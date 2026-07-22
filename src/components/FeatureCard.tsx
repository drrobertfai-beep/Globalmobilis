interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  accentColor?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  accentColor = "#0E4F8B",
}: FeatureCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
        style={{ backgroundColor: `${accentColor}10` }}
      >
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}