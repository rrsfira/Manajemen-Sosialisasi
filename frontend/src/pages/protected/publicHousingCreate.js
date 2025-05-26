import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import PublicHousingForm from '../../features/socialization/publicHousings/Create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Rusun | Tambah Data"}))
      }, [])


    return(
        <PublicHousingForm />
    )
}

export default InternalPage