import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import UrbanVillage from '../../features/socialization/urbanVillages'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Kelurahan Tangguh"}))
      }, [])


    return(
        <UrbanVillage />
    )
}

export default InternalPage