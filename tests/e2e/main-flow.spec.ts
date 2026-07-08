import { expect, test, type Page } from "@playwright/test";

const campaignData = {
  businessName: "Pizzaria Bairro Feliz",
  businessType: "Pizzaria artesanal",
  offer: "Combo de pizza grande com refrigerante",
  differentiator: "Ingredientes frescos e entrega rápida no bairro",
  region: "Joinville, bairro América",
  audience: "Famílias e casais que moram perto e pedem jantar em casa",
  goal: "Receber mensagens no WhatsApp",
  mainChannel: "WhatsApp",
  dailyBudget: "R$ 25 por dia",
  experienceLevel: "Nunca anunciei",
  communicationTone: "Divertido",
  hasVisualAssets: "Tenho pouco material",
  hasWhatsappResponder: "Sim, mas com pouca disponibilidade",
  currentChallenge: "Muitos perguntam preço e somem",
};

async function fillCampaignForm(page: Page) {
  await page.locator('[name="businessName"]').fill(campaignData.businessName);
  await page.locator('[name="businessType"]').fill(campaignData.businessType);
  await page.locator('[name="offer"]').fill(campaignData.offer);
  await page
    .locator('[name="differentiator"]')
    .fill(campaignData.differentiator);
  await page.locator('[name="region"]').fill(campaignData.region);
  await page.locator('[name="audience"]').fill(campaignData.audience);
  await page.locator('[name="goal"]').selectOption(campaignData.goal);
  await page
    .locator('[name="mainChannel"]')
    .selectOption(campaignData.mainChannel);
  await page.locator('[name="dailyBudget"]').fill(campaignData.dailyBudget);
  await page
    .locator('[name="experienceLevel"]')
    .selectOption(campaignData.experienceLevel);
  await page
    .locator('[name="communicationTone"]')
    .selectOption(campaignData.communicationTone);
  await page
    .locator('[name="hasVisualAssets"]')
    .selectOption(campaignData.hasVisualAssets);
  await page
    .locator('[name="hasWhatsappResponder"]')
    .selectOption(campaignData.hasWhatsappResponder);
  await page
    .locator('[name="currentChallenge"]')
    .selectOption(campaignData.currentChallenge);
}

async function generateMockPlan(page: Page) {
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/generate-campaign") &&
      response.request().method() === "POST",
  );

  await page.getByRole("button", { name: "Gerar plano inicial" }).click();
  const response = await responsePromise;
  const body = (await response.json()) as {
    success?: boolean;
    source?: string;
    provider?: string;
  };

  expect(response.status()).toBe(200);
  expect(body).toMatchObject({
    success: true,
    source: "mock",
    provider: "mock",
  });
  await expect(page).toHaveURL(/\/resultado$/);
}

