"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { CampaignResultSection } from "@/components/CampaignResultSection";
import { Header } from "@/components/Header";
import { mockCampaignResult } from "@/data/mockCampaignResult";
import type { CampaignFormData } from "@/types/campaign";

const fallbackForm: CampaignFormData = {
  businessName: "Seu negocio",
  businessType: "negocio local",
  region: "sua regiao",
  offer: "produto ou servico principal",
  goal: "Receber mensagens",
  dailyBudget: "R$ 20 por dia",
  audience: "pessoas da regiao com interesse na solucao",
  differentiator: "atendimento simples e confiavel",
  mainChannel: "WhatsApp",
  experienceLevel: "Nunca anunciei",
};

export default function ResultPage() {
  const [form] = useState<CampaignFormData>(() => {
    if (typeof window === "undefined") {
      return fallbackForm;
    }

    const savedForm = sessionStorage.getItem("campaign-form");

    if (!savedForm) {
      return fallbackForm;
    }

    try {
      return JSON.parse(savedForm) as CampaignFormData;
    } catch {
      return fallbackForm;
    }
  });

  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <Header />
      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
              Resultado mockado
            </p>
            <h1 className="mt-3 text-3xl font-bold text-stone-950">
              Plano inicial da campanha
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
              Este resultado ainda nao usa IA real. Ele mostra a estrutura do
              plano que depois podera ser gerado com OpenAI API.
            </p>
          </div>
          <Button href="/criar-campanha" variant="secondary">
            Editar respostas
          </Button>
        </div>

        <div className="grid gap-5">
          <CampaignResultSection title="Resumo da campanha">
            <p>
              Campanha para <strong>{form.businessName}</strong>, um negocio do
              tipo <strong>{form.businessType}</strong> em{" "}
              <strong>{form.region}</strong>. A oferta principal sera{" "}
              <strong>{form.offer}</strong>, com foco em{" "}
              <strong>{form.goal}</strong> usando <strong>{form.mainChannel}</strong>.
            </p>
          </CampaignResultSection>

          <div className="grid gap-5 md:grid-cols-3">
            <CampaignResultSection title="Objetivo recomendado">
              <p>{mockCampaignResult.recommendedObjective}</p>
            </CampaignResultSection>
            <CampaignResultSection title="Publico sugerido">
              <p>
                {mockCampaignResult.suggestedAudience} Base informada:{" "}
                <strong>{form.audience}</strong>.
              </p>
            </CampaignResultSection>
            <CampaignResultSection title="Orcamento inicial">
              <p>
                {mockCampaignResult.initialBudget} Referencia enviada:{" "}
                <strong>{form.dailyBudget}</strong>.
              </p>
            </CampaignResultSection>
          </div>

          <CampaignResultSection title="3 textos de anuncios">
            <ol className="grid gap-3">
              {mockCampaignResult.adTexts.map((text) => (
                <li key={text} className="rounded-md bg-stone-50 p-4">
                  {text}
                </li>
              ))}
            </ol>
          </CampaignResultSection>

          <CampaignResultSection title="Ideias de criativos">
            <ul className="grid gap-2">
              {mockCampaignResult.creativeIdeas.map((idea) => (
                <li key={idea}>- {idea}</li>
              ))}
            </ul>
          </CampaignResultSection>

          <CampaignResultSection title="Passo a passo para configurar">
            <ol className="grid gap-2">
              {mockCampaignResult.setupSteps.map((step, index) => (
                <li key={step}>
                  <strong>{index + 1}.</strong> {step}
                </li>
              ))}
            </ol>
          </CampaignResultSection>

          <CampaignResultSection title="Checklist antes de publicar">
            <ul className="grid gap-2">
              {mockCampaignResult.prePublishChecklist.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </CampaignResultSection>

          <CampaignResultSection title="Plano de acompanhamento">
            <div className="grid gap-4 md:grid-cols-3">
              {mockCampaignResult.followUpPlan.map((period) => (
                <div key={period.period} className="rounded-md bg-stone-50 p-4">
                  <h3 className="font-bold text-stone-950">{period.period}</h3>
                  <ul className="mt-3 grid gap-2">
                    {period.actions.map((action) => (
                      <li key={action}>- {action}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CampaignResultSection>
        </div>
      </section>
    </main>
  );
}
