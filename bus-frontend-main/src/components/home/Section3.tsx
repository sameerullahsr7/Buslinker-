import { useSelector } from "react-redux"
import AccordionMui from "./AccordionMui"
import "./main.css"

import UserCard from "./UserCard"

const Section3 = () => {

    const reviews: any = [
        {
            name: "Farhan M.",
            star: 5,
            time: new Date(),
            image: "https://avatars.githubusercontent.com/u/120649081?v=4",
            message: "En ipsom gestionamos de forma integral ayudas de sostenibilidad, eficiencia energética, inversiones industriales e innovación para empresas"
        },
        {
            name: "Farhan M.",
            star: 5,
            time: new Date(),
            image: "",
            message: "بھائی، میں ایک ٹیکسٹ لکھ رہا ہوں جو کہ اس طرح دیکھتا ہے۔ یہ ٹیکسٹ کسی خاص معنی یا مضمون کو ظاہر نہیں کرتا، بلکہ صرف لفظوں کا انتخاب ہے جو زبان کے متن کو نمونہ طور پر پیش کرنے کے لیے استعمال ہوتا ہے۔"
        },
        {
            name: "Farhan M.",
            star: 5,
            time: new Date(),
            image: "https://avatars.githubusercontent.com/u/120649081?v=4",
            message: "En ipsom gestionamos de forma integral ayudas de sostenibilidad, eficiencia energética, inversiones industriales e innovación para empresas"
        },
        {
            name: "Farhan M.",
            star: 5,
            time: new Date(),
            image: "",
            message: "En ipsom gestionamos de forma integral ayudas de sostenibilidad, eficiencia energética, inversiones industriales e innovación para empresas"
        },
        {
            name: "Farhan M.",
            star: 5,
            time: new Date(),
            image: "https://avatars.githubusercontent.com/u/120649081?v=4",
            message: "En ipsom gestionamos de forma integral ayudas de sostenibilidad, eficiencia energética, inversiones industriales e innovación para empresas"
        },
        {
            name: "Farhan M.",
            star: 5,
            time: new Date(),
            image: "https://avatars.githubusercontent.com/u/120649081?v=4",
            message: "بھائی، میں ایک ٹیکسٹ لکھ رہا ہوں جو کہ اس طرح دیکھتا ہے۔ یہ ٹیکسٹ کسی خاص معنی یا مضمون کو ظاہر نہیں کرتا، بلکہ صرف لفظوں کا انتخاب ہے جو زبان کے متن کو نمونہ طور پر پیش کرنے کے لیے استعمال ہوتا ہے۔"
        },
        {
            name: "Farhan M.",
            star: 5,
            time: new Date(),
            image: "",
            message: "En ipsom gestionamos de forma integral ayudas de sostenibilidad, eficiencia energética, inversiones industriales e innovación para empresas"
        },
        {
            name: "Farhan M.",
            star: 5,
            time: new Date(),
            image: "https://avatars.githubusercontent.com/u/120649081?v=4",
            message: "بھائی، میں ایک ٹیکسٹ لکھ رہا ہوں جو کہ اس طرح دیکھتا ہے۔ یہ ٹیکسٹ کسی خاص معنی یا مضمون کو ظاہر نہیں کرتا، بلکہ صرف لفظوں کا انتخاب ہے جو زبان کے متن کو نمونہ طور پر پیش کرنے کے لیے استعمال ہوتا ہے۔"
        },
        {
            name: "Farhan M.",
            star: 5,
            time: new Date(),
            image: "",
            message: "En ipsom gestionamos de forma integral ayudas de sostenibilidad, eficiencia energética, inversiones industriales e innovación para empresas"
        },
        {
            name: "Farhan M.",
            star: 5,
            time: new Date(),
            image: "",
            message: "بھائی، میں ایک ٹیکسٹ لکھ رہا ہوں جو کہ اس طرح دیکھتا ہے۔ یہ ٹیکسٹ کسی خاص معنی یا مضمون کو ظاہر نہیں کرتا، بلکہ صرف لفظوں کا انتخاب ہے جو زبان کے متن کو نمونہ طور پر پیش کرنے کے لیے استعمال ہوتا ہے۔"
        },
        {
            name: "Farhan M.",
            star: 5,
            time: new Date(),
            image: "https://avatars.githubusercontent.com/u/120649081?v=4",
            message: "En ipsom gestionamos de forma integral ayudas de sostenibilidad, eficiencia energética, inversiones industriales e innovación para empresas"
        },
    ]

    const isDarkMode = useSelector((state: any) => state?.user?.isDarkTheme)
    const isSelectedEnglish = !(useSelector((state: any) => state?.user?.isSelectedUrdu))

    return (
        <div className={`w-full p-8 flex flex-col bg-[${isDarkMode ? "#0f172a" : "#fff"}]`}>
            <h1 className={`uppercase text-[40px] w-full text-center text-[${isDarkMode ? "#fff" : "#0f172a"}] font-bold`}>{isSelectedEnglish ? "WHAT OUR CLIENT SAYS" : "ہمارا کلائنٹ کیا کہتا ہے۔"}</h1>
            <div className="scroll-container w-full flex flex-row-reverse items-center mt-16">
                {
                    (reviews && reviews?.length) ? reviews?.map((review: any) => (
                        <UserCard
                            name={review?.name}
                            star={review?.star}
                            time={review?.time}
                            message={review?.message}
                            image={review?.image}
                        />
                    )) : null
                }
            </div>
            <h1 className={`uppercase mt-24 text-[40px] w-full text-center text-[${isDarkMode ? "#fff" : "#0f172a"}] font-bold`}>
                {isSelectedEnglish ? "FREQUENTLY ASKED QUESTION" : "اکثر پوچھے گئے سوالات"}
            </h1>
            <div className="w-full flex flex-col gap-4 mt-16">
                <AccordionMui
                    title={isSelectedEnglish ? "How do I book tickets?" : "میں ٹکٹ کیسے بک کروں ؟"}
                    description={
                        isSelectedEnglish ? "En ipsom gestionamos de forma integral ayudas de sostenibilidad, eficiencia energética, inversiones industriales e innovación para empresas"
                            : "بھائی، میں ایک ٹیکسٹ لکھ رہا ہوں جو کہ اس طرح دیکھتا ہے۔ یہ ٹیکسٹ کسی خاص معنی یا مضمون کو ظاہر نہیں کرتا، بلکہ صرف لفظوں کا انتخاب ہے جو زبان کے متن کو نمونہ طور پر پیش کرنے کے لیے استعمال ہوتا ہے۔"
                    }
                />
                <AccordionMui
                    title={isSelectedEnglish ? "How do I book tickets?" : "میں ٹکٹ کیسے بک کروں ؟"}
                    description={
                        isSelectedEnglish ? "En ipsom gestionamos de forma integral ayudas de sostenibilidad, eficiencia energética, inversiones industriales e innovación para empresas"
                            : "بھائی، میں ایک ٹیکسٹ لکھ رہا ہوں جو کہ اس طرح دیکھتا ہے۔ یہ ٹیکسٹ کسی خاص معنی یا مضمون کو ظاہر نہیں کرتا، بلکہ صرف لفظوں کا انتخاب ہے جو زبان کے متن کو نمونہ طور پر پیش کرنے کے لیے استعمال ہوتا ہے۔"
                    }
                />
                <AccordionMui
                    title={isSelectedEnglish ? "How do I book tickets?" : "میں ٹکٹ کیسے بک کروں ؟"}
                    description={
                        isSelectedEnglish ? "En ipsom gestionamos de forma integral ayudas de sostenibilidad, eficiencia energética, inversiones industriales e innovación para empresas"
                            : "بھائی، میں ایک ٹیکسٹ لکھ رہا ہوں جو کہ اس طرح دیکھتا ہے۔ یہ ٹیکسٹ کسی خاص معنی یا مضمون کو ظاہر نہیں کرتا، بلکہ صرف لفظوں کا انتخاب ہے جو زبان کے متن کو نمونہ طور پر پیش کرنے کے لیے استعمال ہوتا ہے۔"
                    }
                />
                <AccordionMui
                    title={isSelectedEnglish ? "How do I book tickets?" : "میں ٹکٹ کیسے بک کروں ؟"}
                    description={
                        isSelectedEnglish ? "En ipsom gestionamos de forma integral ayudas de sostenibilidad, eficiencia energética, inversiones industriales e innovación para empresas"
                            : "بھائی، میں ایک ٹیکسٹ لکھ رہا ہوں جو کہ اس طرح دیکھتا ہے۔ یہ ٹیکسٹ کسی خاص معنی یا مضمون کو ظاہر نہیں کرتا، بلکہ صرف لفظوں کا انتخاب ہے جو زبان کے متن کو نمونہ طور پر پیش کرنے کے لیے استعمال ہوتا ہے۔"
                    }
                />
            </div>
            <div className="p-[2em]"></div>
        </div>
    )
}

export default Section3