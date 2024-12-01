import Link from "next/link";
import { getCardsInSet } from "../../api/cards/route";

export default async function SetPage({ params }: { params: { set: string } }) {
    const { set } = await params;
    const cards = await getCardsInSet(decodeURIComponent(set));

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <Link href="/">Back</Link>
                {cards.map((card) => (
                    <Link
                        key={card.card}
                        href={`/set/${set}/card/${card.id}`}
                        className="button-class"
                    >
                        {card.name}
                    </Link>
                ))}
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </div>
    );
}
