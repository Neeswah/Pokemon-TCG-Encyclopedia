import Link from "next/link";
import { getCardDetails, getCardImage } from "../../../../api/cards/route";

export default async function CardPage({ params }: { params: { card: string } }) {
    const { card } = await params;

    const cardDetails = await getCardDetails(decodeURIComponent(card));
    let image: string = "";

    // Wait for the image to be fetched
    await new Promise(async (resolve) => {
        if (!cardDetails) {
            resolve("");
            return;
        }
        image = await getCardImage(card, cardDetails.set_num, false);
        resolve(image);
    });

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Link className="fixed top-6 left-6" href={(cardDetails && `/set/${cardDetails.set}`) || "/"}>
                &lt; Back
            </Link>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                {cardDetails ? (
                    <div>
                        <img src={image} alt={cardDetails.name} className="rounded-md shadow-md" />
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
