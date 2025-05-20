import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import HealthFacilities from '../../features/socialization/healthFacilities'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Fasilitas Kesehatan"}))
      }, [])


    return(
        <HealthFacilities />
    )
}

export default InternalPage