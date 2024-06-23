import "../../tailwind.css"
import logo from "../../assets/images/logo.png"
import { Button, TextField } from "@mui/material"
import PasswordField from "../../mui/components/PasswordField"
import { useState } from "react"
import AlertMUI from "../../mui/components/AlertMUI"
import { baseUrl, emailPattern, passwordPattern } from "../../core"
import axios from "axios"

const Signup = ({ data, setData, setScreen }: any) => {

    // data
    const [email, setEmail] = useState<string | null>(null)
    const [userName, setUserName] = useState<string | null>(null)
    const [password, setPassword] = useState<string | null>(null)
    const [repeatPassword, setRepeatPassword] = useState<string | null>(null)

    // others
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<null | string>(null)

    const handleSignup = async (e: React.FormEvent) => {

        e.preventDefault()

        if (!email || email.trim() === "") {
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

        if (!userName || userName.trim() === "") {
            setErrorMessage("User name is required")
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
            return
        }

        if (!password || password.trim() === "") {
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

            const signupResp = await axios.post(`${baseUrl}/api/v1/signup`, {
                email, password, userName
            },{withCredentials:true})

            const otpSendResp = await axios.post(`${baseUrl}/api/v1/send-email-otp`, {
                email
            },{withCredentials:true})

            console.log("signupResp", signupResp)
            console.log("otpSendResp", otpSendResp)
            setData({ ...data, email, userName })
            setScreen("email-verification")

            setIsLoading(false)

        } catch (error: any) {
            setIsLoading(false)
            console.log(error)
            switch (error?.response?.data?.errorCode) {
                case "INVALID_PASSWORD":
                    setErrorMessage("Password must be the 8 characters long, must contain alphanumeric characters with uppercase and lowercase letters")
                    break;
                case "INVALID_EMAIL":
                    setErrorMessage("Email is invalid")
                    break;
                case "USER_ALREADY_EXIST":
                    setErrorMessage("Email already taken")
                    break;
                case "USER_NOT_EXIST":
                    setErrorMessage("Account not found")
                    break;
                case "EMAIL_ALREADY_VERIFIED":
                    setErrorMessage("Email already verified")
                    break;
                case "LIMIT_EXCEED_TRY_IN_24HR":
                    setErrorMessage("OTP send limit exceed, please try again in 24 hours")
                    break;
                case "LIMIT_EXCEED_TRY_IN_60MIN":
                    setErrorMessage("OTP send limit exceed, please try again in 60 minutes")
                    break;
                case "LIMIT_EXCEED_TRY_IN_5MIN":
                    setErrorMessage("OTP send limit exceed, please try again in 5 minutes")
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
                    <form onSubmit={handleSignup}
                        className="w-fit h-fit flex flex-col justify-center items-center gap-6 px-8 py-16 bg-[#fff] rounded-[24px]"
                    >
                        <h1 className="text-[#2c2c2c] text-[32px] w-full text-center font-bold">Sign Up Now</h1>
                        <p className="text-[#2c2c2c] w-full text-center">Create a new account</p>
                        <TextField label="Full Name *" placeholder="Enter name..."
                            sx={{ width: 480 }}
                            onChange={(e: any) => setUserName(e?.target?.value)}
                        />
                        <TextField label="Email address *" placeholder="Enter email..."
                            sx={{ width: 480 }}
                            onChange={(e: any) => setEmail(e?.target?.value)}
                        />
                        <PasswordField label="Password *" placeholder="Enter password *" width={480}
                            onChange={(val: any) => setPassword(val)}
                            un={1}
                        />
                        <PasswordField label="Confirm Password*" placeholder="Enter confirm password *" width={480}
                            onChange={(val: any) => setRepeatPassword(val)}
                            un={2}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                            fullWidth variant="contained" color="secondary">Sign Up</Button>
                        <div className="w-full flex justify-center items-center gap-2">
                            <p>Already have an account?</p>
                            <p className="font-bold text-[#66BEBF] cursor-pointer"
                                onClick={() => setScreen("login")}
                            >Login</p>
                        </div>
                    </form>
                </div>
            </>
        </>
    )
}

export default Signup