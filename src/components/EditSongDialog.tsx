import { Song } from "../types/song";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditSongForm from "./EditSongForm";

interface EditSongDialogProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (song: Song) => Promise<void>;
  isSubmitting?: boolean;
}

const EditSongDialog: React.FC<EditSongDialogProps> = ({
  song,
  isOpen,
  onClose,
  onEdit,
  isSubmitting = false,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-800 border-zinc-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {t("songForm.editSong")}
          </DialogTitle>
        </DialogHeader>

        <EditSongForm
          song={song}
          onEdit={onEdit}
          onClose={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditSongDialog;
