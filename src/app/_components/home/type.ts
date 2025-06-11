import type { HomeListCardType } from './cards/list';
import type { HomeVideoCardType } from './cards/video';
import type { HomeWelcomeCardType } from './cards/welcome';
import type { HomeTimelineType } from './timeline';

export interface HomePageConfig {
  welcome?: HomeWelcomeCardType;
  video?: HomeVideoCardType;
  list?: HomeListCardType;
  typed?: string[];
  timeline?: HomeTimelineType[];
}
