export interface Home {
  name: string;
  location: string;
  description?: string;
  image: string;
  photos?: string[];
  url: string;
}

export const homes: Home[] = [
  {
    name: 'Horizonte 33',
    location: 'Hércules, Querétaro · Mexico',
    description:
      'A serene two-bedroom retreat dressed in soft linens and quiet light. Wake up unhurried, cook in a fully-equipped kitchen, and watch the city lights over Hércules from the loggia. Shared pool, gym, and casa club.',
    image: '/horizonte33/assets/images/living-view.jpg',
    photos: [
      '/horizonte33/assets/images/bedroom-queen.jpg',
      '/horizonte33/assets/images/living-kitchen.jpg',
      '/horizonte33/assets/images/pool-sunset.jpg',
      '/horizonte33/assets/images/cover-view.jpg',
    ],
    url: 'https://www.airbnb.com/h/horizonte33',
  },
  {
    name: 'Zen in Rennes',
    location: 'Rennes · France',
    description:
      'A calm, light-filled apartment in the heart of Rennes. A quiet workspace with a screen lets you work at your own pace, and cozy corners make you feel right at home.',
    image: '/zen-in-rennes/listing-photos/photo-01.jpg',
    photos: [
      '/zen-in-rennes/listing-photos/photo-02.jpg',
      '/zen-in-rennes/listing-photos/photo-05.jpg',
      '/zen-in-rennes/listing-photos/photo-08.jpg',
      '/zen-in-rennes/listing-photos/photo-11.jpg',
    ],
    url: 'https://www.airbnb.com/h/zen-in-rennes',
  },
];
