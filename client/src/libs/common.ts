export const getUniqueStr = (myStrong?: number): string => {
  const strong = myStrong || 1000
  return new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16)
}
