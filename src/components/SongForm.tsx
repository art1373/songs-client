import { useState } from "react";
import { SongFormData } from "../types/song";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface SongFormProps {
  onAddSong: (song: SongFormData) => Promise<boolean | void>;
  isSubmitting: boolean;
  isMobileSheet?: boolean;
}

const SongForm: React.FC<SongFormProps> = ({
  onAddSong,
  isSubmitting,
  isMobileSheet = false,
}) => {
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

  const resetForm = () => {
    form.reset();
    setImagePreview(null);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Extract file from the form values
      const formData: SongFormData = {
        name: values.name,
        artist: values.artist,
        imageUrl:
          values.albumCover instanceof FileList
            ? values.albumCover[0]
            : values.albumCover,
      };

      const success = await onAddSong(formData);

      if (success !== false) {
        resetForm();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const formClassNames = isMobileSheet
    ? "space-y-6"
    : "space-y-6 bg-zinc-800 p-6 rounded-lg shadow-md";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={formClassNames}>
        {!isMobileSheet && (
          <h2 className="text-xl font-bold text-white mb-4">
            {t("songForm.title")}
          </h2>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-zinc-300">
                {t("songForm.songName")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-zinc-700 border-zinc-600 text-white"
                  placeholder={t("songForm.songName")}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="artist"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-zinc-300">
                {t("songForm.artistName")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-zinc-700 border-zinc-600 text-white"
                  placeholder={t("songForm.artistName")}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="albumCover"
          render={({ field: { onChange, value, ...fieldProps } }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-zinc-300">
                {t("songForm.albumCover")} ({t("songForm.optional")})
              </FormLabel>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      className="bg-zinc-700 border-zinc-600 text-white"
                      onChange={(e) => {
                        // Handle file selection
                        onChange(e.target.files);

                        // Update image preview
                        const file = e.target.files?.[0];
                        if (file) {
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
                        } else {
                          setImagePreview(null);
                        }
                      }}
                    />
                  </FormControl>
                  <p className="text-xs text-zinc-400 mt-1">
                    {t("songForm.maxSize")}
                  </p>
                </div>

                {imagePreview && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-music-primary hover:bg-music-secondary text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("songForm.addingStatus") : t("songForm.addSong")}
        </Button>
      </form>
    </Form>
  );
};

export default SongForm;
