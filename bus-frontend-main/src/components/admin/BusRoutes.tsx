import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseUrl } from "../../core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ImCross } from "react-icons/im";
import logo from "../../assets/images/logo.png"
import { Button } from "@mui/material";
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { titleCase } from "../../functions";
import DelModal from "./DelModal"
import EditRouteForm from "./EditRouteForm";

const BusRoutes = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()

    const { busId } = params

    const [routes, setRoutes] = useState<any>([])
    const [showForm, setShowForm] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [departure, setDeparture] = useState<any>()
    const [arrival, setArrival] = useState<any>()
    const [date, setDate] = useState<any>()
    const [showDelModal, setShowDelModal] = useState<boolean>(false)
    const [_id, set_id] = useState<string | null>(null)
    const [routeData, setRouteData] = useState<any>(null)
    const [editRoute, setEditRoute] = useState<boolean>(false)
    const [index, setIndex] = useState<number>(0)

    console.log(setIsLoading)

    const originRef: any = useRef()
    const destinationRef: any = useRef()
    const priceRef: any = useRef()

    useEffect(() => {
        getRoutes()
    }, [busId])

    const getRoutes = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/api/v1/bus-routes/${busId}`, {
                withCredentials: true
            })
            console.log("resp?.data?.data", resp?.data?.data)
            setRoutes(resp?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSubmit = async (e: any) => {

        e?.preventDefault()

        if (!departure || `${departure}`?.trim() === "") return
        if (!arrival || `${arrival}`?.trim() === "") return
        if (!date || `${date}`?.trim() === "") return
        if (!originRef?.current?.value || `${originRef?.current?.value}`?.trim() === "") return
        if (!destinationRef?.current?.value || `${destinationRef?.current?.value}`?.trim() === "") return
        if (!priceRef?.current?.value || `${priceRef?.current?.value}`?.trim() === "") return

        try {
            setIsLoading(true)

            const resp = await axios.post(`${baseUrl}/api/v1/bus-route/${location?.state?.bus?._id}`, {
                origin: titleCase(originRef?.current?.value),
                destination: titleCase(destinationRef?.current?.value),
                arrivalTime: arrival,
                departureTime: departure,
                date: date,
                price: +priceRef?.current?.value,
            }, { withCredentials: true })

            console.log(resp, "resp")
            setShowForm(false)
            getRoutes()

            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }

    }

    const delRoute = async (_id: string) => {

        if (!_id) return

        try {
            setIsLoading(true)
            const resp = await axios.delete(`${baseUrl}/api/v1/bus-route/${_id}`, {
                withCredentials: true
            })
            console.log("resp", resp)
            setIsLoading(false)
            getRoutes()
            setShowDelModal(false)
            set_id(null)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }

    }

    const _editRoute = async (_id: string) => {

        if (!_id || _id?.trim() === "") return
        if (!routeData) return
        if (!routeData?.origin || routeData?.origin?.trim() === "") return
        if (!routeData?.destination || routeData?.destination?.trim() === "") return
        if (!routeData?.arrivalTime || routeData?.arrivalTime?.trim() === "") return
        if (!routeData?.departureTime || routeData?.departureTime?.trim() === "") return
        if (!routeData?.date || routeData?.date?.trim() === "") return
        if (!routeData?.price || `${routeData?.price}`?.trim() === "") return

        console.log(_id)

        try {
            setIsLoading(true)
            const resp = await axios.put(`${baseUrl}/api/v1/bus-route/${_id}`, {
                arrivalTime: routeData?.arrivalTime?.length > 5 ? moment?.utc(routeData?.arrivalTime)?.format("HH:mm") : routeData?.arrivalTime,
                departureTime: routeData?.departureTime?.length > 5 ? moment?.utc(routeData?.departureTime)?.format("HH:mm") : routeData?.departureTime,
                origin: titleCase(routeData?.origin),
                destination: titleCase(routeData?.destination),
                date: routeData?.date,
                price: +routeData?.price,
            }, { withCredentials: true })
            console.log("resp", resp)
            setIsLoading(false)
            getRoutes()
            setEditRoute(false)
            setRouteData(null)
            set_id(null)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }

    }

    return (
        <div className="w-full flex flex-col gap-8 p-8">
            {
                showForm && <>
                    <div className="popupcontainer">
                        <form onSubmit={handleSubmit}
                            className="relative h-fit shadow-2xl border bg-[#fff] p-8 flex flex-col gap-4 rounded-2xl"
                        >
                            <ImCross
                                style={{
                                    position: "absolute",
                                    top: "1em",
                                    right: "1em",
                                    cursor: "pointer",
                                    backgroundColor: "#353535",
                                    padding: "12px",
                                    width: 40,
                                    height: 40,
                                    borderRadius: 100
                                }}
                                onClick={() => setShowForm(false)}
                            />
                            <img src={logo} alt="logo"
                                className="object-contain object-center rounded-full mx-auto"
                                style={{
                                    width: 80,
                                    height: 80,
                                }}
                            />
                            <h1 className="w-full text-center text-[#000] text-[40px] font-bold">Add A Route</h1>
                            <input type="text"
                                ref={originRef}
                                placeholder="Origin"
                                className="border-2 border-[#ccc] p-2 rounded-md w-[500px]"
                            />
                            <input type="text"
                                ref={destinationRef}
                                placeholder="Destination"
                                className="border-2 border-[#ccc] p-2 rounded-md w-[500px]"
                            />
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <MobileTimePicker
                                    className="date-route"
                                    label="Departure Time"
                                    onChange={(e: any) => setDeparture(moment.utc(e).format('HH:mm'))}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <MobileTimePicker
                                    className="date-route"
                                    label="Arrival Time"
                                    onChange={(e: any) => setArrival(moment.utc(e).format('HH:mm'))}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    className="date-route"
                                    label="Date"
                                    onChange={(e: any) => setDate(moment.utc(e).format('YYYY MM DD').replace(" ", "-").replace(" ", "-"))}
                                />
                            </LocalizationProvider>
                            <input type="number"
                                ref={priceRef}
                                placeholder="Price"
                                className="border-2 border-[#ccc] p-2 rounded-md w-[500px]"
                            />
                            <Button
                                type="submit" color="primary" variant="contained">{
                                    isLoading ? "Loading" : "+ Add"
                                }</Button>
                        </form>
                    </div>
                </>
            }
            {
                showDelModal && <>
                    <DelModal
                        showDelModal={showDelModal} setShowDelModal={setShowDelModal}
                        title="Delete Route ?" text="Are you sure, you want to delete this route ?"
                        fun={delRoute}
                        isLoading={isLoading} _id={_id}
                    />
                </>
            }
            {
                editRoute && <>
                    <EditRouteForm
                        editRoute={editRoute} setEditRoute={setEditRoute}
                        fun={_editRoute} routeData={routeData}
                        setRouteData={setRouteData}
                        isLoading={isLoading} _id={_id}
                    />
                </>
            }
            <>
                <div className="w-fit flex items-center gap-4 px-2 cursor-pointer"
                    onClick={() => window?.history?.back()}
                >
                    <p className="text-[#000] text-[40px] text-left font-bold">{`<`}</p>
                    <h1 className="text-[#000] text-[32px] text-left font-bold">{location?.state?.bus?.name} {`(Routes)`}</h1>
                </div>
                <div className="w-full flex justify-between items-center px-2">
                    <h1 className="text-[24px] text-left text-[#fff] font-bold cursor-pointer p-4 bg-[#29ABE2] rounded-md"
                        onClick={() => setShowForm(true)}
                    > + Add A Route</h1>
                </div>
                <table border={1} className="w-full h-full overflow-y-auto border-1 border border-[#ccc]">
                    <tr className="border border-b border-[#ccc]">
                        <th className="p-[8px] py-[12px] text-[20px]">Departure</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Arrival</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Departure Time</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Arrival Time</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Bus Number</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Status</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Price</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Actions</th>
                    </tr>
                    {
                        routes?.map((route: any, i: number) => (
                            <>
                                <tr className="border border-b border-[#ccc]" key={route?._id}>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                        onClick={() => navigate(`/admin/passengers/${route?._id}`, {
                                            state: {
                                                ...route, busNumber: location?.state?.bus?.busNumber, busName: location?.state?.bus?.name
                                            }
                                        })}
                                    >{route?.origin}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                        onClick={() => navigate(`/admin/passengers/${route?._id}`, {
                                            state: {
                                                ...route, busNumber: location?.state?.bus?.busNumber, busName: location?.state?.bus?.name
                                            }
                                        })}
                                    >{route?.destination}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                        onClick={() => navigate(`/admin/passengers/${route?._id}`, {
                                            state: {
                                                ...route, busNumber: location?.state?.bus?.busNumber, busName: location?.state?.bus?.name
                                            }
                                        })}
                                    >{moment.utc(route?.departureTime).format('LLL')}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                        onClick={() => navigate(`/admin/passengers/${route?._id}`, {
                                            state: {
                                                ...route, busNumber: location?.state?.bus?.busNumber, busName: location?.state?.bus?.name
                                            }
                                        })}
                                    >{moment.utc(route?.arrivalTime).format('LLL')}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                        onClick={() => navigate(`/admin/passengers/${route?._id}`, {
                                            state: {
                                                ...route, busNumber: location?.state?.bus?.busNumber, busName: location?.state?.bus?.name
                                            }
                                        })}
                                    >{location?.state?.bus?.busNumber}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                        onClick={() => navigate(`/admin/passengers/${route?._id}`, {
                                            state: {
                                                ...route, busNumber: location?.state?.bus?.busNumber, busName: location?.state?.bus?.name
                                            }
                                        })}
                                    >
                                        <p className={`${route?.isActive ? "bg-[#28A745]" : "bg-[#D61717]"} w-[100px] h-[33px] rounded-[100px] flex justify-center items-center text-[#fff] text-center text-sm mx-auto`}>{route?.isActive ? "Active" : "Close"}</p>
                                    </td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                        onClick={() => navigate(`/admin/passengers/${route?._id}`, {
                                            state: {
                                                ...route, busNumber: location?.state?.bus?.busNumber, busName: location?.state?.bus?.name
                                            }
                                        })}
                                    >{route?.price?.toLocaleString()}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]">
                                        <p
                                            className="font-bold"
                                            id="demo-positioned-button"
                                            aria-controls={open ? 'demo-positioned-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={(e: any) => {
                                                handleClick(e)
                                                setIndex(i)
                                            }}
                                        >
                                            ...
                                        </p>
                                        <Menu
                                            id="demo-positioned-menu"
                                            aria-labelledby="demo-positioned-button"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                        >
                                            <MenuItem sx={{ fontSize: 18 }}
                                                onClick={() => {
                                                    setRouteData({ ...routes[index], date: routes[index]?.arrivalTime?.substr(0, 10) })
                                                    setEditRoute(true)
                                                    set_id(routes[index]?._id)
                                                    handleClose()
                                                }}
                                            >Edit</MenuItem>
                                            <MenuItem sx={{ fontSize: 18 }}
                                                onClick={() => {
                                                    setShowDelModal(true)
                                                    set_id(routes[index]?._id)
                                                    handleClose()
                                                }}
                                            >Delete</MenuItem>
                                        </Menu>
                                    </td>
                                </tr>
                            </>
                        ))
                    }
                </table>
            </>
        </div >
    )
}

export default BusRoutes