import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import HotelDetail from '../../features/socialization/hotels/Details'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Hotel | Detail"}))
      }, [])


    return(
        <HotelDetail />
    )
}

export default InternalPage