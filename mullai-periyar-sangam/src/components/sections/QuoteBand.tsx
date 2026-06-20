export function QuoteBand() {
  return (
    <section className="relative mt-[90px] overflow-hidden bg-[radial-gradient(120%_140%_at_80%_0%,#067A52_0%,#064E3B_55%,#063D2B_100%)] text-off-white">
      <svg
        viewBox="0 0 100 100"
        width="460"
        height="460"
        className="absolute -bottom-40 -left-30 opacity-[0.06]"
        aria-hidden
      >
        <path
          d="M50 22 C63 40 71 50 71 61 a21 21 0 1 1 -42 0 C29 50 37 40 50 22 Z"
          fill="#FBFCFA"
        />
      </svg>
      <div className="relative mx-auto max-w-[1000px] px-8 py-[90px] text-center">
        <div className="font-accent text-[90px] leading-[0.5] text-gold opacity-65">“</div>
        <p className="font-tamil-serif text-[clamp(24px,3.2vw,40px)] leading-[1.45] font-medium tracking-[-0.2px]">
          நீர் என்பது எங்கள் தயவில் கிடைப்பதன்று — அது எங்கள் பிறப்புரிமை.
        </p>
        <p className="mt-6 font-accent text-[clamp(16px,1.8vw,21px)] text-[#A9C2B2] italic">
          “Water is not a favour granted to us — it is our birthright.”
        </p>
        <div className="mt-7 flex items-center justify-center gap-3.5">
          <span className="h-px w-7 bg-gold" />
          <span className="text-[13px] tracking-[2.5px] text-gold uppercase">சங்கத்தின் கொள்கை</span>
          <span className="h-px w-7 bg-gold" />
        </div>
      </div>
    </section>
  )
}
