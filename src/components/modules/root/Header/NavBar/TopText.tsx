export default function TopText({ text }: { text: string }) {
  return (
    <div className="max-w-full overflow-hidden bg-grey_pebble px-0 py-1 text-center font-dm_mono text-[9px] font-thin text-white sm:text-sm">
      <p className="marquee animate-marquee-slow sm:animate-marquee-normal lg:animate-marquee-fast">
        {text}
      </p>
    </div>
  )
}
