import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import GameSD from '../../features/Game/gameSD'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Game SD"}))
      }, [])


    return(
        <GameSD />
    )
}

export default InternalPage