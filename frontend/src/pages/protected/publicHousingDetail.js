import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import PublicHousingDetail from '../../features/socialization/publicHousings/Details'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Rusun | Detail"}))
      }, [])


    return(
        <PublicHousingDetail />
    )
}

export default InternalPage