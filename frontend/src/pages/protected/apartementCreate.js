import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ApartementsForm from '../../features/socialization/apartements/Create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Apartment | Tambah Data"}))
      }, [])


    return(
        <ApartementsForm />
    )
}

export default InternalPage