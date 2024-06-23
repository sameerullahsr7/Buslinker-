import "../../tailwind.css"
import logo from "../../assets/images/logo.png"
import { Button } from "@mui/material"
import PasswordField from "../../mui/components/PasswordField"
import { baseUrl, passwordPattern } from "../../core"
import AlertMUI from "../../mui/components/AlertMUI"
import { useState } from "react"
import axios from "axios"

const ForgotPasswordComplete = ({ data, setData, setScreen }: any) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [password, setPassword] = useState<string | null>(null)
    const [repeatPassword, setRepeatPassword] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<null | string>(null)

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        if (!data?.email) return

        if (!password || `${password}`.trim() === "") {
            setErrorMessage("Password is required")
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
            return
        }

        if (!passwordPattern.test(`${password}`)) {
            setErrorMessage("Password must be the 8 characters long, must contain alphanumeric characters with uppercase and lowercase letters")
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
            return
        }

        if (password !== repeatPassword) {
            setErrorMessage("Passwords do not match")
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
            return
        }

        try {

            setIsLoading(true)

            const forgotPasswordCompleteResp = await axios.post(`${baseUrl}/api/v1/forget-password-complete`, {
                email: data?.email,
                otpCode: data?.otp,
                newPassword: password
            },{withCredentials:true})

            console.log("forgotPasswordCompleteResp", forgotPasswordCompleteResp)

            setIsLoading(false)

            setData({ ...data })
            setScreen("login")

        } catch (error: any) {
            console.log(error)
            setIsLoading(false)
            switch (error?.response?.data?.errorCode) {
                case "INVALID_EMAIL":
                    setErrorMessage("Email is invalid")
                    break;
                case "INVALID_PASSWORD":
                    setErrorMessage("Password must be the 8 characters long, must contain alphanumeric characters with uppercase and lowercase letters")
                    break;
                case "USER_NOT_EXIST":
                    setErrorMessage("Account not found")
                    break;
                case "INVALID_OTP":
                    setErrorMessage("OTP is invalid")
                    break;
                default:
                    setErrorMessage("An unknown error occured")
                    break;
            }
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
        }

    }

    return (
        <>
            <>
                {
                    errorMessage && <AlertMUI status="error" text={errorMessage} />
                }
            </>
            <>
                <div className="flex flex-col justify-center items-center gap-8">
                    <img src={logo} alt="logo" className="w-[150px] h-[150px] rounded-full object-contain" />
                    <form onSubmit={handleSubmit}
                        className="w-fit h-fit flex flex-col justify-center items-center gap-8 px-8 py-16 bg-[#fff] rounded-[24px]"
                    >
                        <h1 className="text-[#2c2c2c] text-[32px] w-full text-center font-bold">Reset Password</h1>
                        <p className="text-[#2c2c2c] w-full text-center">Enter your new password</p>
                        <PasswordField
                            onChange={(val: any) => setPassword(val)}
                            label="New Password *" placeholder="Enter new password *" width={480} />
                        <PasswordField
                            onChange={(val: any) => setRepeatPassword(val)} label="Confirm Password *" placeholder="Enter confirm password *" width={480} />
                        <Button type="submit" disabled={isLoading} fullWidth variant="contained" color="secondary">Reset</Button>
                    </form>
                </div>
            </>
        </>
    )
}

export default ForgotPasswordComplete