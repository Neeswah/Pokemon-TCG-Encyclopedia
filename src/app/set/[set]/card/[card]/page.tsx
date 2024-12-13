import Link from "next/link";
import React from "react";

import SearchBar from "./../../../../searchBar/page";

export default async function CardPage({ params }: { params: { card: string } }) {
    const { card } = await params;
    // Construct base URL
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const cardDetailsResponse = await fetch(`${baseURL}/api/cards?action=getCardDetails&idCard=${decodeURIComponent(card)}`);
    const cardDetails = await cardDetailsResponse.json();
    let image: string = "";

    // Wait for the image to be fetched
    await new Promise(async (resolve) => {
        const imageResponse = await fetch(
            `${baseURL}/api/cards?action=getCardImage&idCard=${card}&cardSetNum=${cardDetails.set_num}&large=false`
        );
        image = await imageResponse.json();
        resolve(true);
    });
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header className="row-start-1 flex gap-2 flex-wrap items-center justify-center">
                <SearchBar />
            </header>
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
                        <hr />
                        {Object.keys(cardDetails).map((key) =>
                            key === "id" || key === "name" || key === "set" || key === "series" || key === "set_num" ? null : (
                                <p key={key}>
                                    {key} : {cardDetails[key]}
                                </p>
                            )
                        )}
                    </div>
                ) : (
                    <p>No details found</p>
                )}
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </div>
    );
}
