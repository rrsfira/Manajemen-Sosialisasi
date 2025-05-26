import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import GameMasyarakat from '../../features/Game/gameMasyarakat'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Game Masyarakat"}))
      }, [])


    return(
        <GameMasyarakat />
    )
}

export default InternalPage