import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === "en" ? "es" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1 text-zinc-400 hover:text-white"
    >
      <Globe className="h-4 w-4" />
      <span>
        {currentLanguage === "en" ? t("language.es") : t("language.en")}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;
