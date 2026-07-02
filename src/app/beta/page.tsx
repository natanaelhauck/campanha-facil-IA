import type { Metadata } from "next";
import { BetaFeedbackCard } from "@/components/BetaFeedbackCard";
import { BetaPageViewTracker } from "@/components/BetaPageViewTracker";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Programa beta | Campanha Fácil IA",
  description:
    "Saiba como testar o Campanha Fácil IA e ajudar a melhorar a experiência para pequenos negócios.",
};

const testSteps = [
  {
    number: "01",
    title: "Conte sobre seu negócio",
    description:
      "Preencha o formulário como faria de verdade, sem incluir dados sensíveis.",
  },
  {
    number: "02",
    title: "Leia o plano com calma",
    description:
      "Veja se objetivo, público, textos, criativos e próximos passos fazem sentido.",
  },
  {
    number: "03",
    title: "Tente usar o material",
    description:
      "Copie o plano, baixe o PDF e identifique o que você conseguiria executar.",
  },
  {
    number: "04",
    title: "Conte onde ajudou ou travou",
    description:
      "Feedbacks específicos ajudam a decidir o que deve ser simplificado primeiro.",
  },
];

const plannedItems = [
  "Planos mais claros a partir do feedback recebido no beta.",
  "Leitura simples de métricas informadas manualmente pelo usuário.",
  "Mais apoio para revisar a configuração antes de anunciar.",
  "Avaliação futura de conta e histórico sincronizado, somente se houver necessidade real.",
];

export default function BetaPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <BetaPageViewTracker />
      <Header />

      <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <div className="relative overflow-hidden rounded-2xl bg-stone-950 px-6 py-10 text-white shadow-sm md:px-10 md:py-14">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-emerald-400/20 bg-emerald-500/10"
          />
          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
              Beta controlado
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Ajude a tornar o primeiro plano de campanha mais simples
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300">
              O Campanha Fácil IA transforma respostas sobre um pequeno negócio
              em um plano inicial para anúncios, criativos, atendimento e
              acompanhamento — sempre para revisão antes de usar.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/criar-campanha">Testar o Campanha Fácil IA</Button>
              <Button
                href="#como-testar"
                variant="secondary"
                className="border-stone-600 bg-transparent text-white hover:bg-stone-900"
              >
                Ver como testar
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              O que é
            </p>
            <h2 className="mt-3 text-2xl font-bold text-stone-950">
              Um ponto de partida, não uma promessa
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              A ferramenta organiza informações do negócio em um pacote
              inicial. O plano é orientativo e não garante vendas, lucro,
              aprovação de anúncios ou performance.
            </p>
          </section>
          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Para quem é
            </p>
            <h2 className="mt-3 text-2xl font-bold text-stone-950">
              Pequenos negócios que ainda não dominam anúncios
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              O beta é voltado principalmente a quem vende pelo WhatsApp,
              Instagram, site ou loja física e precisa organizar o básico antes
              de investir.
            </p>
          </section>
        </div>

        <section
          id="como-testar"
          className="mt-6 scroll-mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Como testar
            </p>
            <h2 className="mt-3 text-2xl font-bold text-stone-950">
              Use uma situação real e observe o que acontece
            </h2>
          </div>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {testSteps.map((step) => (
              <li
                key={step.number}
                className="grid grid-cols-[3rem_1fr] gap-4 rounded-lg bg-stone-50 p-4"
              >
                <span className="font-mono text-sm font-bold text-emerald-800">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-bold text-stone-950">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <strong>Como enviar feedback:</strong> use o botão disponível
            abaixo ou responda pelo canal em que recebeu o convite para o beta.
            Não inclua senhas, documentos ou outros dados sensíveis.
          </p>
        </section>

        <div className="mt-6">
          <BetaFeedbackCard />
        </div>

        <section className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Próximos recursos
              </p>
              <h2 className="mt-3 text-2xl font-bold text-stone-950">
                O feedback define a ordem
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Estes itens são possibilidades planejadas, não promessas de
                entrega.
              </p>
            </div>
            <ul className="grid gap-3">
              {plannedItems.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-lg border border-stone-200 p-4 text-sm leading-6 text-stone-700"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-700"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </section>
    </main>
  );
}
