import { publicEnv } from 'env'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const Home: NextPage = () => {
  const [socket, setSocket] = useState(() => {
    return io(publicEnv.apiURL)
  })
  const [isConnected, setIsConnected] = useState(false)
  const [inputKey, setInputKey] = useState('')
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected!!')
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      console.log('socket disconnected!!')
      setIsConnected(false)
    })

    socket.on('cache', (data: any) => {
      console.log(data)
    })

    return () => {
      socket.close()
    }
  }, [socket]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isConnected) return

    console.log('socket reconnect...')
    socket.close()
    setSocket(() => {
      return io(publicEnv.apiURL)
    })
  }, [isConnected]) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    socket.emit('cache', { [inputKey]: inputValue })
    setInputKey('')
    setInputValue('')
  }
  return (
    <div className="px-20 pt-4">
      <input
        type="text"
        value={inputKey}
        onChange={(e) => {
          return setInputKey(e.target.value)
        }}
        size={20}
        className="px-6 py-2 border"
      />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          return setInputValue(e.target.value)
        }}
        size={20}
        className="px-6 py-2 border"
      />
      <button type="button" onClick={submit} className="px-4 py-2 bg-blue-300 border rounded">
        クリック
      </button>
    </div>
  )
}

export default Home
