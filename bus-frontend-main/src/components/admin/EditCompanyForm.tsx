import { Button } from "@mui/material"
import "./main.css"
import { ThemeProvider } from "@emotion/react"
import { theme } from "../../mui/theme"

const EditCompanyForm = ({ editCompany, setEditCompany, fun, isLoading, _id, companyData, setCompanyData }: any) => {

    console.log(editCompany, companyData)

    return (
        <ThemeProvider theme={theme}>
            <div className="modalCont">
                <div className="w-[600px] h-fit bg-[#fff] shadow-lg border p-8 rounded-md flex flex-col gap-4">
                    <h1 className="w-full text-left text-[32px] font-bold text-[#353535]">Update Company</h1>
                    <p className="w-full text-left text-[24px] text-[#575757]">Company Name:</p>
                    <input type="text"
                        placeholder="Company Name . . ."
                        className="border-2 border-[#ccc] p-2 rounded-md w-[500px]"
                        defaultValue={companyData}
                        onChange={(e: any) => setCompanyData(e?.target?.value)}
                    />
                    <div className="w-full flex justify-end items-center gap-4">
                        <Button disabled={isLoading} variant="outlined" color="primary"
                            onClick={() => setEditCompany(false)}
                        >Cancel</Button>
                        <Button disabled={isLoading} variant="contained" color="primary"
                            onClick={() => fun(_id)}
                        >Update</Button>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default EditCompanyForm