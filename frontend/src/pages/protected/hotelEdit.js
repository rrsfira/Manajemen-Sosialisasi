import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import HotelEdit from '../../features/socialization/hotels/Edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Hotel | Edit Data"}))
      }, [])


    return(
        <HotelEdit />
    )
}

export default InternalPage