"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import type { CampaignFormData } from "@/types/campaign";

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
    sessionStorage.setItem("campaign-form", JSON.stringify(form));
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
            Conte o basico sobre o seu negocio
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
            Responda com linguagem simples. O resultado vai simular um plano de
            campanha inicial, sem usar IA real nesta versao.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 rounded-lg border border-stone-200 bg-white p-5 shadow-sm md:grid-cols-2 md:p-7"
        >
          <Input
            label="Nome do negocio"
            name="businessName"
            value={form.businessName}
            onChange={(event) => updateField("businessName", event.target.value)}
            required
          />
          <Input
            label="Tipo de negocio"
            name="businessType"
            placeholder="Ex: pizzaria, salao, clinica"
            value={form.businessType}
            onChange={(event) => updateField("businessType", event.target.value)}
            required
          />
          <Input
            label="Cidade/regiao"
            name="region"
            value={form.region}
            onChange={(event) => updateField("region", event.target.value)}
            required
          />
          <Input
            label="Produto ou servico anunciado"
            name="offer"
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
              "Receber mensagens",
              "Gerar visitas no perfil",
              "Levar pessoas para o site",
              "Aumentar visitas na loja fisica",
              "Divulgar uma oferta",
            ]}
            required
          />
          <Input
            label="Orcamento diario aproximado"
            name="dailyBudget"
            placeholder="Ex: R$ 20 por dia"
            value={form.dailyBudget}
            onChange={(event) => updateField("dailyBudget", event.target.value)}
            required
          />
          <Textarea
            label="Publico-alvo"
            name="audience"
            value={form.audience}
            onChange={(event) => updateField("audience", event.target.value)}
            className="md:col-span-2"
            placeholder="Ex: moradores da regiao, mulheres de 25 a 45 anos, pequenos empresarios"
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
            placeholder="Ex: entrega rapida, atendimento humanizado, preco acessivel"
            required
          />
          <Select
            label="Canal principal desejado"
            name="mainChannel"
            value={form.mainChannel}
            onChange={(event) => updateField("mainChannel", event.target.value)}
            options={["WhatsApp", "Instagram", "Site", "Loja fisica"]}
            required
          />
          <Select
            label="Nivel de experiencia com anuncios"
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={(event) =>
              updateField("experienceLevel", event.target.value)
            }
            options={["Nunca anunciei", "Ja tentei algumas vezes", "Anuncio com frequencia"]}
            required
          />
          <div className="md:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              Gerar plano mockado
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
