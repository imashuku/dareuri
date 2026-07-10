import './fonts';
import React from 'react';
import { Composition } from 'remotion';
import { DareuriHowTo } from './Dareuri';
import { DareuriShort, SHORT_TOTAL_FRAMES } from './Short';
import { FPS, TOTAL_FRAMES } from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="DareuriHowTo"
      component={DareuriHowTo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    {/* SNS用の30秒版。同じ素材を3比率で出し分ける（レイアウトは比率で分岐） */}
    <Composition
      id="DareuriShort"
      component={DareuriShort}
      durationInFrames={SHORT_TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    {/* 1:1 タイムライン用 */}
    <Composition
      id="DareuriShortSquare"
      component={DareuriShort}
      durationInFrames={SHORT_TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1080}
    />
    {/* 9:16 リール/ショート用 */}
    <Composition
      id="DareuriShortVertical"
      component={DareuriShort}
      durationInFrames={SHORT_TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
