import { ThemeProvider } from "@emotion/react";
import { CustomTextField } from "../home/Form";
import { theme } from "../../mui/theme";
import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import AlertMUI from "../../mui/components/AlertMUI";
import { baseUrl, phonePattern } from "../../core";
import axios from "axios";
import { useSelector } from "react-redux";

const Step3 = ({ step, setStep, data, _data, set_data }: any) => {

    const isDarkMode = useSelector((state: any) => state?.user?.isDarkTheme)
    const isSelectedEnglish = !useSelector((state: any) => state?.user?.isSelectedUrdu)

    const [passengersData, setPassengersData] = useState<any[]>([])
    const [errorMessage, setErrorMessage] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    console.log(step, setStep, data, _data, set_data);

    const payment = async () => {

        for (let i = 0; i < passengersData.length; i++) {
            if (!passengersData[i]?.phone || !phonePattern?.test(`+${passengersData[i]?.phone}`)) {
                setErrorMessage(`Invalid phone number for passenger ${i + 1}`)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 4000);
                return
            }
            if (!passengersData[i]?.firstName || passengersData[i]?.firstName?.trim() === "") {
                setErrorMessage(`First name is missing for passenger ${i + 1}`)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 4000);
                return
            }
            if (!passengersData[i]?.lastName || passengersData[i]?.lastName?.trim() === "") {
                setErrorMessage(`Last name is missing for passenger ${i + 1}`)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 4000);
                return
            }
            if (!passengersData[i]?.age) {
                setErrorMessage(`Age is invalid for passenger ${i + 1}`)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 4000);
                return
            }
            // if (!passengersData[i]?.city || passengersData[i]?.city?.trim() === "") {
            //     setErrorMessage(`City is missing for passenger ${i + 1}`)
            //     setTimeout(() => {
            //         setErrorMessage(null)
            //     }, 4000);
            //     return
            // }

            console.log(passengersData)

        }

        try {
            const promises = passengersData?.map(async (passenger: any) => {
                const addPassengerResp = await axios.post(
                    `${baseUrl}/api/v1/passenger/${_data?.bus?._id}`,
                    {
                        firstName: passenger?.firstName,
                        lastName: passenger?.lastName,
                        age: passenger?.age,
                        phone: `+${passenger?.phone}`,
                        seatNumber: passenger?.seat,
                    },
                    { withCredentials: true }
                );
                return addPassengerResp?.data?.passengerId;
            });

            const newPassengerIds = await Promise.all(promises);
            setIsLoading(false);

            set_data({
                ..._data,
                passengersData: passengersData,
                passengerIds: newPassengerIds,
            });

            console.log("Updated _data:", _data); // Log updated _data for verification

            setStep(step + 1); // Move to the next step after all passengers are added
        } catch (error) {
            console.error("Error adding passengers:", error);
            setIsLoading(false);
        }

    }

    return (
        <ThemeProvider theme={theme} >
            <>
                {
                    errorMessage && <AlertMUI status="error" text={errorMessage} />
                }
                <div className={`w-full h-screen bg-[${isDarkMode ? "#0a101d" : "#fff"}] flex flex-col gap-4 p-8 pt-16`}>
                    <h1 className={`w-full text-[${!isDarkMode ? "#0a101d" : "#fff"}] font-bold text-[24px] ${isSelectedEnglish ? "text-left" : "text-right"}`}>
                        {isSelectedEnglish ? "Enter Passenger Details" : "مسافر کی تفصیلات درج کریں۔"}
                    </h1>
                    <div className={`w-full border-b-2 border-b-[${!isDarkMode ? "#0a101d" : "#fff"}] mt-2`}></div>
                    <h1 className={`w-full text-[${!isDarkMode ? "#0a101d" : "#fff"}] font-bold text-[24px] mt-2 mb-4 ${isSelectedEnglish ? "text-left" : "text-right"}`}>
                        {isSelectedEnglish ? "Passengers Information" : "مسافروں کی معلومات"}
                    </h1>
                    <>
                        {
                            _data?.selectedSeats?.map((seat: any, i: number) => (
                                <>
                                    <React.Fragment key={i}>
                                        <div className="w-full flex flex-col gap-2 mt-4">
                                            <div className={`w-full flex ${isSelectedEnglish ? "flex-row" : "flex-row-reverse"} items-center gap-4`}>
                                                <h2 className="w-[300px] h-fit p-4 bg-[#29ABE2] text-[#fff] font-bold"
                                                    style={{
                                                        borderTopRightRadius: "400px",
                                                        borderBottomRightRadius: "400px",
                                                    }}
                                                >{isSelectedEnglish ? `Passenger ${i + 1}` : `مسافر ${i + 1}`}</h2>
                                                <h2 className={`h-fit p-4 text-[${isDarkMode ? "#fff" : "#0a101d"}] font-bold`}
                                                >{isSelectedEnglish ? `Seat No: ${seat}` : `سیٹ نمبر : ${seat}`}</h2>
                                            </div>
                                            <div className={`mt-4 w-full flex ${isSelectedEnglish ? "flex-row" : "flex-row-reverse"} justify-start items-start gap-2 flex-wrap`}>
                                                {/* <CustomAutocomplete
                                                sx={{
                                                    width: "319px"
                                                }}
                                                value={passengersData[i]?.title}
                                                disablePortal
                                                id="combo-box-demo"
                                                options={["Mr.", "Mrs."]}
                                                onChange={(e: any) => {
                                                    const newData = [...passengersData]
                                                    newData[i] = { ...newData[i], title: e?.target?.textContent }
                                                    setPassengersData(newData)
                                                }}
                                                renderInput={(params: any) => <CustomTextField
                                                    placeholder="Mr. / Mrs."
                                                    {...params} />}
                                            /> */}

                                                {
                                                    isDarkMode ?
                                                        <CustomTextField
                                                            placeholder={isSelectedEnglish ? "Phone (+92 format)" : "فون (+92 فارمیٹ)"}
                                                            type="number"
                                                            onChange={(e: any) => {
                                                                const newData = [...passengersData]
                                                                newData[i] = { ...newData[i], phone: e?.target?.value, seat: seat }
                                                                setPassengersData(newData)
                                                            }}
                                                        /> :
                                                        <TextField
                                                            placeholder={isSelectedEnglish ? "Phone (+92 format)" : "فون (+92 فارمیٹ)"}
                                                            type="number"
                                                            onChange={(e: any) => {
                                                                const newData = [...passengersData]
                                                                newData[i] = { ...newData[i], phone: e?.target?.value, seat: seat }
                                                                setPassengersData(newData)
                                                            }}
                                                        />
                                                }

                                                {
                                                    isDarkMode ?
                                                        <CustomTextField
                                                            placeholder={isSelectedEnglish ? "First name" : "پہلا نام"}
                                                            onChange={(e: any) => {
                                                                const newData = [...passengersData]
                                                                newData[i] = { ...newData[i], firstName: e?.target?.value, seat: seat }
                                                                setPassengersData(newData)
                                                            }}
                                                        /> :
                                                        <TextField
                                                            placeholder={isSelectedEnglish ? "First name" : "پہلا نام"}
                                                            onChange={(e: any) => {
                                                                const newData = [...passengersData]
                                                                newData[i] = { ...newData[i], firstName: e?.target?.value, seat: seat }
                                                                setPassengersData(newData)
                                                            }}
                                                        />
                                                }

                                                {
                                                    isDarkMode ?
                                                        <CustomTextField
                                                            placeholder={isSelectedEnglish ? "Last name" : "آخری نام"}
                                                            onChange={(e: any) => {
                                                                const newData = [...passengersData]
                                                                newData[i] = { ...newData[i], lastName: e?.target?.value, seat: seat }
                                                                setPassengersData(newData)
                                                            }}
                                                        /> :
                                                        <TextField
                                                            placeholder={isSelectedEnglish ? "Last name" : "آخری نام"}
                                                            onChange={(e: any) => {
                                                                const newData = [...passengersData]
                                                                newData[i] = { ...newData[i], lastName: e?.target?.value, seat: seat }
                                                                setPassengersData(newData)
                                                            }}
                                                        />
                                                }

                                                {/* <CustomTextField
                                                    placeholder="City"
                                                    onChange={(e: any) => {
                                                        const newData = [...passengersData]
                                                        newData[i] = { ...newData[i], city: e?.target?.value, seat: seat }
                                                        setPassengersData(newData)
                                                    }}
                                                /> */}

                                                {
                                                    isDarkMode ?
                                                        <CustomTextField
                                                            type="number"
                                                            placeholder={isSelectedEnglish ? "Age" : "عمر"}
                                                            onChange={(e: any) => {
                                                                if (e?.target?.value <= 0) {
                                                                    e.target.value = 1
                                                                }
                                                                const newData = [...passengersData]
                                                                newData[i] = { ...newData[i], age: e?.target?.value, seat: seat }
                                                                setPassengersData(newData)

                                                            }}
                                                        /> :
                                                        <TextField
                                                            type="number"
                                                            placeholder={isSelectedEnglish ? "Age" : "عمر"}
                                                            onChange={(e: any) => {
                                                                if (e?.target?.value <= 0) {
                                                                    e.target.value = 1
                                                                }
                                                                const newData = [...passengersData]
                                                                newData[i] = { ...newData[i], age: e?.target?.value, seat: seat }
                                                                setPassengersData(newData)

                                                            }}
                                                        />
                                                }

                                            </div>
                                        </div>
                                    </React.Fragment>
                                </>
                            ))
                        }
                    </>
                    <div className="mt-8 w-full flex justify-end">
                        <Button variant="contained" color="secondary"
                            sx={{
                                fontSize: "32px",
                                borderRadius: "8px",
                                padding: "24px"
                            }}
                            onClick={payment}
                        >{isLoading ? "Loading..." : isSelectedEnglish ? "Proceed To Payment" : "ادائیگی کے لیے آگے بڑھیں"}</Button>
                    </div>
                    {/* <h1 className="w-full text-[#fff] font-bold text-[24px] mt-16">Contact Information</h1> */}
                    {/* <div className="w-full border-b-2 border-b-[#fff] mt-2"></div> */}
                </div>
            </>
        </ThemeProvider>
    );
};

export default Step3;