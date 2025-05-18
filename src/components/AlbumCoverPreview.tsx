import { Album } from "lucide-react";

interface AlbumCoverPreviewProps {
  imageUrl: string | null;
}

const AlbumCoverPreview: React.FC<AlbumCoverPreviewProps> = ({ imageUrl }) => {
  return (
    <div className="flex justify-center mb-4">
      {imageUrl ? (
        <div className="w-32 h-32 rounded-md overflow-hidden">
          <img
            src={imageUrl}
            alt="Album cover"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-32 h-32 bg-zinc-700 rounded-md flex items-center justify-center">
          <Album size={48} className="text-zinc-500" />
        </div>
      )}
    </div>
  );
};

export default AlbumCoverPreview;
