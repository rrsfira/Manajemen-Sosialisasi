import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import PublicHousing from '../../features/socialization/publicHousings'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Rusun"}))
      }, [])


    return(
        <PublicHousing />
    )
}

export default InternalPage