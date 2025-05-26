import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import HotelForm from '../../features/socialization/hotels/Create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Hotel | Tambah Data"}))
      }, [])


    return(
        <HotelForm />
    )
}

export default InternalPage