
import success from "../assets/images/success.png"
import { RxCross2 } from "react-icons/rx";

const SuccessModal = ({ data, setScreen }: any) => {

    return (
        <div className="w-[500px] relative flex flex-col justify-center items-center gap-8 rounded-[8px] p-8 bg-[#fff]">
            <RxCross2 className="w-[1.5em] h-[1.5em] absolute top-[1em] right-[1em] z-5 cursor-pointer"
                onClick={() => setScreen(null)} />
            <img src={success} alt="success" className="w-[70px] h-[70px] object-contain" />
            <h1 className="w-full text-center font-bold text-[24px]">Success</h1>
            <p className="w-full text-center">{data?.succesMessage}</p>
        </div>
    )
}

export default SuccessModal