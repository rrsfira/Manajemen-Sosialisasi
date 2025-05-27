import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ApartmentDetail from '../../features/socialization/apartements/details'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Apartment | Detail"}))
      }, [])


    return(
        <ApartmentDetail />
    )
}

export default InternalPage