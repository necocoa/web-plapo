type PublicEnv = {
  apiURL: string
}

export const publicEnv: PublicEnv = {
  apiURL: process.env.NEXT_PUBLIC_API_URL as string,
}
