export default function StudioCardSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="aspect-[4/3] skeleton rounded-2xl" />
      <div className="pt-4 space-y-3">
        <div className="skeleton h-4 w-20 rounded-full" />
        <div className="skeleton h-5 w-4/5 rounded-md" />
        <div className="skeleton h-3.5 w-3/5 rounded-md" />
        <div className="flex items-center justify-between border-t border-base-content/10 mt-4 pt-4">
          <div className="skeleton h-5 w-24 rounded-md" />
          <div className="skeleton h-4 w-14 rounded-md" />
        </div>
      </div>
    </div>
  );
}
