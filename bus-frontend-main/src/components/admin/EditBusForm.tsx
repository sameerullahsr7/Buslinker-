import { Button } from "@mui/material"
import "./main.css"
import { ThemeProvider } from "@emotion/react"
import { theme } from "../../mui/theme"
import { TextField } from "@mui/material"

const EditBusForm = ({ editBus, setEditBus, fun, isLoading, _id, busData, setBusData }: any) => {

    console.log(editBus, busData, "busData")

    return (
        <ThemeProvider theme={theme}>
            <div className="modalCont">
                <div className="w-[600px] h-fit bg-[#fff] shadow-lg border p-8 rounded-md flex flex-col gap-4">
                    <h1 className="w-full text-left text-[32px] font-bold text-[#353535]">Update Route</h1>
                    <TextField id="outlined-basic" label="Name" variant="outlined"
                        onChange={(e: any) => setBusData({ ...busData, name: e?.target?.value })}
                        defaultValue={busData?.name}
                    />
                    <TextField id="outlined-basic" label="Registration Number" variant="outlined"
                        onChange={(e: any) => setBusData({ ...busData, busNumber: e?.target?.value })}
                        defaultValue={busData?.busNumber}
                    />
                    <TextField id="outlined-basic" label="Total Seats" variant="outlined"
                        onChange={(e: any) => {
                            if (e?.target?.value < 0) {
                                e.target.value = 1
                            }
                            setBusData({ ...busData, totalSeats: +e?.target?.value })
                        }}
                        defaultValue={+busData?.totalSeats}
                    />
                    <div className="w-full flex justify-end items-center gap-4">
                        <Button disabled={isLoading} variant="outlined" color="primary"
                            onClick={() => {
                                setEditBus(false)
                                setBusData(null)
                            }}
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

export default EditBusForm