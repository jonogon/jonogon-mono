export default function AnimatedBadge({
    count,
    isActive,
}: {
    count: number;
    isActive: boolean;
}) {
    return count ? (
        <div
            className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`}>
            {count > 99 ? '99+' : count}
        </div>
    ) : null;
}
