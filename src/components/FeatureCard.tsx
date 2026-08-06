import { Link } from "@tanstack/react-router";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  accentColor?: string;
  /** When set, the whole card becomes a link to this app route. */
  href?: string;
}
export function FeatureCard({
  icon,
  title,
  description,
  accentColor = "#0E4F8B",
  href,
}: FeatureCardProps) {
  const cardClasses =
    "group block h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl";
  const inner = (
    <>
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
        style={{ backgroundColor: `${accentColor}10` }}
      >
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{description}</p>
      {href && (
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-primary-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Try it now →
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <Link to={href} className={cardClasses}>
        {inner}
      </Link>
    );
  }
  return <div className={cardClasses}>{inner}</div>;
}
