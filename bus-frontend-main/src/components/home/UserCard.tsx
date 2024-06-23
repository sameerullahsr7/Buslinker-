import "./main.css"

import white from "../../assets/images/white-bg.jpg"
import { FaStar } from "react-icons/fa6";
import moment from "moment";

const UserCard = ({ name, star, time, message, image }: any) => {

    return (
        <>
            <div className="bg-[#1E293B] mx-4 min-w-[552px] max-w-[552px] h-[285px] p-4 flex flex-col rounded-3xl border-2 broder-[#fff]">
                <>
                    <p className="text-[32px] text-[#4DD836] font-bold w-full h-[10px] text-right">{`"`}</p>
                    <div className="w-full flex items-center gap-2">
                        <img src={image ? image : white} alt="image"
                            className="bg-[#fff] w-[82px] h-[82px] object-cover object-center rounded-full"
                        />
                        <div className="flex flex-col">
                            <h3 className="w-fit flex gap-2 items-center text-left text-sm capitalize text-[#fff]">{name}
                                <span className="starsCont flex items-center">
                                    {Array.from({ length: star }, (_, index) => (
                                        <FaStar key={index} />  // Rendering star icons
                                    ))}
                                </span>
                            </h3>
                            <h5 className="w-full text-left text-[14px] text-[#7B7B7B]">
                                {moment.utc(time).fromNow()}
                            </h5>
                        </div>
                    </div>
                </>
                <>
                    <p className="w-full text-left text-[#fff] text-[16px] mt-4 line-clamp-4 leading-[32px]">{message}</p>
                </>
            </div>
        </>
    )
}

export default UserCard