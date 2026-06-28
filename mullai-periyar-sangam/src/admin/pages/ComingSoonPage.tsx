export function ComingSoonPage({ ta, en }: { ta: string; en: string }) {
  return (
    <div className="rounded-[18px] border border-dashed border-[#D5E0D8] bg-white px-8 py-16 text-center shadow-[0_10px_30px_rgba(5,70,50,0.05)]">
      <p className="font-tamil-serif text-xl font-bold text-green-dark">{ta}</p>
      <p className="font-accent mt-2 text-[15px] italic text-[#7C8A81]">{en} — coming in Phase 2</p>
    </div>
  )
}
