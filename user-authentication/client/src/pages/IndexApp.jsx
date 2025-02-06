import { useState } from "react"

function IndexApp() {
  
  const [userId, setUserId] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [resultText, setResultText] = useState("")

  return (
    <>
      <input type="text" id="id-input" name="id-input" value={userId} onChange={(e) => {setUserId(e.target.value)}}/>
      <input type="text" id="password-input" name="password-input" value={userPassword} onChange={(e) => {setUserPassword(e.target.value)}}/>
      <button onClick={() => {loginHandler(userId, userPassword, setResultText)}}>Login</button>
      <p className="res-text">{resultText}</p>
    </>
  )
}

async function loginHandler(userId, userPassword, setResultText) {
  const res = await fetch("http://127.0.0.1:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: userId,
      userPassword: userPassword
    })
  })
  const data = await res.json()

  setResultText(data.message)
}



export default IndexApp
