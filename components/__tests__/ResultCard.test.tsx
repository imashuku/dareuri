import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ResultCard from '../ResultCard';
import type { CheckResult } from '@/lib/types';

const result: CheckResult = {
  signal: 'medium',
  flags: [],
  facts: {
    storeName: '毎日上向き',
    shipsFrom: 'Amazon',
    country: '中国',
    operatorNameScript: 'ローマ字表記',
    hasTokushoho: 'present',
    hasPhoneLikeInfo: 'not_found',
  },
};

describe('ResultCard labels', () => {
  const html = renderToStaticMarkup(<ResultCard result={result} />);

  it('labels the country as an estimate', () => {
    expect(html).toContain('推定所在国');
    expect(html).not.toContain('>所在国<');
  });

  it('scopes business-info and phone labels to the pasted text', () => {
    expect(html).toContain('貼り付けテキスト内の事業者表示');
    expect(html).toContain('貼り付けテキスト内の電話番号表示');
  });

  it('shows the estimation note', () => {
    expect(html).toContain(
      '表示内容は、貼り付けられたテキストから機械的に整理・推定した結果です。',
    );
  });

  it('maps Presence values to あり/見当たらない', () => {
    expect(html).toContain('あり');
    expect(html).toContain('見当たらない');
  });
});
