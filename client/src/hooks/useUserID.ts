import { parseCookies, setCookie } from 'nookies'
import { getUniqueStr } from 'src/libs/common'

export const useUserID = (): string => {
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

  const userID = getUserIDFromCookies()
  if (typeof userID === 'string') return userID

  const newUserID = getUniqueStr()
  setUserIDToCookies(newUserID)
  return newUserID
}
