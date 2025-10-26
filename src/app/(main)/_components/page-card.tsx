import Link from "next/link";

interface PageCardProps {
  page: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
  };
  configuration: {
    cardBackgroundColor: string;
    cardTextColor: string;
    iconBackgroundColor: string;
    iconTextColor: string;
  };
}

export function PageCard({ page, configuration }: PageCardProps) {
  const Icon = page.icon;
  return (
    <Link
      href={page.path}
      className="group block rounded-xl p-8 shadow-md transition-all hover:scale-[1.02] hover:shadow-xl"
      style={{
        backgroundColor: configuration.cardBackgroundColor,
        borderWidth: "1px",
        borderStyle: "solid",
        color: configuration.cardTextColor,
      }}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="mb-4 flex size-16 items-center justify-center rounded-2xl shadow-lg transition-transform group-hover:scale-110"
          style={{
            background: `linear-gradient(to bottom right, ${configuration.iconBackgroundColor}, ${configuration.iconBackgroundColor}dd)`,
            boxShadow: `0 10px 15px -3px ${configuration.iconBackgroundColor}30`,
            color: configuration.iconTextColor,
          }}
        >
          <Icon className="size-8" />
        </div>
        <h3
          className="text-xl font-bold transition-opacity group-hover:opacity-80"
          style={{ color: configuration.cardTextColor }}
        >
          {page.title}
        </h3>
        <p
          className="mt-3 text-sm leading-relaxed opacity-70"
          style={{ color: configuration.cardTextColor }}
        >
          {page.description}
        </p>
      </div>
    </Link>
  );
}
