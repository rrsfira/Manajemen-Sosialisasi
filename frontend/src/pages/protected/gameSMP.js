import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import GameSMP from '../../features/Game/gameSMP'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Game SMP"}))
      }, [])


    return(
        <GameSMP />
    )
}

export default InternalPage