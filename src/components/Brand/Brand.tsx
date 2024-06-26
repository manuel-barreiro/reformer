import React from "react"
import BrandTop from "./BrandTop"
import BrandBottom from "./BrandBottom"

function Brand() {
  return (
    <section className="h-[auto] w-full scroll-mt-28 md:scroll-m-32" id="brand">
      <BrandTop />
      <BrandBottom />
    </section>
  )
}

export default Brand
