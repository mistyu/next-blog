import type { FC } from 'react';

import { Suspense } from 'react';

import { homeConfig } from '@/config/home';

import { FadeInMotion } from '../motion/fadeIn';
// import { FadeInMotion } from '../motion/fadeIn';
// import { TypedText } from '../text/typed';
import { HomeBackground } from './background';
import { HomeWelcomeCard } from './cards/welcome';
import { HomeBlock, HomeContainer } from './container';
import { HomeSeketon } from './skeleton';
import $styles from './style.module.css';
import { HomeTimeline } from './timeline';
const { welcome, timeline } = homeConfig;
export const Home: FC = () => (
  <>
    <HomeBackground />
    <Suspense fallback={<HomeSeketon />}>
      <div className={$styles.home}>
        {welcome && (
          <HomeContainer>
            {welcome && (
              <HomeBlock>
                <FadeInMotion>
                  <HomeWelcomeCard {...welcome} />
                </FadeInMotion>
              </HomeBlock>
            )}
          </HomeContainer>
        )}
        {timeline && (
          <HomeContainer>
            <div className="tw-h-full tw-w-full">
              <HomeTimeline data={timeline} />
            </div>
          </HomeContainer>
        )}
      </div>
    </Suspense>
  </>
);
