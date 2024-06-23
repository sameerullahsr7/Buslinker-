import { MdOutlineFacebook } from "react-icons/md";
import { IoLogoInstagram } from "react-icons/io5";
import { IoLogoTwitter } from "react-icons/io";
import { useSelector } from "react-redux";

const Footer = () => {

    const isSelectedEnglish = !(useSelector((state: any) => state?.user?.isSelectedUrdu))

    return (
        <div className="footer bg-[#1E293B] p-8 gap-8 flex flex-col items-center">
            <div className="w-full flex justify-around items-center">
                <div className="flex flex-col gap-2">
                    <p className="font-bold text-[#fff] uppercase text-sm">{isSelectedEnglish ? "General" : "جنرل"}</p>
                    <p className="text-[#fff] text-sm text-left">{isSelectedEnglish ? "About" : "بارے میں"}</p>
                    <p className="text-[#fff] text-sm text-left">{isSelectedEnglish ? "Blog" : "بلاگ"}</p>
                    <p className="text-[#fff] text-sm text-left">{isSelectedEnglish ? "Help" : "مدد"}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-bold text-[#fff] uppercase text-sm">{isSelectedEnglish ? "Legal" : "قانونی"}</p>
                    <p className="text-[#fff] text-sm text-left">{isSelectedEnglish ? "Privacy" : "رازداری"}</p>
                    <p className="text-[#fff] text-sm text-left">{isSelectedEnglish ? "Terms" : "شرائط"}</p>
                    <p className="text-[#fff] text-sm text-left">{isSelectedEnglish ? "Cookies" : "کوکیز"}</p>
                </div>
            </div>
            <div className="flex flex-col items-center gap-4">
                <p className="font-bold text-[#fff] text-sm uppercase">{isSelectedEnglish ? "Social Media" : "سوشل میڈیا"}</p>
                <div className="flex justify-center items-center gap-4">
                    <a href="#"><MdOutlineFacebook
                        style={{
                            width: "1.5em",
                            height: "1.5em",
                        }}
                    /></a>
                    <a href="#"><IoLogoInstagram
                        style={{
                            width: "1.5em",
                            height: "1.5em",
                        }}
                    /></a>
                    <a href="#"><IoLogoTwitter
                        style={{
                            width: "1.5em",
                            height: "1.5em",
                        }}
                    /></a>
                </div>
            </div>
            <p className="w-full text-center text-sm text-[#fff]">
                &copy; {new Date().getFullYear()} {isSelectedEnglish ? "Bus Booking Website Tutorial. All rights reserved" : "بس بکنگ ویب سائٹ ٹیوٹوریل۔ جملہ حقوق محفوظ ہیں"}
            </p>
        </div>
    )
}

export default Footer