test("protege o fluxo principal da campanha em modo mock", async ({
  context,
  page,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);

  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Organize sua primeira campanha sem precisar dominar anúncios",
    }),
  ).toBeVisible();

  await page
    .getByRole("link", { name: "Criar minha campanha" })
    .first()
    .click();
  await expect(page).toHaveURL(/\/criar-campanha$/);

  await fillCampaignForm(page);
  await generateMockPlan(page);

  await expect(page.getByText("Plano inicial de demonstração")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Campanha pronta para revisão",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(`Rascunho para ${campaignData.businessName}`, {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      /Plano inicial orientativo.*não garante vendas, lucro, aprovação de anúncios ou performance/i,
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Campanha pronta para revisão" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Passos para colocar no ar" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Textos principais do anúncio" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Criativo principal recomendado" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Enviar feedback" }),
  ).toHaveAttribute("href", "https://example.com/feedback");
  await expect(
    page.getByRole("link", { name: "Quero ajuda para configurar" }),
  ).toHaveAttribute("href", "https://wa.me/5500000000000");

  await page
    .getByRole("button", { name: "Copiar campanha pronta" })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Campanha copiada" }),
  ).toBeVisible();
  const copiedCampaignDraft = await page.evaluate(() =>
    navigator.clipboard.readText(),
  );
  expect(copiedCampaignDraft).toContain("CAMPANHA PRONTA PARA REVISÃO");
  expect(copiedCampaignDraft).toContain("Plataforma: meta_ads");

  await expect(page.locator("#plano-completo-conteudo")).toBeHidden();
  await page
    .getByRole("navigation", { name: "Navegação rápida do plano" })
    .getByRole("link", { name: "Plano completo", exact: true })
    .click();
  await expect(page).toHaveURL(/#plano-completo$/);
  await expect(page.locator("#plano-completo-conteudo")).toBeVisible();

  for (const sectionTitle of [
    "Configuração sugerida da campanha",
    "Pacote de criativos",
    "Roteiro de atendimento no WhatsApp",
    "Métricas simples para acompanhar",
    "Checklist antes de publicar",
    "Plano de ação de 7 dias",
  ]) {
    await expect(
      page.getByRole("heading", { name: sectionTitle }),
    ).toBeVisible();
  }

  const actionPlanSection = page.locator("#plano-7-dias");
  await expect(actionPlanSection.getByText(/^Dia [1-7]$/)).toHaveCount(7);
  await expect(page.locator("#criativos").getByText(/^Criativo [1-3]$/)).toHaveCount(3);

  await expect(page.locator("#configuracao-conteudo")).toBeHidden();
  await page
    .getByRole("button", {
      name: "Mostrar Configuração sugerida da campanha",
    })
    .click();
  await expect(page.locator("#configuracao-conteudo")).toBeVisible();

  await page
    .getByRole("button", { name: "Copiar plano completo" })
    .click();
  await expect(
    page.getByRole("button", { name: "Plano copiado" }),
  ).toBeVisible();

  const copiedPlan = await page.evaluate(() => navigator.clipboard.readText());
  expect(copiedPlan).toContain(
    `PLANO INICIAL DE CAMPANHA — ${campaignData.businessName}`,
  );
  expect(copiedPlan).toContain(
    "este é um plano inicial orientativo. Revise as informações antes de publicar.",
  );
  expect(copiedPlan).toContain("DADOS DO BRIEFING");
  expect(copiedPlan).toContain(
    `Tom de comunicação: ${campaignData.communicationTone}`,
  );
  expect(copiedPlan).toContain(
    `Fotos ou vídeos: ${campaignData.hasVisualAssets}`,
  );
  expect(copiedPlan).toContain(
    `Disponibilidade no WhatsApp: ${campaignData.hasWhatsappResponder}`,
  );
  expect(copiedPlan).toContain(
    `Principal dificuldade: ${campaignData.currentChallenge}`,
  );
  expect(copiedPlan).toContain("PLANO DE AÇÃO DE 7 DIAS");
  expect(copiedPlan).toContain("Dia 1: Revisar oferta e canal");
  expect(copiedPlan).toContain("Dia 7: Decidir próximo ajuste");
  expect(copiedPlan).toContain("Materiais necessários:");
  expect(copiedPlan).toContain("Montagem no Canva:");
  expect(copiedPlan).toContain("Passos de produção:");
  expect(copiedPlan).toContain("Evite:");
  expect(copiedPlan).toContain("Briefing pronto:");
  expect(copiedPlan).toContain(
    "O conteúdo não garante vendas, lucro ou performance.",
  );
  expect(copiedPlan).toMatch(/\[ \] \S/);
  expect(copiedPlan).not.toMatch(/\[ \]\S/);

  await expect(
    page.getByRole("button", { name: "Copiar briefing do criativo" }),
  ).toHaveCount(4);
  await page
    .getByRole("button", { name: "Copiar briefing do criativo" })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Briefing copiado" }),
  ).toBeVisible();
  const copiedCreativeBriefing = await page.evaluate(() =>
    navigator.clipboard.readText(),
  );
  expect(copiedCreativeBriefing).toContain("CRIATIVO 1:");
  expect(copiedCreativeBriefing).toContain("Materiais necessários:");
  expect(copiedCreativeBriefing).toContain("Evite:");

  await page.getByRole("button", { name: "Copiar plano de ação" }).click();
  await expect(
    page.getByRole("button", { name: "Plano de ação copiado" }),
  ).toBeVisible();
  const copiedActionPlan = await page.evaluate(() =>
    navigator.clipboard.readText(),
  );
  expect(copiedActionPlan).toContain("Dia 1: Revisar oferta e canal");
  expect(copiedActionPlan).toContain("Dia 7: Decidir próximo ajuste");

  await page.getByRole("button", { name: "Copiar texto" }).first().click();
  await expect(
    page.getByRole("button", { name: "Copiado", exact: true }),
  ).toBeVisible();
  const copiedAdText = await page.evaluate(() => navigator.clipboard.readText());
  expect(copiedAdText.length).toBeGreaterThan(20);

  await page
    .getByRole("button", {
      name: "Mostrar Roteiro de atendimento no WhatsApp",
    })
    .click();
  await page.getByRole("button", { name: "Copiar resposta" }).first().click();
  await expect(
    page
      .locator("#whatsapp-conteudo")
      .getByRole("button", { name: "Copiado", exact: true }),
  ).toBeVisible();
  const copiedWhatsappReply = await page.evaluate(() =>
    navigator.clipboard.readText(),
  );
  expect(copiedWhatsappReply.length).toBeGreaterThan(20);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Baixar PDF" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^plano-campanha-.+\.pdf$/);
  expect(await download.failure()).toBeNull();

  await page
    .getByRole("link", { name: "Ajustar informações" })
    .first()
    .click();
  await expect(page).toHaveURL(/\/criar-campanha$/);
  await expect(page.locator('[name="businessName"]')).toHaveValue(
    campaignData.businessName,
  );
  await expect(page.locator('[name="offer"]')).toHaveValue(campaignData.offer);
  await expect(page.locator('[name="communicationTone"]')).toHaveValue(
    campaignData.communicationTone,
  );
  await expect(page.locator('[name="hasVisualAssets"]')).toHaveValue(
    campaignData.hasVisualAssets,
  );
  await expect(page.locator('[name="hasWhatsappResponder"]')).toHaveValue(
    campaignData.hasWhatsappResponder,
  );
  await expect(page.locator('[name="currentChallenge"]')).toHaveValue(
    campaignData.currentChallenge,
  );

  const updatedBusinessName = "Pizzaria Bairro Feliz Centro";
  await page.locator('[name="businessName"]').fill(updatedBusinessName);
  await generateMockPlan(page);

  await expect(
    page.getByRole("heading", {
      name: "Campanha pronta para revisão",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(`Rascunho para ${updatedBusinessName}`, {
      exact: false,
    }),
  ).toBeVisible();

  await page
    .getByRole("link", { name: "Histórico", exact: true })
    .click();
  await expect(page).toHaveURL(/\/historico$/);
  await expect(
    page.getByRole("heading", { name: "Histórico de planos" }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(2);

  const updatedPlanCard = page.getByRole("article").filter({
    has: page.getByRole("heading", {
      name: updatedBusinessName,
      exact: true,
    }),
  });
  await expect(updatedPlanCard).toBeVisible();
  await updatedPlanCard
    .getByRole("button", { name: "Abrir plano" })
    .click();

  await expect(page).toHaveURL(/\/resultado$/);
  await expect(
    page.getByRole("heading", {
      name: "Campanha pronta para revisão",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(`Rascunho para ${updatedBusinessName}`, {
      exact: false,
    }),
  ).toBeVisible();

  await page
    .getByRole("link", { name: "Histórico", exact: true })
    .click();
  const restoredPlanCard = page.getByRole("article").filter({
    has: page.getByRole("heading", {
      name: updatedBusinessName,
      exact: true,
    }),
  });
  await restoredPlanCard.getByRole("button", { name: "Excluir" }).click();
  await expect(restoredPlanCard).toHaveCount(0);
  await expect(page.getByRole("article")).toHaveCount(1);

  await page
    .getByRole("article")
    .getByRole("button", { name: "Excluir" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Nenhum plano salvo ainda" }),
  ).toBeVisible();
});

test("mantém o resultado utilizável em viewport mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/criar-campanha");
  await fillCampaignForm(page);
  await generateMockPlan(page);

  const pageWidths = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(pageWidths.scrollWidth).toBeLessThanOrEqual(pageWidths.clientWidth);

  const quickNavigation = page.getByRole("navigation", {
    name: "Navegação rápida do plano",
  });
  await expect(quickNavigation).toBeVisible();

  for (const linkName of [
    "Campanha",
    "Passos",
    "Textos",
    "Criativo",
    "Plano completo",
  ]) {
    await expect(
      quickNavigation.getByRole("link", { name: linkName, exact: true }),
    ).toBeVisible();
  }

  await quickNavigation
    .getByRole("link", { name: "Plano completo", exact: true })
    .click();
  await expect(page).toHaveURL(/#plano-completo$/);
  await expect(page.locator("#plano-completo-conteudo")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Material de apoio" }),
  ).toBeVisible();
});

test("mantém estado vazio com histórico ausente ou corrompido", async ({
  page,
}) => {
  await page.goto("/historico");
  await expect(
    page.getByRole("heading", { name: "Nenhum plano salvo ainda" }),
  ).toBeVisible();

  await page.evaluate(() => {
    localStorage.setItem("campaign-plan-history", "{conteudo-invalido");
  });
  await page.reload();

  await expect(
    page.getByRole("heading", { name: "Nenhum plano salvo ainda" }),
  ).toBeVisible();
});

test("mantém páginas institucionais acessíveis pelo rodapé", async ({
  page,
}) => {
  await page.goto("/");

  const footerNavigation = page.getByRole("navigation", {
    name: "Links do rodapé",
  });
  await expect(
    footerNavigation.getByRole("link", {
      name: "Programa beta",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    footerNavigation.getByRole("link", {
      name: "Privacidade",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    footerNavigation.getByRole("link", { name: "Termos", exact: true }),
  ).toBeVisible();

  await footerNavigation
    .getByRole("link", { name: "Privacidade", exact: true })
    .click();
  await expect(page).toHaveURL(/\/privacidade$/);
  await expect(
    page.getByRole("heading", { name: "Privacidade", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByText("Nenhum serviço externo de analytics está ativo."),
  ).toBeVisible();

  await page
    .getByRole("navigation", { name: "Links do rodapé" })
    .getByRole("link", { name: "Termos", exact: true })
    .click();
  await expect(page).toHaveURL(/\/termos$/);
  await expect(
    page.getByRole("heading", { name: "Termos de uso", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Sem garantia de resultado" }),
  ).toBeVisible();
  await expect(
    page.getByText("Esta versão não se conecta ao Meta Ads", {
      exact: false,
    }),
  ).toBeVisible();
});

test("carrega o programa beta e mostra canais públicos configurados", async ({
  page,
}) => {
  await page.goto("/beta");

  await expect(
    page.getByRole("heading", {
      name: "Ajude a tornar o primeiro plano de campanha mais simples",
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Um ponto de partida, não uma promessa" }),
  ).toBeVisible();

  const feedbackLink = page.getByRole("link", {
    name: "Enviar feedback",
  });
  const helpLink = page.getByRole("link", {
    name: "Quero ajuda para configurar",
  });

  await expect(feedbackLink).toHaveAttribute(
    "href",
    "https://example.com/feedback",
  );
  await expect(helpLink).toHaveAttribute(
    "href",
    "https://wa.me/5500000000000",
  );

  for (const link of [feedbackLink, helpLink]) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toHaveAttribute("rel", /noreferrer/);
  }
});
