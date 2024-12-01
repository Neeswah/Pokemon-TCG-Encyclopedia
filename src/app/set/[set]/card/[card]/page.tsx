import Link from "next/link";
import { getCardDetails } from "../../../../api/cards/route";

export default async function CardPage({ params }: { params: { card: string } }) {
    const { card } = await params;

    const cardDetails = await getCardDetails(decodeURIComponent(card));

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                {cardDetails ? (
                    <div>
                        <Link href={`/set/${cardDetails.set}`}>Back</Link>
                        <h1>{cardDetails.name}</h1>
                        <p>{cardDetails.set}</p>
                        <p>Serie : {cardDetails.series}</p>
                        <p>No. {cardDetails.set_num}</p>
                    </div>
                ) : (
                    <p>No details found</p>
                )}
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </div>
    );
}
