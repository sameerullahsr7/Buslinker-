import "../../tailwind.css"
import logo from "../../assets/images/logo.png"
import { Button, TextField } from "@mui/material"
import { useState } from "react"
import { baseUrl, emailPattern } from "../../core"
import AlertMUI from "../../mui/components/AlertMUI"
import axios from "axios"

const ForgotPassword = ({ data, setData, setScreen }: any) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<null | string>(null)
    const [email, setEmail] = useState<null | string>(null)

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        if (!email || `${email}`?.trim() === "") {
            setErrorMessage("Email is required")
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
            return
        }

        if (!emailPattern.test(`${email}`)) {
            setErrorMessage("Email is invalid")
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
            return
        }

        try {

            setIsLoading(true)

            const forgotPasswordResp = await axios.post(`${baseUrl}/api/v1/forget-password`, {
                email
            },{withCredentials:true})

            console.log("forgotPasswordResp", forgotPasswordResp)

            setData({ ...data, email })
            setScreen("forgot-password-otp")

            setIsLoading(false)

        } catch (error: any) {
            console.log(error)
            setIsLoading(false)
            switch (error?.response?.data?.errorCode) {
                case "INVALID_EMAIL":
                    setErrorMessage("Email is invalid")
                    break;
                case "USER_NOT_EXIST":
                    setErrorMessage("Account not found")
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
                        <h1 className="text-[#2c2c2c] text-[32px] w-full text-center font-bold">Forget password</h1>
                        <p className="text-[#2c2c2c] w-full text-center flex justify-center items-center flex-wrap gap-2">Enter your email to reset your password</p>
                        <TextField label="Email address *" placeholder="Enter email..."
                            sx={{ width: 480, marginY: "8px" }}
                            onChange={(e: any) => setEmail(e?.target?.value)}
                        />
                        <Button type="submit" disabled={isLoading} fullWidth variant="contained" color="secondary">Get OTP</Button>
                    </form>
                </div >
            </>
        </>
    )
}

export default ForgotPassword