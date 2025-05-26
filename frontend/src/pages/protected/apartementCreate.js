import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ApartmentsForm from '../../features/socialization/apartements/Create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Apartment | Tambah Data"}))
      }, [])


    return(
        <ApartmentsForm />
    )
}

export default InternalPage