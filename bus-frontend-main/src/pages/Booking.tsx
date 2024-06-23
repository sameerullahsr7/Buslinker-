import { useLocation } from "react-router-dom"
import Header from "../components/booking/Header"
import { useState } from "react"
import Step1 from "../components/booking/Step1"
import Step2 from "../components/booking/Step2"
import Step3 from "../components/booking/Step3"
import Step4 from "../components/booking/Step4"

const Booking = () => {

    const location = useLocation()

    const { passengers, from, to, date } = location?.state

    const [step, setStep] = useState<number>(2)
    const [_data, set_data] = useState<any>({ passengers, from, to, date })

    return (
        <>
            <Header
                passengers={passengers}
                from={from}
                to={to}
                date={date}
                step={step}
                setStep={setStep}
            />
            {
                step == 2 && <Step1 step={step} setStep={setStep}
                    data={{ passengers, from, to, date }}
                    _data={_data} set_data={set_data}
                />
            }
            {
                step == 3 && <Step2 step={step} setStep={setStep}
                    data={{ passengers, from, to, date }}
                    _data={_data} set_data={set_data}
                />
            }
            {
                step == 4 && <Step3 step={step} setStep={setStep}
                    data={{ passengers, from, to, date }}
                    _data={_data} set_data={set_data}
                />
            }
            {
                step == 5 && <Step4 step={step} setStep={setStep}
                    data={{ passengers, from, to, date }}
                    _data={_data} set_data={set_data}
                />
            }
        </>
    )
}

export default Booking