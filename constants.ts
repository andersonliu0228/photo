import { Era } from './types';

export const ERAS: Era[] = [
  {
    id: 'victorian',
    name: 'Victorian London',
    description: 'Steampunks, top hats, and foggy streets.',
    prompt: 'Transform this person into a Victorian aristocrat in 1890s London. Wear elegant period clothing, top hat or bonnet, foggy cobblestone street background, sepia tone, photorealistic, keep facial identity.',
    imagePlaceholder: 'https://picsum.photos/id/1060/400/300'
  },
  {
    id: 'cyberpunk',
    name: 'Neo Tokyo 3000',
    description: 'Neon lights, cybernetics, and rain.',
    prompt: 'Transform this person into a cyberpunk character in Neo Tokyo year 3000. Glowing neon accents, futuristic techwear, rainy neon city background, cinematic lighting, photorealistic, keep facial identity.',
    imagePlaceholder: 'https://picsum.photos/id/1067/400/300'
  },
  {
    id: 'egypt',
    name: 'Ancient Egypt',
    description: 'Pharaohs, pyramids, and golden sands.',
    prompt: 'Transform this person into an Ancient Egyptian noble. Gold jewelry, linen robes, desert and pyramids background, warm sunlight, photorealistic, keep facial identity.',
    imagePlaceholder: 'https://picsum.photos/id/1040/400/300'
  },
  {
    id: 'wildwest',
    name: 'Wild West',
    description: 'Cowboys, saloons, and dusty trails.',
    prompt: 'Transform this person into a Wild West outlaw or sheriff. Cowboy hat, leather vest, dusty saloon background, rugged style, photorealistic, keep facial identity.',
    imagePlaceholder: 'https://picsum.photos/id/1043/400/300'
  },
  {
    id: 'roaring20s',
    name: 'Roaring 20s',
    description: 'Jazz, flappers, and art deco.',
    prompt: 'Transform this person into a 1920s jazz age icon. Art deco style, flapper dress or tuxedo, Gatsby party background, black and white or vintage color, photorealistic, keep facial identity.',
    imagePlaceholder: 'https://picsum.photos/id/1011/400/300'
  },
  {
    id: 'medieval',
    name: 'Medieval Knight',
    description: 'Castles, armor, and epic quests.',
    prompt: 'Transform this person into a Medieval knight or royal. Shining armor or velvet robes, stone castle background, dramatic lighting, photorealistic, keep facial identity.',
    imagePlaceholder: 'https://picsum.photos/id/1036/400/300'
  }
];

export const MAX_HISTORY = 10;