import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AdminEdit from '../../features/DataAdminSuperAdmin/Edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Tabel Admin | Edit Admin"}))
      }, [])


    return(
        <AdminEdit />
    )
}

export default InternalPage