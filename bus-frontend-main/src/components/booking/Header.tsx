import "../../tailwind.css"
import "./main.css"
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png"
import { TbCircleNumber1, TbCircleNumber7 } from "react-icons/tb";
import { TbCircleNumber2 } from "react-icons/tb";
import { TbCircleNumber3 } from "react-icons/tb";
import { TbCircleNumber4 } from "react-icons/tb";
// import { TbCircleNumber5 } from "react-icons/tb";
import { TbCircleNumber6 } from "react-icons/tb";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { useSelector } from "react-redux";

const Header = (
    {
        passengers, from, to, date,
        step, setStep
    }: any) => {

    const navigate = useNavigate()
    const isSelectedEnglish = !useSelector((state: any) => state?.user?.isSelectedUrdu)

    console.log(passengers, from, to, date, setStep)

    return (
        <div className="w-full h-fit px-8 flex items-center gap-16 bg-[#070B15] sticky top-0 z-20">
            <img src={logo} alt="logo"
                className="w-[83px] h-[83px] object-cover object-center rounded-full my-4"
            />
            <div className="w-fit h-full flex items-center">
                <div
                    onClick={() => navigate("/")}
                    className={`steps-header cursor-pointer w-fit flex items-center justify-center p-2 py-8 gap-2 ${(step == 1) && "bg-[#29ABE2]"}`}>
                    {
                        (step == 1) ? <TbCircleNumber1 /> : <IoCheckmarkDoneCircle />
                    }
                    <p className="text-left text-[#fff] text-sm">{isSelectedEnglish ? "Search" : "تلاش کریں"}</p>
                </div>
                <div className={`steps-header cursor-pointer w-fit flex items-center justify-center p-2 py-8 gap-2 ${(step == 2) && "bg-[#29ABE2]"}`}>
                    {
                        (step <= 2) ? <TbCircleNumber2 /> : <IoCheckmarkDoneCircle />
                    }
                    <p className="text-left text-[#fff] text-sm">{isSelectedEnglish ? "Select Bus" : "بس منتخب کریں"}</p>
                </div>
                <div className={`steps-header cursor-pointer w-fit flex items-center justify-center p-2 py-8 gap-2 ${(step == 3) && "bg-[#29ABE2]"}`}>
                    {
                        (step <= 3) ? <TbCircleNumber3 /> : <IoCheckmarkDoneCircle />
                    }
                    <p className="text-left text-[#fff] text-sm">{isSelectedEnglish ? "Select Seat" : "سیٹ منتخب کریں"}</p>
                </div>
                <div className={`steps-header cursor-pointer w-fit flex items-center justify-center p-2 py-8 gap-2 ${(step == 4) && "bg-[#29ABE2]"}`}>
                    {
                        (step <= 4) ? <TbCircleNumber4 /> : <IoCheckmarkDoneCircle />
                    }
                    <p className="text-left text-[#fff] text-sm">{isSelectedEnglish ? "Enter Details" : "تفصیلات درج کریں"}</p>
                </div>
                {/* <div className={`steps-header cursor-pointer w-fit flex items-center justify-center p-2 py-8 gap-2 ${(step == 5) && "bg-[#29ABE2]"}`}>
                    {
                        (step == 5) ? <TbCircleNumber5 /> : <IoCheckmarkDoneCircle />
                    }
                    <p className="text-left text-[#fff] text-sm">Add Extras</p>
                </div> */}
                <div className={`steps-header cursor-pointer w-fit flex items-center justify-center p-2 py-8 gap-2 ${(step == 5) && "bg-[#29ABE2]"}`}>
                    {
                        (step <= 5) ? <TbCircleNumber6 /> : <IoCheckmarkDoneCircle />
                    }
                    <p className="text-left text-[#fff] text-sm">{isSelectedEnglish ? "Pay And Confirm" : "ادائیگی کریں"}</p>
                </div>
                <div className={`steps-header cursor-pointer w-fit flex items-center justify-center p-2 py-8 gap-2 ${(step == 6) && "bg-[#29ABE2]"}`}>
                    {
                        (step <= 6) ? <TbCircleNumber7 /> : <IoCheckmarkDoneCircle />
                    }
                    <p className="text-left text-[#fff] text-sm">{isSelectedEnglish ? "Payment Status" : "ادائیگیاں"}</p>
                </div>
            </div>
        </div>
    )
}

export default Header