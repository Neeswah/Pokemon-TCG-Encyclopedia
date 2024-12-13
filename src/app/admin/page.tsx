"use client";

export default function AdminPage() {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const handleAddCard = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const releaseDateString = formData.get("release_date") as string;
        const release_date = new Date(releaseDateString);

        const card = Object.fromEntries(formData.entries());
        if (release_date) {
            card.release_date = release_date.toISOString();
        } else {
            card.release_date = "";
        }

        const response = await fetch(`${baseURL}/api/cards`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "addCard",
                card,
            }),
        });

        if (response.ok) {
            alert("Card added successfully!");
            //event.currentTarget.reset();
        } else {
            alert("Failed to add card.");
        }
    };

    const handleDeleteCard = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Ask for confirmation
        if (!window.confirm("Are you sure you want to delete the card?")) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const id = formData.get("id");

        const response = await fetch(`${baseURL}/api/cards?id=${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Card deleted successfully!");
            //event.currentTarget.reset();
        } else {
            alert("Failed to delete card.");
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <p>Admin page</p>
                <form onSubmit={handleAddCard} className="flex flex-col gap-4">
                    <input type="text" name="id" placeholder="id *" required />
                    <input type="text" name="name" placeholder="name *" required />
                    <input type="text" name="set" placeholder="set *" required />
                    <input type="text" name="set_num" placeholder="set_num *" required />
                    <input type="text" name="series" placeholder="series *" required />
                    <input type="text" name="types" placeholder="types *" required />
                    <input type="text" name="supertype" placeholder="supertype *" required />
                    <input type="text" name="subtypes" placeholder="subtypes *" required />
                    <input type="text" name="hp" placeholder="hp *" required />
                    <input type="text" name="release_date" placeholder="release_date (YYYY-MM-DD) *" required />
                    <input type="text" name="rarity" placeholder="rarity" />
                    <input type="text" name="flavorText" placeholder="flavorText" />
                    <input type="text" name="evolves_to" placeholder="evolves_to" />
                    <input type="text" name="attacks" placeholder="attacks" />
                    <input type="text" name="weaknesses" placeholder="weaknesses" />
                    <input type="text" name="retreatCost" placeholder="retreatCost" />
                    <input type="text" name="publisher" placeholder="publisher" />
                    <input type="text" name="generation" placeholder="generation" />
                    <input type="text" name="artist" placeholder="artist" />
                    <input type="submit" value="Ajouter la carte" />
                </form>

                <form onSubmit={handleDeleteCard} className="flex flex-col gap-4">
                    <input type="text" name="id" placeholder="id *" required />
                    <input type="submit" value="Supprimer la carte" />
                </form>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </div>
    );
}
