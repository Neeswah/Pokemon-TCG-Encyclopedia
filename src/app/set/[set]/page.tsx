import Link from "next/link";

import SearchBar from "./../../searchBar/page";

export default async function SetPage({ params }: { params: { set: string } }) {
    // Construct base URL
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const { set } = await params;

    // Fetch cards in the set
    const cardsResponse = await fetch(`${baseURL}/api/cards?action=getCardsInSet&setName=${decodeURIComponent(set)}`);
    const cards = await cardsResponse.json();

    // Fetch images for all cards
    const images = new Map();

    await Promise.allSettled(
        cards.map(async (card: { id: string; set_num: string }) => {
            const imageResponse = await fetch(
                `${baseURL}/api/cards?action=getCardImage&idCard=${card.id}&cardSetNum=${card.set_num}&large=false`
            );
            const imageUrl = await imageResponse.json();
            images.set(card.id, imageUrl);
        })
    );

    return (
        <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <SearchBar />
            <Link className="fixed top-6 left-6" href="/">
                &lt; Back
            </Link>
            <main className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 m-4">
                {cards.map((card: { id: string; name: string; set_num: string; set: string }) => (
                    <Link key={card.id} href={`/set/${set}/card/${card.id}`} className="button-class">
                        <img src={images.get(card.id)} alt={card.name} className="rounded-md shadow-md" loading="lazy" />
                        <p>{`${card.set_num}. ${card.name}`}</p>
                    </Link>
                ))}
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </div>
    );
}
