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


// app.post("/login", async (req, res) => {
  
//   // User Authentication
//   const user = userDatas.find(user => user.id === req.body.userId)
//   if(user === null) {
//     return res.status(400).send("We can't find users")
//   }
//   try {
//     if(await bcrypt.compare(req.body.userPassword, user.password)){
//       // 두 값이 일치함 (해싱되어 저장된 비밀번호와 input으로 넘어온 비밀번호가 일치함)
//       // res.json({ message: "Success"})
//       const { userId, userPassword } = req.body
//       const correctUser = { id: userId, password: userPassword}
      
//       const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
//       res.json({ accessToken: accessToken })
//     } else {
//       // 아님
//       res.json({ message: "Not allowed"})
//     }
//   } catch(error) {
//     res.status(500).json({ message: error.message})
//   }
// })

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


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});