export interface Work {
  id: string;
  name: string;
  color: string;
  tagline: string;
  appid?: string;
  icon?: string;
  screenshot?: string;
  country?: string;
  personal?: boolean;
  description: string;
}

export const works: Work[] = [
  {
    id: 'aurastudio',
    name: 'AuraStudio',
    color: 'FF4D8D',
    tagline: 'AI portraits, perfected',
    appid: 'id6757937783',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/d1/ef/08/d1ef0833-7ad0-ac4e-1604-0c7dc6a9a660/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg',
    screenshot:
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/fe/84/59/fe84590f-2700-5543-8efc-9d2a8d133325/1314.png/600x1300bb.png',
    description:
      'A few selfies in, cinematic AI portraits out. 30+ story templates, studio-quality results, and a free portrait every single day.',
  },
  {
    id: 'callguard',
    name: 'CallGuard',
    color: '3B82F6',
    tagline: 'Spam stops here',
    appid: 'id6757877028',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/83/73/f5/8373f536-5321-5920-19d9-aee9fa5f0130/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.jpg',
    screenshot:
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/90/5e/14/905e14d5-6a34-37cb-7ab6-9bc3a2432f08/01-hero-1320x2868.png/600x1300bb.jpg',
    description:
      'Blocks unwanted calls at the system level, before your phone even rings. No pre-loaded lists — you decide what gets through.',
  },
  {
    id: 'sorenson-forum',
    name: 'Sorenson Forum',
    color: '7FBEFA',
    tagline: 'Every voice heard',
    appid: 'id1612322502',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/85/f0/64/85f064ac-2bf9-774f-c46e-3e7c72ea7e50/AppIcon-0-0-1x_U007epad-0-1-0-85-220.jpeg/512x512bb.jpg',
    screenshot:
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/b3/6c/ff/b36cff0b-6c76-995c-934c-173018079a1d/6_7-1.jpg/600x1300bb.jpg',
    description:
      'Live interpreting for meetings, lectures and events. Create a session, invite guests, and converse across any language.',
  },
  {
    id: 'qoach',
    name: 'Qoach',
    color: '6D21D9',
    tagline: 'Get fit at home',
    appid: 'id650627810',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/0d/a9/22/0da92261-54be-cf13-5fae-a83dfd5ed950/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg',
    screenshot:
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource124/v4/db/f4/0d/dbf40d26-27b0-287a-f775-0c635c6dae97/588687af-11d0-4625-9bb4-fa988fff56a2_iPhone_8_Plus-0_home_framed.png/600x1300bb.png',
    description:
      'HIIT programs designed hand in hand with a certified coach. Cardio, strengthening, weight training — no equipment needed.',
  },
  {
    id: 'looq',
    name: 'Looq',
    color: '8964BD',
    tagline: 'AI-powered filters',
    appid: 'id1159704664',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple112/v4/19/3d/30/193d30ab-696c-7b33-6c5d-5d8e5da9c979/AppIcon-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg',
    screenshot:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/1f/d4/4f/1fd44f2a-e4d9-1de2-257c-cfb84cb6b567/pr_source.png/600x1300bb.png',
    description:
      'Neural style transfer running on-device, turning photos and videos from your iPhone into striking artworks.',
  },
  {
    id: 'qonceal',
    name: 'Qonceal',
    color: '90D1FF',
    tagline: 'Your smart vault',
    appid: 'id1478637915',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple114/v4/83/0a/97/830a975f-e3b6-1414-7ea4-944da77ef69e/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
    screenshot:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/36/51/00/36510002-6266-fdea-3447-9058834c56e2/pr_source.png/600x1300bb.png',
    description:
      'Private photos and videos locked behind Face ID — with on-device AI that detects and imports sensitive images automatically.',
  },
  {
    id: 'flamingo',
    name: 'Flamingo',
    color: 'F05E32',
    tagline: 'Hacker News, minimal',
    appid: 'id817164332',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/a9/fe/96/a9fe96cf-edb1-38fc-ede4-de919c42ed35/AppIcon-0-0-1x_U007emarketing-0-6-0-85-220.png/512x512bb.jpg',
    screenshot:
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource124/v4/47/2b/8c/472b8ccf-d261-f3fa-103e-7e7a61318c49/66ecf222-27ee-49ed-8a56-935055118cf3_iPhone_8_Plus-0_top_framed.png/600x1300bb.png',
    description:
      'A minimalist reader for Hacker News, released as an open-source project on GitHub.',
  },
  {
    id: 'cyqle',
    name: 'Cyqle',
    color: '32DB4F',
    tagline: 'Handy and esthetic app to use veloStar in Rennes',
    appid: 'id1212133334',
    description:
      "This is the second app developped under Monoqle's name. We expect to open it to more and more city in the upcoming months!",
  },
  {
    id: 'vero',
    name: 'Vero',
    color: '20788C',
    tagline: 'True social',
    appid: 'id971055041',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d7/b5/fb/d7b5fb69-7c05-2c93-51f4-7c81b1531b5a/AppIcon-0-1x_U007emarketing-0-8-0-0-0-85-220-0.png/512x512bb.jpg',
    screenshot:
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/94/f8/28/94f82829-1ca8-7cec-3352-004ba54a8e5f/73110a65-70fc-41bd-99bf-adc269ed31af_iPhone_8_Plus-01_Stream.png/600x1300bb.png',
    description:
      'Ad-free, algorithm-free social network. I contributed as an iOS developer within an awesome team spread around the world.',
  },
  {
    id: 'pilot',
    name: 'Pilot Speech Translator',
    color: '1B86FC',
    tagline: 'A World Without Language Barriers',
    appid: 'id1179122763',
    description:
      'The Pilot speech translation app allows users to translate between languages in two ways: speaking or texting, depending on the languages',
  },
  {
    id: 'happywait',
    name: 'Happywait',
    color: 'FF6457',
    tagline: 'Connect real estate developers to buyers',
    description:
      'Happywait connects real estate developers and individuals who buy off plan their house or apartment',
  },
  {
    id: 'qolor',
    name: 'Qolor',
    color: '8279C8',
    tagline: 'Fast & fun color grabber',
    appid: 'id973492333',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/40/7e/96/407e965b-673d-887d-6eb3-c7e7225cd681/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg',
    screenshot:
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource114/v4/33/3e/89/333e898d-8305-42a2-ba2a-916cbf116ca0/bf7ff594-b65e-405a-8d12-94372c6903fd_Screenshot_1.jpg/600x1300bb.jpg',
    description:
      'The fastest way to identify and save the colors around you. First app shipped under Monoqle — from idea to App Store in under a month.',
  },
  {
    id: 'nw2',
    name: 'Nice Weather 2',
    color: 'C6A0B7',
    tagline: 'The weather, simply gorgeous',
    appid: 'id729430189',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple124/v4/4a/c8/f1/4ac8f1d3-7414-bfd9-b088-3e9e3159fcf1/AppIcon-0-1x_U007emarketing-0-85-220-0-6.png/512x512bb.jpg',
    screenshot:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple118/v4/23/17/91/23179171-4879-8fd2-de54-878e17c263c4/mzl.qrmdgfzi.jpg/600x1300bb.jpg',
    description:
      'A clean, simple way to check the forecast. Featured multiple times by Apple and praised for its design — 250,000+ downloads.',
  },
  {
    id: 'mk2',
    name: 'mk2',
    color: '5B8DEF',
    tagline: 'Une autre idée du cinéma',
    appid: 'id515951296',
    country: 'fr',
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/1f/ae/61/1fae6122-7551-1e72-9f82-2495af63c159/AppIcon-0-0-1x_U007ephone-0-1-0-85-220.png/512x512bb.jpg',
    screenshot:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/22/72/4a/22724ad7-31ce-84c4-96af-3e4deeb82086/pr_source.png/600x1300bb.png',
    description:
      'Showtimes, geolocated screenings and ticket booking for the entire mk2 cinema network in Paris — right from your pocket.',
  },
];
