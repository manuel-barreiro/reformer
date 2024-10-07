import NavBar from "./NavBar/NavBar"
import TopText from "./NavBar/TopText"

const top_text = "OUR SPACE IS A HOUSE, A TEMPLE FOR YOUR BODY AND MIND."

function Header() {
  return (
    <header className="sticky top-0 z-50 flex w-full flex-col">
      <TopText text={top_text} />
      <NavBar />
    </header>
  )
}

export default Header
