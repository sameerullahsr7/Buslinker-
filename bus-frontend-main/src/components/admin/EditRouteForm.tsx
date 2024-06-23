import { Button } from "@mui/material"
import "./main.css"
import { ThemeProvider } from "@emotion/react"
import { theme } from "../../mui/theme"
import { TextField } from "@mui/material"
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import {
    DatePicker,
    //  DatePicker, 
    LocalizationProvider
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment"

const EditRouteForm = ({ editRoute, setEditRoute, fun, isLoading, _id, routeData, setRouteData }: any) => {

    console.log(editRoute, routeData, "routeData")

    return (
        <ThemeProvider theme={theme}>
            <div className="modalCont">
                <div className="w-[600px] h-fit bg-[#fff] shadow-lg border p-8 rounded-md flex flex-col gap-4">
                    <h1 className="w-full text-left text-[32px] font-bold text-[#353535]">Update Route</h1>
                    <TextField id="outlined-basic" label="Origin" variant="outlined"
                        onChange={(e: any) => setRouteData({ ...routeData, origin: e?.target?.value })}
                        defaultValue={routeData?.origin}
                    />
                    <TextField id="outlined-basic" label="Destination" variant="outlined"
                        onChange={(e: any) => setRouteData({ ...routeData, destination: e?.target?.value })}
                        defaultValue={routeData?.destination}
                    />
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <MobileTimePicker
                            className="date-route"
                            label="Departure Time"
                            defaultValue={moment.utc(routeData?.departureTime)}
                            onChange={(e: any) => setRouteData({ ...routeData, departureTime: moment.utc(e).format('HH:mm') })}
                        // onChange={(e: any) => setDeparture(moment.utc(e).format('HH:mm'))}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <MobileTimePicker
                            className="date-route"
                            label="Arrival Time"
                            defaultValue={moment.utc(routeData?.arrivalTime)}
                            onChange={(e: any) => setRouteData({ ...routeData, arrivalTime: moment.utc(e).format('HH:mm') })}
                        // onChange={(e: any) => setArrival(moment.utc(e).format('HH:mm'))}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            className="date-route"
                            label="Date"
                            defaultValue={moment.utc(routeData?.arrivalTime?.substring(0, 10))}
                            onChange={(e: any) => setRouteData({ ...routeData, date: moment.utc(e).format('YYYY MM DD').replace(" ", "-").replace(" ", "-") })}
                        // onChange={(e: any) => setDate(moment.utc(e).format('YYYY MM DD').replace(" ", "-").replace(" ", "-"))}
                        />
                    </LocalizationProvider>
                    <TextField id="outlined-basic" label="Price" variant="outlined"
                        onChange={(e: any) => setRouteData({ ...routeData, price: e?.target?.value })}
                        defaultValue={routeData?.price}
                    />
                    <div className="w-full flex justify-end items-center gap-4">
                        <Button disabled={isLoading} variant="outlined" color="primary"
                            onClick={() => {
                                setEditRoute(false)
                                setRouteData(null)
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

export default EditRouteForm