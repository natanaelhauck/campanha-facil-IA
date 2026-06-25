import type { ReactNode } from "react";
import { Card } from "./Card";

type CampaignResultSectionProps = {
  title: string;
  children: ReactNode;
};

export function CampaignResultSection({
  title,
  children,
}: CampaignResultSectionProps) {
  return (
    <Card>
      <h2 className="text-xl font-bold text-stone-950">{title}</h2>
      <div className="mt-4 text-sm leading-6 text-stone-700">{children}</div>
    </Card>
  );
}
