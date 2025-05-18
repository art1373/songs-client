import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEditSongForm } from "@/hooks/useEditSongForm";
import AlbumCoverPreview from "./AlbumCoverPreview";
import { Song } from "@/types/song";
import DefaultAlbumCover from "./defaultAlbumCover.png";

interface EditSongFormProps {
  song: Song | null;
  onEdit: (song: Song) => Promise<void>;
  onClose: () => void;
  isSubmitting?: boolean;
}

const EditSongForm: React.FC<EditSongFormProps> = ({
  song,
  onEdit,
  onClose,
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const { form, imagePreview, handleImageChange, onSubmit } = useEditSongForm(
    song,
    onEdit
  );

  const handleSubmit = async (values) => {
    const success = await onSubmit(values);
    if (success) {
      onClose();
    }
  };

  return (
    <>
      <AlbumCoverPreview
        imageUrl={imagePreview ? imagePreview : DefaultAlbumCover}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                          onChange(e.target.files);
                          handleImageChange(e.target.files);
                        }}
                      />
                    </FormControl>
                    <p className="text-xs text-zinc-400 mt-1">
                      {t("songForm.maxSize")}
                    </p>
                  </div>
                </div>
                <FormMessage className="text-red-400 text-sm" />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-music-primary hover:bg-music-secondary text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditSongForm;
