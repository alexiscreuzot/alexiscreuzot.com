export interface LimpiezaNotePart {
  text?: string;
  icon?: string;
  key?: string;
  strong?: boolean;
}

export interface LimpiezaNoteLine {
  title?: boolean;
  parts: LimpiezaNotePart[];
}

export interface LimpiezaItem {
  id: string;
  label: string;
  note?: string | LimpiezaNoteLine[];
}

export interface LimpiezaSection {
  id: string;
  title: string;
  icon: string;
  duration: string;
  items: LimpiezaItem[];
}

export const limpiezaSections: LimpiezaSection[] = [
  {
    id: 'preparar',
    title: 'Preparar',
    icon: 'spray-can',
    duration: '10 min',
    items: [
      { id: 'prep-ropa', label: 'Quitar sábanas y toallas sucias' },
      {
        id: 'prep-lavavajillas',
        label: 'Cargar el lavavajillas y prenderlo',
        note: [
          {
            parts: [
              { text: 'Pastilla ' },
              { text: 'Cascade', strong: true },
              { text: ' en el dispensador y mete los trastes' },
            ],
          },
          {
            parts: [
              { text: 'Toca ' },
              { key: 'P' },
              { text: ' para ' },
              { text: 'ECO', strong: true },
            ],
          },
          {
            parts: [
              { text: 'Toca ' },
              { key: 'F' },
              { text: ' 3 veces hasta que los 2 iconos de arriba a la derecha estén prendidos' },
            ],
          },
          {
            parts: [
              { text: 'Cierra la puerta y arranca solo' },
            ],
          },
        ],
      },
      {
        id: 'prep-lavadora',
        label: 'Prender la lavadora con sábanas y toallas',
        note: [
          {
            parts: [
              { text: 'Pon una hoja ' },
              { text: 'Fisroa', strong: true },
              { text: ' en el tambor y mete sábanas/toallas (máx. ~9 kg para secar bien)' },
            ],
          },
          {
            parts: [
              { text: 'Mantén ' },
              { icon: 'power' },
              { text: ' hasta prender' },
            ],
          },
          {
            parts: [
              { text: 'Gira a ' },
              { text: 'Lavado rápido', strong: true },
              { text: ' y toca ' },
              { icon: 'circle' },
              { text: ' para secado' },
            ],
          },
          {
            parts: [
              { text: 'Mantén ' },
              { icon: 'play' },
              { icon: 'pause' },
              { text: ' para arrancar' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cocina',
    title: 'Cocina',
    icon: 'utensils',
    duration: '40 min',
    items: [
      { id: 'cocina-superficies', label: 'Limpiar barra y cubiertas' },
      { id: 'cocina-tarja', label: 'Lavar bien la tarja' },
      { id: 'cocina-parrilla', label: 'Limpiar la estufa de inducción' },
      { id: 'cocina-horno', label: 'Limpiar horno y micro por dentro' },
      { id: 'cocina-refri',
        label: 'Limpiar el refri por dentro y quitar comida que hayan dejado',
        note: 'Revisa estantes y cajones. No debe quedar nada de los huéspedes anteriores.',
      },
    ],
  },
  {
    id: 'bano-principal',
    title: 'Baño principal',
    icon: 'bath',
    duration: '25 min',
    items: [
      { id: 'bano1-wc', label: 'Limpiar bien el WC' },
      {
        id: 'bano1-regadera',
        label: 'Limpiar regadera: cancel y trampa de pelos',
        note: 'Cancel sin manchas de agua ni jabón; seca con el jalador. Quita pelos de la trampa, enjuaga y vuelve a poner.',
      },
      {
        id: 'bano1-lavabo',
        label: 'Limpiar lavamanos y espejo',
        note: 'Espejo limpio, sin huellas. Llaves del agua brillantes, sin sarro.',
      },
    ],
  },
  {
    id: 'bano-invitado',
    title: 'Baño de visitas',
    icon: 'bath',
    duration: '25 min',
    items: [
      { id: 'bano2-wc', label: 'Limpiar bien el WC' },
      {
        id: 'bano2-regadera',
        label: 'Limpiar regadera: cancel y trampa de pelos',
        note: 'Cancel sin manchas de agua ni jabón; seca con el jalador. Quita pelos de la trampa, enjuaga y vuelve a poner.',
      },
      {
        id: 'bano2-lavabo',
        label: 'Limpiar lavamanos y espejo',
        note: 'Espejo limpio, sin huellas. Llaves del agua brillantes, sin sarro.',
      },
    ],
  },
  {
    id: 'recamaras',
    title: 'Recámaras',
    icon: 'bed-double',
    duration: '40 min',
    items: [
      { id: 'recamaras-polvo', label: 'Quitar polvo de burós, muebles y lámparas' },
      {
        id: 'recamaras-tender',
        label: 'Hacer las camas con sábanas limpias',
        note: 'Esquinas bien puestas, almohadas parejas, cobijas lisas — como en hotel.',
      },
      { id: 'recamaras-closets', label: 'Ordenar closets y cajones' },
      {
        id: 'recamaras-vidrios',
        label: 'Limpiar ventanas y cristales',
        note: 'Sin manchas ni película; checa con la luz en las dos recámaras.',
      },
    ],
  },
  {
    id: 'sala-comedor',
    title: 'Sala y comedor',
    icon: 'sofa',
    duration: '15 min',
    items: [
      { id: 'sala-muebles', label: 'Quitar polvo de muebles y limpiar mesa del comedor' },
      {
        id: 'sala-vidrios',
        label: 'Limpiar cristales de la sala',
        note: 'Ventanales y puerta al balcón. Sin manchas; checa con la luz.',
      },
    ],
  },
  {
    id: 'loggia',
    title: 'Balcón',
    icon: 'wind',
    duration: '15 min',
    items: [
      { id: 'loggia-piso', label: 'Barrer y limpiar mesa y sillas del balcón' },
      {
        id: 'loggia-barandal',
        label: 'Limpiar barandal del balcón',
        note: 'Cristal del barandal sin manchas ni huellas.',
      },
    ],
  },
  {
    id: 'reponer',
    title: 'Reponer',
    icon: 'package-check',
    duration: '10 min',
    items: [
      {
        id: 'reponer-toallas',
        label: 'Poner toallas limpias en los dos baños',
        note: 'Toallas dobladas igual en los dos baños.',
      },
      { id: 'reponer-amenidades', label: 'Poner papel, jabón, shampoo y amenidades' },
      { id: 'reponer-cafe', label: 'Poner agua, café y cápsulas' },
    ],
  },
  {
    id: 'pisos',
    title: 'Pisos',
    icon: 'droplets',
    duration: '35 min',
    items: [
      {
        id: 'pisos-trapear',
        label: 'Barrer y trapear todo el depa',
        note: 'Al final, cuando ya terminaste todo, para no ensuciar otra vez el piso.',
      },
    ],
  },
  {
    id: 'cierre-lavado',
    title: 'Sacar ropa y vajilla',
    icon: 'archive',
    duration: '15 min',
    items: [
      {
        id: 'final-sabanas',
        label: 'Sacar sábanas y toallas de la lavadora: doblar y guardar',
        note: 'Si aún están húmedas, tiéndelas a secar antes de guardar.',
      },
      { id: 'final-vajillas', label: 'Sacar vajillas del lavavajillas y guardar' },
    ],
  },
  {
    id: 'revision-final',
    title: 'Revisión final',
    icon: 'clipboard-check',
    duration: '10 min',
    items: [
      { id: 'final-basura', label: 'Sacar la basura y poner bolsas nuevas' },
      {
        id: 'final-revision',
        label: 'Revisar todo: limpio, completo y en su lugar',
        note: 'Recorre el depa como si fueras huésped: olores, polvo, manchas, camas, cocina y baños.',
      },
    ],
  },
];

export const limpiezaTotalItems = limpiezaSections.reduce(
  (total, section) => total + section.items.length,
  0
);

export const limpiezaEstimatedMinutes = limpiezaSections.reduce(
  (total, section) => total + parseInt(section.duration, 10),
  0
);
