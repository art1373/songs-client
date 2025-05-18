import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Song, SongFormData } from "../types/song";
import { songService } from "../services/songService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useSongs() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: songs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["songs"],
    queryFn: songService.getAllSongs,
  });

  const addSongMutation = useMutation({
    mutationFn: (songData: SongFormData) => songService.addSong(songData),
    onSuccess: (newSong) => {
      queryClient.setQueryData<Song[]>(["songs"], (oldSongs = []) => [
        ...oldSongs,
        newSong,
      ]);
      toast.success(t("messages.songAdded"));
    },
    onError: (error) => {
      console.error("Error adding song:", error);
      toast.error(t("messages.failedToAdd"));
    },
  });

  const deleteSongMutation = useMutation({
    mutationFn: (id: string) => songService.deleteSong(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["songs"] });

      const previousSongs = queryClient.getQueryData<Song[]>(["songs"]);

      queryClient.setQueryData<Song[]>(["songs"], (oldSongs = []) =>
        oldSongs.filter((song) => song.id !== deletedId)
      );

      return { previousSongs };
    },
    onSuccess: () => {
      toast.success(t("messages.songDeleted"));
    },
    onError: (error, _, context) => {
      console.error("Error deleting song:", error);
      if (context?.previousSongs) {
        queryClient.setQueryData(["songs"], context.previousSongs);
      }
      toast.error(t("messages.failedToDelete"));
    },
  });

  // New edit song handler
  const handleEditSong = (songToEdit: Song) => {
    const song: Song = {
      id: songToEdit.id,
      name: songToEdit.name,
      artist: songToEdit.artist,
      imageUrl: songToEdit.imageUrl,
    };

    return songService.editSong(song).then((updatedSong) => {
      queryClient.setQueryData<Song[]>(["songs"], (oldSongs = []) =>
        oldSongs.map((s) => (s.id === updatedSong.id ? updatedSong : s))
      );
      toast.success(t("messages.songEdited"));
    });
  };

  return {
    songs,
    isLoading,
    error,
    addSong: addSongMutation.mutate,
    isAddingSong: addSongMutation.isPending,
    deleteSong: deleteSongMutation.mutate,
    isDeletingSong: (id: string) =>
      deleteSongMutation.isPending && deleteSongMutation.variables === id,
    editSong: handleEditSong,
  };
}
