export interface Website {
  url: string;
  name: string;
  tagline: string;
  color: string;
  description: string;
  icon?: string;
  image?: string;
  discontinued?: boolean;
  archive_url?: string;
}

export const websites: Website[] = [
  {
    url: 'surfaceable.ai',
    name: 'Surfaceable',
    tagline: 'AI brand visibility',
    color: '6C5CE7',
    description:
      'Consultancy that surfaces where your brand drops out of multi-turn AI conversations across ChatGPT, Claude and Gemini — tracking revenue, not vanity scores.',
    icon: 'https://surfaceable.ai/icon-512.png',
    image: 'https://surfaceable.ai/og.png',
  },
  {
    url: 'airglowai.com',
    name: 'Airglow',
    tagline: 'Listing photos that book',
    color: '38BDF8',
    description:
      'AI photo enhancer for Airbnb hosts. Import listing photos, edit with generative AI, and download polished versions ready to boost bookings.',
    icon: 'https://airglowai.com/android-chrome-512x512.png',
    image: 'https://airglowai.com/opengraph-image?8b6af11bf9c0134f',
  },
  {
    url: 'linglo.me',
    name: 'Linglo',
    tagline: 'Teach languages, independently',
    color: '34D399',
    description:
      'A free teaching platform for independent language teachers — interactive lessons and personalized learning paths.',
    image: 'https://linglo-me.vercel.app/preview.jpg',
  },
];
