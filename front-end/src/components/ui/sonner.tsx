"use client";

import { useTheme } from "../ThemeProvider";
import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--dao-card)",
          "--normal-text": "var(--dao-foreground)",
          "--normal-border": "var(--dao-border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };