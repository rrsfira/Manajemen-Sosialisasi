import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import OfficeDetail from '../../features/socialization/offices/Details'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Perkantoran | Detail"}))
      }, [])


    return(
        <OfficeDetail />
    )
}

export default InternalPage