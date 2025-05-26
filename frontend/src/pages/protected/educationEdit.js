import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import EducationEdit from '../../features/Education/Edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Materi | Edit Materi"}))
      }, [])


    return(
        <EducationEdit />
    )
}

export default InternalPage