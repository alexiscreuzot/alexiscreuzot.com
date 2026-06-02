export interface LimpiezaItem {
  id: string;
  label: string;
  note?: string;
}

export interface LimpiezaSection {
  id: string;
  title: string;
  icon: string;
  items: LimpiezaItem[];
}

// Order follows Airbnb's 5-step turnover: preparar, limpiar, desinfectar, reponer, revisar.
export const limpiezaSections: LimpiezaSection[] = [
  {
    id: 'preparar',
    title: 'Preparar',
    icon: 'spray-can',
    items: [
      { id: 'prep-ventilar', label: 'Ventilar: abrir ventanas y puerta del balcón' },
      { id: 'prep-manos', label: 'Lavarse las manos y ponerse guantes' },
      { id: 'prep-productos', label: 'Juntar productos y trapos de limpieza' },
      { id: 'prep-ropa', label: 'Retirar sábanas y toallas usadas' },
      {
        id: 'prep-lavadora',
        label: 'Iniciar la lavadora con sábanas y toallas',
        note: 'Hazlo al inicio para que termine mientras limpias el resto del depa.',
      },
      {
        id: 'prep-lavavajillas',
        label: 'Cargar el lavavajillas y ponerlo en marcha',
        note: 'Igual que la lavadora: arráncalo al principio para aprovechar el tiempo.',
      },
    ],
  },
  {
    id: 'cocina',
    title: 'Cocina',
    icon: 'utensils',
    items: [
      { id: 'cocina-encimera', label: 'Limpiar encimeras y barra' },
      { id: 'cocina-fregadero', label: 'Lavar y desinfectar el fregadero' },
      { id: 'cocina-parrilla', label: 'Limpiar parrilla de inducción' },
      { id: 'cocina-horno', label: 'Limpiar horno y microondas por dentro' },
      {
        id: 'cocina-refri',
        label: 'Limpiar refrigerador por dentro y retirar comida olvidada',
        note: 'Revisa bien estantes y cajones. No debe quedar nada de huéspedes anteriores.',
      },
      { id: 'cocina-lavavajillas', label: 'Vaciar y acomodar el lavavajillas' },
      { id: 'cocina-trastes', label: 'Guardar trastes y dejar todo en su lugar' },
    ],
  },
  {
    id: 'bano-principal',
    title: 'Baño principal',
    icon: 'bath',
    items: [
      { id: 'bano1-wc', label: 'Tallar y desinfectar el inodoro' },
      {
        id: 'bano1-cancel',
        label: 'Limpiar cancel de vidrio, regadera y mampara',
        note: 'Sin marcas de agua ni jabón. Secar con jalador hasta que quede transparente; revisar a contraluz.',
      },
      { id: 'bano1-tapa-olores', label: 'Limpiar tapa-olores del desagüe de la regadera' },
      {
        id: 'bano1-lavabo',
        label: 'Limpiar lavabo y espejo',
        note: 'Espejo sin manchas ni huellas. Grifería brillante, sin calcio visible.',
      },
    ],
  },
  {
    id: 'bano-invitado',
    title: 'Baño de invitado',
    icon: 'bath',
    items: [
      { id: 'bano2-wc', label: 'Tallar y desinfectar el inodoro' },
      {
        id: 'bano2-cancel',
        label: 'Limpiar cancel de vidrio, regadera y mampara',
        note: 'Sin marcas de agua ni jabón. Secar con jalador hasta que quede transparente; revisar a contraluz.',
      },
      { id: 'bano2-tapa-olores', label: 'Limpiar tapa-olores del desagüe de la regadera' },
      {
        id: 'bano2-lavabo',
        label: 'Limpiar lavabo y espejo',
        note: 'Espejo sin manchas ni huellas. Grifería brillante, sin calcio visible.',
      },
    ],
  },
  {
    id: 'recamaras',
    title: 'Recámaras',
    icon: 'bed-double',
    items: [
      { id: 'recamaras-polvo', label: 'Quitar el polvo de burós, superficies y lámparas' },
      {
        id: 'recamaras-tender',
        label: 'Tender las camas con ropa de cama limpia',
        note: 'Esquinas tensas, almohadas simétricas, cobijas lisas — como en un hotel.',
      },
      { id: 'recamaras-closets', label: 'Ordenar clósets y cajones' },
      {
        id: 'recamaras-vidrios',
        label: 'Limpiar ventanas y vidrios',
        note: 'Sin marcas ni película; revisar a contraluz en ambas recámaras.',
      },
    ],
  },
  {
    id: 'sala-comedor',
    title: 'Sala y comedor',
    icon: 'sofa',
    items: [
      { id: 'sala-polvo', label: 'Quitar el polvo de muebles y superficies' },
      { id: 'sala-mesa', label: 'Limpiar la mesa del comedor' },
      {
        id: 'sala-vidrios',
        label: 'Limpiar vidrios de la sala principal',
        note: 'Ventanales y puerta de cristal al balcón. Sin marcas; revisar a contraluz.',
      },
      { id: 'sala-cojines', label: 'Acomodar cojines y mantas' },
    ],
  },
  {
    id: 'loggia',
    title: 'Loggia / balcón',
    icon: 'wind',
    items: [
      { id: 'loggia-barrer', label: 'Barrer el piso de la loggia' },
      {
        id: 'loggia-barandal',
        label: 'Limpiar barandal del balcón',
        note: 'Cristal del barandal sin marcas ni huellas; revisar a contraluz.',
      },
      { id: 'loggia-mobiliario', label: 'Limpiar mesa y sillas exteriores' },
    ],
  },
  {
    id: 'desinfectar',
    title: 'Desinfectar superficies de contacto',
    icon: 'shield-check',
    items: [
      {
        id: 'desinf-interruptores',
        label: 'Interruptores y apagadores',
        note: 'Pasar desinfectante en todos los de sala, recámaras y baños.',
      },
      { id: 'desinf-manijas', label: 'Manijas y perillas de puertas' },
      { id: 'desinf-controles', label: 'Controles de TV y de clima' },
      { id: 'desinf-llaves', label: 'Llaves de agua y jaladeras' },
      {
        id: 'desinf-cerradura',
        label: 'Cerradura inteligente y teclado de entrada',
        note: 'Teclado y manija de entrada: desinfectar sin dejar residuo pegajoso.',
      },
    ],
  },
  {
    id: 'reponer',
    title: 'Reponer amenidades',
    icon: 'package-check',
    items: [
      {
        id: 'reponer-toallas',
        label: 'Reponer toallas limpias en ambos baños',
        note: 'Toallas dobladas y colocadas igual en los dos baños.',
      },
      { id: 'reponer-papel', label: 'Reponer papel higiénico y pañuelos' },
      { id: 'reponer-amenidades', label: 'Reponer jabón, shampoo y amenidades' },
      { id: 'reponer-cafe', label: 'Reponer agua, café y cápsulas' },
    ],
  },
  {
    id: 'pisos',
    title: 'Pisos',
    icon: 'droplets',
    items: [
      {
        id: 'pisos-trapear',
        label: 'Barrer y trapear el piso de todo el depa',
        note: 'Hazlo al final, cuando ya terminaste el resto, para no volver a ensuciar el piso.',
      },
    ],
  },
  {
    id: 'revision-final',
    title: 'Revisión final y salida',
    icon: 'clipboard-check',
    items: [
      { id: 'final-lavadora', label: 'Terminar lavadora/secadora y guardar la ropa de cama' },
      { id: 'final-basura', label: 'Sacar toda la basura y poner bolsas nuevas' },
      { id: 'final-clima', label: 'Apagar luces, clima y televisores' },
      { id: 'final-ventanas', label: 'Cerrar ventanas y puerta del balcón' },
      {
        id: 'final-revision',
        label: 'Revisión general: todo limpio, completo y en su lugar',
        note: 'Recorre el depa como huésped: olores, polvo, manchas en vidrios, camas, cocina y baños.',
      },
    ],
  },
];

export const limpiezaTotalItems = limpiezaSections.reduce(
  (total, section) => total + section.items.length,
  0
);
