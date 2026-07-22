interface LogoProps {
  className?: string;
  size?: number;
}

export function LogoIcon({ className = "", size = 48 }: LogoProps) {
  return (
    <img
      src="/logo.svg"
      alt="Global Mobilis"
      width={size}
      height={size}
      className={className}
    />
  );
}