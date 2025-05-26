import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import OfficeForm from '../../features/socialization/offices/Create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Perkantoran | Tambah Data" }))
      }, [])


    return(
        <OfficeForm />
    )
}

export default InternalPage