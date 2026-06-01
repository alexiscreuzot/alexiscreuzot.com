export interface CommunityItem {
  type: string;
  title: string;
  emoji: string;
  link: string;
}

export const community: CommunityItem[] = [
  {
    type: 'library',
    title: 'SwiftyGif : High performance & easy to use Gif engine (Swift)',
    emoji: '📦',
    link: 'https://github.com/kirualex/SwiftyGif',
  },
  {
    type: 'library',
    title: 'KAPinField : Lightweight pin code field library (Swift)',
    emoji: '📦',
    link: 'https://github.com/kirualex/KAPinField',
  },
  {
    type: 'library',
    title:
      'KAProgressLabel : Circular progress label with styling, animations, interaction and more (Objective-C)',
    emoji: '📦',
    link: 'https://github.com/kirualex/KAProgressLabel',
  },
  {
    type: 'talk',
    title: "CoreML : Everyone's an Artist",
    emoji: '💬',
    link: 'https://www.youtube.com/watch?v=pn04DDFrX_U',
  },
  {
    type: 'article',
    title: 'Reducing Core ML 2 Model Size by 4X Using Quantization in iOS 12',
    emoji: '📰',
    link: 'https://medium.com/@alexiscreuzot/expanding-uitableview-cells-using-only-constraints-in-swift-f40b13206ea3',
  },
  {
    type: 'article',
    title: 'Building a Neural Style Transfer app on iOS with PyTorch and CoreML',
    emoji: '📰',
    link: 'https://medium.com/@alexiscreuzot/building-a-neural-style-transfer-app-on-ios-with-pytorch-and-coreml-76e00cd14b28',
  },
  {
    type: 'article',
    title: 'Expanding UITableView cells using only constraints in Swift',
    emoji: '📰',
    link: 'https://medium.com/@alexiscreuzot/expanding-uitableview-cells-using-only-constraints-in-swift-f40b13206ea3',
  },
  {
    type: 'article',
    title: "iOS : Let's Build a Network Abstraction Layer",
    emoji: '📰',
    link: 'https://medium.com/learning-swift/ios-let-s-build-a-network-abstraction-layer-6133ae60d143',
  },
];
