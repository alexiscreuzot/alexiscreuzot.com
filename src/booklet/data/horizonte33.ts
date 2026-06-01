import type { BookletData } from '../types';

export const horizonte33: BookletData = {
  meta: {
    slug: 'horizonte33',
    title: 'Horizonte 33 · Welcome Slides',
    lang: 'en',
    theme: 'horizonte33',
    themeColor: '#15110b',
    appleMobileWebAppTitle: 'Horizonte 33',
    toolbar: { prefix: 'Horizonte ', emphasis: '33', suffix: ' · Guest Guide' },
    mark: { prefix: 'Horizonte ', emphasis: '33' },
    storagePrefix: 'h33',
    wifi: { ssid: 'Horizonte', pass: 'welcomehome', type: 'WPA' },
    wifiSvg: 'assets/wifi.svg',
    strings: {
      connect: 'Connect',
      joinNetwork: 'Join network',
      copyPassword: 'Copy password',
      passwordCopied:
        'Password copied — Settings → Wi‑Fi → Horizonte · Contraseña copiada — Ajustes → Wi‑Fi → Horizonte',
      networkCopied: 'Network copied · Red copiada',
      legacyCopyFallback: 'Horizonte · welcomehome',
      androidHint:
        'Confirm in the system prompt.<span class="es">Confirma en el diálogo del sistema.</span>',
      iosHint:
        'Scan QR with Camera, or copy password → Wi‑Fi.<span class="es">Escanea el QR con Cámara, o copia la clave → Wi‑Fi.</span>',
      defaultHint:
        'Scan QR or copy password, then choose Horizonte.<span class="es">Escanea el QR o copia la clave y elige Horizonte.</span>',
    },
  },
  slides: [
    {
      type: 'cover',
      slug: '01-cover',
      kicker: 'Querétaro · México',
      title: 'Horizonte 33',
      bg: 'assets/images/cover-view.jpg',
      features: [
        { icon: 'bed-double', html: '2 bedrooms · 2 recámaras' },
        { icon: 'bath', html: '2 baths · 2 baños' },
        { icon: 'waves', html: 'Pool · Alberca' },
        { icon: 'dumbbell', html: 'Gym · Gimnasio' },
        { icon: 'mountain', html: 'Valley views · Vista al valle' },
      ],
    },
    {
      type: 'welcome',
      slug: '02-welcome',
      kicker: 'A note from your hosts · Un mensaje de tus anfitriones',
      title: 'Welcome <span class="es">/ Bienvenido</span>',
      photo: 'assets/images/living-view.jpg',
      photoAlt: 'Living room with a view',
      intro:
        'Hi — we\'re Alexis &amp; Carolina, and we\'re so happy to have you. This is our part-time home in Querétaro, filled with the warmth and little details we love, so you can unwind and feel right at home. <span class="es">Hola, somos Alexis y Carolina, y nos da mucho gusto recibirte. Este es nuestro hogar a tiempo parcial en Querétaro, lleno de la calidez y los pequeños detalles que nos encantan, para que descanses y te sientas como en casa.</span>',
      aside:
        'We\'re just a message away on the Airbnb app throughout your stay. <span class="es">Estamos a un mensaje en la app de Airbnb durante toda tu estancia.</span>',
      hostsLabel: 'Your hosts · Tus anfitriones',
    },
    {
      type: 'facts',
      slug: '03-essentials',
      kicker: 'Essentials · Lo esencial',
      title: 'At a glance <span class="es">/ De un vistazo</span>',
      facts: [
        {
          icon: 'key-round',
          label: 'Check-in · Entrada',
          value: '3:00 – 10:00 PM',
          detail: 'Self check-in · autoacceso · cerradura inteligente',
        },
        {
          icon: 'log-out',
          label: 'Checkout · Salida',
          value: '11:00 AM',
        },
        {
          icon: 'building-2',
          label: 'Unit · Depto.',
          value: 'No. 33',
          detail: 'Floor 3 · Piso 3',
        },
        {
          icon: 'car-front',
          label: 'Parking · Cajón',
          value: 'No. 33',
          detail: 'Underground, in front of ramp · subterráneo, frente a la rampa',
        },
        {
          icon: 'users',
          label: 'Guests · Huéspedes',
          value: 'Up to 4',
          detail: '2 bed · 2 bath · 2 rec · 2 baños',
        },
        {
          icon: 'map-pin',
          label: 'Address · Dirección',
          value: 'Sendero del Misterio #83',
          detail: 'LAHIA, Milenio III · Querétaro',
        },
      ],
    },
    {
      type: 'access',
      slug: '04-access',
      kicker: 'Getting in · Cómo entrar',
      title: 'Arriving home <span class="es">/ Tu llegada</span>',
      photo: 'assets/images/entrance.jpg',
      photoAlt: 'Building entrance',
      photoCaption: 'Sendero del Misterio #83',
      steps: [
        {
          title: 'At the gate <span class="es">· En la caseta</span>',
          body: 'Security will greet you — just say you\'re a guest of apt. <b>33</b> and show ID. Caseta: <b>+52 442 117 3825</b><span class="es">Vigilancia te recibirá — di que eres huésped del depto. <b>33</b> y muestra ID. Caseta: <b>+52 442 117 3825</b></span>',
        },
        {
          title: 'Park &amp; head in <span class="es">· Estacionate</span>',
          body: 'Your spot is <b>33</b>, underground by the ramp.<span class="es">Tu cajón es el <b>33</b>, subterráneo frente a la rampa.</span>',
        },
        {
          title: 'Up to your floor <span class="es">· Sube</span>',
          body: 'Take the elevator to <b>floor 3</b> — unit <b>33</b> is yours.<span class="es">Toma el elevador al <b>piso 3</b> — el depto. <b>33</b> es tuyo.</span>',
        },
        {
          title: 'Let yourself in <span class="es">· Entra</span>',
          body: 'Type your code, press <b>#</b>, and you\'re home.<span class="es">Escribe tu código, presiona <b>#</b> y estás en casa.</span>',
        },
      ],
      tipIcon: 'key-round',
      tip: 'We\'ll send your door code in the Airbnb app before check-in.<span class="es">Te enviamos tu código en la app de Airbnb antes del check-in.</span>',
    },
    {
      type: 'wifi',
      slug: '05-wifi',
      kicker: 'Stay connected · Mantente conectado',
      title: 'WiFi',
      note: '443 Mbps fiber.<br><span class="es">Fibra 443 Mbps.</span>',
      connectLabel: 'Connect',
      connectSecondary: '· Conectar',
      scanLabel: 'Scan <span class="es">· Escanea</span>',
      ssidLabel: 'Network · Red',
      passLabel: 'Password · Clave',
    },
    {
      type: 'gallery',
      slug: '06-the-home',
      kicker: 'Your space · Tu espacio',
      title: 'The apartment <span class="es">/ El departamento</span>',
      compact: true,
      cells: [
        {
          src: 'assets/images/living-kitchen.jpg',
          caption: 'Living &amp; kitchen <span class="es">· Sala y cocina</span>',
        },
        {
          src: 'assets/images/bedroom-queen.jpg',
          caption: 'Master bedroom <span class="es">· Recámara principal</span>',
        },
        {
          src: 'assets/images/bathroom.jpg',
          caption: 'Guest bathroom <span class="es">· Baño de invitado</span>',
        },
        {
          src: 'assets/images/loggia.jpg',
          caption: 'Loggia <span class="es">· Loggia</span>',
        },
      ],
    },
    {
      type: 'photo',
      slug: 'bedroom-photo',
      kicker: 'Rest well · Descansa',
      title: 'Wake up unhurried',
      subtitle:
        'Two bedrooms dressed in soft linens and quiet light.<br><span class="es">Dos recámaras con ropa de cama suave y luz serena.</span>',
      bg: 'assets/images/archive/bedroom-secondary.jpg',
      style: { titleSize: '72px', subtitleSize: '24px', subtitleMargin: '16px' },
    },
    {
      type: 'rows',
      slug: '07-kitchen',
      kicker: 'House manual · Manual de la casa · 1 / 3',
      title: 'In the kitchen <span class="es">/ En la cocina</span>',
      rows: [
        {
          icon: 'flame',
          title: 'Induction cooktop · Parrilla de inducción',
          body: 'Touch controls. Heats magnetic cookware only — we provide it.<span class="es">Controles táctiles. Solo calienta trastes magnéticos — los dejamos.</span>',
        },
        {
          icon: 'cooking-pot',
          title: 'Oven · Horno',
          body: 'Digital panel: pick a mode, set the temperature, let it preheat.<span class="es">Panel digital: elige un modo, ajusta la temperatura y precalienta.</span>',
        },
        {
          icon: 'utensils',
          title: 'Dishwasher · Lavavajillas',
          body: 'One tablet, controls on the top edge of the door, choose Eco.<span class="es">Una pastilla, controles en el borde superior de la puerta, elige Eco.</span>',
        },
        {
          icon: 'glass-water',
          title: 'Filtered water · Agua filtrada',
          body: 'Bebbia tap to the left of the kitchen sink — COFEPRIS-certified; removes bacteria, chlorine &amp; sediment. Safe to drink.<span class="es">Llave Bebbia a la izquierda del fregadero — certificada COFEPRIS; elimina bacterias, cloro y sedimentos. Agua potable.</span>',
        },
      ],
    },
    {
      type: 'photo',
      slug: 'kitchen-photo',
      kicker: 'The kitchen · La cocina',
      title: 'Cook like you\'re home',
      subtitle:
        'Fully equipped — everything you need to make a meal.<br><span class="es">Totalmente equipada — todo lo que necesitas para cocinar.</span>',
      bg: 'assets/images/archive/kitchen.jpg',
      style: { titleSize: '72px', subtitleSize: '24px', subtitleMargin: '16px' },
    },
    {
      type: 'rows',
      slug: '08-comfort',
      kicker: 'House manual · Manual de la casa · 2 / 3',
      title: 'Comfort &amp; laundry <span class="es">/ Confort y lavandería</span>',
      rows: [
        {
          icon: 'refrigerator',
          title: 'Fridge &amp; wine cooler · Refri y cava',
          body: 'Temperatures are pre-set — there\'s nothing to adjust.<span class="es">Las temperaturas están configuradas — no hay que ajustar nada.</span>',
        },
        {
          icon: 'washing-machine',
          title: 'Washer-dryer · Lavasecadora',
          body: 'All-in-one. Choose "Wash + Dry", or a normal cycle to wash only.<span class="es">Todo en uno. Elige "Wash + Dry", o un ciclo normal para solo lavar.</span>',
        },
        {
          icon: 'wind',
          title: 'A/C &amp; heating · Clima',
          body: 'Mode button: snowflake cools, sun heats. 22–24°C is comfortable.<span class="es">Botón Mode: copo enfría, sol calienta. 22–24°C es cómodo.</span>',
        },
        {
          icon: 'coffee',
          title: 'Nespresso',
          body: 'Drop a capsule and press your cup size — it stops on its own.<span class="es">Coloca una cápsula y presiona el tamaño de taza — se detiene solo.</span>',
        },
      ],
    },
    {
      type: 'rows',
      slug: '09-tech',
      kicker: 'House manual · Manual de la casa · 3 / 3',
      title: 'Tech &amp; access <span class="es">/ Tecnología y acceso</span>',
      rows: [
        {
          icon: 'droplets',
          title: 'Smart bidet · WC inteligente',
          body: 'Use the side panel: wash, dry, stop. The seat is heated. Only toilet paper in the bowl — no wipes.<span class="es">Usa el panel lateral: lavar, secar, detener. El asiento es térmico. Solo papel higiénico en el inodoro — no toallitas.</span>',
        },
        {
          icon: 'tv',
          title: 'TVs · Televisores',
          body: 'Samsung remote, press home for apps. Please sign out before checkout.<span class="es">Control Samsung, presiona home para las apps. Cierra sesión antes de salir.</span>',
        },
        {
          icon: 'lock',
          title: 'Smart lock · Cerradura',
          body: 'Enter your code and press <b>#</b>. It locks automatically when the door closes.<span class="es">Ingresa tu código y presiona <b>#</b>. Se cierra sola al cerrar la puerta.</span>',
        },
      ],
    },
    {
      type: 'gallery',
      slug: '10-amenities',
      kicker: 'LAHIA condominium · Condominio LAHIA',
      title: 'Amenities <span class="es">/ Amenidades</span>',
      compact: true,
      cells: [
        { src: 'assets/images/pool.jpg', caption: 'Pool <span class="es">· Alberca</span>' },
        { src: 'assets/images/gym.jpg', caption: 'Gym <span class="es">· Gimnasio</span>' },
        {
          src: 'assets/images/casa-club.jpg',
          caption: 'Club house <span class="es">· Casa club</span>',
        },
        {
          src: 'assets/images/common-areas.jpg',
          caption: 'Common areas <span class="es">· Áreas comunes</span>',
        },
      ],
    },
    {
      type: 'rows',
      slug: '11-amenities-tips',
      kicker: 'Good to know · Bueno saberlo',
      title: 'Using the amenities <span class="es">/ Uso de amenidades</span>',
      rows: [
        {
          icon: 'waves',
          title: 'Pool · Alberca',
          hours: '— 8:00–22:00',
          body: 'Shower first, sandals around the pool, no glass.<span class="es">Dúchate antes, sandalias alrededor, sin vidrio.</span>',
        },
        {
          icon: 'dumbbell',
          title: 'Gym · Gimnasio',
          hours: '— Mon–Fri 6–22 · Sat/Sun 8–19',
          body: 'Sportswear and a towel, age 12+. Request the key at the caseta.<span class="es">Ropa deportiva y toalla, +12. Pide la llave en la caseta.</span>',
        },
        {
          icon: 'sofa',
          title: 'Club house · Casa club',
          hours: '— Mon–Thu 9–22 · Fri/Sat 9–24 · Sun 10–20',
          body: 'Shared lounge, no smoking. Request the key at the caseta.<span class="es">Espacio común, no fumar. Pide la llave en la caseta.</span>',
        },
        {
          icon: 'car-front',
          title: 'Parking · Estacionamiento',
          body: 'Spot No. 33, underground. Drive ≤ 10 km/h, no honking.<span class="es">Cajón No. 33, subterráneo. ≤ 10 km/h, sin claxon.</span>',
        },
      ],
    },
    {
      type: 'rows',
      slug: '12-rules',
      kicker: 'Good neighbors · Buena convivencia',
      title: 'House rules <span class="es">/ Reglas</span>',
      rows: [
        {
          icon: 'party-popper',
          title: 'No parties or events · Sin fiestas ni eventos',
          body: 'Quiet residential building — gatherings and celebrations aren\'t allowed.<span class="es">Edificio residencial tranquilo — no se permiten fiestas ni reuniones.</span>',
        },
        {
          icon: 'moon',
          title: 'Quiet hours · Silencio',
          body: 'Please keep it down after 10:00 PM — it\'s a family building.<span class="es">Evita ruido después de las 10:00 PM — es un edificio familiar.</span>',
        },
        {
          icon: 'paw-print',
          title: 'Pets · Mascotas',
          body: 'Welcome — leashed in common areas, please clean up.<span class="es">Bienvenidas — con correa en áreas comunes, recoge sus desechos.</span>',
        },
        {
          icon: 'cigarette-off',
          title: 'No smoking · No fumar',
          body: 'Inside the apartment and in the elevators.<span class="es">Dentro del departamento y en los elevadores.</span>',
        },
        {
          icon: 'trash-2',
          title: 'Trash · Basura',
          body: 'Closed bags, separate recycling. Tue &amp; Thu you may leave it by the door before 9 AM.<span class="es">Bolsas cerradas, separa el reciclaje. Martes y jueves puedes dejarla en la puerta antes de las 9 AM.</span>',
        },
      ],
    },
    {
      type: 'gallery',
      slug: '13-explore',
      kicker: 'Beyond the door · Más allá de la puerta',
      title: 'Explore Querétaro <span class="es">/ Explora Querétaro</span>',
      compact: true,
      cells: [
        {
          src: 'assets/images/queretaro-arcos.jpg',
          caption: 'Los Arcos <span class="es">· Acueducto</span>',
        },
        {
          src: 'assets/images/queretaro-centro.jpg',
          caption: 'Historic Center <span class="es">· Centro · UNESCO</span>',
        },
        {
          src: 'assets/images/bernal.jpg',
          caption: 'Peña de Bernal <span class="es">· ~1 hr</span>',
        },
        {
          src: 'assets/images/tequisquiapan.jpg',
          caption: 'Tequisquiapan <span class="es">· Pueblo Mágico</span>',
        },
      ],
    },
    {
      type: 'rows',
      slug: '14-explore-more',
      kicker: 'Our recommendations · Recomendaciones',
      title: 'Local favorites <span class="es">/ Favoritos locales</span>',
      rows: [
        {
          icon: 'landmark',
          title: 'Historic Center · Centro Histórico',
          hours: '— ~20 min',
          body: 'Plazas, the Templo de Santa Rosa, the Museum of Art and lovely cafés.<span class="es">Plazas, el Templo de Santa Rosa, el Museo de Arte y cafés encantadores.</span>',
        },
        {
          icon: 'grape',
          title: 'Wine &amp; cheese route · Ruta del Queso y Vino',
          body: 'Vineyards and tastings around Ezequiel Montes &amp; Tequisquiapan.<span class="es">Viñedos y catas por Ezequiel Montes y Tequisquiapan.</span>',
        },
        {
          icon: 'mountain',
          title: 'Pueblos Mágicos',
          hours: '— ~1 hr',
          body: 'Peña de Bernal, one of the world\'s tallest monoliths, and charming Tequisquiapan.<span class="es">Peña de Bernal, uno de los monolitos más altos del mundo, y el encantador Tequisquiapan.</span>',
        },
        {
          icon: 'trees',
          title: 'Sierra Gorda',
          hours: '— day trip',
          body: 'A UNESCO biosphere with Franciscan missions, waterfalls and forests.<span class="es">Reserva de la biosfera UNESCO con misiones franciscanas, cascadas y bosques.</span>',
        },
        {
          icon: 'utensils',
          title: 'Local flavors · Sabores locales',
          body: 'Try enchiladas queretanas and gorditas, and the great local coffee.<span class="es">Prueba las enchiladas queretanas y gorditas, y el buen café local.</span>',
        },
      ],
    },
    {
      type: 'photo',
      slug: 'night-view',
      kicker: 'After dark · Al anochecer',
      title: 'Hércules at night',
      subtitle:
        'City lights over Hércules from the loggia.<br><span class="es">Las luces de Hércules desde la loggia.</span>',
      bg: 'assets/images/archive/view-night.jpg',
      style: { titleSize: '72px', subtitleSize: '24px', subtitleMargin: '16px' },
    },
    {
      type: 'rows',
      slug: '15-checkout',
      kicker: 'Before you go · Antes de irte',
      title: 'Checkout · 11:00 AM <span class="es">/ Salida</span>',
      rows: [
        {
          icon: 'trash-2',
          title: 'Trash &amp; towels · Basura y toallas',
          body: 'Bag the trash and leave used towels in the bathroom.<span class="es">Embolsa la basura y deja las toallas usadas en el baño.</span>',
        },
        {
          icon: 'utensils',
          title: 'Dishes · Trastes',
          body: 'Run the dishwasher or wash any dishes you used.<span class="es">Pon el lavavajillas o lava los trastes que usaste.</span>',
        },
        {
          icon: 'lightbulb',
          title: 'Power off · Apagar todo',
          body: 'Turn off the A/C, lights &amp; TVs; close windows and the balcony door.<span class="es">Apaga clima, luces y TVs; cierra ventanas y la puerta del balcón.</span>',
        },
        {
          icon: 'lock',
          title: 'Lock up · Cerrar',
          body: 'Pull the entry door shut — the smart lock sets itself.<span class="es">Cierra la puerta de entrada — la cerradura se activa sola.</span>',
        },
        {
          icon: 'message-circle',
          title: 'Message us · Avísanos',
          body: 'Message us on the app once you\'ve left. Safe travels!<span class="es">Avísanos por la app al salir. ¡Buen viaje!</span>',
        },
      ],
    },
    {
      type: 'rows',
      slug: '16-help',
      kicker: 'We\'re here for you · Estamos para ayudarte',
      title: 'Help &amp; safety <span class="es">/ Ayuda y seguridad</span>',
      rows: [
        {
          icon: 'message-circle',
          title: 'Contact us · Contáctanos',
          body: 'Message us on the Airbnb app — we usually reply within an hour.<span class="es">Escríbenos por la app de Airbnb — respondemos en ~1 hora.</span>',
        },
        {
          icon: 'phone',
          title: 'Caseta · Vigilancia',
          body: '<span class="emergency-num">+52 442 117 3825</span> — building access, amenity keys &amp; on-site help.<span class="es">Acceso al edificio, llaves de amenidades y apoyo en sitio.</span>',
        },
        {
          icon: 'siren',
          title: 'Emergencies · Emergencias',
          body: '<span class="emergency-num">911</span> &nbsp;— for any emergency in Mexico.<span class="es">Para cualquier emergencia en México.</span>',
        },
        {
          icon: 'shield-check',
          title: 'In the apartment · En el departamento',
          body: 'Smoke alarm and a first-aid kit are inside the apartment.<span class="es">Hay alarma de humo y botiquín de primeros auxilios en el departamento.</span>',
        },
      ],
    },
    {
      type: 'photo',
      slug: '17-thank-you',
      kicker: 'Enjoy your stay · Disfruta tu estancia',
      title: 'Thank you',
      subtitle:
        'We hope you felt right at home.<br><span class="es">Esperamos que te hayas sentido como en casa.</span>',
      bg: 'assets/images/pool-sunset.jpg',
      style: { titleSize: '88px', lineHeight: '1.0', subtitleSize: '27px', subtitleMargin: '18px' },
      footer:
        '<div class="cover-meta" style="margin-top:30px;"><span class="m"><i data-lucide="star"></i> A 5-star review means the world to us · Una reseña de 5 estrellas nos ayuda muchísimo</span></div>',
    },
    {
      type: 'spacer',
      slug: 'blank',
    },
  ],
};
