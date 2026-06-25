"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import type { CampaignFormData } from "@/types/campaign";

const campaignStorageKey = "campaign-form-data";

const initialForm: CampaignFormData = {
  businessName: "",
  businessType: "",
  region: "",
  offer: "",
  goal: "",
  dailyBudget: "",
  audience: "",
  differentiator: "",
  mainChannel: "",
  experienceLevel: "",
};

export default function CreateCampaignPage() {
  const [form, setForm] = useState(initialForm);
  const router = useRouter();

  function updateField(field: keyof CampaignFormData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem(campaignStorageKey, JSON.stringify(form));
    router.push("/resultado");
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <Header />
      <section className="mx-auto max-w-4xl px-5 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Criar campanha
          </p>
          <h1 className="mt-3 text-3xl font-bold text-stone-950">
            Conte sobre o seu negócio
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
            Responda com linguagem simples. O resultado será um plano inicial
            simulado para orientar a primeira configuração da campanha.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 rounded-lg border border-stone-200 bg-white p-5 shadow-sm md:grid-cols-2 md:p-7"
        >
          <Input
            label="Nome do negócio"
            name="businessName"
            helpText="Use o nome que seus clientes reconhecem."
            value={form.businessName}
            onChange={(event) => updateField("businessName", event.target.value)}
            required
          />
          <Input
            label="Tipo de negócio"
            name="businessType"
            placeholder="Ex: pizzaria, salão, clínica"
            helpText="Descreva o segmento de forma simples."
            value={form.businessType}
            onChange={(event) => updateField("businessType", event.target.value)}
            required
          />
          <Input
            label="Cidade/região"
            name="region"
            placeholder="Ex: Curitiba e região metropolitana"
            helpText="Informe onde você atende ou quer vender."
            value={form.region}
            onChange={(event) => updateField("region", event.target.value)}
            required
          />
          <Input
            label="Produto ou serviço anunciado"
            name="offer"
            placeholder="Ex: almoço executivo, limpeza de sofá, consulta inicial"
            helpText="Escolha uma oferta principal para começar."
            value={form.offer}
            onChange={(event) => updateField("offer", event.target.value)}
            required
          />
          <Select
            label="Objetivo da campanha"
            name="goal"
            value={form.goal}
            onChange={(event) => updateField("goal", event.target.value)}
            options={[
              "Receber mensagens no WhatsApp",
              "Atrair visitas para o perfil do Instagram",
              "Levar pessoas para o site",
              "Aumentar visitas na loja física",
              "Divulgar uma oferta local",
            ]}
            required
          />
          <Input
            label="Orçamento diário aproximado"
            name="dailyBudget"
            placeholder="Ex: R$ 20 por dia"
            helpText="Pode ser uma estimativa. O ideal é manter por alguns dias para medir."
            value={form.dailyBudget}
            onChange={(event) => updateField("dailyBudget", event.target.value)}
            required
          />
          <Textarea
            label="Público-alvo"
            name="audience"
            value={form.audience}
            onChange={(event) => updateField("audience", event.target.value)}
            className="md:col-span-2"
            placeholder="Ex: moradores da região, mulheres de 25 a 45 anos, pequenos empresários"
            helpText="Pense em quem compra, onde mora e qual problema quer resolver."
            required
          />
          <Textarea
            label="Diferencial da empresa"
            name="differentiator"
            value={form.differentiator}
            onChange={(event) =>
              updateField("differentiator", event.target.value)
            }
            className="md:col-span-2"
            placeholder="Ex: entrega rápida, atendimento humanizado, preço acessível"
            helpText="Diga por que alguém deveria escolher você."
            required
          />
          <Select
            label="Canal principal desejado"
            name="mainChannel"
            value={form.mainChannel}
            onChange={(event) => updateField("mainChannel", event.target.value)}
            options={["WhatsApp", "Instagram", "Site", "Loja física"]}
            required
          />
          <Select
            label="Nível de experiência com anúncios"
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={(event) =>
              updateField("experienceLevel", event.target.value)
            }
            options={[
              "Nunca anunciei",
              "Já tentei algumas vezes",
              "Anuncio com frequência",
            ]}
            required
          />
          <div className="md:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              Gerar plano inicial
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
