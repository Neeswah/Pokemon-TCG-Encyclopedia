"use client";

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const search = new FormData(event.currentTarget).get("search")?.toString() || "";
        window.location.href = `/search/${search}`;
    };

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
                <input type="text" name="search" defaultValue={defaultValue} placeholder="Search" required />
                <button type="submit">Search</button>
            </form>
        </div>
    );
}
