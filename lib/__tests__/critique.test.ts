import { describe, expect, it } from 'vitest';
import { sanitizeCritique } from '../critique';

describe('sanitizeCritique', () => {
  it('returns a normal short critique as-is', () => {
    const text =
      '販売元の所在地が日本国外のため、返品や問い合わせの窓口を購入前に確認しておくとよさそうです。店舗名と責任者名の表記にも違いがあります。レビューや返品条件、販売元情報をもう一度確認したうえで判断してください。';
    expect(sanitizeCritique(text)).toBe(text);
  });

  it('rejects output containing forbidden terms', () => {
    expect(sanitizeCritique('この商品は偽物の可能性があります。')).toBeUndefined();
    expect(sanitizeCritique('この販売元は安全です。')).toBeUndefined();
    expect(sanitizeCritique('購入はSTOPしてください。')).toBeUndefined();
  });

  it('rejects output longer than 500 characters', () => {
    expect(sanitizeCritique('あ'.repeat(501))).toBeUndefined();
  });

  it('rejects empty output', () => {
    expect(sanitizeCritique('')).toBeUndefined();
    expect(sanitizeCritique('   ')).toBeUndefined();
  });

  it('rejects code blocks and JSON-looking output', () => {
    expect(sanitizeCritique('```json\n{"a":1}\n```')).toBeUndefined();
    expect(sanitizeCritique('{"signal":"high"}')).toBeUndefined();
    expect(sanitizeCritique('[{"signal":"high"}]')).toBeUndefined();
  });
});
