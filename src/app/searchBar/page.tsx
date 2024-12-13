"use client";

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const search = new FormData(event.currentTarget).get("search")?.toString() || "";
        window.location.href = `/search/${search}`;
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                <form onSubmit={handleSearch} className="flex flex-col gap-4">
                    <input type="text" name="search" defaultValue={defaultValue} placeholder="Search" required />
                    <button type="submit">Search</button>
                </form>
            </main>
        </div>
    );
}
