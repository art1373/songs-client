
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/sonner";
import { Song, SongFormData } from "../types/song";
import SongCard from "../components/SongCard";
import SongForm from "../components/SongForm";
import SongSkeleton from "../components/SongSkeleton";
import LanguageSwitcher from "../components/LanguageSwitcher";
import EditSongDialog from "../components/EditSongDialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSongs } from "@/hooks/useSongs";

const Home = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    songs,
    isLoading,
    addSong,
    isAddingSong,
    deleteSong,
    isDeletingSong,
    editSong,
  } = useSongs();

  const handleAddSong = async (songData: SongFormData) => {
    try {
      addSong(songData);
      return true; // Return success for mobile sheet closing
    } catch (error) {
      console.error("Error adding song:", error);
      throw error;
    }
  };

  const handleEditClick = (song: Song) => {
    setEditingSong(song);
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingSong(null);
  };

  // Mobile Add Song Button and Sheet
  const MobileAddButton = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-music-primary hover:bg-music-secondary p-0 z-10"
          aria-label={t("songForm.addSong")}
        >
          <Plus size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[80%] sm:h-[90%] bg-zinc-800 p-0"
      >
        <div className="p-6 overflow-auto h-full">
          <h2 className="text-xl font-bold text-white mb-4">
            {t("songForm.title")}
          </h2>
          <SongForm
            onAddSong={handleAddSong}
            isSubmitting={isAddingSong}
            isMobileSheet
          />
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-music-dark">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 text-center relative">
          <div className="absolute top-0 right-0">
            <LanguageSwitcher />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <span className="text-music-primary">Music</span>
            {t("app.title")}
          </h1>
          <p className="text-zinc-400">{t("app.subtitle")}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {!isMobile && (
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-8">
                <SongForm
                  onAddSong={handleAddSong}
                  isSubmitting={isAddingSong}
                />
              </div>
            </div>
          )}

          <div
            className={`${isMobile ? "col-span-1" : "lg:col-span-3"} order-1 ${
              isMobile ? "" : "lg:order-2"
            }`}
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              {t("app.header")}
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <SongSkeleton key={i} />
                ))}
              </div>
            ) : songs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {songs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    onDelete={deleteSong}
                    onEdit={handleEditClick}
                    isDeleting={isDeletingSong(song.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-zinc-800 p-10 rounded-lg text-center">
                <p className="text-zinc-400">{t("app.emptyLibrary")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobile && <MobileAddButton />}
      
      <EditSongDialog
        song={editingSong}
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        onEdit={editSong}
      />

      <Toaster position="top-center" />
    </div>
  );
};

export default Home;
