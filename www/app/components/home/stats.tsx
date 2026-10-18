import { getGeoStats, type GeoStats } from "@/lib/geo-stats";
import { LocalizedNumber, T } from "../locale_provider";

const ORDER: (keyof GeoStats)[] = ["continents", "countries", "states", "cities", "languages", "timezones"];

export default async function HomeStats() {
  const stats = await getGeoStats();

  return (
    <section className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 md:grid-cols-3 lg:grid-cols-6 dark:border-neutral-800 dark:bg-neutral-800">
      {ORDER.map((key) => (
        <div key={key} className="flex flex-col gap-1 bg-white p-5 dark:bg-neutral-900">
          <span className="text-2xl font-bold tabular-nums text-teal-600 md:text-3xl dark:text-teal-400">
            <LocalizedNumber value={stats[key]} />
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400"><T k={`home.stats.${key}`} /></span>
        </div>
      ))}
    </section>
  );
}
