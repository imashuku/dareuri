import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FONT_SANS, FPS, T } from './theme';
import { Rise, SceneFade, Title, Wordmark } from './parts';
import { OpeningQuestion } from './Dareuri';

// SNS用の30秒版。16:9 / 1:1 / 9:16 の3比率を同じ素材から出し分ける。
// レイアウトは useVideoConfig の width/height から比率を見て切り替える。
const A = (n: string) => staticFile(`assets/${n}`);
const V = (n: number) => staticFile(`audio-short/short-0${n}.wav`);

export const SHORT_SCENES = [
  { id: 1, sec: 5.98 },
  { id: 2, sec: 15.95 },
  { id: 3, sec: 7.26 },
] as const;

export const SHORT_TOTAL_FRAMES = Math.round(
  SHORT_SCENES.reduce((a, s) => a + s.sec, 0) * FPS,
);

function shortFrames(id: number) {
  const from = SHORT_SCENES.slice(0, id - 1).reduce((a, s) => a + s.sec, 0);
  const dur = SHORT_SCENES[id - 1].sec;
  return { from: Math.round(from * FPS), durationInFrames: Math.round(dur * FPS) };
}

// 縦長かどうか（9:16判定）。レイアウトの向きを決める唯一の分岐。
function useAspect() {
  const { width, height } = useVideoConfig();
  const r = width / height;
  return { portrait: r < 0.85, square: r >= 0.85 && r < 1.2, wide: r >= 1.2, width, height };
}

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: T.canvas,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </AbsoluteFill>
);

// 縦・正方向けの下部テロップ。横位置いっぱい、下からの距離を比率で変える。
const ShortCaption: React.FC<{ children: React.ReactNode; bottom: number }> = ({
  children,
  bottom,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom,
      display: 'flex',
      justifyContent: 'center',
      padding: '0 6%',
    }}
  >
    <div
      style={{
        fontFamily: FONT_SANS,
        fontSize: 30,
        fontWeight: 500,
        color: T.onDark,
        background: 'rgba(24,23,21,0.88)',
        padding: '16px 32px',
        borderRadius: 12,
        textAlign: 'center',
        lineHeight: 1.55,
      }}
    >
      {children}
    </div>
  </div>
);

// 2: 実演。録画は12.84秒。シーン尺15.95秒に合わせて0.805倍速。
// 判定結果は録画8.6秒地点 = シーン内10.7秒 = フレーム320。
const RESULT_FRAME = 320;

const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { portrait, square, width } = useAspect();
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionOpacity = interpolate(
    frame,
    [0, 10, RESULT_FRAME - 40, RESULT_FRAME - 10],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // 録画は横長(1280x800)。横長比率はそのまま大きく置ける。
  // 縦・正方では、録画をズームしてビューポートに“充満”させ、結果が出る手前で
  // 判定カードのある右側へゆっくり寄る（狭い画面でも中身が読めるように）。
  const wide = !portrait && !square;
  if (wide) {
    return (
      <Stage>
        <div
          style={{
            opacity,
            width: Math.min(1520, width * 0.82),
            borderRadius: 20,
            overflow: 'hidden',
            border: `1px solid ${T.hairline}`,
            boxShadow: '0 30px 70px rgba(20,20,19,0.18)',
            background: '#fff',
          }}
        >
          <OffthreadVideo
            src={A('demo-check.mp4')}
            playbackRate={0.805}
            muted
            style={{ width: '100%', display: 'block' }}
          />
        </div>
        <div style={{ opacity: captionOpacity }}>
          <ShortCaption bottom={90}>
            貼り付けるだけ。9つの観点で整理し、3段階の確認レベルで示します
          </ShortCaption>
        </div>
      </Stage>
    );
  }

  // 縦・正方: 縦向きに撮り直した録画(900x1400)を使う。サイト自体が縦レイアウトで
  // 表示されているので、cropせずそのまま大きく置ける。
  // 録画10.4秒（貼付t=1・結果t=7）をシーン15.95秒に 0.652倍速で引き伸ばす。
  const shotW = portrait ? width * 0.9 : width * 0.6;
  return (
    <Stage>
      <div
        style={{
          opacity,
          width: shotW,
          maxHeight: portrait ? '78%' : '86%',
          borderRadius: 18,
          overflow: 'hidden',
          border: `1px solid ${T.hairline}`,
          boxShadow: '0 24px 60px rgba(20,20,19,0.18)',
          background: '#fff',
        }}
      >
        <OffthreadVideo
          src={A('demo-check-tall.mp4')}
          playbackRate={0.652}
          muted
          style={{ width: '100%', display: 'block' }}
        />
      </div>
      <div style={{ opacity: captionOpacity }}>
        <ShortCaption bottom={portrait ? 150 : 60}>
          貼り付けるだけ。9つの観点で確認レベルを示します
        </ShortCaption>
      </div>
    </Stage>
  );
};

// 3: 締め。縦は縦積み、横・正方は横並び。QRは実寸のまま。
const Closing: React.FC = () => {
  const { portrait } = useAspect();
  return (
    <Stage>
      <div style={{ display: 'grid', gap: 30, justifyItems: 'center' }}>
        <Rise>
          <Wordmark size={portrait ? 88 : 100} />
        </Rise>
        <Rise delay={10}>
          <Title size={portrait ? 44 : 42}>
            {portrait ? (
              <>
                ポチる前に、
                <br />
                販売元を3秒チェック。
              </>
            ) : (
              'ポチる前に、販売元を3秒チェック。'
            )}
          </Title>
        </Rise>
        <Rise delay={20}>
          <div
            style={{
              display: 'flex',
              flexDirection: portrait ? 'column' : 'row',
              alignItems: 'center',
              gap: portrait ? 22 : 34,
              marginTop: 16,
            }}
          >
            <div
              style={{
                padding: 12,
                background: '#ffffff',
                border: `1px solid ${T.hairline}`,
                borderRadius: 14,
                display: 'flex',
              }}
            >
              <img
                src={A('qr-dareuri.png')}
                width={296}
                height={296}
                style={{ display: 'block', imageRendering: 'pixelated' }}
                alt=""
              />
            </div>
            <div
              style={{
                display: 'grid',
                gap: 12,
                justifyItems: portrait ? 'center' : 'start',
              }}
            >
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 32,
                  fontWeight: 700,
                  color: T.onPrimary,
                  background: T.primary,
                  padding: '18px 40px',
                  borderRadius: 14,
                }}
              >
                dareuri.app
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 21, color: T.muted }}>
                無料・登録不要。QRからすぐ開けます。
              </div>
            </div>
          </div>
        </Rise>
      </div>
    </Stage>
  );
};

// 冒頭は長尺版と同じカット（Dareuri.tsx から共有）。中身が中央グリッドなので
// どの比率でもそのまま収まる。
const SCENE_COMPONENTS = [OpeningQuestion, Demo, Closing];

export const DareuriShort: React.FC = () => (
  <AbsoluteFill style={{ background: T.canvas }}>
    {SCENE_COMPONENTS.map((C, i) => {
      const id = i + 1;
      const { from, durationInFrames } = shortFrames(id);
      return (
        <Sequence key={id} from={from} durationInFrames={durationInFrames}>
          <SceneFade
            durationInFrames={durationInFrames}
            last={id === SCENE_COMPONENTS.length}
          >
            <C />
          </SceneFade>
          <Audio src={V(id)} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
