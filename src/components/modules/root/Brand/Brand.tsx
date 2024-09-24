import React from "react"
import BrandTop from "./components/BrandTop"
import BrandBottom from "./components/BrandBottom"

function Brand() {
  return (
    <section className="h-[auto] w-full scroll-mt-28 md:scroll-m-32" id="brand">
      <BrandTop />
      <BrandBottom />
    </section>
  )
}

export default Brand
