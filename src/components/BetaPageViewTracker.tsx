"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function BetaPageViewTracker() {
  useEffect(() => {
    trackEvent("beta_page_viewed");
  }, []);

  return null;
}
