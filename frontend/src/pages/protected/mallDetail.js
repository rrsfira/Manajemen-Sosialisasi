import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import MallDetail from '../../features/socialization/malls/Details'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sosialisasi | Mall | Detail"}))
      }, [])


    return(
        <MallDetail />
    )
}

export default InternalPage