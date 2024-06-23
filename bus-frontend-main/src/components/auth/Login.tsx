import "../../tailwind.css"
import logo from "../../assets/images/logo.png"
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material"
import PasswordField from "../../mui/components/PasswordField"
import { baseUrl, emailPattern, passwordPattern } from "../../core"
import axios from "axios"
import AlertMUI from "../../mui/components/AlertMUI"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { login, logout } from "../../redux/user"

const Login = ({ data, setData, setScreen }: any) => {

    const dispatch = useDispatch()

    // data
    // const [email, setEmail] = useState<string | null>("ahaduser@gmail.com")
    const [email, setEmail] = useState<string | null>("ahaduser@gmail.com")
    const [password, setPassword] = useState<string | null>("Pass1234")

    // others
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<null | string>(null)

    const handleLogin = async (e: React.FormEvent) => {

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

        if (!password || password.trim() === "") {
            setErrorMessage("Password is required")
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
            return
        }

        if (!passwordPattern.test(`${password}`)) {
            setErrorMessage("Email or password incorrect")
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
            return
        }

        try {

            setIsLoading(true)

            const loginResp = await axios.post(`${baseUrl}/api/v1/login`, {
                email, password
            }, { withCredentials: true })

            console.log("signupResp", loginResp)

            setData({ ...data, email })
            // setScreen(null)
            setIsLoading(false)

            dispatch(login(loginResp?.data?.data))

        } catch (error: any) {
            setIsLoading(false)
            console.log(error)
            switch (error?.response?.data?.errorCode) {
                case "EMAIL_NOT_VERIFIED":
                    try {

                        setIsLoading(true)

                        const otpSendResp = await axios.post(`${baseUrl}/api/v1/send-email-otp`, {
                            email
                        }, { withCredentials: true })

                        console.log("otpSendResp", otpSendResp)
                        setData({ ...data, email })
                        setScreen("email-verification")

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
                    break;
                case "INVALID_EMAIL_OR_PASSWORD":
                    setErrorMessage("Email or password incorrect")
                    break;
                default:
                    setErrorMessage("An unknown error occured")
                    break;
            }
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
            dispatch(logout())
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
                    <form onSubmit={handleLogin}
                        className="w-fit h-fit flex flex-col justify-center items-center gap-6 px-8 py-16 bg-[#fff] rounded-[24px]"
                    >
                        <h1 className="text-[#2c2c2c] text-[32px] w-full text-center font-bold">Get Started Now</h1>
                        <p className="text-[#2c2c2c] w-full text-center">Enter your credentials to access your account</p>
                        <TextField label="Email address *" placeholder="Enter email..."
                            sx={{ width: 480 }}
                            onChange={(e: any) => setEmail(e?.target?.value)}
                        />
                        <PasswordField
                            onChange={(val: any) => setPassword(val)}
                            label="Password *" placeholder="Enter password *" width={480} />
                        <div className="w-full flex justify-between items-center px-4">
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <p className="w-fit text-right cursor-pointer font-bold"
                                onClick={() => setScreen("forgot-password")}
                            >Forget your password?</p>
                        </div>
                        <Button type="submit" disabled={isLoading} fullWidth variant="contained" color="secondary">Login</Button>
                        <div className="w-full flex justify-center items-center gap-2">
                            <p>Dont have an account?</p>
                            <p className="font-bold text-[#66BEBF] cursor-pointer"
                                onClick={() => setScreen("signup")}
                            >Sign up</p>
                        </div>
                    </form>
                </div>
            </>
        </>
    )
}

export default Login