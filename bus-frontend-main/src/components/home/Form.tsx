import "./main.css"

import { Autocomplete, Button, FormControl, TextField } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { baseUrl } from "../../core"
import { ThemeProvider } from "@emotion/react"
import { theme } from "../../mui/theme"
import { styled } from '@mui/system';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export const CustomAutocomplete: any = styled(Autocomplete)(() => ({
    color: "#fff",
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#888',
            color: '#888',
        },
        '&:hover fieldset': {
            borderColor: '#888',
            color: '#888',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4DD836',
            color: "#888"
        },
    },
}));

export const CustomTextField: any = styled(TextField)(() => ({
    '& .MuiOutlinedInput-root': {
        color: "#fff",
        '& fieldset': {
            borderColor: '#888',
        },
        '&:hover fieldset': {
            borderColor: '#888',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4DD836',
        },
    },
}));

const CustomDatePicker: any = styled(DatePicker)(() => ({
    '& .MuiOutlinedInput-root': {
        color: "#fff",
        '& fieldset': {
            borderColor: '#888',
        },
        '&:hover fieldset': {
            borderColor: '#888',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4DD836',
        },
    },
}));

const Form = () => {

    const currentUser = useSelector((state: any) => state?.user)
    const { isDarkMode } = currentUser
    const navigate = useNavigate()
    const isSelectedEnglish = !currentUser?.isSelectedUrdu

    const [filters, setFilters] = useState<any>(null)
    const [from, setFrom] = useState<null | string>(null)
    const [to, setTo] = useState<null | string>(null)
    const [passengers, setPassengers] = useState<number>(0)
    const [date, setDate] = useState<any>(null)
    const [localData, setLocalData] = useState<any>(null)

    useEffect(() => {
        setPassengers(localData?.passengers || passengers)
        setFrom(localData?.from || from)
        setTo(localData?.to || to)
        setLocalData(null)
    }, [passengers, from, to])

    useEffect(() => {
        const storedData = localStorage.getItem("bus-data")
        if (storedData) {
            setLocalData(JSON.parse(storedData))
        }
    }, [])

    useEffect(() => {
        getFilters()
    }, [])

    const getFilters = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/api/v1/filter`, { withCredentials: true })
            setFilters(resp?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e: any) => {
        e?.preventDefault()

        if (currentUser?.isLogin == false) {
            localStorage.setItem("bus-data", JSON.stringify({ from, to, passengers, date }))
            navigate("/auth")
            return
        }

        setFrom(localData?.from ? localData?.from : from)
        setTo(localData?.to ? localData?.to : to)
        setPassengers(localData?.passengers ? localData?.passengers : passengers)
        console.log(from, to, passengers, date)
        setLocalData(null)

        if (!date || !passengers || !from || !to) return

        const formattedDate = moment.utc(date).format('YYYY MM DD').replace(" ", "/").replace(" ", "/")

        navigate("/booking", {
            state: {
                date: formattedDate,
                from: from,
                to: to,
                passengers: +passengers
            }
        })

    }

    return (
        <ThemeProvider theme={theme}>
            <form
                onSubmit={handleSubmit}
                className={`w-[1280px] mx-auto flex justify-between items-center gap-4 p-8 rounded-2xl bg-[#1E293B] border-[${isDarkMode ? "#DFC5C5" : "#353535"}] border-2 ${!isDarkMode ? "shadow-2xl" : ""}`}>
                <div className="flex flex-col gap-2 flex-1">
                    <p className="text-[#fff]">{isSelectedEnglish ? "From" : "کہاں سے"}</p>
                    <FormControl fullWidth>
                        <CustomAutocomplete
                            value={(localData && localData?.from) ? localData?.from : from}
                            disablePortal
                            id="combo-box-demo"
                            options={filters?.origins || []}
                            fullWidth
                            onChange={(e: any) => setFrom(e?.target?.textContent)}
                            renderInput={(params: any) => <CustomTextField {...params} />}
                        />
                    </FormControl>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <p className="text-[#fff]">{isSelectedEnglish ? "To" : "کہاں پر"}</p>
                    <FormControl fullWidth>
                        <CustomAutocomplete
                            value={(localData && localData?.to) ? localData?.to : to}
                            disablePortal
                            id="combo-box-demo"
                            options={filters?.destinations || []}
                            fullWidth
                            onChange={(e: any) => setTo(e?.target?.textContent)}
                            renderInput={(params: any) => <CustomTextField {...params} />}
                        />
                    </FormControl>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <p className="text-[#fff]">{isSelectedEnglish ? "Departure" : "روانگی"}</p>
                    <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DemoContainer components={['DatePicker']}>
                                <CustomDatePicker
                                    onChange={(e: any) => setDate(moment.utc(e).format('YYYY MM DD').replace(" ", "-").replace(" ", "-"))}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </FormControl>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <p className="text-[#fff]">{isSelectedEnglish ? "Passengers" : "مسافر"}</p>
                    <FormControl fullWidth>
                        <CustomTextField
                            type="number"
                            onChange={(e: any) => {
                                if (e?.target?.value >= 0) {
                                    setPassengers(e?.target?.value)
                                } else {
                                    setPassengers(0)
                                }
                            }}
                            value={(localData && localData?.passengers) ? localData?.passengers : passengers}
                        />
                    </FormControl>
                </div>
                <Button type="submit" color="secondary" variant="contained"
                    sx={{
                        borderRadius: "8px",
                        height: "68px",
                        marginTop: "auto",
                        fontSize: "1.2em"
                    }}
                >{isSelectedEnglish ? "Book Now" : "بکنگ کریں"}</Button>
            </form>
        </ThemeProvider >
    )
}

export default Form