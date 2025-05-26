import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import EducationUnitForm from '../../features/socialization/educationUnits/Create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Satuan Pendidikan | Tambah Data"}))
      }, [])


    return(
        <EducationUnitForm />
    )
}

export default InternalPage