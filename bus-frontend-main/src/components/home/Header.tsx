import "../../tailwind.css";
import "./main.css";
import { IoMdPerson } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoSunny, IoMoonSharp } from "react-icons/io5";
import { setDarkTheme, toggleLanguage } from "../../redux/user";
import { useEffect, useState } from "react";
import { CustomAutocomplete, CustomTextField } from "./Form";

const Header = ({ onAboutClick, onReviewsClick, onFAQsClick }: any) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state: any) => state.user);
    const isDarkTheme = currentUser?.isDarkTheme;
    const isSelectedEnglish = !(currentUser?.isSelectedUrdu);

    const [isSelectedUrdu, setIsSelectedUrdu] = useState<boolean>(currentUser?.isSelectedUrdu || false);
    const [lang, setLang] = useState<string>(isSelectedEnglish ? "en" : "اردو");

    useEffect(() => {
        // Update Redux store with selected language
        dispatch(toggleLanguage(isSelectedUrdu));

        // Update local state for rendering
        setLang(isSelectedUrdu ? "اردو" : "en");

    }, [isSelectedUrdu]); // Only run effect when isSelectedUrdu changes

    return (
        <div className="w-full h-fit py-8 px-12 flex justify-between items-center bg-[#070B15] sticky top-0 z-20">
            <div className="w-fit flex justify-start items-center gap-4">
                <p className="text-[#fff] uppercase cursor-pointer" onClick={onAboutClick}>{isSelectedEnglish ? "About" : "بارے میں"}</p>
                <p className="text-[#fff] uppercase cursor-pointer" onClick={onReviewsClick}>{isSelectedEnglish ? "Reviews" : "جائزے"}</p>
                <p className="text-[#fff] uppercase cursor-pointer" onClick={onFAQsClick}>{isSelectedEnglish ? "FAQs" : "اکثر سوالات"}</p>
            </div>
            <div className="w-fit text-[#fff] flex justify-start items-center gap-4">
                {/* Language Selector */}
                <CustomAutocomplete
                    value={lang}
                    disablePortal
                    id="combo-box-demo"
                    options={["en", "اردو"]}
                    fullWidth
                    onChange={(e: any) => {
                        setIsSelectedUrdu(e.target.textContent === "اردو");
                        setLang(e.target.textContent);
                    }}
                    renderInput={(params: any) => <CustomTextField {...params} />}
                />
                {/* Theme Toggle */}
                {isDarkTheme ?
                    <IoSunny
                        className="cursor-pointer"
                        onClick={() => dispatch(setDarkTheme(!isDarkTheme))}
                        style={{ width: "4em", height: "2em" }}
                    /> :
                    <IoMoonSharp
                        className="cursor-pointer"
                        onClick={() => dispatch(setDarkTheme(!isDarkTheme))}
                        style={{ width: "4em", height: "2em" }}
                    />
                }
                {/* Conditional Rendering based on User Authentication */}
                {currentUser?.isLogin ?
                    <p className="text-[#fff] uppercase cursor-pointer" onClick={() => navigate("/my-reservations")}>{isSelectedEnglish ? "My Reservations" : "میرے تحفظات"}</p>
                    :
                    <>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/auth")}>
                            <IoMdPerson className="cursor-pointer" />
                            <p className="text-[#fff] uppercase cursor-pointer w-[80px]">{isSelectedEnglish ? "Login" : "لاگ ان"}</p>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/auth")}>
                            <IoMdPerson className="cursor-pointer" />
                            <p className="text-[#fff] uppercase cursor-pointer">{isSelectedEnglish ? "Register" : "رجسٹر"}</p>
                        </div>
                    </>
                }
            </div>
        </div>
    );
};

export default Header;