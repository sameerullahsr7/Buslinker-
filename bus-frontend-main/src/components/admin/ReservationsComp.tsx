import "./main.css"

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
// import { LuDownload } from "react-icons/lu";
import { baseUrl } from "../../core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ImCross } from "react-icons/im";
import { Button } from "@mui/material";
import logo from "../../assets/images/logo.png"
import DelModal from "./DelModal";
import EditBusForm from "./EditBusForm";
const ReservationsComp = () => {

    const navigate = useNavigate()
    const { companyId } = useParams()
    const { state } = useLocation()

    // const statuses = [
    //     "On Route"
    // ]

    const [buses, setBuses] = useState<any>([])
    const [showForm, setShowForm] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [index, setIndex] = useState<number>(0)
    const [showDelModal, setShowDelModal] = useState<boolean>(false)
    const [_id, set_id] = useState<string | null>(null)
    const [busData, setBusData] = useState<any>(null)
    const [editBus, setEditBus] = useState<boolean>(false)

    const registrationNumberRef: any = useRef()
    const busNameRef: any = useRef()
    const seatsRef: any = useRef()

    useEffect(() => {
        getBuses()
    }, [])

    const getBuses = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/api/v1/company/${companyId}/buses`, {
                withCredentials: true
            })
            setBuses(resp?.data?.data)
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

        const regNo = registrationNumberRef?.current?.value
        const name = busNameRef?.current?.value
        const seats = seatsRef?.current?.value

        if (!regNo || regNo?.trim() === "" || !name || name?.trim() === "" || !seats || seats == 0) {
            return
        }

        try {

            setIsLoading(true)
            const resp = await axios.post(`${baseUrl}/api/v1/bus/${state?.company?._id}`, {
                registrationNumber: regNo,
                name: name,
                totalSeats: seats
            }, { withCredentials: true })

            console.log(resp)

            setIsLoading(true)
            setShowForm(false)
            getBuses()

        } catch (error) {
            console.log(error)
            setIsLoading(true)
        }

    }

    const delBus = async (_id: string) => {
        if (!_id || _id?.trim() === "") return

        try {
            setIsLoading(true)
            const resp = await axios.delete(`${baseUrl}/api/v1/bus/${_id}`, {
                withCredentials: true
            })
            console.log("resp", resp)
            setIsLoading(false)
            getBuses()
            setShowDelModal(false)
            set_id(null)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }

    }

    const _editBus = async (_id: string) => {

        if (!_id || _id?.trim() === "") return
        if (!busData) return
        if (!busData?.busNumber || busData?.busNumber?.trim() === "") return
        if (!busData?.totalSeats) return
        if (!busData?.name || busData?.name?.trim() === "") return

        console.log("doing")

        try {
            setIsLoading(true)
            const resp = await axios.put(`${baseUrl}/api/v1/bus/${_id}`, {
                registrationNumber: busData?.busNumber,
                name: busData?.name,
                totalSeats: busData?.totalSeats
            }, { withCredentials: true })
            console.log("resp", resp)
            setIsLoading(false)
            getBuses()
            setEditBus(false)
            setBusData(null)
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
                            <h1 className="w-full text-center text-[#000] text-[40px] font-bold">Add A Bus</h1>
                            <input type="text"
                                ref={registrationNumberRef}
                                placeholder="Bus Registration Number . . ."
                                className="border-2 border-[#ccc] p-2 rounded-md w-[500px]"
                            />
                            <input type="text"
                                ref={busNameRef}
                                placeholder="Bus Name . . ."
                                className="border-2 border-[#ccc] p-2 rounded-md w-[500px]"
                            />
                            <input type="number"
                                ref={seatsRef}
                                placeholder="Total Seats . . ."
                                step={1}
                                min={1}
                                max={200}
                                className="border-2 border-[#ccc] p-2 rounded-md w-[500px]"
                            />
                            <Button type="submit" color="primary" variant="contained">{
                                isLoading ? "Loading . . ." : "+ Add"
                            }</Button>
                        </form>
                    </div>
                </>
            }
            {
                showDelModal && <>
                    <DelModal
                        showDelModal={showDelModal} setShowDelModal={setShowDelModal}
                        title={`Delete Bus ${buses[index]?.name}?`} text="Are you sure, you want to delete this bus?"
                        fun={delBus}
                        isLoading={isLoading} _id={_id}
                    />
                </>
            }
            {
                editBus && <>
                    <EditBusForm
                        editBus={editBus} setEditBus={setEditBus} fun={_editBus}
                        isLoading={isLoading} _id={_id} busData={busData} setBusData={setBusData}
                    />
                </>
            }
            <>
                <div className="w-fit flex items-center gap-4 px-2 cursor-pointer"
                    onClick={() => window?.history?.back()}
                >
                    <p className="text-[#000] text-[40px] text-left font-bold">{`<`}</p>
                    <h1 className="text-[#000] text-[32px] text-left font-bold">{state?.company?.name} {`(Buses)`} </h1>
                    <div className="flex h-[2em] justify-end items-center gap-2">
                        {/* <select name="status"
                            className="text-[20px] outline-none w-[200px] p-2 bg-[#e8e8e8] border border-1 border-[#ccc] rounded-md"
                        >
                            <option value="" disabled>Select Status</option>
                            {
                                statuses.map((status: any) => (
                                    <option value={status}>{status}</option>
                                ))
                            }
                        </select>
                        <input type="text"
                            className="text-[20px] outline-none p-2 bg-[#e8e8e8] border border-1 border-[#ccc] rounded-md"
                            placeholder="Search"
                        />
                        <LuDownload
                            className="cursor-pointer bg-[#252525] p-2 w-[2em] h-[2em] rounded-md"
                        /> */}
                    </div>
                </div>
                <div className="w-full flex justify-between items-center px-2">
                    <h1 className="text-[24px] text-left text-[#fff] font-bold cursor-pointer p-4 bg-[#29ABE2] rounded-md"
                        onClick={() => setShowForm(true)}
                    > + Add A Bus</h1>
                </div>
                <table border={1} className="w-full h-full overflow-y-auto border-1 border border-[#ccc]">
                    <tr className="border border-b border-[#ccc]"
                    // onClick={()=>navigate(`/admin/routes/66450ad1abead2a31f618012`)}
                    >
                        <th className="p-[8px] py-[12px] text-[20px]">Bus Name</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Bus Number</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Total Seats</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Actions</th>
                    </tr>
                    {
                        buses?.map((bus: any, i: number) => (
                            <>
                                <tr className="border border-b border-[#ccc]" key={bus?._id}>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                        onClick={() => navigate(`/admin/routes/${bus?._id}`, {
                                            state: { bus }
                                        })}
                                    >{bus?.name}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                        onClick={() => navigate(`/admin/routes/${bus?._id}`, {
                                            state: { bus }
                                        })}
                                    >{bus?.busNumber}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                        onClick={() => navigate(`/admin/routes/${bus?._id}`, {
                                            state: { bus }
                                        })}
                                    >{bus?.totalSeats?.toLocaleString()}</td>
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
                                                    setBusData({ ...buses[index], totalSeats: +buses[index]?.totalSeats })
                                                    setEditBus(true)
                                                    set_id(buses[index]?._id)
                                                    handleClose()
                                                }}
                                            >Edit</MenuItem>
                                            <MenuItem sx={{ fontSize: 18 }}
                                                onClick={() => {
                                                    handleClose()
                                                    setShowDelModal(true)
                                                    set_id(buses[index]?._id)
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
        </div>
    )
}

export default ReservationsComp