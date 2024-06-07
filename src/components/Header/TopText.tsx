export default function TopText({ text }: { text: string }) {
  return (
    <div className="bg-grey_pebble px-2 py-1 text-center font-dm_mono text-[9px] font-thin text-white sm:text-sm">
      <p>{text}</p>
    </div>
  )
}
