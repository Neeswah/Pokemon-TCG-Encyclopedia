import { addCard, deleteCard } from "../api/cards/route";

export default async function AdminPage() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <p>Admin page</p>
                <form>
                    <input type="text" name="id" placeholder="id" required />
                    <input type="text" name="name" placeholder="name" required />
                    <input type="text" name="set" placeholder="set" required />
                    <input type="text" name="set_num" placeholder="set_num" required />
                    <input type="text" name="series" placeholder="series" required />
                    <input type="text" name="publisher" placeholder="publisher" required />
                    <input type="text" name="generation" placeholder="generation" required />
                    <input type="text" name="release_date" placeholder="release_date" required />
                    <input type="text" name="artist" placeholder="artist" required />
                    <input type="text" name="types" placeholder="types" required />
                    <input type="text" name="supertype" placeholder="supertype" required />
                    <input type="text" name="sybtypes" placeholder="sybtypes" required />
                    <input type="text" name="hp" placeholder="hp" required />
                    <input type="text" name="evolves_to" placeholder="evolves_to" required />
                    <input type="text" name="attacks" placeholder="attacks" required />
                    <input type="text" name="weaknesses" placeholder="weaknesses" required />
                    <input type="text" name="retreatCost" placeholder="retreatCost" required />
                    <input type="text" name="rarity" placeholder="rarity" required />
                    <input type="text" name="flavorText" placeholder="flavorText" required />
                    <input type="text" name="nationalpokedexNumbers" placeholder="nationalpokedexNumbers" required />
                    <input type="text" name="legalities" placeholder="legalities" required />
                    <input type="text" name="regulationMark" placeholder="regulationMark" required />
                    <input
                        type="submit"
                        value="Ajouter la carte"
                        onSubmit={(event) => {
                            event.preventDefault();
                            const form = event.target as HTMLFormElement;
                            const formData = new FormData(form);
                            const card = Object.fromEntries(formData);
                            addCard(card);
                        }}
                    />
                </form>
                <form>
                    <input type="text" name="id" placeholder="id" required />
                    <input
                        type="submit"
                        value="Supprimer la carte"
                        onSubmit={(event) => {
                            event.preventDefault();
                            const form = event.target as HTMLFormElement;
                            const formData = new FormData(form);
                            const id = formData.get("id") as string;
                            deleteCard(id);
                        }}
                    />
                </form>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </div>
    );
}
