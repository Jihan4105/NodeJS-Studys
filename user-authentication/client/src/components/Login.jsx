import { useContext, useState } from "react"

import useSignIn from "react-auth-kit/hooks/useSignIn"

import axios, { AxiosError } from "axios"
import SetPageContext from "../contexts/SetPageContext"

export default function Login() {
  const setPageStatus = useContext(SetPageContext)
  const [userId, setUserId] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [resultText, setResultText] = useState("")
  const signIn = useSignIn()

  return (
    <>
      <input type="text" id="id-input" name="id-input" value={userId} onChange={(e) => {setUserId(e.target.value)}}/>
      <input type="text" id="password-input" name="password-input" value={userPassword} onChange={(e) => {setUserPassword(e.target.value)}}/>
      <button onClick={() => {loginHandler(userId, userPassword, setResultText, signIn, setPageStatus)}}>Login</button>
      <p>{resultText}</p>
    </>
  )
}

async function loginHandler(userId, userPassword, setResultText, signIn, setPageStatus) {
  try {
    const res = await axios.post("http://127.0.0.1:3000/login", {
      userId: userId,
      userPassword: userPassword
    })
    
    if(res.data?.message === "Not allowed") {
      setResultText(res.data.message)
    } 
    else if(signIn({
      auth: {
        token: res.data.accessToken,
        type: "Bearer"
      },
      refesh: res.data.refreshToken,
      userState: {
        id: userId
      }
    })) {
      setPageStatus("dashboard")
    } else {
      setResultText("Something occured")
    }
  } catch (error) {
    if(error & error instanceof AxiosError) {
      setResultText(error.response?.data.message)
    }
    else if (error & error instanceof Error) {
      console.log("Error: ", error)
    }
  }
}
