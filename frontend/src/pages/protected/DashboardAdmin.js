import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import DashboardAdmin from '../../features/dashboardAdmin/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Beranda Admin"}))
      }, [])


    return(
        <DashboardAdmin />
    )
}

export default InternalPage