export default function StudioCardSkeleton() {
  return (
    <div className="card bg-base-100 border border-base-300 h-full overflow-hidden">
      <div className="aspect-[4/3] skeleton m-0 rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-24 rounded-md" />
        <div className="skeleton h-6 w-4/5" />
        <div className="skeleton h-4 w-3/5" />
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-5 w-20" />
          <div className="skeleton h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
