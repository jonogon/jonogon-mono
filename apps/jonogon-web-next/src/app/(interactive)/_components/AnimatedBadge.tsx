export default function AnimatedBadge({count}: {count: number}) {
    return count ? (
        <div className="ab-container" id="badge">
            <a className="entypo-bell"></a>
            <div className="badge-num">{count > 99 ? '99+' : count}</div>
        </div>
    ) : null;
}
