import { busImage } from "../../core"
import { MdOutlineShield } from "react-icons/md";
import { IoMdAlarm } from "react-icons/io";
import { BsCashCoin } from "react-icons/bs";
import { RiGitBranchFill } from "react-icons/ri";
import { FaLeaf } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { RiVipFill } from "react-icons/ri";
import { BsBuildingsFill } from "react-icons/bs";
import { useSelector } from "react-redux";

const Section2 = () => {

    const isDarkmode = useSelector((state: any) => state?.user?.isDarkTheme)
    const isSelectedEnglish = !(useSelector((state: any) => state?.user?.isSelectedUrdu))

    console.log("isDarkmodests", isDarkmode)

    const features = [
        {
            title: isSelectedEnglish ? "Safety" : "حفاظت",
            icon: <MdOutlineShield />
        },
        {
            title: isSelectedEnglish ? "Reliability" : "اعتبار",
            icon: <IoMdAlarm />
        },
        {
            title: isSelectedEnglish ? "Affordable" : "سستی",
            icon: <BsCashCoin />
        },
        {
            title: isSelectedEnglish ? "Environment Friendly" : "ماحول دوست",
            icon: <RiGitBranchFill />
        },
        {
            title: isSelectedEnglish ? "Largest Network in the U.S" : "امریکہ میں سب سے بڑا نیٹ ورک",
            icon: <FaLeaf />
        },
    ]

    const clients = [
        {
            numbers: 1210471,
            icon: <IoPersonSharp />,
            text: isSelectedEnglish ? "Passengers Served" : "مسافر ہو چکے ہیں"
        },
        {
            numbers: 114,
            icon: <RiVipFill />,
            text: isSelectedEnglish ? "Stations Around the Pakistan" : "پاکستان کے اسٹیشن"
        },
        {
            numbers: 331,
            icon: <BsBuildingsFill />,
            text: isSelectedEnglish ? "VIP Served" : "پیش کیے ہیں VIP"
        },
    ]

    return (
        <div className={`w-full p-8 py-8 flex flex-col bg-[${isDarkmode ? "#0f172a" : "#fff"}]`}>
            <>
                <h1 className={`w-full capitalize text-center px-4 text-[48px] text-[${isDarkmode ? "#fff" : "#0f172a"}] font-bold`}>
                    {isSelectedEnglish ? "A better way to travel" : "سفر کرنے کا ایک بہتر طریقہ"}
                </h1>
                <p className={`w-full text-center px-12 mt-8 text-sm text-[${isDarkmode ? "#fff" : "#0f172a"}] ${!isSelectedEnglish ? "leading-[48px]" : ""}`}>
                    {
                        isSelectedEnglish ?
                            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nesciunt mollitia labore possimus omnis architecto illum voluptates molestias corporis aut totam, repudiandae eveniet dolore numquam? Numquam iusto accusamus eum quas!"
                            : "بھائی، میں ایک ٹیکسٹ لکھ رہا ہوں جو کہ اس طرح دیکھتا ہے۔ یہ ٹیکسٹ کسی خاص معنی یا مضمون کو ظاہر نہیں کرتا، بلکہ صرف لفظوں کا انتخاب ہے جو زبان کے متن کو نمونہ طور پر پیش کرنے کے لیے استعمال ہوتا ہے۔"
                    }
                </p>
                <div className="w-full flex justify-center items-center gap-4 mt-8">
                    <img src={busImage} alt="bus"
                        className="h-[600px] w-[600px] object-cover rounded-md object-center"
                    />
                    <div className="flex flex-col justify-start items-start gap-4 p-4">
                        <h1 className={`w-full capitalize text-left text-[32px] text-[${isDarkmode ? "#fff" : "#1E293B"}] font-bold`}>{isSelectedEnglish ? "Features" : "خصوصیات"}</h1>
                        {
                            features?.map((feature: any, i: number) => (
                                <div className="w-full p-4 flex flex-col bg-[#1E293B] rounded-md"
                                    key={i}
                                >
                                    <p className={`w-full flex justify-start items-center gap-4 text-[#fff] font-bold ${isSelectedEnglish ? "flex-row" : "flex-row-reverse"}`}>
                                        {feature?.icon} {feature?.title?.toUpperCase()}
                                    </p>
                                    <p className={`w-full text-[#fff] ${isSelectedEnglish ? "text-left" : "text-right"} text-sm ${!isSelectedEnglish ? "leading-[48px] mt-4" : ""}`}>
                                        {
                                            isSelectedEnglish ? "Lorem ipsum dolor sit amet consectetur, adipisicing elit."
                                                : " یہ ٹیکسٹ کسی خاص معنی یا مضمون کو ظاہر نہیں کرتا، بلکہ صرف لفظوں کا انتخاب ہے"
                                        }
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </>
            <>
                <div className="w-full mt-[80px] flex flex-col justify-center items-center gap-4">
                    <h1 className={`w-full text-center px-4 text-[40px] text-[${isDarkmode ? "#fff" : "#1E293B"}] ${!isSelectedEnglish ? "mb-4" : ""} font-bold uppercase`}>
                        {isSelectedEnglish ? "number say it all" : "نمبر یہ سب کہتے ہیں"}
                    </h1>
                    <div className="w-full flex justify-center items-center gap-4">
                        {
                            clients?.map((client: any, i: number) => (
                                <div className="w-fit flex flex-col justify-center items-center bg-[#1E293B] gap-2 p-4 rounded-md border-2 border-[#fff]"
                                    key={i}
                                >
                                    {client?.icon}
                                    <p className="w-full text-center px-4 text-[#fff] text-[28px] font-bold">{client?.numbers?.toLocaleString()}</p>
                                    <p className="w-full text-center px-4 text-[#fff] text-sm">{client?.text?.toUpperCase()}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </>
        </div>
    )
}

export default Section2