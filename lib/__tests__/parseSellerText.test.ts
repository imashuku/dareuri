import { describe, expect, it } from 'vitest';
import { guessCountry, parseSellerText } from '../parseSellerText';
import { evaluate } from '../rules';

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

describe('parseSellerText rating count', () => {
  it('parses 評価: (1,234件)', () => {
    const parsed = parseSellerText('評価: (1,234件)');
    expect(parsed.ratingCount).toBe(1234);
  });

  it('parses 評価： （1,234件） with full-width punctuation', () => {
    const parsed = parseSellerText('評価： （1,234件）');
    expect(parsed.ratingCount).toBe(1234);
  });

  it('still parses the older (1,234件の評価) form', () => {
    const parsed = parseSellerText('(1,234件の評価)');
    expect(parsed.ratingCount).toBe(1234);
  });

  it('does not treat non-rating counts as ratingCount', () => {
    const parsed = parseSellerText('在庫: 1,234件\n販売実績 5,678件');
    expect(parsed.ratingCount).toBeUndefined();
  });

  it('parses a positive rating percent without inventing a count', () => {
    const parsed = parseSellerText('過去12か月間で90%が肯定的');
    expect(parsed.ratingPercent).toBe(90);
    expect(parsed.ratingCount).toBeUndefined();
  });

  it('does not treat 低評価/高評価/総評価 counts as ratingCount even with a high percent', () => {
    for (const label of ['低評価', '高評価', '総評価'] as const) {
      const parsed = parseSellerText(`${label}: (123件)\n過去12か月間で90%が肯定的`);
      expect(parsed.ratingCount, label).toBeUndefined();
      expect(parsed.ratingPercent, label).toBe(90);
    }
  });

  it('does not award good_seller_rating for a 低評価 count with a high percent', () => {
    const input = [
      '店舗名: Example',
      '低評価: (123件)',
      '過去12か月間で90%が肯定的',
      '商品: USBメモリ',
    ].join('\n');
    const parsed = parseSellerText(input);
    expect(parsed.ratingCount).toBeUndefined();
    expect(parsed.ratingPercent).toBe(90);
    const result = evaluate(parsed);
    expect(result.flags.map((flag) => flag.id)).not.toContain('good_seller_rating');
    expect(result.signal).toBe('high');
  });

  it('parses a standalone 評価 label on a separate or indented line in both parenthesis styles', () => {
    expect(parseSellerText('店舗名: Example\n評価: (1,234件)').ratingCount).toBe(1234);
    expect(parseSellerText('店舗名: Example\n評価： （1,234件）').ratingCount).toBe(1234);
    expect(parseSellerText('  評価: (1,234件)').ratingCount).toBe(1234);
    expect(parseSellerText('\t評価： (1,234件)').ratingCount).toBe(1234);
    expect(parseSellerText('\u3000評価: （1,234件）').ratingCount).toBe(1234);
    expect(parseSellerText('(1,234件の評価)').ratingCount).toBe(1234);
  });
});
