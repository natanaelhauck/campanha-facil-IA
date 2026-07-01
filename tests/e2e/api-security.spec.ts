import { expect, test } from "@playwright/test";

const validCampaignPayload = {
  businessName: "Pizzaria Segurança",
  businessType: "Pizzaria artesanal",
  offer: "Pizza grande com refrigerante",
  differentiator: "Ingredientes frescos e entrega rápida",
  region: "Joinville, bairro América",
  audience: "Famílias e casais que moram perto",
  goal: "Receber mensagens no WhatsApp",
  mainChannel: "WhatsApp",
  dailyBudget: "R$ 25 por dia",
  experienceLevel: "Nunca anunciei",
};

test("rejeita payload acima do limite antes da geração", async ({
  request,
}) => {
  const response = await request.post("/api/generate-campaign", {
    headers: {
      "x-forwarded-for": "192.0.2.10",
    },
    data: {
      ...validCampaignPayload,
      audience: "x".repeat(9_000),
    },
  });

  expect(response.status()).toBe(413);
  await expect(response.json()).resolves.toMatchObject({
    success: false,
  });
});

test("aplica limite em memória e retorna Retry-After", async ({ request }) => {
  const headers = {
    "x-forwarded-for": "192.0.2.20",
  };

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await request.post("/api/generate-campaign", {
      headers,
      data: validCampaignPayload,
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toMatchObject({
      success: true,
      source: "mock",
      provider: "mock",
    });
  }

  const blockedResponse = await request.post("/api/generate-campaign", {
    headers,
    data: validCampaignPayload,
  });

  expect(blockedResponse.status()).toBe(429);
  expect(blockedResponse.headers()["retry-after"]).toBeTruthy();
  await expect(blockedResponse.json()).resolves.toMatchObject({
    success: false,
    code: "rate_limited",
  });
});
