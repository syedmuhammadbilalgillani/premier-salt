// ─── Shared primitives ────────────────────────────────────────────────────────
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div
        style={{ width: 80, height: 1, background: "rgba(12,35,64,0.15)" }}
      />
    </div>
  );
}
