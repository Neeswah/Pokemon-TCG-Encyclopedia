import Link from "next/link";
import SearchBar from "./searchBar/page";

export default async function Home() {
    // Construct base URL
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const setsResponse = await fetch(`${baseURL}/api/cards?action=getSets`);
    const sets = await setsResponse.json();

    const images: { [key: string]: string } = {};

    await Promise.allSettled(
        sets.map(async (set: { id: string }) => {
            let imageResponse = await fetch(`${baseURL}/api/cards?action=getSetImage&setId=${set.id}`);
            let image = await imageResponse.json();
            images[set.id] = image;
        })
    );

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <SearchBar />
            <main className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                {sets.map((set: { id: string; set: string }) => (
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
