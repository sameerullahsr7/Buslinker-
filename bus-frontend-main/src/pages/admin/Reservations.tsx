import ReservationsComp from "../../components/admin/ReservationsComp"
import Dashboard from "../../mui/components/Dashboard"

const Reservations = () => {
    return (
        <>
            <Dashboard
                component={<ReservationsComp />}
            />
        </>
    )
}

export default Reservations