import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AuditAdminSuper from '../../features/AuditAdmin'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Audit Admin"}))
      }, [])


    return(
        <AuditAdminSuper />
    )
}

export default InternalPage