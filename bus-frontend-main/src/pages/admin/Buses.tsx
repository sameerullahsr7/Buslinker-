import ReservationsComp from "../../components/admin/ReservationsComp"
import Dashboard from "../../mui/components/Dashboard"

const Buses = () => {
  return (
    <>
      <Dashboard 
        component={<ReservationsComp/>}
      />
    </>
  )
}

export default Buses