"use client";

import { useThemeConfig } from "@/components/theme-customizer/active-theme";
import { Button } from "@/components/ui/button";
import { DEFAULT_THEME } from "@/lib/themes/themes";

export function ResetThemeButton() {
  const { setTheme } = useThemeConfig();

  const resetThemeHandle = () => {
    setTheme(DEFAULT_THEME);
  };

  return (
    <Button className="mt-4 w-full" onClick={resetThemeHandle}>
      Reset to Default
    </Button>
  );
}