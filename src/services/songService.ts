import { Song, SongFormData } from "../types/song";

let API_URL;
if (process.env.NODE_ENV === "production") {
  API_URL = "https://song-api-uptb.onrender.com/songs"; // Replace with your production URL
} else {
  API_URL = "http://localhost:3000/songs"; // Replace with your development URL
}

export const songService = {
  // Get all songs
  getAllSongs: async (): Promise<Song[]> => {
    try {
      const resp = await fetch(API_URL);
      const data = await resp.json();
      return data;
    } catch (error) {
      console.error("Error fetching songs:", error);
      return [];
    }
  },

  addSong: async (songData: SongFormData): Promise<Song> => {
    try {
      const formData = new FormData();
      formData.append("name", songData.name);
      formData.append("artist", songData.artist);

      if (songData.imageUrl instanceof File) {
        formData.append("image", songData.imageUrl);
      }

      const resp = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        throw new Error("Failed to add song");
      }

      const newSong = await resp.json();
      return newSong;
    } catch (error) {
      console.error("Error adding song:", error);
      throw error;
    }
  },

  // Edit a song
  editSong: async (song: Song): Promise<Song> => {
    try {
      const formData = new FormData();
      formData.append("name", song.name);
      formData.append("artist", song.artist);

      // Handle image URL or File
      if (typeof song.imageUrl !== "string" && song.imageUrl instanceof File) {
        formData.append("image", song.imageUrl);
      }

      const resp = await fetch(`${API_URL}/${song.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!resp.ok) {
        throw new Error("Failed to edit song");
      }

      const updatedSong = await resp.json();
      return updatedSong;
    } catch (error) {
      console.error("Error editing song:", error);
      throw error;
    }
  },

  // Delete a song
  deleteSong: async (id: string): Promise<boolean> => {
    try {
      const resp = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (resp.ok) {
        return true;
      } else {
        throw new Error("Failed to delete song");
      }
    } catch (error) {
      console.error("Error deleting song:", error);
      return false;
    }
  },
};
