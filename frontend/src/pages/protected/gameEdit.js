import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import GameEdit from '../../features/Game/Edit'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Game | Edit Kuis"}))
      }, [])


    return(
        <GameEdit />
    )
}

export default InternalPage