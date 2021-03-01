import type { NextPage } from 'next'
import { parseCookies, setCookie } from 'nookies'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { getUniqueStr } from 'src/libs/common'

type CardNum = 0 | 1 | 2 | 3 | 5 | 8 | 13 | 21 | 44
type CardType = {
  userID: string
  cardNum: CardNum
}

const Home: NextPage = () => {
  const uri = 'http://localhost:3001'
  const [socket] = useState(() => {
    return io(uri)
  })
  const [isConnected, setIsConnected] = useState(false)
  const cardsNum: CardNum[] = [0, 1, 2, 3, 5, 8, 13, 21, 44]
  const [users, setUsers] = useState<CardType[]>([])
  const [userID, setUserID] = useState<string | null>(null)

  const getUserIDFromCookies = () => {
    const cookies = parseCookies()
    const _userID = cookies.userID as string | undefined
    return _userID || null
  }

  const setUserIDToCookies = (value: string) => {
    setCookie(null, 'userID', value, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })
  }

  useEffect(() => {
    if (typeof userID === 'string') return

    const _userID = getUserIDFromCookies()
    if (typeof _userID === 'string') {
      setUserID(_userID)
      return
    }

    const newUserID = getUniqueStr()
    setUserID(newUserID)
    setUserIDToCookies(newUserID)
  }, [userID])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected!!')
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      console.log('socket disconnected!!')
      setIsConnected(false)
    })
    socket.on('room', (data: CardType) => {
      setUsers((prevState) => {
        return [
          ...prevState.filter((state) => {
            return state.userID !== data.userID
          }),
          data,
        ]
      })
    })

    return () => {
      socket.close()
    }
  }, [socket])

  const cardClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    const cardNumStr = event.currentTarget.dataset.num
    if (!cardNumStr) return
    const cardNum = parseInt(cardNumStr) as CardNum
    const data: CardType = { userID, cardNum }
    socket.emit('room', data)
  }

  return (
    <div className="px-20 pt-4">
      <header>
        <h1 className="py-4 text-lg font-semibold">プランニングポーカー部屋</h1>
      </header>
      <div className="py-4">{isConnected ? 'コネクト中' : 'ディスコネクト中'}</div>
      <div className="py-4">
        {users.map((user, index) => {
          return (
            <div key={index}>
              <dd>{user.userID}</dd>
              <dt>{user.cardNum}</dt>
            </div>
          )
        })}
      </div>
      <div>
        {cardsNum.map((num, index) => {
          return <Card key={index} num={num} disabled={!isConnected} onClick={cardClick} />
        })}
      </div>
    </div>
  )
}

export default Home

type CardProps = {
  num: CardNum
  disabled: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
const Card: React.VFC<CardProps> = (props) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      data-num={props.num}
      className="px-4 py-2 mx-2 font-semibold text-white bg-blue-400 rounded shadow focus:opacity-80 focus:shadow-none disabled:bg-gray-300 disabled:shadow-none disabled:cursor-default"
    >
      {props.num}
    </button>
  )
}
