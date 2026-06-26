"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultContent, type Content } from "@/lib/content";

const ContentContext = createContext<Content>(defaultContent);

/** Supplies portfolio content to the sections. Defaults to the demo content. */
export function ContentProvider({
  value,
  children,
}: {
  value: Content;
  children: ReactNode;
}) {
  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

/** Read the active portfolio content (falls back to demo defaults). */
export function useContent() {
  return useContext(ContentContext);
}
