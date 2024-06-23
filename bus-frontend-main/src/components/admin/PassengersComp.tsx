import axios from "axios";
import
// React, 
{ useEffect, useState } from "react";
import { baseUrl } from "../../core";
import {
    useLocation, useParams
    // ,useNavigate
} from "react-router-dom";
import moment from "moment";
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';

const PassengersComp = () => {

    // const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()

    const { routeId } = params

    const [passengers, setPassengers] = useState<any>([])

    useEffect(() => {
        getPassengers()
    }, [routeId])

    const getPassengers = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/api/v1//bus-route/${routeId}/passengers/`, {
                withCredentials: true
            })
            console.log("resp?.data?.data", resp?.data?.data)
            setPassengers(resp?.data?.data)
        } catch (error: any) {
            console.log(error)
        }
    }

    // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    // const open = Boolean(anchorEl);

    // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    return (
        <div className="w-full flex flex-col gap-8 p-8">
            <>
                <div className="w-fit flex items-center gap-4 px-2 cursor-pointer"
                    onClick={() => window?.history?.back()}
                >
                    <p className="text-[#000] text-[40px] text-left font-bold">{`<`}</p>
                    <h1 className="text-[#000] text-[32px] text-left font-bold">{location?.state?.busName} {`(Passengers)`}</h1>
                </div>
                <table border={1} className="w-full h-full overflow-y-auto border-1 border border-[#ccc]">
                    <tr className="border border-b border-[#ccc]">
                        <th className="p-[8px] py-[12px] text-[20px]">Passenger Name</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Departure</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Arrival</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Departure Time</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Arrival Time</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Bus Number</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Payment</th>
                        {/* <th className="p-[8px] py-[12px] text-[20px]">Actions</th> */}
                    </tr>
                    {
                        passengers?.map((passenger: any) => (
                            <>
                                <tr className="border border-b border-[#ccc]" key={passenger?._id}>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                    // onClick={() => navigate(`/admin/passengers/${passenger?._id}`)}
                                    >{`${passenger?.firstName} ${passenger?.lastName}`}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                    // onClick={() => navigate(`/admin/passengers/${passenger?._id}`)}
                                    >{location?.state?.origin}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                    // onClick={() => navigate(`/admin/passengers/${passenger?._id}`)}
                                    >{location?.state?.destination}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                    // onClick={() => navigate(`/admin/passengers/${passenger?._id}`)}
                                    >{moment.utc(location?.state?.departureTime).format('LLL')}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                    // onClick={() => navigate(`/admin/passengers/${passenger?._id}`)}
                                    >{moment.utc(location?.state?.arrivalTime).format('LLL')}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                    // onClick={() => navigate(`/admin/passengers/${passenger?._id}`)}
                                    >{location?.state?.busNumber}</td>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                    // onClick={() => navigate(`/admin/passengers/${passenger?._id}`)}
                                    >
                                        <p className={`${passenger?.isActive ? "bg-[#28A745]" : "bg-[#D61717]"} w-[100px] h-[33px] rounded-[100px] flex justify-center items-center text-[#fff] text-center text-sm mx-auto`}>{passenger?.isActive ? "Paid" : "Un-Paid"}</p>
                                    </td>
                                    {/* <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]">
                                        <p
                                            className="font-bold"
                                            id="demo-positioned-button"
                                            aria-controls={open ? 'demo-positioned-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={handleClick}
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
                                            <MenuItem onClick={handleClose}
                                                sx={{ fontSize: 18 }}
                                            >Edit</MenuItem>
                                            <MenuItem onClick={handleClose}
                                                sx={{ fontSize: 18 }}
                                            >Delete</MenuItem>
                                        </Menu>
                                    </td> */}
                                </tr>
                            </>
                        ))
                    }
                </table>
            </>
        </div>
    )
}

export default PassengersComp