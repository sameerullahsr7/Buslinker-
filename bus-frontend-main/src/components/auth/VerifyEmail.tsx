import "../../tailwind.css"
import logo from "../../assets/images/logo.png"
import { Button } from "@mui/material"
import { MuiOtpInput } from "mui-one-time-password-input"
import { useEffect, useState } from "react"
import { baseUrl, otpPattern } from "../../core"
import AlertMUI from "../../mui/components/AlertMUI"
import axios from "axios"

const VerifyEmail = ({ data, setData, setScreen }: any) => {

    const [otp, setOtp] = useState('')
    const [countdown, setCountdown] = useState<number>(900)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<null | string>(null)

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        console.log(otp)

        if (!otp || `${otp}`?.trim() === "" || !otpPattern.test(`${otp}`)) {
            setErrorMessage("OTP is invalid")
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
            return
        }

        try {

            setIsLoading(true)

            const otpResp = await axios.post(`${baseUrl}/api/v1/verify-email-otp`, {
                email: data?.email,
                otpCode: otp
            }, { withCredentials: true })

            console.log("otpResp", otpResp)

            setData({ ...data, otp })

            setIsLoading(false)

            setScreen("login")

        } catch (error: any) {
            console.log(error)
            setIsLoading(false)
            switch (error?.response?.data?.errorCode) {
                case "INVALID_OTP":
                    setErrorMessage("OTP you entered is invalid")
                    break;
                case "INVALID_EMAIL":
                    setErrorMessage("Email is invalid")
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

    const resendOtp = async () => {

        if (!data?.email) return

        try {

            setIsLoading(true)

            const otpSendResp = await axios.post(`${baseUrl}/api/v1/send-email-otp`, {
                email: data?.email
            }, { withCredentials: true })

            console.log("otpSendResp", otpSendResp)

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

    // countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown === 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(interval);

    }, []);

    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    return (
        <>
            {
                errorMessage && <AlertMUI text={errorMessage} status="error" />
            }
            <>
                <div className="flex flex-col justify-center items-center gap-8">
                    <img src={logo} alt="logo" className="w-[150px] h-[150px] rounded-full object-contain" />
                    <form onSubmit={handleSubmit}
                        className="w-fit h-fit flex flex-col justify-center items-center gap-6 px-8 py-16 bg-[#fff] rounded-[24px]"
                    >
                        <h1 className="text-[#2c2c2c] text-[32px] w-full text-center font-bold">Email verification</h1>
                        <p className="text-[#2c2c2c] w-full flex flex-col justify-center items-center flex-wrap gap-2"><p>Enter OTP we have sent to</p> <p className="font-bold">{data?.email}</p> </p>
                        <MuiOtpInput
                            gap={1}
                            value={`${otp}`}
                            length={6}
                            onChange={(val: number | string) => {
                                setOtp(`${val}`)
                            }}
                            sx={{
                                margin: "16px 0",
                                width: "360px",
                            }}
                        />
                        <p className="w-full text-right cursor-pointer font-bold"
                            onClick={resendOtp}
                        >Resend OTP</p>
                        <Button disabled={isLoading} type="submit" fullWidth variant="contained" color="secondary">Verify</Button>
                        <div className="w-full flex justify-center items-center gap-2">
                            <p>OTP will expire in</p>
                            <p className="font-bold text-[#66BEBF]">
                                {
                                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                                }
                            </p>
                        </div>
                    </form>
                </div>
            </>
        </>
    )
}

export default VerifyEmail