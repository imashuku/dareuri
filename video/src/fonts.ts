import { loadFont as loadSans } from '@remotion/google-fonts/NotoSansJP';
import { loadFont as loadMincho } from '@remotion/google-fonts/ShipporiMincho';

loadSans('normal', { weights: ['400', '500', '700', '800'], subsets: ['latin'] });
loadMincho('normal', { weights: ['700'], subsets: ['latin'] });
