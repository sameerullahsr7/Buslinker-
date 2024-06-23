import CompanyComp from "../../components/admin/CompanyComp"
import Dashboard from "../../mui/components/Dashboard"

const Companies = () => {
    return (
        <>
            <Dashboard
                component={<CompanyComp />}
            />
        </>
    )
}

export default Companies