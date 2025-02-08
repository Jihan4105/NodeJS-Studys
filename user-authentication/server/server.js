import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"


const app = express()
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
  optionsSuccessStatus: 200,
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

dotenv.config()

const userDatas = [
  {
    id: "JohnDoe1234",
    password: "$2b$10$QRwRR7KO3GZVXhSewYv42eduLQdpivGTXGZ9.49VM6ts7zh/b.35q",
    userName: "JohnDoe1234"
  },
  {
    id: "SemenDoe1234",
    password: "$2b$10$pBV0lVUcjGT1oakZ8g6zguGto6X.BqSMI1mNkPEVCOrsmRSScGgg.",
    userName: "SemenDoe1234"
  },
  {
    id: "BabyDoe1234",
    password: "BabyDoe1234",
    userName: "BabyDoe1234"
  }
]

const posts = [
  {
    userName: "JohnDoe1234",
    title: "Post 1"
  },
  {
    userName: "SemenDoe1234",
    title: "Post 2"
  }
]

const refreshTokens = []

const hostname = '127.0.0.1';
const port = 3000;

app.get("/getUsers", (req, res) => {
  res.json(userDatas)
})

app.post("/makeUser", async (req,res) => {
  try {
    const salt = await bcrypt.genSalt()
    const hasedPassword = await bcrypt.hash(req.body.userPassword, salt)
    console.log(salt)
    console.log(hasedPassword)
    const user = { name: "defaultName", id: req.body.userId, password: hasedPassword}
    // userDatas.push(user)
    res.status(200).json(user)
  } catch(error) {
    res.status(500).send()
  }
})

app.get("/posts", authenticateToken, (req, res) => {
  console.log(req.user)
  res.json(posts.filter((post) => { return post.userName === req.user.userName}))
})

function authenticateToken(req, res, next) {
  // client에서 보내주는 accessToken을 받아서 저장된 토큰과 비교하는 Middleware

  // Client에서 header로 요청과함께 토큰을 보냄 `Bearer ${TOKEN}` 형태
  const authHeader = req.headers["authorization"]
  // Client에서 TOKEN을 보내주지 않으면 token값을 null로 설정
  const token = authHeader && authHeader.split(" ")[1]
  if(token === null) { 
    return res.sendStatus(401)
  }

  //Token이 있는상태로 넘어온것을 알았으니 그 토큰을 Verify 즉 인증해야한다.
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // 유저가 토큰이 있는건 알았지만 그 토큰은 이제 더이상 사용할 수 없다 는 것.
    if(err) {
      return res.sendStatus(403)  
    } 
    req.user = user

    //미들웨어에서 빠져나가서 뒤의 Controller를 실행하는 함수
    next()
  })
}

app.post("/token", (req, res) => {
  const refreshToken = req.body.token

  // refreshToken이 만약 없이 요청이 온다면 401에러러
  if(refreshToken === null) {
    return res.sendStatus(401)
  }

  // refreshToken을 저장해두는 곳에 현재 받은 refreshToken이 없으면 금지된 요청청
  if(!refreshTokens.includes(refreshToken)) {
    res.sendStatus(403)
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    // 에러가 있으면 에러리턴턴
    if(err) {
      return res.sendStatus(403)
    }
    console.log(user)
    // accessToken을 만드는데 이 데이터에는는 다른 여러 데이터
    // 예를들어 토큰 유효기간, 만들어진 기간 등등이 있기때문에에
    // 실제로 우리가 토큰에 담을 데이터만 뽑아서 담아야한다.
    const accessToken = generateAccesToken({ id: user.id, password: user.password, userName: user.userName})
    res.json({ accessToken: accessToken })
  })
})

app.delete("/logout", (req, res) => {
  //지금은 배열로 DB를 대신하지만 실제론 DB연결이 필요
  refreshTokens = refreshTokens.filter((token) => {
    return token !== req.body.token
  })

  // 원래는 refreshToken을 이용하여 새로운 accesToken을 계속 무한정 만들어낼 수 있었지만 
  // logout과 동시에 그 refreshToken이 사라져 더이상 사라진 refreshToken으로
  // accessToken을 만들어 낼 수 없음. /token으로 만들어낼려하면 403에러 
  res.sendStatus(204)
})

app.post("/login", async (req, res) => {
  
  // User Authentication
  const user = userDatas.find(user => user.id === req.body.userId)
  if(user === null) {
    return res.status(400).send("We can't find users")
  }
  try {
    if(await bcrypt.compare(req.body.userPassword, user.password)){
      // 두 값이 일치함 (해싱되어 저장된 비밀번호와 input으로 넘어온 비밀번호가 일치함)
      // res.json({ message: "Success"})
      const { userId, userPassword } = req.body
      const correctUser = { id: userId, password: userPassword, userName: user.userName}
      
      const accessToken = generateAccesToken(correctUser)
      const refreshToken = jwt.sign(correctUser, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d"})
      refreshTokens.push(refreshToken)

      res.json({ accessToken: accessToken, refreshToken: refreshToken })
    } else {
      // 아님
      res.json({ message: "Not allowed"})
    }
  } catch(error) {
    res.status(500).json({ message: error.message})
  }
})


function generateAccesToken(user) {
  //accessToken을 만드는데 expiresIn 즉 30s뒤에 이 토큰은 못사용하게 만듦
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "59s"})
}


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});