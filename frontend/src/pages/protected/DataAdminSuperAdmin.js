import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import DataAdminSuperAdmin from '../../features/DataAdminSuperAdmin'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Tabel Admin"}))
      }, [])


    return(
        <DataAdminSuperAdmin />
    )
}

export default InternalPage