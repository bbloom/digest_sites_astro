/**
 * Central API fetch utility for the Digest static site.
 * All pages import this — fetch logic lives in one place.
 */

const API_BASE_URL      = import.meta.env.API_BASE_URL;
const API_BEARER_TOKEN  = import.meta.env.API_BEARER_TOKEN;
const REQUESTING_DOMAIN = import.meta.env.REQUESTING_DOMAIN;
const DIGEST_NAME       = import.meta.env.DIGEST_NAME;

async function apiFetch(): Promise<any> {
  const CF_ID     = import.meta.env.CF_ACCESS_CLIENT_ID;
  const CF_SECRET = import.meta.env.CF_ACCESS_CLIENT_SECRET;

  const headers: Record<string, string> = {
    'Authorization':    `Bearer ${API_BEARER_TOKEN}`,
    'RequestingDomain': REQUESTING_DOMAIN,
    'X-Digest-List':    DIGEST_NAME,
  };

  if (CF_ID && CF_SECRET) {
    headers['CF-Access-Client-Id']     = CF_ID;
    headers['CF-Access-Client-Secret'] = CF_SECRET;
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/digests`, { headers });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export async function getList(): Promise<any> {
  const data = await apiFetch();
  return data.list ?? {};
}

export async function getDigests(): Promise<any[]> {
  const data = await apiFetch();
  return data.digests ?? [];
}

export async function getAllData(): Promise<{
  list:    any;
  digests: any[];
}> {
  const data = await apiFetch();
  return {
    list:    data.list    ?? {},
    digests: data.digests ?? [],
  };
}