import type { BookletData } from '../types';

export const zenInRennes: BookletData = {
  meta: {
    slug: 'zen-in-rennes',
    title: 'Zen in Rennes · Guide',
    lang: 'fr',
    theme: 'zen-in-rennes',
    themeColor: '#101c1c',
    appleMobileWebAppTitle: 'Zen in Rennes',
    toolbar: { prefix: 'Zen in ', emphasis: 'Rennes', suffix: ' · Guide' },
    mark: { prefix: 'Zen in ', emphasis: 'Rennes' },
    storagePrefix: 'zr',
    wifi: { ssid: 'ZenInRennes', pass: 'welcomehome', type: 'WPA' },
    wifiSvg: 'assets/wifi.svg',
    strings: {
      connect: 'Connect',
      joinNetwork: 'Rejoindre le réseau',
      copyPassword: 'Copier le mot de passe',
      passwordCopied:
        'Mot de passe copié — Réglages → Wi‑Fi → ZenInRennes · Password copied — Settings → Wi‑Fi → ZenInRennes',
      networkCopied: 'Réseau copié · Network copied',
      legacyCopyFallback: 'ZenInRennes · welcomehome',
      androidHint:
        'Confirmez dans la fenêtre du système.<span class="es">Confirm in the system prompt.</span>',
      iosHint:
        'Scannez le QR avec l\u2019Appareil photo, ou copiez le mot de passe → Wi‑Fi.<span class="es">Scan the QR with Camera, or copy the password → Wi‑Fi.</span>',
      defaultHint:
        'Scannez le QR ou copiez le mot de passe, puis choisissez ZenInRennes.<span class="es">Scan the QR or copy the password, then choose ZenInRennes.</span>',
    },
  },
  slides: [
    {
      type: 'cover',
      slug: '01-cover',
      kicker: 'Rennes · Bretagne',
      title: 'Zen in Rennes',
      bg: 'listing-photos/photo-08.jpg',
      features: [
        { icon: 'bed-double', html: '1 chambre · 1 bedroom' },
        { icon: 'sofa', html: 'Canapé-lit · Sofa bed' },
        { icon: 'square-parking', html: 'Parking inclus · Parking' },
        { icon: 'monitor', html: 'Coin travail · Work corner' },
        { icon: 'trees', html: 'Vue sur le Mail · Park view' },
      ],
    },
    {
      type: 'welcome',
      slug: '02-welcome',
      kicker: 'Un mot de vos hôtes · A note from your hosts',
      title: 'Bienvenue <span class="es">/ Welcome</span>',
      photo: 'listing-photos/photo-01.jpg',
      photoAlt: 'Balcon avec vue sur le Mail',
      intro:
        'Bonjour — nous sommes Alexis &amp; Carolina, et nous sommes ravis de vous accueillir. Ce petit guide vous aidera à vous installer et à profiter au mieux de l\'appartement. <span class="es">Hi — we\'re Alexis &amp; Carolina, and we\'re delighted to have you. This short guide will help you settle in and make the most of the apartment.</span>',
      aside:
        'Nous restons joignables par message sur Airbnb pendant tout votre séjour. <span class="es">We\'re just a message away on Airbnb throughout your stay.</span>',
      hostsLabel: 'Vos hôtes · Your hosts',
    },
    {
      type: 'facts',
      slug: '03-essentials',
      kicker: 'L\'essentiel · Essentials',
      title: 'En bref <span class="es">/ At a glance</span>',
      facts: [
        {
          icon: 'key-round',
          label: 'Arrivée · Check-in',
          value: '17:00',
          detail: 'Arrivée autonome · Self check-in',
        },
        {
          icon: 'log-out',
          label: 'Départ · Checkout',
          value: '11:00',
        },
        {
          icon: 'building-2',
          label: 'Étage · Floor',
          value: '1<sup>er</sup> étage',
          detail: 'Floor 1',
        },
        {
          icon: 'square-parking',
          label: 'Parking',
          value: 'Place n°42',
          detail: 'Sous-sol · Underground',
        },
        {
          icon: 'users',
          label: 'Voyageurs · Guests',
          value: 'Jusqu\'à 3',
          detail: '1 chambre + canapé-lit · 1 bed + sofa bed',
        },
        {
          icon: 'map-pin',
          label: 'Adresse · Address',
          value: '80 Mail F. Mitterrand',
          detail: '35000 Rennes · à côté du caviste "Le Vin Vivant"',
        },
      ],
    },
    {
      type: 'access',
      slug: '04-access',
      kicker: 'Comment entrer · Getting in',
      title: 'Votre arrivée <span class="es">/ Arriving home</span>',
      photo: 'listing-photos/photo-11.jpg',
      photoAlt: 'La résidence',
      photoCaption: '<i data-lucide="map-pin"></i> 80 Mail François Mitterrand',
      steps: [
        {
          title: 'Interphone <span class="es">· Intercom</span>',
          body: 'Sonnez à <b>CREUZOT</b> pour ouvrir la porte (poussez fort). Vous avez 30 s pour appeler l\'ascenseur, puis sélectionnez l\'étage <b>1</b>.<span class="es">Ring <b>CREUZOT</b> to open the door (push hard). You have 30 s to call the lift, then select floor <b>1</b>.</span>',
        },
        {
          title: 'Placard technique <span class="es">· Utility cupboard</span>',
          body: 'Au 1<sup>er</sup> étage, face à l\'ascenseur, ouvrez le placard technique.<span class="es">On floor 1, facing the lift, open the utility cupboard.</span>',
        },
        {
          title: 'Boîte à clé <span class="es">· Key box</span>',
          body: 'La boîte à clé est à l\'intérieur. Nous vous communiquons le code sur Airbnb.<span class="es">The key box is inside. We\'ll send you the code on Airbnb.</span>',
        },
        {
          title: 'La porte <span class="es">· The door</span>',
          body: 'L\'appartement est directement sur votre gauche. La clé s\'insère et se retire à l\'horizontale.<span class="es">The apartment is directly on your left. The key inserts and removes horizontally.</span>',
        },
      ],
      tipIcon: 'message-circle',
      tip: 'Nous envoyons les instructions détaillées le jour même sur Airbnb.<span class="es">We send detailed entry instructions on arrival day via Airbnb.</span>',
    },
    {
      type: 'wifi',
      slug: '05-wifi',
      kicker: 'Restez connecté · Stay connected',
      title: 'WiFi',
      note: 'Internet haut débit inclus.<br><span class="es">High-speed internet included.</span>',
      connectLabel: 'Se connecter',
      connectSecondary: '· Connect',
      scanLabel: 'Scanner <span class="es">· Scan</span>',
      ssidLabel: 'Réseau · Network',
      passLabel: 'Mot de passe · Password',
    },
    {
      type: 'gallery',
      slug: '06-the-home',
      kicker: 'Votre espace · Your space',
      title: 'L\'appartement <span class="es">/ The apartment</span>',
      compact: true,
      cells: [
        {
          src: 'listing-photos/photo-06.jpg',
          caption: 'Salon <span class="es">· Living room</span>',
        },
        {
          src: 'listing-photos/photo-02.jpg',
          caption: 'Chambre <span class="es">· Bedroom</span>',
        },
        {
          src: 'listing-photos/photo-03.jpg',
          caption: 'Cuisine <span class="es">· Kitchen</span>',
        },
        {
          src: 'listing-photos/photo-05.jpg',
          caption: 'Salle à manger <span class="es">· Dining room</span>',
        },
      ],
    },
    {
      type: 'photo',
      slug: 'office-photo',
      kicker: 'Télétravail · Work',
      title: 'Un coin bureau',
      subtitle:
        'Un espace calme avec écran pour travailler à votre rythme.<br><span class="es">A quiet corner with a monitor to work at your own pace.</span>',
      bg: 'listing-photos/photo-04.jpg',
      style: { titleSize: '72px', subtitleSize: '24px', subtitleMargin: '16px' },
    },
    {
      type: 'rows',
      slug: '07-parking',
      kicker: 'Votre voiture · Your car',
      title: 'Parking souterrain <span class="es">/ Underground parking</span>',
      rows: [
        {
          icon: 'badge',
          title: 'Télécommande · Remote',
          body: 'La télécommande du parking se trouve sur la tablette d\'entrée de l\'appartement.<span class="es">The parking remote is on the entry console in the apartment.</span>',
        },
        {
          icon: 'door-open',
          title: 'Entrée du parking · Entrance',
          body: 'Côté opposé de la résidence, au <b>4 rue Pré-du-Mail</b> (portail turquoise). Appuyez sur le bouton en haut à gauche de la télécommande.<span class="es">On the opposite side of the residence, at <b>4 rue Pré-du-Mail</b> (turquoise gate). Press the top-left button on the remote.</span>',
        },
        {
          icon: 'square-parking',
          title: 'Place n°42 · Spot 42',
          body: 'La large place en forme de triangle, directement face à vous après la rampe.<span class="es">The large triangle-shaped space, directly in front of you after the ramp.</span>',
        },
        {
          icon: 'arrow-up-down',
          title: 'Ascenseur &amp; badge · Lift &amp; badge',
          body: 'Au fond du parking (côté sud), derrière 2 portes (une bleue puis une blanche). <b>Le badge est nécessaire</b> pour appeler l\'ascenseur.<span class="es">At the far end (south side), behind 2 doors (blue then white). <b>The badge is required</b> to call the lift.</span>',
        },
      ],
    },
    {
      type: 'rows',
      slug: '08-kitchen',
      kicker: 'Manuel de la maison · House manual · 1 / 3',
      title: 'Cuisine &amp; électroménager <span class="es">/ Kitchen &amp; appliances</span>',
      rows: [
        {
          icon: 'utensils',
          title: 'Lave-vaisselle · Dishwasher',
          body: 'Bouton marche à gauche, puis sélectionnez un programme. Standard : n°1. La nuit : n°8 (silencieux).<span class="es">Power button on the left, then pick a program. Standard: No.1. At night: No.8 (silent).</span>',
        },
        {
          icon: 'washing-machine',
          title: 'Lave-linge · Washer',
          body: 'Bouton marche, puis tournez la molette centrale. Le séchoir se trouve dans la cuisine.<span class="es">Power on, then turn the central dial. The drying rack is in the kitchen.</span>',
        },
        {
          icon: 'flame',
          title: 'Cuisine · Cooking',
          body: 'Plaque à induction, four et micro-ondes ; tout le nécessaire est fourni.<span class="es">Induction hob, oven and microwave; everything you need is provided.</span>',
        },
        {
          icon: 'glass-water',
          title: 'Eau · Water',
          body: 'L\'eau du robinet est potable.<span class="es">Tap water is safe to drink.</span>',
        },
      ],
    },
    {
      type: 'rows',
      slug: '09-comfort',
      kicker: 'Manuel de la maison · House manual · 2 / 3',
      title: 'Confort &amp; quotidien <span class="es">/ Comfort &amp; everyday</span>',
      rows: [
        {
          icon: 'sofa',
          title: 'Canapé-lit · Sofa bed',
          body: 'Draps, coussins et couvertures sont dans le coffre de la méridienne. Glissez la partie basse vers vous, puis tirez sur la sangle pour monter le matelas.<span class="es">Sheets, cushions and blankets are in the chaise chest. Slide the lower part toward you, then pull the strap to raise the mattress.</span>',
        },
        {
          icon: 'lightbulb',
          title: 'Lumières d\'ambiance · Mood lights',
          body: 'Les ampoules de la chambre se gèrent avec la petite télécommande (boutons ❙ / O), sans l\'interrupteur. Couleur et intensité réglables.<span class="es">The bedroom lights are controlled with the small remote (❙ / O buttons), no wall switch. Color and brightness adjustable.</span>',
        },
        {
          icon: 'trash-2',
          title: 'Ordures · Trash',
          body: 'Local poubelle dans la cour, à côté de la grille du garage. Verre : benne au bout du Mail Mitterrand (~50 m).<span class="es">Bin room in the courtyard, next to the garage gate. Glass: container at the end of Mail Mitterrand (~50 m).</span>',
        },
      ],
    },
    {
      type: 'rows',
      slug: '10-tv',
      kicker: 'Manuel de la maison · House manual · 3 / 3',
      title: 'Télévision <span class="es">/ TV</span>',
      rows: [
        {
          icon: 'tv',
          title: 'Apple TV',
          body: 'Tout passe par l\'Apple TV : appuyez sur le bouton en haut à droite de la télécommande Apple pour afficher l\'accueil.<span class="es">Everything runs through the Apple TV: press the top-right button on the Apple remote to show the home screen.</span>',
        },
        {
          icon: 'radio',
          title: 'TV en direct · Live TV',
          body: 'Ouvrez l\'application Molotov pour la TNT en direct et les replays.<span class="es">Open the Molotov app for live French TV and replays.</span>',
        },
        {
          icon: 'clapperboard',
          title: 'Netflix',
          body: 'Ouvrez Netflix : vous êtes connecté sur un compte invité.<span class="es">Open Netflix: you\'re signed in to a guest account.</span>',
        },
      ],
    },
    {
      type: 'rows',
      slug: '11-transit',
      kicker: 'Se déplacer · Getting around',
      title: 'Transports <span class="es">/ Transit</span>',
      rows: [
        {
          icon: 'bus-front',
          title: 'Arrêt de bus · Bus stop',
          body: 'La résidence fait face à l\'arrêt "Chèques Postaux".<span class="es">The residence faces the "Chèques Postaux" stop.</span>',
        },
        {
          icon: 'train-front',
          title: 'Depuis la gare · From the station',
          body: 'Bus n°11 direction Vezin-le-Coquet (ZI Ouest).<span class="es">Bus 11 toward Vezin-le-Coquet (ZI Ouest).</span>',
        },
        {
          icon: 'route',
          title: 'Depuis République · From République',
          body: 'Bus C4, 11, 53, 54 ou 55.<span class="es">Bus C4, 11, 53, 54 or 55.</span>',
        },
        {
          icon: 'footprints',
          title: 'Centre-ville · City centre',
          body: 'À quelques minutes à pied le long du Mail et de la Vilaine.<span class="es">A few minutes\' walk along the Mail and the Vilaine.</span>',
        },
      ],
    },
    {
      type: 'rows',
      slug: '12-rules',
      kicker: 'Bon voisinage · Good neighbors',
      title: 'Règlement <span class="es">/ House rules</span>',
      rows: [
        {
          icon: 'party-popper',
          title: 'Pas de fête · No parties',
          body: 'Immeuble résidentiel calme — ni fêtes ni événements.<span class="es">Quiet residential building — no parties or events.</span>',
        },
        {
          icon: 'moon',
          title: 'Calme · Quiet hours',
          body: 'Merci de limiter le bruit après 22h.<span class="es">Please keep noise down after 10 PM.</span>',
        },
        {
          icon: 'cigarette-off',
          title: 'Non-fumeur · No smoking',
          body: 'Interdit dans l\'appartement et les ascenseurs.<span class="es">Not allowed inside the apartment or the lifts.</span>',
        },
        {
          icon: 'recycle',
          title: 'Déchets · Trash',
          body: 'Sacs fermés, et merci de trier le verre.<span class="es">Closed bags, and please sort the glass.</span>',
        },
      ],
    },
    {
      type: 'gallery',
      slug: '13-explore',
      kicker: 'Au-delà de la porte · Beyond the door',
      title: 'Explorer Rennes <span class="es">/ Explore Rennes</span>',
      compact: true,
      cells: [
        {
          src: 'listing-photos/photo-10.jpg',
          caption: 'Les bords de Vilaine <span class="es">· The riverside</span>',
        },
        {
          src: 'listing-photos/photo-11.jpg',
          caption: 'Le quartier <span class="es">· The neighbourhood</span>',
        },
        {
          src: 'listing-photos/photo-12.jpg',
          caption: 'Rennes au crépuscule <span class="es">· Rennes at dusk</span>',
        },
        {
          src: 'listing-photos/photo-14.jpg',
          caption: 'Sport sur le Mail <span class="es">· Outdoor gym</span>',
        },
      ],
    },
    {
      type: 'rows',
      slug: '14-checkout',
      kicker: 'Avant de partir · Before you go',
      title: 'Départ · 11:00 <span class="es">/ Checkout</span>',
      rows: [
        {
          icon: 'trash-2',
          title: 'Déchets &amp; serviettes · Trash &amp; towels',
          body: 'Sortez les poubelles et laissez les serviettes utilisées dans la salle de bain.<span class="es">Take out the trash and leave used towels in the bathroom.</span>',
        },
        {
          icon: 'utensils',
          title: 'Vaisselle · Dishes',
          body: 'Lancez le lave-vaisselle ou lavez ce que vous avez utilisé.<span class="es">Run the dishwasher or wash what you used.</span>',
        },
        {
          icon: 'power',
          title: 'Tout éteindre · Power off',
          body: 'Éteignez les lumières et la TV ; fermez les fenêtres et la porte du balcon.<span class="es">Turn off the lights and TV; close the windows and the balcony door.</span>',
        },
        {
          icon: 'key-round',
          title: 'Clés &amp; parking · Keys &amp; parking',
          body: 'Reposez la clé dans la boîte (à l\'horizontale), ainsi que la télécommande et le badge sur la tablette d\'entrée.<span class="es">Return the key to the box (horizontally), and leave the remote and badge on the entry console.</span>',
        },
        {
          icon: 'message-circle',
          title: 'Un petit message · Message us',
          body: 'Prévenez-nous sur Airbnb une fois partis. Bon voyage !<span class="es">Message us on Airbnb once you\'ve left. Safe travels!</span>',
        },
      ],
    },
    {
      type: 'rows',
      slug: '15-help',
      kicker: 'Nous sommes là · We\'re here for you',
      title: 'Aide &amp; urgences <span class="es">/ Help &amp; emergencies</span>',
      rows: [
        {
          icon: 'message-circle',
          title: 'Nous contacter · Contact us',
          body: 'Écrivez-nous sur Airbnb — nous répondons rapidement.<span class="es">Message us on Airbnb — we reply quickly.</span>',
        },
        {
          icon: 'siren',
          title: 'Urgences · Emergencies',
          body: '<span class="emergency-num">15 · 18 · 17</span> &nbsp;SAMU · Pompiers · Police (Européen : 112).<span class="es">Ambulance · Fire · Police (EU: 112).</span>',
        },
        {
          icon: 'stethoscope',
          title: 'Médecin · Doctor',
          body: 'SOS Médecin : <b>02 99 53 06 06</b>. Urgences CHU Villejean : <b>02 99 28 43 21</b>.<span class="es">SOS Médecin and the CHU Villejean ER.</span>',
        },
        {
          icon: 'cross',
          title: 'Pharmacie de garde · On-call pharmacy',
          body: '<span class="emergency-num">32 37</span>',
        },
      ],
    },
    {
      type: 'photo',
      slug: '16-thank-you',
      kicker: 'Bon séjour · Enjoy your stay',
      title: 'Merci',
      subtitle:
        'Nous espérons que vous vous y sentirez comme chez vous.<br><span class="es">We hope you\'ll feel right at home.</span>',
      bg: 'listing-photos/photo-12.jpg',
      style: { titleSize: '88px', lineHeight: '1.0', subtitleSize: '27px', subtitleMargin: '18px' },
      footer:
        '<div class="cover-meta" style="margin-top:30px;"><span class="m"><i data-lucide="star"></i> Un avis 5 étoiles nous aide énormément · A 5-star review means the world to us</span></div>',
    },
    {
      type: 'spacer',
      slug: 'blank',
    },
  ],
};
