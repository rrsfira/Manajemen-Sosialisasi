import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import PublicHousingEdit from '../../features/socialization/publicHousings/Edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Rusun | Edit Data"}))
      }, [])


    return(
        <PublicHousingEdit />
    )
}

export default InternalPage