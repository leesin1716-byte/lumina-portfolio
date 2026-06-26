/** TossPayments billing helpers (server-only — uses the secret key). */

export const PRO_PRICE = 9900;
export const PRO_ORDER_NAME = "LUMINA Pro 구독";

export const isTossConfigured = Boolean(
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY && process.env.TOSS_SECRET_KEY,
);

const TOSS_API = "https://api.tosspayments.com";

function authHeader() {
  const secret = process.env.TOSS_SECRET_KEY ?? "";
  return "Basic " + Buffer.from(`${secret}:`).toString("base64");
}

type BillingIssue = {
  billingKey: string;
  customerKey: string;
  card?: { number?: string };
};

/** Exchange the authKey from the billing-auth redirect for a billingKey. */
export async function issueBillingKey(
  authKey: string,
  customerKey: string,
): Promise<BillingIssue> {
  const res = await fetch(`${TOSS_API}/v1/billing/authorizations/issue`, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ authKey, customerKey }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "빌링키 발급에 실패했습니다.");
  return data as BillingIssue;
}

/** Charge a billingKey (the recurring/first payment). */
export async function chargeBilling(params: {
  billingKey: string;
  customerKey: string;
  amount: number;
  orderId: string;
  orderName: string;
}) {
  const { billingKey, ...body } = params;
  const res = await fetch(`${TOSS_API}/v1/billing/${billingKey}`, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "결제에 실패했습니다.");
  return data;
}
