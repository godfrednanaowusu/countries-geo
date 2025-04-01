"use client";

import React from "react";
// import { SessionProvider } from "next-auth/react";
import { Theme } from "@radix-ui/themes";
import { useConfigStore } from "@/zustand/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const { appTheme } = useConfigStore();
  return (
    <>
        <Theme accentColor={"purple"} appearance={appTheme} radius="large">
            {children}
        </Theme>
    </>
  );
}
