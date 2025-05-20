import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AdminCreate from '../../features/DataAdminSuperAdmin/Create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Tabel Admin | Tambah Admin"}))
      }, [])


    return(
        <AdminCreate />
    )
}

export default InternalPage