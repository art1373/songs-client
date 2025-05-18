import { useState } from "react";
import { Song } from "../types/song";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import DefaultAlbumCover from "./defaultAlbumCover.png";

interface SongCardProps {
  song: Song;
  onDelete: (id: string) => void;
  onEdit: (song: Song) => void;
  isDeleting: boolean;
}

const SongCard: React.FC<SongCardProps> = ({
  song,
  onDelete,
  onEdit,
  isDeleting,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group bg-zinc-900 rounded-lg overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg hover:shadow-music-primary/20 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden cursor-pointer">
        <img
          src={
            !song.imageUrl
              ? DefaultAlbumCover
              : `https://song-api-uptb.onrender.com/${song.imageUrl}`
          }
          alt={`${song.name} by ${song.artist}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => onEdit(song)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => onDelete(song.id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white truncate">{song.name}</h3>
        <p className="text-zinc-400 text-sm truncate">{song.artist}</p>
      </div>
    </div>
  );
};

export default SongCard;
