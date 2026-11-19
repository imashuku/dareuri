import { describe, expect, it } from 'vitest';
import { parsePrefillHash } from '../prefill';

describe('parsePrefillHash', () => {
  it('parses seller text and url from the fragment', () => {
    const text = '店舗名: 毎日上向き\n住所: 江西省吉安市';
    const url = 'https://www.amazon.co.jp/dp/B0H5HKHQSJ';
    const hash = `#s=${encodeURIComponent(text)}&u=${encodeURIComponent(url)}`;
    expect(parsePrefillHash(hash)).toEqual({ sellerText: text, url });
  });

  it('returns empty object for missing or empty hash', () => {
    expect(parsePrefillHash('')).toEqual({});
    expect(parsePrefillHash('#')).toEqual({});
    expect(parsePrefillHash('#foo=bar')).toEqual({
      sellerText: undefined,
      url: undefined,
    });
  });

  it('caps overly long seller text', () => {
    const hash = `#s=${encodeURIComponent('あ'.repeat(20000))}`;
    expect(parsePrefillHash(hash).sellerText?.length).toBe(10000);
  });

  it('drops an emoji that straddles the seller text limit', () => {
    const prefix = 'あ'.repeat(9999);
    const hash = `#s=${encodeURIComponent(prefix + '😀')}`;
    const { sellerText } = parsePrefillHash(hash);

    expect(sellerText?.length).toBe(9999);
    expect(sellerText).toBe(prefix);
  });

  it('keeps an emoji that fits exactly within the seller text limit', () => {
    const text = 'あ'.repeat(9998) + '😀';
    const hash = `#s=${encodeURIComponent(text)}`;
    const { sellerText } = parsePrefillHash(hash);

    expect(sellerText?.length).toBe(10000);
    expect(sellerText).toBe(text);
  });

  it('caps overly long ASCII seller text at 10000 code units', () => {
    const hash = `#s=${'a'.repeat(10001)}`;
    expect(parsePrefillHash(hash).sellerText?.length).toBe(10000);
  });

  it('works without the leading #', () => {
    expect(parsePrefillHash('s=hello')).toEqual({
      sellerText: 'hello',
      url: undefined,
    });
  });
});
