import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../core";
import { Button, CircularProgress } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import { GiSteeringWheel } from "react-icons/gi";
import { useSelector } from "react-redux";

const Step2 = ({ step, setStep, data, _data, set_data }: any) => {

    const isDarkMode = useSelector((state: any) => state?.user?.isDarkTheme)
    const isSelectedEnglish = !useSelector((state: any) => state?.user?.isSelectedUrdu)

    console.log(step, setStep, data, _data, set_data);

    const [availableSeats, setAvailableSeats] = useState<number[] | null>(null);
    const [totalSeats, setTotalSeats] = useState<number>(0);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    // const navigate = useNavigate()

    useEffect(() => {
        getSeats();
    }, []);

    const getSeats = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/api/v1/seats/${_data?.bus?._id}`, {
                withCredentials: true
            });

            setTotalSeats(resp?.data?.totalSeats)
            setAvailableSeats(resp?.data?.availableSeats)
            console.log("resp?.data", resp?.data)
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelect = (seatNumber: number) => {

        if (availableSeats?.includes(seatNumber)) {
            if (selectedSeats.includes(seatNumber)) {
                setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
            } else {
                if (+data?.passengers != selectedSeats?.length) {
                    setSelectedSeats([...selectedSeats, seatNumber]);
                }
            }
        }

    };

    return (
        <div className={`w-full bg-[${isDarkMode ? "#0a101d" : "#fff"}] flex flex-col gap-4 p-8 pt-16`}>
            <h1 className={`w-full text-center font-bold text-[64px] text-[${isDarkMode ? "#fff" : "#0a101d"}]`}>{isSelectedEnglish ? "Select the seat" : "سیٹ منتخب کریں"}</h1>
            <div className={`w-full border-b-2 border-b-[${isDarkMode ? "#fff" : "#0a101d"}]`}></div>
            <div className="w-full flex justify-evenly items-center mt-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-[83px] h-[83px] bg-[#D61717]"></div>
                    <p className={`w-full text-center text-[${isDarkMode ? "#fff" : "#0a101d"}]`}>{isSelectedEnglish ? "Booked Seats" : "پہلے سے ہی بک کرائی گئی سیٹیں"}</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-[83px] h-[83px] bg-[#4DD836]"></div>
                    <p className={`w-full text-center text-[${isDarkMode ? "#fff" : "#0a101d"}]`}>{isSelectedEnglish ? "Selected Seats" : "آپ کی منتخب سیٹیں"}</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-[83px] h-[83px] bg-[#29ABE2]"></div>
                    <p className={`w-full text-center text-[${isDarkMode ? "#fff" : "#0a101d"}]`}>{isSelectedEnglish ? "Empty Seats" : "خالی سیٹیں"}</p>
                </div>
            </div>
            <div className="w-[680px] mx-auto flex justify-between items-center mt-8">
                <p className={`text-left text-[${isDarkMode ? "#fff" : "#0a101d"}] text-xl`}>{isSelectedEnglish ? "Entry" : "داخلہ"}</p>
                <GiSteeringWheel
                    style={{
                        backgroundColor: "#0a101d",
                        borderRadius: "100px",
                        padding: "12px",
                        width: "50px",
                        height: "50px"
                    }}
                />
            </div>
            {totalSeats ?
                <div className="seatsContStep3 w-[600px] grid grid-cols-6 gap-12 mx-auto">
                    {Array.from({ length: totalSeats }, (_, index) => index + 1).map((seat: number) => (
                        <div
                            className={`w-[80px] h-[80px] text-[#fff] font-bold text-center cursor-pointer flex justify-center items-center ${selectedSeats.includes(seat) ? 'bg-[#4DD836]' : availableSeats?.includes(seat) ? 'bg-[#29ABE2]' : 'bg-[#D61717]'}`}
                            key={seat}
                            onClick={() => handleSelect(seat)}
                        >
                            {seat}
                        </div>
                    ))}
                </div>
                : (
                    <div className="w-full flex justify-center items-center p-4 mt-4">
                        <CircularProgress color="primary" />
                    </div>
                )}
            {
                totalSeats && <>
                    <Button
                        sx={{
                            width: "16em",
                            borderRadius: 4,
                            marginX: "auto",
                            marginTop: 16
                        }}
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            if (+data?.passengers != selectedSeats?.length) return
                            set_data({ ..._data, selectedSeats: selectedSeats })
                            setStep(+step + 1)
                        }}
                    >{isSelectedEnglish ? "Confirm Selection" : "انتخاب کی تصدیق کریں"}</Button>
                </>
            }
        </div>
    );
};

export default Step2;