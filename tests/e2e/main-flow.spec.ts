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
      name: `Resultado para ${campaignData.businessName}`,
    }),
  ).toBeVisible();
  await expect(page.getByText(/^Criativo [1-3]$/)).toHaveCount(3);

  for (const sectionTitle of [
    "Configuração sugerida da campanha",
    "Pacote de criativos",
    "Roteiro de atendimento no WhatsApp",
    "Métricas simples para acompanhar",
    "Checklist antes de publicar",
  ]) {
    await expect(
      page.getByRole("heading", { name: sectionTitle }),
    ).toBeVisible();
  }

  await page
    .getByRole("button", { name: "Copiar plano completo" })
    .click();
  await expect(
    page.getByRole("button", { name: "Plano copiado" }),
  ).toBeVisible();

  const copiedPlan = await page.evaluate(() => navigator.clipboard.readText());
  expect(copiedPlan).toContain(`PLANO INICIAL DE CAMPANHA — ${campaignData.businessName}`);
  expect(copiedPlan).toMatch(/\[ \] \S/);
  expect(copiedPlan).not.toMatch(/\[ \]\S/);

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

  const updatedBusinessName = "Pizzaria Bairro Feliz Centro";
  await page.locator('[name="businessName"]').fill(updatedBusinessName);
  await generateMockPlan(page);

  await expect(
    page.getByRole("heading", {
      name: `Resultado para ${updatedBusinessName}`,
    }),
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
    "Configuração",
    "Criativos",
    "WhatsApp",
    "Métricas",
    "Checklist",
  ]) {
    await expect(
      quickNavigation.getByRole("link", { name: linkName, exact: true }),
    ).toBeVisible();
  }

  await quickNavigation
    .getByRole("link", { name: "Checklist", exact: true })
    .click();
  await expect(page).toHaveURL(/#checklist$/);
  await expect(
    page.getByRole("heading", { name: "Checklist antes de publicar" }),
  ).toBeVisible();
});
