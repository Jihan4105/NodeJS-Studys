import { useContext } from "react"

import AuthContext from "../contexts/AuthContext"

function useAuth() {
  const authContext = useContext(AuthContext)

  if(!authContext) {
    throw new Error("useAuth must be used within a AuthProvider")
  }

  return authContext
}

export default useAuth