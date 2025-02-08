import { useState } from "react"
import Login from "../components/Login"

import setPageContext from "../contexts/SetPageContext"
import DashBoard from "../components/DashBoard"

function IndexApp() {
  const [pageStatus, setPageStatus] = useState("logIn")
  let page 

  switch(pageStatus) {
    case "logIn" :
      page = <Login /> 
      break;
    case "dashboard" :
      page = <DashBoard />
      break;
  }

  return (
    <>
      <setPageContext.Provider value={setPageStatus}>
        {page}
      </setPageContext.Provider>
    </>
  )
}

export default IndexApp
