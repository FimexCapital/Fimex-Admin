export default function FimexLogo({ height = 44, showBg = true }: { height?: number; showBg?: boolean }) {
  return (
    <div
      className={showBg ? "bg-white rounded px-2 inline-flex items-center" : "inline-flex items-center"}
      style={{ height }}
    >
      <svg viewBox="0 0 178 56" height={height - 8} xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="35" fontFamily="Arial Black, Impact, sans-serif" fontWeight="900" fontSize="40" fill="#242F5D" letterSpacing="-1.5">FIM</text>
        <text x="89" y="35" fontFamily="Arial Black, Impact, sans-serif" fontWeight="900" fontSize="40" fill="#242F5D" letterSpacing="-1.5">E</text>
        <g transform="translate(112, 2)">
          <polygon points="12,0 24,33 20,33 12,12 4,33 0,33" fill="#C8142F" />
          <polygon points="0,5 4,5 12,25 20,5 24,5 12,33" fill="#C8142F" />
        </g>
        <text x="42" y="52" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="16" fill="#C8142F" letterSpacing="5">CAPITAL</text>
      </svg>
    </div>
  );
}
