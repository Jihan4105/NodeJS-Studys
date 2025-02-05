import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken"

const app = express()
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
  optionsSuccessStatus: 200,
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const userDatas = [
  {
    name: "JohnDoe",
    id: "JohnDoe1234",
    password: "$2b$10$QRwRR7KO3GZVXhSewYv42eduLQdpivGTXGZ9.49VM6ts7zh/b.35q"
  },
  {
    name: "SemenDoe",
    id: "SemenDoe1234",
    password: "SemenDoe1234"
  },
  {
    name: "BabyDoe",
    id: "BabyDoe1234",
    password: "BabyDoe1234"
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
    userDatas.push(user)
    res.status(200).send()
  } catch(error) {
    res.status(500).send()
  }
})

app.post("/login", async (req, res) => {
  const { userId, userPassword } = req.body

  // User Authentication
  const user = userDatas.find(user => user.id === userId)
  if(user === null) {
    return res.status(400).send("We can't find users")
  }
  try {
    if(await bcrypt.compare(userPassword, user.password)){
      res.json({ message: "Success"})
    } else {
      res.json({ message: "Not allowed"})
    }
  } catch(error) {
    res.status(500).json({ message: error.message})
  }
})


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});