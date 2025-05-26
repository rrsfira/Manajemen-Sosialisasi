import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import HealthFacilitiesForm from '../../features/socialization/healthFacilities/Create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Fasilitas Kesehatan | Tambah Data"}))
      }, [])


    return(
        <HealthFacilitiesForm />
    )
}

export default InternalPage