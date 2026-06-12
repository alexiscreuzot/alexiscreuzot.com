export interface CommunityItem {
  type: string;
  title: string;
  emoji: string;
  link: string;
}

export const community: CommunityItem[] = [
  {
    type: 'library',
    title: 'SwiftyGif',
    emoji: '📦',
    link: 'https://github.com/kirualex/SwiftyGif',
  },
  {
    type: 'library',
    title: 'KAPinField',
    emoji: '📦',
    link: 'https://github.com/kirualex/KAPinField',
  },
  {
    type: 'library',
    title: 'KAProgressLabel',
    emoji: '📦',
    link: 'https://github.com/kirualex/KAProgressLabel',
  },
  {
    type: 'talk',
    title: "CoreML: Everyone's an Artist",
    emoji: '💬',
    link: 'https://www.youtube.com/watch?v=pn04DDFrX_U',
  },
  {
    type: 'article',
    title: 'Core ML quantization',
    emoji: '📰',
    link: 'https://medium.com/@alexiscreuzot/expanding-uitableview-cells-using-only-constraints-in-swift-f40b13206ea3',
  },
  {
    type: 'article',
    title: 'Neural style transfer on iOS',
    emoji: '📰',
    link: 'https://medium.com/@alexiscreuzot/building-a-neural-style-transfer-app-on-ios-with-pytorch-and-coreml-76e00cd14b28',
  },
  {
    type: 'article',
    title: 'Expanding UITableView cells',
    emoji: '📰',
    link: 'https://medium.com/@alexiscreuzot/expanding-uitableview-cells-using-only-constraints-in-swift-f40b13206ea3',
  },
  {
    type: 'article',
    title: 'A network abstraction layer',
    emoji: '📰',
    link: 'https://medium.com/learning-swift/ios-let-s-build-a-network-abstraction-layer-6133ae60d143',
  },
];
