import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";

const benefits = [
  {
    title: "Ajuda a escolher um objetivo",
    description:
      "Transforme a dúvida entre mensagens, visitas, site ou loja física em uma escolha inicial mais clara.",
  },
  {
    title: "Organiza público e orçamento",
    description:
      "Defina uma região, um público e uma verba diária para começar com mais controle.",
  },
  {
    title: "Dá ideias para textos e criativos",
    description:
      "Receba sugestões simples para escrever anúncios e separar fotos ou vídeos reais do negócio.",
  },
  {
    title: "Lembra o que revisar antes de publicar",
    description:
      "Use checklist e acompanhamento em 3, 7 e 14 dias para não deixar o anúncio solto.",
  },
];

const trustItems = [
  "Leva poucos minutos",
  "Não conecta sua conta de anúncios nesta versão",
  "Plano inicial para revisar antes de anunciar",
  "Feito para quem não domina tráfego pago",
];

const previewItems = [
  {
    title: "Objetivo recomendado",
    description: "Começar com mensagens no WhatsApp para medir interesse real.",
  },
  {
    title: "Público sugerido",
    description: "Pessoas próximas da região, com interesses amplos no início.",
  },
  {
    title: "Textos de anúncio",
    description: "3 chamadas simples para testar a oferta sem linguagem complicada.",
  },
  {
    title: "Checklist",
    description: "Canal pronto, criativo separado e orçamento que cabe no caixa.",
  },
];

const steps = [
  {
    title: "Conte sobre o negócio",
    description:
      "Informe o tipo de negócio, a oferta, a região, o público e o canal principal.",
  },
  {
    title: "Receba o plano inicial",
    description:
      "Veja objetivo, público, orçamento, textos, ideias de criativos e checklist.",
  },
  {
    title: "Revise e acompanhe com cuidado",
    description:
      "Use o roteiro como ponto de partida antes de publicar e medir os primeiros sinais.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <Header />

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Campanha Fácil IA
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-stone-950 sm:text-5xl">
            Organize sua primeira campanha sem precisar dominar anúncios
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
            Uma ferramenta guiada para pequenos negócios brasileiros montarem um
            plano inicial para Meta Ads, Instagram, Facebook e WhatsApp com
            linguagem simples, sem prometer venda garantida.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/criar-campanha">Criar minha campanha</Button>
            <Button href="#como-funciona" variant="secondary">
              Ver como funciona
            </Button>
          </div>
          <div className="mt-6 grid gap-2 text-sm text-stone-700 sm:grid-cols-2">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-700" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm md:p-6">
          <div className="rounded-lg bg-stone-950 p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-emerald-200">Prévia do plano</p>
                <h2 className="mt-3 text-2xl font-bold">
                  Campanha de mensagens no WhatsApp
                </h2>
              </div>
              <span className="rounded-md bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-100">
                Orientativo
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-stone-200">
              Um roteiro inicial para revisar objetivo, público, criativos e
              acompanhamento antes de investir verba.
            </p>
          </div>
          <div className="mt-5 grid gap-3 text-sm text-stone-700">
            {previewItems.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-stone-200 bg-stone-50 p-4"
              >
                <h3 className="font-bold text-stone-950">{item.title}</h3>
                <p className="mt-1 leading-6">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-bold">Acompanhamento sugerido</p>
            <p className="leading-6">
              Olhe os primeiros contatos em 3 dias, compare qualidade em 7 dias
              e ajuste criativos antes de aumentar a verba.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
              Antes de anunciar
            </p>
            <h2 className="mt-3 text-2xl font-bold text-stone-950">
              Organize o básico para não começar no escuro
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              O Campanha Fácil IA ajuda a transformar informações soltas do
              negócio em um roteiro prático para revisar antes de publicar uma
              campanha.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <h3 className="text-base font-bold leading-snug text-stone-950">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-700">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
              Para quem é
            </p>
            <h2 className="mt-3 text-2xl font-bold text-stone-950">
              Pequenos negócios que querem começar com mais clareza
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Vende pelo WhatsApp ou Instagram e quer anunciar com mais organização.",
              "Tem medo de gastar sem saber que objetivo, público ou texto usar.",
              "Precisa de um plano simples para revisar antes de publicar a campanha.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-stone-200 bg-white p-5 text-sm leading-6 text-stone-700 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
                Como funciona
              </p>
              <h2 className="mt-3 text-2xl font-bold text-stone-950">
                Três passos para sair da ideia e chegar em um plano
              </h2>
            </div>
            <Button href="/criar-campanha" variant="secondary">
              Criar minha campanha
            </Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step.title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-700 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-stone-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-700">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
