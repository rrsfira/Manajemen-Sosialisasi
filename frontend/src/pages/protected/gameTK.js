import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import GameTK from '../../features/Game/gameTK'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Game TK"}))
      }, [])


    return(
        <GameTK />
    )
}

export default InternalPage