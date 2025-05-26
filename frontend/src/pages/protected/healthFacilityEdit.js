import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import HealthFacilitiesEdit from '../../features/socialization/healthFacilities/Edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Fasilitas Kesehatan | Edit Data"}))
      }, [])


    return(
        <HealthFacilitiesEdit />
    )
}

export default InternalPage