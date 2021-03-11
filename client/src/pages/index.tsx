import { publicEnv } from 'env'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useUserID } from 'src/hooks/useUserID'

type CardNum = 0 | 1 | 2 | 3 | 5 | 8 | 13 | 21 | 44
type userType = {
  userID: string
  name: string
  cardNum: CardNum | null
}

const Home: NextPage = () => {
  const [socket, setSocket] = useState(() => io(publicEnv.apiURL))
  const cardsNum: CardNum[] = [0, 1, 2, 3, 5, 8, 13, 21, 44]
  const userID = useUserID()
  const [name, setName] = useState<string>('')
  const [members, setMembers] = useState<userType[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    socket.on('connect', () => {
      console.info('socket connected!!')
      socket.emit('roomJoin', { userID, cardNum: null })
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      console.info('socket disconnected!!')
      socket.emit('roomLeave', { userID })
      setIsConnected(false)
    })
    socket.on('roomMembers', (data: userType[]) => setMembers(data))

    socket.on('roomMemberUpdate', (data: userType) => {
      setMembers((prev) => [...prev.filter((value) => value.userID !== data.userID), data])
    })

    socket.on('cardPick', (data: userType) => {
      setMembers((prev) =>
        prev.map((member) => {
          if (member.userID !== data.userID) return member

          member.cardNum = data.cardNum
          return member
        })
      )
    })

    return () => {
      socket.close()
    }
  }, [socket]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isConnected) return

    console.info('socket reconnected!!')
    socket.close()
    setSocket(() => io(publicEnv.apiURL))
  }, [isConnected]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCardClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    const cardNumStr = event.currentTarget.dataset.num
    if (!cardNumStr) return
    const cardNum = parseInt(cardNumStr) as CardNum
    const data: userType = { userID, name, cardNum }
    socket.emit('cardPick', data)
  }

  const roomLeave = () => socket.emit('roomLeave', { userID })

  const roomMemberUpdate = () => socket.emit('roomMemberUpdate', { userID, name })

  return (
    <div className="px-20 pt-4">
      <header>
        <h1 className="py-4 text-lg font-semibold">プランニングポーカー部屋</h1>
      </header>
      <div className="py-4">{isConnected ? 'コネクト中' : 'ディスコネクト中'}</div>
      <div className="py-4">
        <label htmlFor="namedInput" className="mr-2">
          名前
        </label>
        <input
          id="namedInput"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-1 mr-2 border rounded-sm shadow"
        />
        <button
          type="button"
          onClick={roomMemberUpdate}
          className="px-3 py-2 text-white bg-blue-400 rounded shadow"
        >
          更新
        </button>
      </div>
      <div className="py-4">
        <button
          type="button"
          onClick={roomLeave}
          className="px-3 py-2 text-white bg-red-400 rounded shadow"
        >
          退室
        </button>
      </div>
      <div className="py-4">
        {members.map((member) => (
          <div key={`member-${member.userID}`}>
            <div className="flex">
              <div>ID: {member.userID}</div>
              <div>Name: {member.name}</div>
            </div>
            <div
              className={`flex justify-center items-center w-8 h-12 font-semibold text-white rounded shadow ${
                member.cardNum === null ? 'bg-gray-50 border' : 'bg-blue-400'
              }`}
            >
              {member.cardNum}
            </div>
          </div>
        ))}
      </div>
      <div>
        {cardsNum.map((num) => (
          <Card key={`card-${num}`} num={num} disabled={!isConnected} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  )
}

export default Home

type CardProps = {
  num: CardNum
  disabled: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
}
const Card: React.VFC<CardProps> = ({ num, disabled, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-num={num}
      className="px-4 py-2 mx-2 font-semibold text-white bg-blue-400 rounded shadow focus:opacity-80 focus:shadow-none disabled:bg-gray-300 disabled:shadow-none disabled:cursor-default"
    >
      {num}
    </button>
  )
}
