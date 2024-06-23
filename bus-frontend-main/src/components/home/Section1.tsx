import Form from "./Form"
import busImage from "../../assets/images/bus-image.png"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const Section1 = () => {

    const navigate = useNavigate()
    const currentUser = useSelector((state: any) => state?.user)
    const { isDarkTheme } = currentUser
    const isSelectedEnglish = !currentUser?.isSelectedUrdu

    return (
        <div className={`w-full bg-[${isDarkTheme ? "#0A101D" : "#fff"}] p-8 flex flex-col gap-8`}>
            <Form />
            <div className="w-full flex flex-col gap-4 mt-16">
                <div className="flex justify-between items-center gap-4 p-2">
                    <div className="flex flex-col gap-2 flex-1">
                        <h2 className={`w-full font-bold text-[40px] uppercase text-[${isDarkTheme ? "#fff" : "#0A101D"}] ${!isSelectedEnglish && "text-right"} `}>{isSelectedEnglish ? "The Private" : " ایک پرائیویٹ"}</h2>
                        <div className={`w-full flex items-center ${isSelectedEnglish ? "justify-start" : "justify-center"} gap-2 mt-2`}>
                            <h1 className="text-[70px] font-bold uppercase text-[#29ABE2]">{isSelectedEnglish ? "Bus" : "کمپنی"}</h1>
                            <h1 className="text-[70px] font-bold uppercase text-[#4DD836]">{isSelectedEnglish ? "Company" : "بس"}</h1>
                        </div>
                        <div className={`w-full ${!isSelectedEnglish && "mt-4"} h-[8px] bg-[${isDarkTheme ? "#fff" : "#0A101D"}]`}></div>
                        <p className={`${isSelectedEnglish ? "text-left" : "text-right"} ${!isSelectedEnglish ? "leading-[48px]" : ""} mt-4 text-[16px] text-[${isDarkTheme ? "#fff" : "0A101D"}]`}>
                            {
                                isSelectedEnglish ?
                                    "En ipsom gestionamos de forma integral ayudas de sostenibilidad, eficiencia energética, inversiones industriales e innovación para empresas"
                                    : "بھائی، میں ایک ٹیکسٹ لکھ رہا ہوں جو کہ اس طرح دیکھتا ہے۔ یہ ٹیکسٹ کسی خاص معنی یا مضمون کو ظاہر نہیں کرتا، بلکہ صرف لفظوں کا انتخاب ہے جو زبان کے متن کو نمونہ طور پر پیش کرنے کے لیے استعمال ہوتا ہے۔"
                            }
                        </p>
                        {
                            currentUser?.isLogin == false && <>
                                <button className={`bg-transparent border-4 text-[20px] border-[#4DD836] p-3 px-5 font-bold mt-2 flex justify-center items-center text-center text-[${isDarkTheme ? "#fff" : "#0A101D"}] cursor-pointer rounded-0 w-fit`}
                                    onClick={() => navigate("/auth")}
                                >{isSelectedEnglish ? "Create Account" : "اکاؤنٹ بنائیں"}</button>
                            </>
                        }
                    </div>
                    <img src={busImage} alt="image"
                        className="flex-1 rounded-3xl object-cover h-full"
                    />
                </div>
                <div className="w-full flex items-center gap-8">
                    <div className="w-fit flex flex-col gap-2">
                        <h2 className={`text-[40px] w-full text-[${isDarkTheme ? "#fff" : "#0A101D"}] font-bold ${!isSelectedEnglish ? "mt-4 text-right" : ""}`}>{isSelectedEnglish ? "Book Easy" : "آسان بکنگ"}</h2>
                        <p className={`text-[16px] ${!isSelectedEnglish ? "leading-[40px] text-right" : ""} text-wrap text-[${isDarkTheme ? "#fff" : "#0A101D"}]`}>{isSelectedEnglish ? "Limited steps to book" : "آپ کا سفر بک کرنے کے محدود مراحل"}
                            <br />{isSelectedEnglish ? "your journey" : ""}</p>
                    </div>
                    <div className="w-fit flex flex-col gap-2">
                        <h2 className={`text-[40px] w-full text-[${isDarkTheme ? "#fff" : "#0A101D"}] ${!isSelectedEnglish ? "text-right" : ""} font-bold`}>{isSelectedEnglish ? "Discounts" : "رعایت"}</h2>
                        <p className={`text-[16px] text-wrap text-[${isDarkTheme ? "#fff" : "#0A101D"}] ${!isSelectedEnglish ? "text-right" : ""}`}>{isSelectedEnglish ? "Special Discounts available" : "خصوصی رعایتیں دستیاب ہیں۔"}</p>
                    </div>
                    <div className="w-fit flex flex-col gap-2">
                        <h2 className={`text-[40px] w-full text-[${isDarkTheme ? "#fff" : "#0A101D"}] ${!isSelectedEnglish ? "text-right" : ""} font-bold`}>20+</h2>
                        <p className={`text-[16px] text-wrap text-[${isDarkTheme ? "#fff" : "#0A101D"}] ${!isSelectedEnglish ? "text-right" : ""}`}>{isSelectedEnglish ? "Cities around the Pakistan" : "پاکستان کے شہر"}</p>
                    </div>
                </div>
                <div className="h-[100px]"></div>
            </div>
        </div>
    )
}

export default Section1