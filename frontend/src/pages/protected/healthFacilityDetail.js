import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import HealthFacilitiesDetail from '../../features/socialization/healthFacilities/Details'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Fasilitas Kesehatan | Detail" }))
      }, [])


    return(
        <HealthFacilitiesDetail />
    )
}

export default InternalPage