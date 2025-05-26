import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ApartmentEdit from '../../features/socialization/apartements/Edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Apartment | Edit"}))
      }, [])


    return(
        <ApartmentEdit />
    )
}

export default InternalPage