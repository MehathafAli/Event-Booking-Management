export default function PageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="orb-3d orb-3d-a" />
      <div className="orb-3d orb-3d-b" />
      <div className="orb-3d orb-3d-c" />
      <div className="grid-floor-3d" />
    </div>
  )
}
