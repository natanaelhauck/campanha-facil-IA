"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { CampaignResultSection } from "@/components/CampaignResultSection";
import { Header } from "@/components/Header";
import { mockCampaignResult } from "@/data/mockCampaignResult";
import type { CampaignFormData } from "@/types/campaign";

const campaignStorageKey = "campaign-form-data";

function parseCampaignForm(value: string | null): CampaignFormData | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<CampaignFormData>;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      businessName: parsed.businessName ?? "",
      businessType: parsed.businessType ?? "",
      region: parsed.region ?? "",
      offer: parsed.offer ?? "",
      goal: parsed.goal ?? "",
      dailyBudget: parsed.dailyBudget ?? "",
      audience: parsed.audience ?? "",
      differentiator: parsed.differentiator ?? "",
      mainChannel: parsed.mainChannel ?? "",
      experienceLevel: parsed.experienceLevel ?? "",
    };
  } catch {
    return null;
  }
}

function display(value: string, fallback: string) {
  return value.trim() || fallback;
}

function EmptyResult() {
  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <Header />
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Nenhum plano encontrado
          </p>
          <h1 className="mt-3 text-3xl font-bold text-stone-950">
            Crie uma campanha para ver o resultado
          </h1>
          <p className="mt-4 text-sm leading-6 text-stone-700">
            Não encontramos dados salvos neste navegador. Volte ao formulário e
            preencha as informações básicas para gerar um plano inicial.
          </p>
          <div className="mt-6">
            <Button href="/criar-campanha">Criar campanha</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ResultPage() {
  const [form, setForm] = useState<CampaignFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      const savedForm = localStorage.getItem(campaignStorageKey);
      setForm(parseCampaignForm(savedForm));
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7f8f5]">
        <Header />
        <section className="mx-auto max-w-3xl px-5 py-16">
          <div className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
            <p className="text-sm text-stone-700">Carregando plano inicial...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!form) {
    return <EmptyResult />;
  }

  const businessName = display(form.businessName, "seu negócio");
  const businessType = display(form.businessType, "negócio local");
  const region = display(form.region, "sua região");
  const offer = display(form.offer, "produto ou serviço anunciado");
  const goal = display(form.goal, "receber contatos qualificados");
  const dailyBudget = display(form.dailyBudget, "orçamento inicial informado");
  const audience = display(form.audience, "pessoas com interesse na oferta");
  const differentiator = display(form.differentiator, "atendimento confiável");
  const mainChannel = display(form.mainChannel, "canal principal");
  const experienceLevel = display(form.experienceLevel, "não informado");

  const personalizedAdTexts = [
    `${businessName} ajuda quem procura ${offer} em ${region}. Fale pelo ${mainChannel} e tire suas dúvidas de forma simples.`,
    `Está buscando ${offer}? Conheça o atendimento da ${businessName} e veja como o diferencial "${differentiator}" pode ajudar.`,
    `Oferta para ${audience}. Chame a ${businessName} pelo ${mainChannel} e receba uma orientação inicial.`,
  ];

  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <Header />
      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
              Plano inicial
            </p>
            <h1 className="mt-3 text-3xl font-bold text-stone-950">
              Resultado para {businessName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
              Este resultado ainda é simulado e usa as informações preenchidas
              no formulário para simular a estrutura de um plano de campanha.
            </p>
          </div>
          <Button href="/criar-campanha" variant="secondary">
            Ajustar informações
          </Button>
        </div>

        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          Este é um plano inicial gerado para orientação. Ele não garante
          resultados e deve ser acompanhado e ajustado conforme os dados da
          campanha.
        </div>

        <div className="grid gap-5">
          <CampaignResultSection title="Resumo do plano">
            <p>
              A campanha será criada para <strong>{businessName}</strong>, um
              negócio do tipo <strong>{businessType}</strong> que atua em{" "}
              <strong>{region}</strong>. A oferta principal é{" "}
              <strong>{offer}</strong>, com objetivo de <strong>{goal}</strong>.
              O canal principal será <strong>{mainChannel}</strong>,
              considerando que o nível de experiência informado foi{" "}
              <strong>{experienceLevel}</strong>.
            </p>
          </CampaignResultSection>

          <div className="grid gap-5 md:grid-cols-3">
            <CampaignResultSection title="Objetivo recomendado">
              <p>
                Para o objetivo informado, <strong>{goal}</strong>, a
                recomendação inicial é começar com uma campanha focada em
                contato direto pelo canal <strong>{mainChannel}</strong>.{" "}
                {mockCampaignResult.recommendedObjective}
              </p>
            </CampaignResultSection>
            <CampaignResultSection title="Público sugerido">
              <p>
                Use como base: <strong>{audience}</strong>.{" "}
                {mockCampaignResult.suggestedAudience} Inclua a região{" "}
                <strong>{region}</strong> e evite segmentações muito estreitas
                no primeiro teste.
              </p>
            </CampaignResultSection>
            <CampaignResultSection title="Orçamento inicial">
              <p>
                Orçamento informado: <strong>{dailyBudget}</strong>.{" "}
                {mockCampaignResult.initialBudget}
              </p>
            </CampaignResultSection>
          </div>

          <CampaignResultSection title="Textos de anúncio">
            <ol className="grid gap-3">
              {personalizedAdTexts.map((text) => (
                <li key={text} className="rounded-md bg-stone-50 p-4">
                  {text}
                </li>
              ))}
            </ol>
          </CampaignResultSection>

          <CampaignResultSection title="Ideias de criativos">
            <ul className="grid gap-2">
              <li>
                - Mostre {offer} em uma imagem real, destacando {differentiator}.
              </li>
              {mockCampaignResult.creativeIdeas.map((idea) => (
                <li key={idea}>- {idea}</li>
              ))}
            </ul>
          </CampaignResultSection>

          <CampaignResultSection title="Passo a passo">
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
              <li>
                - O canal principal ({mainChannel}) está pronto para receber
                contatos.
              </li>
              {mockCampaignResult.prePublishChecklist.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </CampaignResultSection>

          <CampaignResultSection title="Acompanhamento em 3, 7 e 14 dias">
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
