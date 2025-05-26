import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import UrbanVillagesForm from '../../features/socialization/urbanVillages/Create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Kelurahan Tangguh | Tambah Data"}))
      }, [])


    return(
        <UrbanVillagesForm />
    )
}

export default InternalPage