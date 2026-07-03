export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-primary-800 text-white">
      <div className="container py-8">
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-3xl text-sm text-primary-100 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
