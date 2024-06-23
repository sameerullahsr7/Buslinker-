import "../tailwind.css"

import { useState } from "react"
import Login from "../components/auth/Login"
import SuccessModal from "../components/SuccessModal"
import Signup from "../components/auth/Signup"
import VerifyEmail from "../components/auth/VerifyEmail"
import ForgotPassword from "../components/auth/ForgotPassword"
import ForgotPasswordOtp from "../components/auth/ForgotPasswordOtp"
import ForgotPasswordComplete from "../components/auth/ForgotPasswordComplete"

const Auth = () => {

  const [screen, setScreen] = useState<string | null>("login")
  const [data, setData] = useState<{}>({})

  return (
    <>
      <div className="w-screen h-screen bg-[#0F172A] flex justify-center items-center">
        {screen === "login" && <Login data={data} setData={setData} setScreen={setScreen} />}
        {screen === "signup" && <Signup data={data} setData={setData} setScreen={setScreen} />}
        {screen === "success" && <SuccessModal data={data} setData={setData} setScreen={setScreen} />}
        {screen === "email-verification" && <VerifyEmail data={data} setData={setData} setScreen={setScreen} />}
        {screen === "forgot-password" && <ForgotPassword data={data} setData={setData} setScreen={setScreen} />}
        {screen === "forgot-password-otp" && <ForgotPasswordOtp data={data} setData={setData} setScreen={setScreen} />}
        {screen === "forgot-password-complete" && <ForgotPasswordComplete data={data} setData={setData} setScreen={setScreen} />}
      </div>
    </>
  )
}

export default Auth