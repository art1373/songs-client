import { Skeleton } from "@/components/ui/skeleton";

const SongSkeleton: React.FC = () => {
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-md">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

export default SongSkeleton;
