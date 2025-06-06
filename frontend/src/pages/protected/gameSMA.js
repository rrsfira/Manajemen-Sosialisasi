import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import GameSMA from '../../features/Game/gameSMA'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Game SMA"}))
      }, [])


    return(
        <GameSMA />
    )
}

export default InternalPage