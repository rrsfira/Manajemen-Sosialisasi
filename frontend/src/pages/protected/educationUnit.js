import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import EducationUnits from '../../features/socialization/educationUnits'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Satuan Pendidikan"}))
      }, [])


    return(
        <EducationUnits />
    )
}

export default InternalPage