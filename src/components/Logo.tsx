type LogoProps = {
  /** light = para sa maliwanag na background; dark = para sa navy/dark na background */
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  className?: string;
  textClassName?: string;
  markClassName?: string;
};

const NAVY = '#16283F';
const ORANGE = '#E8912D';

export function Logo({
  variant = 'light',
  showTagline = false,
  className = '',
  textClassName = '',
  markClassName = 'w-9 h-11',
}: LogoProps) {
  const crossFill = variant === 'light' ? NAVY : '#FFFFFF';
  const textMain = variant === 'light' ? 'text-corporate-900' : 'text-white';
  const taglineColor = variant === 'light' ? 'text-corporate-500' : 'text-corporate-300';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 120 140"
        className={markClassName}
        role="img"
        aria-label="ReDirection Innovations Inc"
      >
        {/* Orange chevron / arrowhead */}
        <path d="M60 6 L92 62 L72 62 L60 40 L48 62 L28 62 Z" fill={ORANGE} />
        {/* Navy cross with arrow tip */}
        <path
          d="M60 46 L72 66 L72 74 L98 74 L98 92 L72 92 L72 134 L48 134 L48 92 L22 92 L22 74 L48 74 L48 66 Z"
          fill={crossFill}
        />
      </svg>
      <div className={`leading-tight ${textClassName}`}>
        <p className={`text-xl font-bold tracking-tight font-display ${textMain}`}>
          Re<span className="text-redirection-500">Direction</span>
        </p>
        <p className={`text-lg font-semibold tracking-tight font-display ${textMain}`}>
          Innovations Inc
        </p>
        {showTagline && (
          <p className={`text-[11px] font-medium mt-1 ${taglineColor}`}>
            Serving with Purpose, Directing Success.
          </p>
        )}
      </div>
    </div>
  );
}