export default function RootLoading() {
  // Root-level route loading state — branded skeleton, never a blank screen
  return (
    <div className="section-pad px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="skeleton h-48 md:h-72 w-full rounded-2xl mb-10" />
      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-x-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex h-full flex-col">
            <div className="aspect-[4/3] skeleton rounded-2xl" />
            <div className="pt-4 space-y-3">
              <div className="skeleton h-4 w-20 rounded-full" />
              <div className="skeleton h-5 w-4/5 rounded-md" />
              <div className="skeleton h-3.5 w-3/5 rounded-md" />
              <div className="mt-4 flex items-center justify-between border-t border-base-content/10 pt-4">
                <div className="skeleton h-5 w-24 rounded-md" />
                <div className="skeleton h-4 w-14 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
