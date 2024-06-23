import { Button } from "@mui/material"
import "./main.css"
import { ThemeProvider } from "@emotion/react"
import { theme } from "../../mui/theme"

const DelModal = ({ showDelModal, setShowDelModal, title, text, fun, isLoading, _id }: any) => {
    console.log(showDelModal, setShowDelModal)
    return (
        <ThemeProvider theme={theme}>
            <div className="modalCont">
                <div className="w-[600px] h-fit bg-[#fff] shadow-lg border p-8 rounded-md flex flex-col gap-4">
                    <h1 className="w-full text-left text-[32px] font-bold text-[#353535]">{title}</h1>
                    <p className="w-full text-left text-[24px] text-[#575757]">{text}</p>
                    <div className="w-full flex justify-end items-center gap-4">
                        <Button disabled={isLoading} variant="outlined" color="primary"
                            onClick={() => setShowDelModal(false)}
                        >Cancel</Button>
                        <Button disabled={isLoading} variant="contained" color="primary"
                            onClick={() => fun(_id)}
                        >Delete</Button>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default DelModal