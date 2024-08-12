// Create a component markup for filtering petitions.

export default function PetitionFilter() {
    return (
        <div className="flex gap-4">
            <select className="border border-gray-300 rounded-md px-2 py-1">
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
            </select>
            <select className="border border-gray-300 rounded-md px-2 py-1">
                <option value="trending">Trending</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
            </select>
        </div>
    );
}
