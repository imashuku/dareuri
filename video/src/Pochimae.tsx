import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { FONT_SANS, FPS, SCENES, T, sceneFrames } from './theme';
import { Caption, Kicker, Rise, SceneFade, Shot, Sub, Title, Wordmark } from './parts';

const A = (n: string) => staticFile(`assets/${n}`);
const V = (n: number) => staticFile(`audio/scene-0${n}.wav`);

const Stage: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({
  children,
  dark,
}) => (
  <AbsoluteFill
    style={{
      background: dark ? T.surfaceDark : T.canvas,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </AbsoluteFill>
);

// 1: 問い
const S1: React.FC = () => (
  <Stage>
    <div style={{ textAlign: 'center', display: 'grid', gap: 30 }}>
      <Rise>
        <Sub>ネット通販で、</Sub>
      </Rise>
      <Rise delay={14}>
        <Title size={78}>
          「誰が売っているか」まで
          <br />
          確認していますか？
        </Title>
      </Rise>
    </div>
  </Stage>
);

// 2: 見落とされている販売元（実画面を大きく、寄りで）
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  // ゆっくり寄る（実画面の細部が見えてくる）
  const scale = interpolate(frame, [0, 300], [1.0, 1.09], {
    extrapolateRight: 'clamp',
  });
  return (
    <Stage>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 70,
          padding: '0 96px',
          marginBottom: 60,
        }}
      >
        <div style={{ width: 640, display: 'grid', gap: 26 }}>
          <Rise>
            <Title size={56} align="left">
              販売元は、
              <br />
              画面の隅に小さく。
            </Title>
          </Rise>
          <Rise delay={16}>
            <Sub align="left">
              そこを開いて所在地まで
              <br />
              確かめる人は、ほとんどいない。
            </Sub>
          </Rise>
        </div>
        <Rise delay={10} distance={40}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
            <Shot src={A('01-top.png')} width={780} height={720} />
          </div>
        </Rise>
      </div>
      <Caption>Amazonの「販売元」、開いたことはありますか</Caption>
    </Stage>
  );
};

// 3: ブランド提示
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [10, 34], [0, 460], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Stage>
      <div style={{ display: 'grid', gap: 26, justifyItems: 'center' }}>
        <Rise>
          <Kicker>AMAZON 販売元チェック</Kicker>
        </Rise>
        <Rise delay={8}>
          <Wordmark size={116} />
        </Rise>
        <div style={{ height: 3, width: line, background: T.primary }} />
        <Rise delay={22}>
          <Title size={44}>ポチる前に、販売元を3秒チェック。</Title>
        </Rise>
      </div>
    </Stage>
  );
};

// 4: 貼り付ける
const S4: React.FC = () => (
  <Stage>
    <div style={{ display: 'grid', gap: 34, justifyItems: 'center' }}>
      <Rise>
        <Kicker>STEP 1</Kicker>
      </Rise>
      <Rise delay={6}>
        <Title size={54}>販売元情報を、貼り付けるだけ。</Title>
      </Rise>
      <Rise delay={16} distance={40}>
        <Shot src={A('02-pasted.png')} width={900} height={520} />
      </Rise>
    </div>
    <Caption>「特定商取引法に基づく表記」をコピーして貼り付け</Caption>
  </Stage>
);

// 5: 何を見ているか（確認ポイント）
const S5: React.FC = () => {
  const items = [
    '所在地は日本国外ではないか',
    '店舗名は日本語なのに、責任者名はローマ字表記ではないか',
    '出荷元はAmazonでも、販売元は別の事業者ではないか',
  ];
  return (
    <Stage>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 76,
          padding: '0 110px',
        }}
      >
        <div style={{ flex: 1, display: 'grid', gap: 24 }}>
          <Rise>
            <Kicker>CHECK POINTS</Kicker>
          </Rise>
          {items.map((t, i) => (
            <Rise key={t} delay={10 + i * 12}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: 99,
                    background: T.primary,
                    marginTop: 13,
                    flex: 'none',
                  }}
                />
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 30,
                    color: T.ink,
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  {t}
                </div>
              </div>
            </Rise>
          ))}
        </div>
        <Rise delay={8} distance={40}>
          <Shot src={A('03-result-card.png')} width={560} height={660} />
        </Rise>
      </div>
    </Stage>
  );
};

