import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Hotel from '../../features/socialization/hotels'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Hotel"}))
      }, [])


    return(
        <Hotel />
    )
}

export default InternalPage