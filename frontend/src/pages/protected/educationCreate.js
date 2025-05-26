import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import EducationCreate from '../../features/Education/Create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Materi | Tambah Materi"}))
      }, [])


    return(
        <EducationCreate />
    )
}

export default InternalPage