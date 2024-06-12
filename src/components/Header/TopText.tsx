export default function TopText({ text }: { text: string }) {
  return (
    <div className="bg-grey_pebble px-2 py-1 text-center font-dm_mono text-[9px] font-thin text-white sm:text-sm">
      <p className="animate-pulse animate-normal animate-duration-[5000ms] animate-fill-both animate-infinite animate-ease-in-out">
        {text}
      </p>
    </div>
  )
}
