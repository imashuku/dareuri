import './fonts';
import React from 'react';
import { Composition } from 'remotion';
import { PochimaeHowTo } from './Pochimae';
import { FPS, TOTAL_FRAMES } from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="PochimaeHowTo"
    component={PochimaeHowTo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
