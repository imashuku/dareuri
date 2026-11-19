// Prefill entry point for the bookmarklet / share sheet / extension.
// Data arrives in the URL fragment (#s=<seller text>&u=<product url>),
// which the browser never sends to the server — the no-server-logs
// privacy design holds even for one-tap flows.

export interface PrefillData {
  sellerText?: string;
  url?: string;
}

const MAX_PREFILL_LENGTH = 10_000;

export function parsePrefillHash(hash: string): PrefillData {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw) return {};
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(raw);
  } catch {
    return {};
  }
  const trimmedSellerText = params.get('s')?.trim();
  let sellerTextEnd = MAX_PREFILL_LENGTH;
  const boundary = trimmedSellerText?.slice(sellerTextEnd - 1, sellerTextEnd + 1);
  if (boundary && /[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(boundary)) {
    sellerTextEnd -= 1;
  }
  const sellerText = trimmedSellerText?.slice(0, sellerTextEnd);
  const url = params.get('u')?.trim();
  return {
    sellerText: sellerText || undefined,
    url: url || undefined,
  };
}
