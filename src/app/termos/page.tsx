import type { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Termos de uso | Campanha Fácil IA",
  description:
    "Condições simples para usar os planos iniciais gerados pelo Campanha Fácil IA.",
};

const terms = [
  {
    title: "Orientação inicial",
    description:
      "O Campanha Fácil IA organiza as informações fornecidas por você em um plano inicial orientativo. O conteúdo serve como ponto de partida e não substitui análise profissional, revisão das políticas das plataformas ou avaliação do seu negócio.",
  },
  {
    title: "Sem garantia de resultado",
    description:
      "A ferramenta não garante vendas, lucro, aprovação de anúncios, alcance, contatos ou qualquer nível de performance. Resultados dependem de oferta, público, criativo, orçamento, atendimento, concorrência e execução.",
  },
  {
    title: "Revisão antes de publicar",
    description:
      "Você deve revisar textos, público, orçamento, criativos e configurações antes de usar o plano. Verifique também preços, condições comerciais, direitos de imagem e regras da plataforma escolhida.",
  },
  {
    title: "Campanhas reais são sua responsabilidade",
    description:
      "A decisão de criar, financiar, publicar, pausar ou alterar uma campanha real é do usuário. Você é responsável pela configuração da conta, pelo orçamento investido e pelo cumprimento das leis e políticas aplicáveis.",
  },
  {
    title: "Sem integração com Meta Ads",
    description:
      "Esta versão não se conecta ao Meta Ads e não publica nem altera campanhas. Ela também não movimenta orçamento ou acessa sua conta de anúncios.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <Header />

      <section className="mx-auto max-w-4xl px-5 py-10 md:py-16">
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 bg-emerald-900 px-6 py-8 text-white md:px-10 md:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Uso responsável
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Termos de uso
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50">
              O que você precisa considerar antes de usar um plano em uma
              campanha real.
            </p>
            <p className="mt-5 text-xs text-emerald-200">
              Última atualização: 2 de julho de 2026
            </p>
          </div>

          <div className="grid gap-5 p-6 md:p-10">
            {terms.map((term, index) => (
              <section
                key={term.title}
                aria-labelledby={`terms-section-${index}`}
                className="rounded-lg border border-stone-200 bg-stone-50 p-5 md:grid md:grid-cols-[2.5rem_1fr] md:gap-4"
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-stone-900 text-xs font-bold text-white"
                >
                  {index + 1}
                </span>
                <div className="mt-4 md:mt-0">
                  <h2
                    id={`terms-section-${index}`}
                    className="text-lg font-bold text-stone-950"
                  >
                    {term.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    {term.description}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
