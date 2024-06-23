import "../tailwind.css"
import logo from "../assets/images/logo.png"

const SplashScreen = () => {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <img src={logo} alt="logo" className="w-[10em] h-[10em] object-contain" />
        </div>
    )
}

export default SplashScreen