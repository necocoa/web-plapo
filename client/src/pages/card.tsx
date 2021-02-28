import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

type CardType = {
  userId: string
  cardNum: CardNums | null
}
type CardNums = 0 | 1 | 2 | 3 | 5 | 8 | 13 | 21 | 44
const Home: NextPage = () => {
  const uri = 'http://localhost:3000'
  const [socket] = useState(() => {
    return io(uri)
  })
  const [isConnected, setIsConnected] = useState(false)
  const cardsNum: CardNums[] = [0, 1, 2, 3, 5, 8, 13, 21, 44]
  const userId = 'test'

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected!!')
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      console.log('socket disconnected!!')
      setIsConnected(false)
    })
    socket.on('room', (data: any) => {
      console.log(data)
    })

    return () => {
      socket.close()
    }
  }, [socket])

  const cardClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    const cardNumStr = event.currentTarget.dataset.num
    if (!cardNumStr) return
    const cardNum = parseInt(cardNumStr) as CardNums
    const data: CardType = { userId, cardNum }
    socket.emit('room', data)
  }

  return (
    <>
      <header>
        <h1 className="p-4 text-lg font-semibold">プランニングポーカー部屋</h1>
      </header>
      <div className="p-4">{isConnected ? 'コネクト中' : 'ディスコネクト中'}</div>
      <div>
        {cardsNum.map((num, index) => {
          return <Card key={index} num={num} onClick={cardClick} />
        })}
      </div>
    </>
  )
}

export default Home

type CardProps = { num: CardNums; onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }
const Card: React.VFC<CardProps> = (props) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      data-num={props.num}
      className="px-4 py-2 mx-2 font-semibold text-white bg-blue-400 rounded shadow"
    >
      {props.num}
    </button>
  )
}
