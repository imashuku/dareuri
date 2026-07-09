import { describe, expect, it } from 'vitest';
import { guessCountry, parseSellerText } from '../parseSellerText';

describe('guessCountry', () => {
  it('classifies Japanese prefectures as JP', () => {
    expect(guessCountry('東京都港区', '')).toBe('JP');
    expect(guessCountry('大阪府大阪市', '')).toBe('JP');
    expect(guessCountry('滋賀県東近江市', '')).toBe('JP');
  });

  it('never classifies prefecture-less Japanese addresses as CN', () => {
    // 市/村 alone must not be treated as a China signal
    expect(['JP', 'unknown']).toContain(guessCountry('横浜市中区', ''));
    expect(['JP', 'unknown']).toContain(guessCountry('東近江市八日市', ''));
    expect(['JP', 'unknown']).toContain(guessCountry('八王子市', ''));
    expect(['JP', 'unknown']).toContain(guessCountry('〇〇村〇〇番地', ''));
  });

  it('classifies explicit Chinese addresses as CN', () => {
    expect(guessCountry('江西省吉安市', '')).toBe('CN');
    expect(guessCountry('深圳市, 广东省, CN', '')).toBe('CN');
    expect(guessCountry('吉水县八都镇', '')).toBe('CN');
  });

  it('classifies explicit JP markers as JP', () => {
    expect(guessCountry('中央区銀座1-2-3 Japan', '')).toBe('JP');
  });

  it('does not let a loose 日本 mention override CN evidence', () => {
    expect(
      guessCountry('吉水县八都镇坛上自然村10号 吉安市 江西 331600 CN 日本語対応可能', ''),
    ).toBe('CN');
    expect(guessCountry('中国 広東省深圳市 日本国内配送', '')).toBe('CN');
    // 「日本語」だけでは JP の証拠にならない
    expect(guessCountry('日本語対応スタッフ在籍', '')).toBe('unknown');
  });

  it('falls back to unknown when nothing matches', () => {
    expect(guessCountry('somewhere', '')).toBe('unknown');
  });
});

describe('parseSellerText country integration', () => {
  it('does not misclassify a Japanese seller as CN', () => {
    const parsed = parseSellerText(
      '店舗名: 東京デジタル\n住所: 横浜市中区1-2-3\n運営責任者名: John Smith',
    );
    expect(parsed.countryGuess).not.toBe('CN');
  });
});
