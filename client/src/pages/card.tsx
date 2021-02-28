import type { NextPage } from 'next'

type CardNums = 0 | 1 | 2 | 3 | 5 | 8 | 13 | 21 | 44

const Home: NextPage = () => {
  const cardsNum: CardNums[] = [0, 1, 2, 3, 5, 8, 13, 21, 44]

  const cardClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    const cardNumStr = event.currentTarget.dataset.num
    if (!cardNumStr) return
    const cardNum = parseInt(cardNumStr) as CardNums
    console.log(cardNum)
  }

  return (
    <>
      <header>
        <h1 className="p-4 text-lg font-semibold">プランニングポーカー部屋</h1>
      </header>
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
