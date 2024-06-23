import { useDispatch, useSelector } from "react-redux"
import logo from "../assets/images/logo.png"
import {
    Button, CircularProgress
    // , Menu, MenuItem
} from "@mui/material"
import axios from "axios"
import { baseUrl } from "../core"
import { logout } from "../redux/user"
import { useEffect, useState } from "react"
import moment from "moment"
// import React from "react"

const MyReservations = () => {

    const currentUser = useSelector((state: any) => state?.user)
    const isSelectedEnglish = !currentUser?.isSelectedUrdu
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [reservations, setReservations] = useState<any>(null)
    const [loadingIds, setLoadingIds] = useState<string[]>([])

    console.log(isLoading)

    useEffect(() => {
        getReservations()
    }, [])

    const _logout = async () => {

        try {

            const logoutResp = await axios.post(`${baseUrl}/api/v1/logout`, {}, { withCredentials: true })

            console.log("logoutResp", logoutResp)

            dispatch(logout())

        } catch (error) {
            console.log(error)
        }

    }

    const getReservations = async () => {

        try {
            setIsLoading(true)
            const resp = await axios.get(`${baseUrl}/api/v1/user-reservations`, {
                withCredentials: true
            })

            console.log("reservations", resp?.data?.data)
            setReservations(resp?.data?.data)
            setIsLoading(false)

        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const cancelReservation = async (id: string, status: boolean) => {

        if (!id || id?.trim() === "") return
        if (status) return

        try {

            setLoadingIds([...loadingIds, id])

            const resp = await axios.delete(`${baseUrl}/api/v1/user-reservation/${id}`, {
                withCredentials: true
            })

            setLoadingIds(loadingIds.filter((_id: string) => _id !== id))

            console.log("resprespresp", resp)
            getReservations()

        } catch (error: any) {
            console.log(error)
        }

    }

    return (
        <>
            <>
                <div className="w-full h-fit flex justify-between items-center p-4 px-8 bg-[#070B15]">
                    <img src={logo} alt="logo"
                        className="w-[80px] h-[80px] object-cover object-center rounded-full"
                    />
                    <div className="w-fit flex justify-end items-center gap-4">
                        <p className="w-fit text-left text-[#fff] font-bold">{currentUser?.userName}</p>
                        <Button onClick={_logout}
                            sx={{
                                background: "#0099ff",
                                padding: "24px"
                            }}
                            variant="contained" color="primary"
                        >{isSelectedEnglish ? "Logout" : "لاگ آؤٹ کریں"}</Button>
                    </div>
                </div>
            </>
            <>
                <div className="mt-8 w-fit flex items-center px-8 gap-2 cursor-pointer"
                    onClick={() => window?.history?.back()}
                >
                    <p className="text-[40px] text-[#fff] font-bold text-left"
                    >{`<`}</p>
                    <p className="text-[32px] text-[#fff] font-bold text-left"
                    >{isSelectedEnglish ? "Back To Homepage" : "ہوم پیج پر واپس"}</p>
                </div>
                {
                    reservations ?

                        reservations?.length ?

                            <>
                                <div className="p-8">
                                    <table border={1} className="w-full h-full overflow-y-auto border-1 border border-[#ccc]">
                                        <tr className="border border-b border-[#ccc]">
                                            <th className="p-[8px] py-[12px] text-[20px] text-[#fff] font-normal">{isSelectedEnglish ? "Passenger Name" : "مسافر کا نام"}</th>
                                            <th className="p-[8px] py-[12px] text-[20px] text-[#fff] font-normal">{isSelectedEnglish ? "Departure" : "روانگی"}</th>
                                            <th className="p-[8px] py-[12px] text-[20px] text-[#fff] font-normal">{isSelectedEnglish ? "Arrival" : "آمد"}</th>
                                            <th className="p-[8px] py-[12px] text-[20px] text-[#fff] font-normal">{isSelectedEnglish ? "Departure Time" : "روانگی کا وقت"}</th>
                                            <th className="p-[8px] py-[12px] text-[20px] text-[#fff] font-normal">{isSelectedEnglish ? "Arrival Time" : "آمد کا وقت"}</th>
                                            <th className="p-[8px] py-[12px] text-[20px] text-[#fff] font-normal">{isSelectedEnglish ? "Seat Number" : "سیٹ نمبر"}</th>
                                            <th className="p-[8px] py-[12px] text-[20px] text-[#fff] font-normal">{isSelectedEnglish ? "Payment" : "ادائیگی"}</th>
                                            <th className="p-[8px] py-[12px] text-[20px] text-[#fff] font-normal">{isSelectedEnglish ? "Actions" : "اعمال"}</th>
                                        </tr>
                                        {reservations?.map((reservation: any) => (
                                            <>
                                                <tr className="border-b-2 border-b-[#fff]" key={reservation?._id}>
                                                    <td className="text-center p-4 text-[20px] text-[#fff]">{`${reservation?.firstName} ${reservation?.lastName}`}</td>
                                                    <td className="text-center p-4 text-[20px] text-[#fff]">{reservation?.route?.origin}</td>
                                                    <td className="text-center p-4 text-[20px] text-[#fff]">{reservation?.route?.destination}</td>
                                                    <td className="text-center p-4 text-[20px] text-[#fff]">{moment.utc(reservation?.route?.departureTime).format('LLL')}</td>
                                                    <td className="text-center p-4 text-[20px] text-[#fff]">{moment.utc(reservation?.route?.arrivalTime).format('LLL')}</td>
                                                    <td className="text-center p-4 text-[20px] text-[#fff]">{reservation?.seatNumber}</td>
                                                    <td className="text-center p-4 text-[20px] text-[#fff]">
                                                        <p className={`${reservation?.isPaid ? "bg-[#28A745]" : "bg-[#D61717]"} w-[100px] h-[33px] rounded-[100px] flex justify-center items-center text-[#fff] text-center text-sm mx-auto p-4`}>{reservation?.isPaid ? `${isSelectedEnglish ? "Paid" : "مکمل"}` : `${isSelectedEnglish ? "Unpaid" : "نا مکمل"}`}</p>
                                                    </td>
                                                    <td className="text-center p-4 text-[20px] text-[#fff]">
                                                        <Button
                                                            disabled={reservation?.isPaid}
                                                            variant="contained"
                                                            onClick={() => cancelReservation(reservation?._id, reservation?.isPaid)}
                                                        >{loadingIds?.includes(reservation?._id) ?
                                                            <>{isSelectedEnglish ? "Loading..." : "...جاری ہے"}</>
                                                            : (isSelectedEnglish ? "Cancel" : "منسوخ کریں")}</Button>
                                                    </td>
                                                </tr>
                                            </>
                                        ))}
                                    </table>
                                </div>
                            </>

                            :

                            <>
                                <h1
                                    className="w-full text-center text-[32px] font-bold text-[#fff] mt-[6em]"
                                >{isSelectedEnglish ? "No Reservations..." : "... کوئی تحفظات نہیں"}</h1>
                            </>

                        :
                        <>
                            <div className="w-full h-full mt-[8em] flex justify-center items-center">
                                <CircularProgress color="primary" />
                            </div>
                        </>
                }
            </>
        </>
    )
}

export default MyReservations