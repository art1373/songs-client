
export interface Song {
  id: string;
  name: string;
  artist: string;
  imageUrl: string | File;
}

export interface SongFormData {
  name: string;
  artist: string;
  imageUrl: File | null;
}
