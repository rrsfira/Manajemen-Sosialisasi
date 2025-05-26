import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import EducationDetail from '../../features/Education/details'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Materi | Detail Materi"}))
      }, [])


    return(
        <EducationDetail />
    )
}

export default InternalPage