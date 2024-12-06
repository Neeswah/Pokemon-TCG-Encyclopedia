import Link from "next/link";

import { getSets, getSetImage } from "./api/cards/route";

export default async function Home() {
    const sets = await getSets();

    const images: any[] = [];

    await Promise.allSettled(
        sets.map(async (set) => {
            let image = await getSetImage(set.id);
            images[set.id] = image;
        })
    );

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header className="row-start-1 flex gap-6 flex-wrap items-center justify-center">
                <h1>Pokemon TCG Encyclopedia</h1>
            </header>
            <main className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                {sets.map((set) => (
                    <Link key={set.id} href={`/set/${set.set}`} className="button-class space-y-5">
                        <img src={images[set.id]} alt={set.set} className="rounded-md shadow-md" loading="lazy" />
                        <p className="text-center">{set.set}</p>
                    </Link>
                ))}
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </div>
    );
}
