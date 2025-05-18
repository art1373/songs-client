import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Song } from "../types/song";

export interface EditSongFormValues {
  name: string;
  artist: string;
  albumCover: FileList | null;
}

export const useEditSongForm = (
  song: Song | null,
  onEdit: (song: Song) => Promise<void>
) => {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Define form schema with Zod
  const formSchema = z.object({
    name: z.string().min(1, { message: t("messages.requiredField") }),
    artist: z.string().min(1, { message: t("messages.requiredField") }),
    albumCover: z.any().optional(),
  });

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      artist: "",
      albumCover: undefined,
    },
  });

  // Update form when song changes
  useEffect(() => {
    if (song) {
      form.reset({
        name: song.name,
        artist: song.artist,
      });

      // Set image preview if imageUrl is a string
      if (song.imageUrl && typeof song.imageUrl === "string") {
        setImagePreview(`https://song-api-uptb.onrender.com/${song.imageUrl}`);
      } else {
        setImagePreview("");
      }
    }
  }, [song, form]);

  const handleImageChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      form.setError("albumCover", {
        message: t("messages.fileSizeError"),
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      form.setError("albumCover", {
        message: t("messages.fileTypeError"),
      });
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!song) return;

    try {
      // Create a copy of the song to avoid modifying the original object
      const updatedSong: Song = {
        id: song.id,
        name: values.name,
        artist: values.artist,
        imageUrl: song.imageUrl, // Keep existing imageUrl as default
      };

      // If a new image was selected, update it
      if (
        values.albumCover instanceof FileList &&
        values.albumCover.length > 0
      ) {
        updatedSong.imageUrl = values.albumCover[0];
      }

      await onEdit(updatedSong);
      return true; // Indicate success
    } catch (error) {
      console.error("Error editing song:", error);
      return false;
    }
  };

  return {
    form,
    imagePreview,
    handleImageChange,
    onSubmit,
  };
};
