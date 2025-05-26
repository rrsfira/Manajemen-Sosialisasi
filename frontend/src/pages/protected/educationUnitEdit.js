import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import EducationUnitEdit from '../../features/socialization/educationUnits/Edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Satuan Pendidikan | Edit Data"}))
      }, [])


    return(
        <EducationUnitEdit />
    )
}

export default InternalPage