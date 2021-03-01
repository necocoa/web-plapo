import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useUserID } from 'src/hooks/useUserID'

type CardNum = 0 | 1 | 2 | 3 | 5 | 8 | 13 | 21 | 44
type CardType = {
  userID: string
  cardNum: CardNum
}

const URI = 'http://localhost:3001'
const socket = io(URI)

const Home: NextPage = () => {
  const cardsNum: CardNum[] = [0, 1, 2, 3, 5, 8, 13, 21, 44]
  const userID = useUserID()
  const [users, setUsers] = useState<CardType[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
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
  }, [])

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