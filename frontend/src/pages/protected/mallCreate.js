import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import MallForm from '../../features/socialization/malls/Create'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Mall | Tambah Data"}))
      }, [])


    return(
        <MallForm />
    )
}

export default InternalPage