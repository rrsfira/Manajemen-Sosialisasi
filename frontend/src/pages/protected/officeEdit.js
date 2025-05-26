import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import OfficeEdit from '../../features/socialization/offices/Edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Perkantoran | Edit Data"}))
      }, [])


    return(
        <OfficeEdit />
    )
}

export default InternalPage