import "./main.css"

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
// import { LuDownload } from "react-icons/lu";
import { baseUrl } from "../../core";
import { useNavigate } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ImCross } from "react-icons/im";
import { Button } from "@mui/material";
import logo from "../../assets/images/logo.png"
import DelModal from "./DelModal";
import EditCompanyForm from "./EditCompanyForm";

const CompanyComp = () => {

    const navigate = useNavigate()

    // const statuses = [
    //     "On Route"
    // ]

    const [companies, setCompanies] = useState<any>([])
    const [showForm, setShowForm] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showDelModal, setShowDelModal] = useState<boolean>(false)
    const [_id, set_id] = useState<string | null>(null)
    const [companyData, setCompanyData] = useState<any>(null)
    const [editCompany, setEditCompany] = useState<boolean>(false)
    const [index, setIndex] = useState<number>(0)

    const companyNameRef: any = useRef()

    useEffect(() => {
        getCompanies()
    }, [])

    const getCompanies = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/api/v1/companies`, {
                withCredentials: true
            })
            setCompanies(resp?.data?.data)
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

        const companyName = companyNameRef?.current?.value

        if (!companyName || (`${companyName}`)?.trim() === "") return

        try {

            setIsLoading(true)
            const resp = await axios.post(`${baseUrl}/api/v1/company`, {
                name: companyName
            }, { withCredentials: true })

            console.log(resp)

            setIsLoading(false)
            setShowForm(false)
            getCompanies()

        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }

    }

    const delCompany = async (_id: string) => {

        if (!_id || _id?.trim() === "") return

        try {
            setIsLoading(true)
            const resp = await axios.delete(`${baseUrl}/api/v1/company/${_id}`, {
                withCredentials: true
            })
            console.log("resp", resp)
            setIsLoading(false)
            getCompanies()
            setShowDelModal(false)
            set_id(null)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }

    }

    const _editCompany = async (_id: string) => {

        if (!_id) return
        if (!companyData || companyData?.trim() === "") return

        try {
            setIsLoading(true)
            const resp = await axios.put(`${baseUrl}/api/v1/company/${_id}`, {
                name: companyData
            }, { withCredentials: true })
            console.log("resp", resp)
            setIsLoading(false)
            getCompanies()
            setEditCompany(false)
            setCompanyData(null)
            set_id(null)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }

    }

    console.log("index", index)

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
                                ref={companyNameRef}
                                placeholder="Company Name . . ."
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
                        title={`Delete ${companies[index]?.name} company ?`} text="Are you sure, you want to delete this company ?"
                        fun={delCompany}
                        isLoading={isLoading} _id={_id}
                    />
                </>
            }
            {
                editCompany && <>
                    <EditCompanyForm
                        editCompany={editCompany} setEditCompany={setEditCompany}
                        fun={_editCompany} companyData={companyData}
                        setCompanyData={setCompanyData}
                        isLoading={isLoading} _id={_id}
                    />
                </>
            }
            <>
                <div className="w-full flex justify-between items-center px-2">
                    <h1 className="text-[#000] text-[32px] text-left font-bold">Companies</h1>
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
                    > + Add A Company</h1>
                </div>
                <table border={1} className="w-full h-full overflow-y-auto border-1 border border-[#ccc]">
                    <tr className="border border-b border-[#ccc]"
                    // onClick={()=>navigate(`/admin/buses/6658c6fabaf294cfba4e8364`)}
                    >
                        <th className="p-[8px] py-[12px] text-[20px]">Company Name</th>
                        <th className="p-[8px] py-[12px] text-[20px]">Actions</th>
                    </tr>
                    {
                        companies?.map((company: any, i: number) => (
                            <>
                                <tr className="border border-b border-[#ccc]" key={company?._id}>
                                    <td className="cursor-pointer text-center p-[8px] py-[12px] text-[20px]"
                                        onClick={() => navigate(`/admin/buses/${company?._id}`, {
                                            state: { company }
                                        })}
                                    >{company?.name}</td>
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
                                                    setEditCompany(true)
                                                    set_id(companies[index]._id)
                                                    handleClose()
                                                    setCompanyData(companies[index]?.name)
                                                }}
                                            >Edit</MenuItem>
                                            <MenuItem sx={{ fontSize: 18 }}
                                                onClick={() => {
                                                    setShowDelModal(true)
                                                    set_id(companies[index]?._id)
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
        </div>
    )
}

export default CompanyComp