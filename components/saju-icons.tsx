type IconName = "flow" | "love" | "wealth" | "time" | "shield" | "spark";

type SajuIconProps = {
  name: IconName;
  className?: string;
};

export function SajuIcon({ name, className }: SajuIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
      {name === "flow" ? (
        <>
          <path d="M14 24C18 24 18 20 22 20C26 20 26 28 30 28C34 28 34 24 38 24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M14 28C18 28 18 24 22 24C26 24 26 32 30 32C34 32 34 28 38 28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
        </>
      ) : null}
      {name === "love" ? (
        <path d="M24 31.5C24 31.5 13 25.5 13 19C13 16.5 15 14.5 17.5 14.5C19 14.5 20.5 15.5 24 19.5C27.5 15.5 29 14.5 30.5 14.5C33 14.5 35 16.5 35 19C35 25.5 24 31.5 24 31.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      ) : null}
      {name === "wealth" ? (
        <>
          <rect x="16" y="16" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M24 16V32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M16 24H32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </>
      ) : null}
      {name === "time" ? (
        <>
          <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.2" />
          <path d="M24 20V24L27 27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : null}
      {name === "shield" ? (
        <path d="M24 14L32 17V23C32 28.5 28.5 32.5 24 34C19.5 32.5 16 28.5 16 23V17L24 14Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      ) : null}
      {name === "spark" ? (
        <path d="M24 14L26 22L34 24L26 26L24 34L22 26L14 24L22 22L24 14Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      ) : null}
    </svg>
  );
}

