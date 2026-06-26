/**
 * Layered CSS aurora used behind the hero. Pure CSS so it renders instantly
 * and acts as the graceful fallback beneath the WebGL scene.
 */
export function AuroraBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
      {/* Aurora blobs */}
      <div className="absolute -left-[10%] top-[6%] h-[42vmax] w-[42vmax] animate-aurora rounded-full bg-[radial-gradient(circle,rgba(109,92,255,0.45),transparent_60%)] blur-[90px]" />
      <div className="absolute right-[-8%] top-[18%] h-[36vmax] w-[36vmax] animate-aurora rounded-full bg-[radial-gradient(circle,rgba(77,226,226,0.32),transparent_60%)] blur-[100px] [animation-delay:-6s]" />
      <div className="absolute bottom-[-12%] left-[24%] h-[40vmax] w-[40vmax] animate-aurora rounded-full bg-[radial-gradient(circle,rgba(255,95,162,0.32),transparent_60%)] blur-[100px] [animation-delay:-12s]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 75%)",
        }}
      />

      {/* Vignette for legibility */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,7,13,0.7)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
