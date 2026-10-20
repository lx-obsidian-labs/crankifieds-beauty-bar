/**
 * Decorative ambient light for dark sections: slow-drifting champagne glows
 * rendered behind the content. Purely presentational.
 */
export function Ambient({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="aurora absolute -left-[15%] top-[10%] h-[38rem] w-[38rem] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(194,160,106,0.30) 0%, rgba(194,160,106,0) 68%)",
        }}
      />
      <div
        className="aurora absolute -right-[10%] bottom-[0%] h-[32rem] w-[32rem] rounded-full blur-[140px]"
        style={{
          animationDelay: "-4s",
          background:
            "radial-gradient(circle, rgba(216,182,171,0.22) 0%, rgba(216,182,171,0) 70%)",
        }}
      />
    </div>
  );
}
