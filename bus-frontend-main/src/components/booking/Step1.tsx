import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { baseUrl } from "../../core"
import CircularProgress from '@mui/material/CircularProgress';
import DropAccordion from "./DropAccordion";
import moment from "moment";
import busEmoji from "../../assets/images/bus-emoji.svg"
import { MdDone } from "react-icons/md";
import { useSelector } from "react-redux";

const Step1 = ({ step, setStep, data, _data, set_data }: any) => {

    const navigate = useNavigate()

    const isDarkMode = useSelector((state: any) => state?.user?.isDarkTheme)
    const isSelectedEnglish = !useSelector((state: any) => state?.user?.isSelectedUrdu)

    console.log(step, setStep, data)
    const [buses, setBuses] = useState([])
    const [routes, setRoutes] = useState<null | any[]>(null)

    const features: string[] = isSelectedEnglish ?
        [
            "Enjoy a comfortable journey with our reclining seats and ample legroom.",
            "Stay connected with free Wi-Fi and power outlets available on board.",
            "Relax with air-conditioned comfort and a smooth ride.",
            "Our buses feature GPS tracking and real-time updates for a hassle-free trip.",
        ] : [
            "ہماری آرام دہ سیٹوں اور وسیع ٹانگوں کے ساتھ مکمل سفر کا لطف اٹھائیں۔",
            "بورڈ پر دستیاب مفت وائی فائی اور پاور آؤٹ لیٹس کے ساتھ منسلک رہیں۔",
            "ہوائی ماحولیتی آرام اور ہموار سفر کے ساتھ آرام کریں۔",
            "ہمارے بسوں میں جی پی ایس ٹریکنگ اور حقیقی وقت کی اپ ڈیٹس شامل ہیں جو پریشانی رہتے ہوئے سفر کو آسان بناتے ہیں۔",
        ]

    const scrollRef: any = useRef()

    useEffect(() => {
        getRoutes()
        getBuses()
    }, [])

    const getRoutes = async () => {

        if (!data?.from || !data?.to || !data?.passengers || !data?.date) navigate("/")

        try {

            const routeResp = await axios.post(`${baseUrl}/api/v1/bus-routes`, {
                passengers: data?.passengers,
                date: data?.date,
                destination: data?.to,
                origin: data?.from
            }, { withCredentials: true })

            setRoutes(routeResp?.data?.data)
            // console.log("routeResp?.data?.data",routeResp?.data)

        } catch (error: any) {
            console.log(error)
        }

    }

    const getBuses = async () => {
        try {

            const busesResp = await axios.get(`${baseUrl}/api/v1/buses`, {
                withCredentials: true
            })

            setBuses(busesResp?.data?.data)

        } catch (error) {
            console.log(error)
        }
    }

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft -= 100; // Adjust the scroll amount as needed
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += 100; // Adjust the scroll amount as needed
        }
    };

    return (
        <div className={`w-full bg-[${isDarkMode ? "#0a101d" : "#fff"}] flex flex-col gap-4 p-8 pt-16`}>
            <h1 className={`w-full ${isSelectedEnglish ? "text-left" : "text-right"} text-[${isDarkMode ? "#fff" : "#0a101d"}] font-bold text-[40px]`}>
                {isSelectedEnglish ? `1. Select your Bus from ${data?.from} to ${data?.to}` : `تک اپنی بس کا انتخاب کریں۔. ${data?.to} سے ${data?.from} `}
            </h1>
            <h1 className={`w-full ${isSelectedEnglish ? "text-left" : "text-right"} text-[#fff] font-bold text-[32px] bg-[#29ABE2] p-8`}>
                {isSelectedEnglish ? "All Bus include a generous 10 KG Hand Baggage" : "تمام بسوں میں 10 کلو گرام ہینڈ بیگیج شامل ہے۔"}
            </h1>
            <div className="w-full flex justify-between items-center gap-4 p-4 mt-4">
                <p className="text-[#29ABE2] text-[48px] cursor-pointer"
                    onClick={scrollLeft}
                >{`<`}</p>
                <div
                    ref={scrollRef}
                    className="w-full h-[100px] flex justify-start items-center gap-4 overflow-auto no-scrollbar">
                    {
                        buses?.length ? buses?.map((bus: any) => (
                            <>
                                <div className={`w-[300px] p-2 text-[${isDarkMode ? "#fff" : "#0a101d"}] text-[32px] font-bold flex justify-center items-center text-center`}>{`${bus?.name}>`}</div>
                            </>
                        )) : null
                    }
                </div>
                <p className="text-[#29ABE2] text-[48px] cursor-pointer"
                    onClick={scrollRight}
                >{`>`}</p>
            </div>
            <div className="w-full mt-4 border-b-2 border-[#F2F2F2]"></div>
            <div className="flex flex-col gap-4 p-4">
                {
                    !routes ?
                        <div className="w-full flex justify-center items-center p-4 mt-4">
                            <CircularProgress
                                color="primary"
                            />
                        </div>
                        : routes?.length ? routes?.map((route: any) => (
                            <>
                                <DropAccordion
                                    button={`${isSelectedEnglish ? "PKR" : ""} ${route?.price?.toLocaleString()} ${isSelectedEnglish ? "" : "روپے"}`}
                                    label={<>
                                        <div className="w-full flex flex-col items-center gap-4">
                                            <div className="w-full flex items-center gap-2">
                                                <p className="text-[#fff] font-bold text-[32px]">{moment.utc(route?.departureTime).format('LT')}</p>
                                                <img src={busEmoji} alt="bus"
                                                    className="w-[70px] h-[70px] object-contain"
                                                />
                                                <div className="flex-1 border-b-2 border-[#F2F2F2]"></div>
                                                <p className="text-[#fff] font-bold text-[32px]">{moment.utc(route?.arrivalTime).format('LT')}</p>
                                            </div>
                                            <div className="w-full flex justify-around items-center">
                                                <p className="text-[#fff]">{route?.origin}/{route?.destination}</p>
                                                <p className={`text-[#fff] ${isSelectedEnglish ? "text-left" : 'text-right'}`}>
                                                    {
                                                        isSelectedEnglish ?
                                                            `${Math.floor(moment.utc(route?.arrivalTime)?.diff(route?.departureTime, 'minutes') / 60)} hour(s) ${moment.utc(route?.arrivalTime)?.diff(route?.departureTime, 'minutes') % 60 >= 1 ? `${moment.utc(route?.arrivalTime)?.diff(route?.departureTime, 'minutes') % 60} minute(s)` : ""}` :
                                                            `گھنٹہ ${Math.floor(moment.utc(route?.arrivalTime)?.diff(route?.departureTime, 'minutes') / 60)} ${moment.utc(route?.arrivalTime)?.diff(route?.departureTime, 'minutes') % 60 >= 1 ? `منٹ ${moment.utc(route?.arrivalTime)?.diff(route?.departureTime, 'minutes') % 60}` : ""}`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </>}
                                    content={<>
                                        <div className="w-full flex flex-col">
                                            <div className={`p-4 bg-[#29ABE2] text-[#fff] ${isSelectedEnglish ? "text-left" : "text-right"} text-[32px] font-bold`}>
                                                {isSelectedEnglish ? "Basic" : "بنیادی"}
                                            </div>
                                            {
                                                features?.map((feature: string, i: number) => (
                                                    <>
                                                        <div
                                                            key={i}
                                                            className={`w-full p-4 pt-8 bg-[#fff] text-[#000] flex items-center gap-4 text-[24px] font-bold ${isSelectedEnglish ? "flex-row" : "flex-row-reverse"}`}
                                                        >
                                                            <MdDone
                                                                style={{
                                                                    background: "#000",
                                                                    padding: 4,
                                                                    borderRadius: 100,
                                                                }}
                                                            /> {feature}
                                                        </div>
                                                    </>
                                                ))
                                            }
                                            <div className="p-4 px-8 py-2 bg-[#fff] text-[#000] flex justify-between items-center gap-4 border-t-2 border-t-[#000]">
                                                <p className="font-bold w-fit text-[#000] text-[32px]">{isSelectedEnglish ? "PKR" : "روپے"} {route?.price?.toLocaleString()}</p>
                                                <p className="font-bold w-fit text-[#000] text-[18px] cursor-pointer"
                                                    onClick={() => {
                                                        set_data({ ..._data, bus: route })
                                                        setStep(3)
                                                    }}
                                                >{isSelectedEnglish ? "Select" : "منتخب کریں"}</p>
                                            </div>
                                        </div>
                                    </>}
                                />
                            </>
                        )) : <h1 className={`w-full h-screen text-center text-[${isDarkMode ? "#fff" : "#444"}] font-bold text-[32px] mt-8`}>
                            {isSelectedEnglish ? "Oops!... No buses available." : "افوہ!... کوئی بس دستیاب نہیں ہے۔"}
                        </h1>
                }
            </div>
        </div>
    )
}

export default Step1