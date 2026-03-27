type IconName = "flow" | "love" | "wealth" | "time" | "shield" | "spark" | "dragon" | "leaf" | "wand" | "coins" | "fire" | "sun" | "moon" | "heart" | "07";

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
      {name === "spark" || name === "07" ? (
        <path d="M24 14L26 22L34 24L26 26L24 34L22 26L14 24L22 22L24 14Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      ) : null}
      {name === "dragon" ? (
        <path d="M34 16C34 16 30 14 24 14C18 14 14 16 14 16M14 32C14 32 18 34 24 34C30 34 34 32 34 32M24 14V34M18 20L30 28M30 20L18 28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      ) : null}
      {name === "leaf" ? (
        <path d="M24 34C24 34 34 28 34 18C34 14 31 14 29 14C27 14 25 15 24 17C23 15 21 14 19 14C17 14 14 14 14 18C14 28 24 34 24 34Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      ) : null}
      {name === "wand" ? (
        <path d="M16 32L32 16M30 14L34 18M14 30L18 34" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      ) : null}
      {name === "coins" ? (
        <>
          <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="28" cy="28" r="6" stroke="currentColor" strokeWidth="1.2" />
        </>
      ) : null}
      {name === "fire" ? (
        <path d="M24 34C24 34 32 30 32 22C32 16 28 14 24 14C20 14 16 16 16 22C16 30 24 34 24 34Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      ) : null}
      {name === "sun" ? (
        <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.2" />
      ) : null}
      {name === "moon" ? (
        <path d="M24 16C28.4 16 32 19.6 32 24C32 28.4 28.4 32 24 32C19.6 32 16 28.4 16 24C16 21 17.5 18.5 20 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      ) : null}
      {name === "heart" ? (
        <path d="M24 31.5C24 31.5 13 25.5 13 19C13 16.5 15 14.5 17.5 14.5C19 14.5 20.5 15.5 24 19.5C27.5 15.5 29 14.5 30.5 14.5C33 14.5 35 16.5 35 19C35 25.5 24 31.5 24 31.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      ) : null}
    </svg>
  );
}
