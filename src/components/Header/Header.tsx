import NavBar from "./NavBar/NavBar"
import TopText from "./TopText"

const top_text = "OUR SPACE IS A HOUSE, A TEMPLE FOR YOUR BODY AND MIND."

function Header() {
  return (
    <header className="flex w-full flex-col">
      <TopText text={top_text} />
      <NavBar />
    </header>
  )
}

export default Header
