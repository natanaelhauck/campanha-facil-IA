import { expect, test } from "@playwright/test";

test("expõe um health check seguro e sem cache", async ({ request }) => {
  const response = await request.get("/api/health");
  const body = (await response.json()) as Record<string, unknown>;

  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(Object.keys(body).sort()).toEqual([
    "app",
    "environment",
    "status",
    "timestamp",
  ]);
  expect(body).toMatchObject({
    status: "ok",
    app: "campanha-facil-ia",
    environment: "development",
  });
  expect(Number.isNaN(Date.parse(String(body.timestamp)))).toBe(false);
});

test("mantém o beta fora da indexação", async ({ page, request }) => {
  await page.goto("/");

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex.*nofollow|nofollow.*noindex/,
  );

  const robotsResponse = await request.get("/robots.txt");

  expect(robotsResponse.status()).toBe(200);
  expect(await robotsResponse.text()).toContain("Disallow: /");
});
