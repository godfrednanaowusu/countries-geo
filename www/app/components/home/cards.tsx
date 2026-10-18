import Link from "next/link";
import { ArrowRight, Blocks, Earth, Globe, Plane, type LucideIcon } from "lucide-react";
import { getGeoStats } from "@/lib/geo-stats";
import { T } from "../locale_provider";

const cards: { key: "continents" | "countries" | "states" | "cities"; icon: LucideIcon }[] = [
  { key: "continents", icon: Earth },
  { key: "countries", icon: Globe },
  { key: "states", icon: Blocks },
  { key: "cities", icon: Plane },
];

export default async function HomeCards() {
  const stats = await getGeoStats();

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, icon: Icon }) => (
        <Link
          key={key}
          href={`/docs/${key}`}
          className="group flex flex-col gap-4 rounded-xl border border-gray-200 bg-white/60 p-6 backdrop-blur transition-colors hover:border-teal-500/60 hover:bg-teal-500/5 focus-visible:outline-2 focus-visible:outline-teal-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-teal-500/60"
        >
          <span className="flex size-11 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Icon size={24} />
          </span>
          <h2 className="text-xl font-bold"><T k={`home.${key}.title`} /></h2>
          <p className="flex-1 text-gray-600 dark:text-gray-400">
            <T k={`home.${key}.description`} values={{ count: stats[key] }} />
          </p>
          <span className="flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400">
            <T k="home.explore" />
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </span>
        </Link>
      ))}
    </section>
  );
}
