"use client"
import Link from "next/link"

function ScrollLink({ id, children }: { id: any; children: any }) {
  const handleClick = (e: any) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Link href={`#${id}`} passHref>
      <div onClick={handleClick}>{children}</div>
    </Link>
  )
}

export default ScrollLink
