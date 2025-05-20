import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Apartements from '../../features/socialization/apartements'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Apartement"}))
      }, [])


    return(
        <Apartements />
    )
}

export default InternalPage