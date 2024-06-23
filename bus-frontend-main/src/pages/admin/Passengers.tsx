import PassengersComp from "../../components/admin/PassengersComp"
import Dashboard from "../../mui/components/Dashboard"

const Passengers = () => {
  return (
    <>
      <Dashboard
        component={<PassengersComp />}
      />
    </>
  )
}

export default Passengers