export default function RootLoading() {
  // Root-level route loading state — branded skeleton, never a blank screen
  return (
    <div className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="skeleton h-48 md:h-72 w-full rounded-2xl mb-10" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="card bg-base-100 border border-base-300 overflow-hidden">
            <div className="aspect-[4/3] skeleton rounded-none" />
            <div className="p-5 space-y-3">
              <div className="skeleton h-5 w-24 rounded-md" />
              <div className="skeleton h-6 w-4/5" />
              <div className="skeleton h-4 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
