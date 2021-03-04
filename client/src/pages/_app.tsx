import '../styles/globals.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'

export default function MyApp(props: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <props.Component {...props.pageProps} />
    </>
  )
}
