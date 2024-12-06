import Link from "next/link";
import { getCardsInSet, getCardImage } from "../../api/cards/route";

export default async function SetPage({ params }: { params: { set: string } }) {
    const { set } = await params;
    const cards = await getCardsInSet(decodeURIComponent(set));
    const images: any[] = [];

    await Promise.allSettled(
        cards.map(async (card) => {
            let image = await getCardImage(card.id, card.set_num, false);
            images[card.id] = image;
        })
    );

    return (
        <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Link className="fixed top-6 left-6" href="/">
                &lt; Back
            </Link>
            <main className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 m-4">
                {cards.map((card) => (
                    <Link key={card.card} href={`/set/${set}/card/${card.id}`} className="button-class">
                        <img src={images[card.id]} alt={card.name} className="rounded-md shadow-md" />
                        <p>{card.set_num + ". " + card.name}</p>
                    </Link>
                ))}
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </div>
    );
}
