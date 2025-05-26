import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import MallEdit from '../../features/socialization/malls/Edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Mall | Edit"}))
      }, [])


    return(
        <MallEdit />
    )
}

export default InternalPage