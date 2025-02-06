import { useContext, useEffect, useLayoutEffect, useState } from "react";

import AuthContext from "../contexts/AuthContext";
import useAuth from "../hooks/useAuth";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState();

  // 실제로 유저를 가져오는 API수행하고 res에 담긴 Accesstoken을 state에 저장
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/api/me")
        setToken(res.data.accessToken)
      } catch {
        setToken(null)
      }
    }

    fetchMe()
  }, [])

  // api가 수행되기전에 헤더에 가지고 있는 토큰을 붙이는 작업을 진행함. 그렇기에 useLayoutEffect 사용
  // 브라우저가 화면을 다시 그리기전, 그러니까 모든 컴포넌트를 보여주기전에 수행하는 작업이기때문에 
  useLayoutEffect(() => {
    const authInterceptor = api.authInterceptor.request.use((config) => {
      config.headers.Authorization = 
        !config._retry && token ?
          `Bearer ${token}`
          :
          config.headers.Authorization
      return config
    })

    return () => {
      api.interceptors.request.eject(authInterceptor)
    }
  })
} 