// 6: 3段階の確認レベル
const S6: React.FC = () => {
  const levels = [
    { label: '要確認', note: '確認したい点が複数あります', c: T.levelHighFg, bg: T.levelHighBg, b: T.levelHighBorder },
    { label: '追加確認', note: 'もう一歩の確認を', c: '#6f540a', bg: '#faf3da', b: '#d4a017' },
    { label: '目立つ懸念なし', note: '懸念は見つかりません', c: '#285f36', bg: '#e7f3e9', b: '#5db872' },
  ];
  return (
    <Stage>
      <div style={{ display: 'grid', gap: 44, justifyItems: 'center' }}>
        <Rise>
          <Title size={52}>3段階の確認レベルで整理します。</Title>
        </Rise>
        <div style={{ display: 'flex', gap: 30 }}>
          {levels.map((l, i) => (
            <Rise key={l.label} delay={12 + i * 10} distance={34}>
              <div
                style={{
                  width: 400,
                  padding: '38px 34px',
                  borderRadius: 18,
                  background: l.bg,
                  border: `2px solid ${l.b}`,
                  display: 'grid',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 40,
                    fontWeight: 800,
                    color: l.c,
                  }}
                >
                  {l.label}
                </div>
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 22,
                    color: l.c,
                    lineHeight: 1.5,
                  }}
                >
                  {l.note}
                </div>
              </div>
            </Rise>
          ))}
        </div>
        <Rise delay={44}>
          <Sub>真贋を言い当てるのではなく、確認する材料を並べます。</Sub>
        </Rise>
      </div>
    </Stage>
  );
};

// 7: 3つの入口
const S7: React.FC = () => {
  const ways = [
    { n: '01', t: '貼り付ける', s: 'ブラウザで3秒' },
    { n: '02', t: 'ブックマークレット', s: '商品ページで1クリック' },
    { n: '03', t: 'iPhoneの共有シート', s: 'Safariから直接' },
  ];
  return (
    <Stage>
      <div style={{ display: 'grid', gap: 46, justifyItems: 'center' }}>
        <Rise>
          <Title size={52}>使い方は、3つ。</Title>
        </Rise>
        <div style={{ display: 'flex', gap: 28 }}>
          {ways.map((w, i) => (
            <Rise key={w.n} delay={10 + i * 12} distance={34}>
              <div
                style={{
                  width: 400,
                  padding: '40px 34px',
                  borderRadius: 18,
                  background: T.surfaceCard,
                  display: 'grid',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    color: T.primaryActive,
                  }}
                >
                  {w.n}
                </div>
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 34,
                    fontWeight: 700,
                    color: T.ink,
                    lineHeight: 1.35,
                  }}
                >
                  {w.t}
                </div>
                <div
                  style={{ fontFamily: FONT_SANS, fontSize: 22, color: T.muted }}
                >
                  {w.s}
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// 8: 無料・プライバシー
const S8: React.FC = () => (
  <Stage dark>
    <div style={{ display: 'grid', gap: 34, justifyItems: 'center' }}>
      <Rise>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 62,
            fontWeight: 800,
            color: T.onDark,
            letterSpacing: '-0.02em',
          }}
        >
          無料・登録不要。
        </div>
      </Rise>
      <Rise delay={14}>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 30,
            color: T.onDarkSoft,
            lineHeight: 1.8,
            textAlign: 'center',
          }}
        >
          貼り付けた内容も、商品のURLも、
          <br />
          サーバーには残りません。
        </div>
      </Rise>
      <Rise delay={30}>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          {[
            '電話番号は送信前にマスク',
            'URLはブラウザの外に出ない',
            'ソースコード公開',
          ].map((t) => (
            <div
              key={t}
              style={{
                fontFamily: FONT_SANS,
                fontSize: 21,
                color: T.onDarkSoft,
                border: `1px solid ${T.onDarkSoft}55`,
                borderRadius: 10,
                padding: '12px 22px',
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </Rise>
    </div>
    <Caption onDark>無料・登録不要／サーバーに残りません</Caption>
  </Stage>
);

// 9: 締め
const S9: React.FC = () => (
  <Stage>
    <div style={{ display: 'grid', gap: 28, justifyItems: 'center' }}>
      <Rise>
        <Wordmark size={104} />
      </Rise>
      <Rise delay={10}>
        <Title size={44}>ポチる前に、販売元を3秒チェック。</Title>
      </Rise>
      <Rise delay={22}>
        <div
          style={{
            marginTop: 18,
            fontFamily: FONT_SANS,
            fontSize: 34,
            fontWeight: 700,
            color: T.onPrimary,
            background: T.primary,
            padding: '20px 46px',
            borderRadius: 14,
          }}
        >
          pochimae.vercel.app
        </div>
      </Rise>
      <Rise delay={34}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 20, color: T.muted, marginTop: 10 }}>
          ステップアウトマーケティング合同会社
        </div>
      </Rise>
    </div>
  </Stage>
);

const SCENE_COMPONENTS = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

export const PochimaeHowTo: React.FC = () => (
  <AbsoluteFill style={{ background: T.canvas }}>
    {SCENE_COMPONENTS.map((C, i) => {
      const id = i + 1;
      const { from, durationInFrames } = sceneFrames(id);
      return (
        <Sequence key={id} from={from} durationInFrames={durationInFrames}>
          <SceneFade durationInFrames={durationInFrames}>
            <C />
          </SceneFade>
          <Audio src={V(id)} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

export { FPS, SCENES };
