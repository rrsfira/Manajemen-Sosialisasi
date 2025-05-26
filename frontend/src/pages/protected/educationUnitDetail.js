import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import EducationUnitDetail from '../../features/socialization/educationUnits/Details'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Satuan Pendidikan | Detail"}))
      }, [])


    return(
        <EducationUnitDetail />
    )
}

export default InternalPage