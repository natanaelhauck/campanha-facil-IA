import type { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Privacidade | Campanha Fácil IA",
  description:
    "Entenda como o Campanha Fácil IA trata os dados informados no formulário e os planos salvos no navegador.",
};

const sections = [
  {
    title: "Quais informações você fornece",
    paragraphs: [
      "Para montar o plano, o formulário pede informações sobre o negócio, a oferta, a região, o público, o objetivo, o canal, o orçamento e sua experiência com anúncios.",
      "Não informe senhas, documentos, dados bancários, informações de saúde ou qualquer outro dado pessoal sensível.",
    ],
  },
  {
    title: "Onde os planos ficam salvos",
    paragraphs: [
      "Nesta versão não há conta, login ou banco de dados. Os dados do formulário, o plano atual e o histórico ficam no localStorage do seu navegador.",
      "Esses dados não são sincronizados entre dispositivos. Eles podem desaparecer ao limpar os dados do site, usar navegação privada, trocar de navegador ou remover o histórico local.",
    ],
  },
  {
    title: "Quando uma IA real é usada",
    paragraphs: [
      "No modo de demonstração, o plano usa conteúdo simulado e não chama OpenAI ou Gemini. Quando o serviço estiver configurado com um desses provedores, os dados preenchidos no formulário podem ser enviados pelo servidor ao provedor escolhido para gerar o plano.",
      "Evite inserir informações confidenciais. O tratamento realizado pelo provedor de IA também segue os termos e as políticas desse provedor.",
    ],
  },
  {
    title: "Analytics nesta versão",
    paragraphs: [
      "Nenhum serviço externo de analytics está ativo. A camada interna atual não usa PostHog, não faz gravação de sessão e não envia eventos para um provedor externo.",
      "Em desenvolvimento, eventos técnicos permitidos podem aparecer no console para validação. Eles não devem conter nome do negócio, região, oferta, público, orçamento ou o conteúdo do plano.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <Header />

      <section className="mx-auto max-w-4xl px-5 py-10 md:py-16">
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 bg-stone-950 px-6 py-8 text-white md:px-10 md:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Transparência
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Privacidade
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300">
              Um resumo simples sobre os dados usados para gerar e guardar seu
              plano nesta versão do produto.
            </p>
            <p className="mt-5 text-xs text-stone-400">
              Última atualização: 2 de julho de 2026
            </p>
          </div>

          <div className="grid gap-8 p-6 md:p-10">
            {sections.map((section, index) => (
              <section
                key={section.title}
                aria-labelledby={`privacy-section-${index}`}
                className="grid gap-3 border-b border-stone-200 pb-8 last:border-0 last:pb-0 md:grid-cols-[12rem_1fr]"
              >
                <h2
                  id={`privacy-section-${index}`}
                  className="text-lg font-bold text-stone-950"
                >
                  {section.title}
                </h2>
                <div className="grid gap-3 text-sm leading-6 text-stone-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
