import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";

const benefits = [
  {
    title: "Feito para leigos",
    description:
      "Perguntas simples transformam informacoes do negocio em um plano claro de campanha.",
  },
  {
    title: "Foco em canais reais",
    description:
      "Organize campanhas para Meta Ads, Instagram, Facebook e WhatsApp sem jargao tecnico.",
  },
  {
    title: "Plano pronto para executar",
    description:
      "Receba textos, ideias de criativos, checklist e rotina de acompanhamento.",
  },
];

const steps = [
  "Informe o negocio, a oferta e o publico que deseja alcancar.",
  "Veja uma recomendacao inicial com objetivo, publico, verba e anuncios.",
  "Use o passo a passo para configurar, publicar e acompanhar a campanha.",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <Header />

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Campanha Facil IA
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-stone-950 sm:text-5xl">
            Crie um plano de anuncios simples para vender mais no seu negocio
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
            Uma ferramenta guiada para pequenos negocios e pessoas leigas em
            anuncios montarem campanhas para Meta Ads, Instagram, Facebook e
            WhatsApp com mais seguranca.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/criar-campanha">Criar minha campanha</Button>
            <Button href="#como-funciona" variant="secondary">
              Ver como funciona
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <div className="rounded-md bg-stone-950 p-5 text-white">
            <p className="text-sm text-emerald-200">Plano sugerido</p>
            <h2 className="mt-3 text-2xl font-bold">
              Campanha de mensagens no WhatsApp
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-200">
              Objetivo, publico, textos, criativos e checklist organizados para
              publicar com menos duvida.
            </p>
          </div>
          <div className="mt-5 grid gap-3 text-sm text-stone-700">
            <div className="rounded-md bg-emerald-50 p-4">
              Publico local com interesses amplos
            </div>
            <div className="rounded-md bg-amber-50 p-4">
              3 textos prontos para teste inicial
            </div>
            <div className="rounded-md bg-sky-50 p-4">
              Acompanhamento em 3, 7 e 14 dias
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-2xl font-bold text-stone-950">Beneficios</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <h3 className="text-lg font-bold text-stone-950">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-700">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-14">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-2xl font-bold text-stone-950">Como funciona</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step}>
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-700 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-4 text-sm leading-6 text-stone-700">{step}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
