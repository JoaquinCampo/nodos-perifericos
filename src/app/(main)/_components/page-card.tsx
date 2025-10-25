import Link from "next/link";

interface PageCardProps {
  page: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
  };
}

export function PageCard({ page }: PageCardProps) {
  const Icon = page.icon;
  return (
    <Link
      href={page.path}
      className="group bg-card text-card-foreground block rounded-xl border p-8 shadow-md transition-all hover:scale-[1.02] hover:border-blue-300 hover:shadow-xl dark:hover:border-blue-700"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-110">
          <Icon className="size-8" />
        </div>
        <h3 className="text-xl font-bold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {page.title}
        </h3>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {page.description}
        </p>
      </div>
    </Link>
  );
}
