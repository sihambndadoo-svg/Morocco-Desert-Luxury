import { Experience } from '@/types';

const image = (url: string, fallbackUrl: string, alt: { en: string; fr: string; es: string; ar: string }) => ({
  type: 'image' as const,
  url,
  fallbackUrl,
  alt,
  source: 'Pexels'
});

const heroVideo = {
  type: 'video' as const,
  url: 'https://videos.pexels.com/video-files/2055056/2055056-hd_1920_802_25fps.mp4',
  fallbackUrl: '/fallback-hero.svg',
  posterUrl: 'https://images.pexels.com/photos/30158465/pexels-photo-30158465.jpeg?auto=compress&cs=tinysrgb&w=1600',
  alt: {
    en: 'Sunset dunes in the Sahara',
    fr: 'Dunes du Sahara au coucher du soleil',
    es: 'Dunas del Sahara al atardecer',
    ar: 'كثبان الصحراء عند الغروب'
  },
  source: 'Pexels'
};

const sharedAddOns = {
  privateTransfer: {
    key: 'private-transfer',
    label: {
      en: 'Private transfer',
      fr: 'Transfert privé',
      es: 'Traslado privado',
      ar: 'نقل خاص'
    },
    description: {
      en: 'Dedicated transfer arrangement with direct coordination.',
      fr: 'Organisation de transfert dédiée avec coordination directe.',
      es: 'Traslado dedicado con coordinación directa.',
      ar: 'تنظيم نقل خاص مع تنسيق مباشر.'
    },
    price: 90,
    category: 'transport' as const
  },
  sunsetDinner: {
    key: 'sunset-dinner',
    label: {
      en: 'Private sunset dinner set-up',
      fr: 'Mise en place d’un dîner privé au coucher du soleil',
      es: 'Montaje de cena privada al atardecer',
      ar: 'جلسة عشاء خاصة وقت الغروب'
    },
    description: {
      en: 'Romantic dining styling in a scenic dune location.',
      fr: 'Mise en scène romantique dans un cadre de dune panoramique.',
      es: 'Montaje romántico para cenar en una localización panorámica entre dunas.',
      ar: 'تنسيق عشاء رومانسي في موقع بانورامي بين الكثبان.'
    },
    price: 120,
    category: 'romance' as const
  },
  sandboarding: {
    key: 'sandboarding',
    label: {
      en: 'Sandboarding set',
      fr: 'Set de sandboard',
      es: 'Set de sandboard',
      ar: 'عدة التزلج على الرمال'
    },
    description: {
      en: 'Boards arranged where terrain and weather allow.',
      fr: 'Planches prévues lorsque le terrain et la météo le permettent.',
      es: 'Tablas disponibles cuando el terreno y el clima lo permiten.',
      ar: 'تتوفر الألواح عندما تسمح التضاريس والطقس.'
    },
    price: 18,
    perGuest: true,
    category: 'adventure' as const
  },
  specialCake: {
    key: 'special-cake',
    label: {
      en: 'Celebration cake',
      fr: 'Gâteau de célébration',
      es: 'Tarta de celebración',
      ar: 'كعكة احتفال'
    },
    description: {
      en: 'For birthdays, honeymoons, and private celebrations.',
      fr: 'Pour anniversaires, lunes de miel et célébrations privées.',
      es: 'Para cumpleaños, lunas de miel y celebraciones privadas.',
      ar: 'لأعياد الميلاد وشهر العسل والمناسبات الخاصة.'
    },
    price: 45,
    category: 'dining' as const
  }
};

export const heroMedia = heroVideo;

export const defaultExperiences: Experience[] = [
  {
    slug: 'luxury-desert-camp-1-night',
    category: 'camp',
    featured: true,
    active: true,
    sortOrder: 1,
    durationLabel: '1 night',
    durationDays: 1,
    startingPrice: 195,
    baseAdultPrice: 195,
    baseChildPrice: 95,
    privateSurcharge: 110,
    transferPrice: 90,
    capacityDefault: 20,
    unitCapacityDefault: 10,
    heroMedia: image('https://images.pexels.com/photos/30757368/pexels-photo-30757368.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-camp.svg', {
      en: 'Luxury desert camp in Morocco',
      fr: 'Camp de luxe dans le désert marocain',
      es: 'Campamento de lujo en el desierto de Marruecos',
      ar: 'مخيم فاخر في الصحراء المغربية'
    }),
    gallery: [
      image('https://images.pexels.com/photos/30757368/pexels-photo-30757368.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-camp.svg', {
        en: 'Luxury desert camp', fr: 'Camp de luxe', es: 'Campamento de lujo', ar: 'مخيم فاخر'
      }),
      image('https://images.pexels.com/photos/13869948/pexels-photo-13869948.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-camp.svg', {
        en: 'Luxury tent interior', fr: 'Intérieur de tente de luxe', es: 'Interior de tienda de lujo', ar: 'داخل خيمة فاخرة'
      }),
      image('https://images.pexels.com/photos/36221130/pexels-photo-36221130.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-dunes.svg', {
        en: 'Glamping scene in Merzouga', fr: 'Glamping à Merzouga', es: 'Glamping en Merzouga', ar: 'تخييم فاخر في مرزوكة'
      })
    ],
    addOns: [sharedAddOns.privateTransfer, sharedAddOns.sunsetDinner, sharedAddOns.sandboarding, sharedAddOns.specialCake],
    content: {
      title: {
        en: 'Luxury Desert Camp Stay – 1 Night',
        fr: 'Séjour en camp de luxe – 1 nuit',
        es: 'Estancia en campamento de lujo – 1 noche',
        ar: 'إقامة في مخيم فاخر – ليلة واحدة'
      },
      shortDescription: {
        en: 'A premium one-night escape with sunset atmosphere, elegant camp comfort, dinner, breakfast, and a polished desert rhythm.',
        fr: 'Une échappée premium d’une nuit avec ambiance de coucher de soleil, confort raffiné au camp, dîner, petit-déjeuner et rythme désertique maîtrisé.',
        es: 'Una escapada premium de una noche con ambiente de atardecer, confort elegante en el campamento, cena, desayuno y ritmo desértico refinado.',
        ar: 'ملاذ فاخر لليلة واحدة مع أجواء الغروب وراحة أنيقة في المخيم وعشاء وفطور وإيقاع صحراوي متقن.'
      },
      longDescription: {
        en: 'This one-night camp stay is designed for travellers who want a beautiful first taste of the Sahara without rushing the experience. It combines thoughtful hosting, dinner under the desert sky, and a calm overnight stay in a refined camp setting.',
        fr: 'Ce séjour d’une nuit est pensé pour les voyageurs qui souhaitent une première immersion dans le Sahara sans précipitation. Il combine un accueil soigné, un dîner sous le ciel du désert et une nuit paisible dans un camp raffiné.',
        es: 'Esta estancia de una noche está pensada para viajeros que desean un primer contacto elegante con el Sahara sin prisas. Combina atención cuidada, cena bajo el cielo del desierto y una noche tranquila en un campamento refinado.',
        ar: 'صُممت هذه الإقامة لليلة واحدة للمسافرين الذين يرغبون في تذوقٍ أول أنيق للصحراء دون استعجال. تجمع بين ضيافة مدروسة وعشاء تحت سماء الصحراء ومبيت هادئ في مخيم راقٍ.'
      },
      idealFor: {
        en: 'Couples, short premium escapes, first-time Merzouga visitors.',
        fr: 'Couples, courtes escapades premium, premiers visiteurs de Merzouga.',
        es: 'Parejas, escapadas premium cortas y primeros visitantes de Merzouga.',
        ar: 'الأزواج، والرحلات القصيرة الراقية، وزوار مرزوكة للمرة الأولى.'
      },
      meetingPoint: {
        en: 'Merzouga meeting point or pre-arranged transfer pick-up.',
        fr: 'Point de rendez-vous à Merzouga ou prise en charge en transfert pré-organisé.',
        es: 'Punto de encuentro en Merzouga o recogida acordada en traslado.',
        ar: 'نقطة لقاء في مرزوكة أو استلام عبر نقل منسق مسبقاً.'
      },
      included: [
        { en: 'Luxury camp night', fr: 'Nuit en camp de luxe', es: 'Noche en campamento de lujo', ar: 'ليلة في مخيم فاخر' },
        { en: 'Dinner and breakfast', fr: 'Dîner et petit-déjeuner', es: 'Cena y desayuno', ar: 'عشاء وفطور' },
        { en: 'Camp hosting and arrival coordination', fr: 'Accueil du camp et coordination d’arrivée', es: 'Recepción del campamento y coordinación de llegada', ar: 'استقبال المخيم وتنسيق الوصول' }
      ],
      exclusions: [
        { en: 'Private transfers unless selected', fr: 'Transferts privés sauf sélection', es: 'Traslados privados salvo selección', ar: 'النقل الخاص ما لم يتم اختياره' }
      ],
      highlights: [
        { en: 'Elegant overnight atmosphere', fr: 'Atmosphère nocturne élégante', es: 'Ambiente nocturno elegante', ar: 'أجواء ليلية أنيقة' },
        { en: 'Designed for smooth short stays', fr: 'Pensé pour les courts séjours fluides', es: 'Pensado para estancias cortas fluidas', ar: 'مصمم للإقامات القصيرة السلسة' }
      ]
    }
  },
  {
    slug: 'luxury-desert-camp-2-nights',
    category: 'camp',
    featured: true,
    active: true,
    sortOrder: 2,
    durationLabel: '2 nights',
    durationDays: 2,
    startingPrice: 360,
    baseAdultPrice: 180,
    baseChildPrice: 88,
    privateSurcharge: 160,
    transferPrice: 90,
    capacityDefault: 20,
    unitCapacityDefault: 10,
    heroMedia: image('https://images.pexels.com/photos/36221130/pexels-photo-36221130.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-camp.svg', {
      en: 'Palm framed glamping in Merzouga',
      fr: 'Glamping à Merzouga entouré de palmiers',
      es: 'Glamping en Merzouga entre palmeras',
      ar: 'تخييم فاخر في مرزوكة بين النخيل'
    }),
    gallery: [
      image('https://images.pexels.com/photos/36221130/pexels-photo-36221130.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-camp.svg', { en: 'Merzouga camp', fr: 'Camp à Merzouga', es: 'Campamento en Merzouga', ar: 'مخيم في مرزوكة' }),
      image('https://images.pexels.com/photos/30757368/pexels-photo-30757368.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-camp.svg', { en: 'Camp exterior', fr: 'Extérieur du camp', es: 'Exterior del campamento', ar: 'واجهة المخيم' }),
      image('https://images.pexels.com/photos/13869948/pexels-photo-13869948.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-camp.svg', { en: 'Tent interior', fr: 'Intérieur de tente', es: 'Interior de tienda', ar: 'داخل الخيمة' })
    ],
    addOns: [sharedAddOns.privateTransfer, sharedAddOns.sunsetDinner, sharedAddOns.sandboarding],
    content: {
      title: {
        en: 'Luxury Desert Camp Stay – 2 Nights',
        fr: 'Séjour en camp de luxe – 2 nuits',
        es: 'Estancia en campamento de lujo – 2 noches',
        ar: 'إقامة في مخيم فاخر – ليلتان'
      },
      shortDescription: {
        en: 'A slower premium desert stay with time to enjoy the camp, the dunes, and added activities without compression.',
        fr: 'Un séjour désertique premium plus lent, avec le temps de profiter du camp, des dunes et d’activités complémentaires sans précipitation.',
        es: 'Una estancia premium más pausada para disfrutar del campamento, las dunas y actividades extra sin prisas.',
        ar: 'إقامة صحراوية راقية بوتيرة أهدأ للاستمتاع بالمخيم والكثبان والأنشطة الإضافية دون ضغط.'
      },
      longDescription: {
        en: 'Two nights allow the experience to breathe. Guests can enjoy a more generous camp rhythm, richer light for photography, and combinations such as camel, quad, or private sunset dining without making the itinerary feel rushed.',
        fr: 'Deux nuits permettent à l’expérience de respirer. Les voyageurs profitent d’un rythme plus généreux au camp, d’une meilleure lumière pour la photographie et de combinaisons camel/quad/dîner privé sans donner une sensation de course.',
        es: 'Dos noches permiten que la experiencia respire. Los viajeros disfrutan de un ritmo más amplio en el campamento, mejor luz para fotografías y combinaciones de camello, quad o cena privada sin sensación de prisa.',
        ar: 'تمنح الليلتان التجربة مساحة أوسع. يمكن للضيوف الاستمتاع بإيقاع أكثر راحة في المخيم وضوء أفضل للتصوير ودمج رحلات الجمال أو الكواد أو العشاء الخاص دون شعور بالعجلة.'
      },
      idealFor: {
        en: 'Couples, photographers, guests adding activities, and travellers who value time.',
        fr: 'Couples, photographes, voyageurs ajoutant des activités et clients qui apprécient le temps.',
        es: 'Parejas, fotógrafos, viajeros que combinan actividades y huéspedes que valoran el tiempo.',
        ar: 'الأزواج والمصورون ومن يضيفون أنشطة ويقدرون الوقت والهدوء.'
      },
      meetingPoint: {
        en: 'Merzouga meeting point or private transfer routing.',
        fr: 'Point de rendez-vous à Merzouga ou transfert privé organisé.',
        es: 'Punto de encuentro en Merzouga o traslado privado organizado.',
        ar: 'نقطة لقاء في مرزوكة أو مسار نقل خاص منظم.'
      },
      included: [
        { en: 'Two luxury camp nights', fr: 'Deux nuits en camp de luxe', es: 'Dos noches en campamento de lujo', ar: 'ليلتان في مخيم فاخر' },
        { en: 'Dinner and breakfast each day', fr: 'Dîner et petit-déjeuner chaque jour', es: 'Cena y desayuno cada día', ar: 'عشاء وفطور كل يوم' },
        { en: 'Arrival support and hosting', fr: 'Assistance à l’arrivée et accueil', es: 'Apoyo en la llegada y atención', ar: 'مساعدة عند الوصول وضيافة' }
      ],
      exclusions: [
        { en: 'Optional activities and transfers unless selected', fr: 'Activités et transferts en option sauf sélection', es: 'Actividades y traslados opcionales salvo selección', ar: 'الأنشطة والنقل الاختياري ما لم يتم اختيارهما' }
      ],
      highlights: [
        { en: 'More relaxed rhythm', fr: 'Rythme plus détendu', es: 'Ritmo más relajado', ar: 'وتيرة أكثر راحة' },
        { en: 'Ideal for combination itineraries', fr: 'Idéal pour les itinéraires combinés', es: 'Ideal para itinerarios combinados', ar: 'مناسب للبرامج المدمجة' }
      ]
    }
  },
  {
    slug: 'sunset-camel-trek',
    category: 'camel',
    featured: true,
    active: true,
    sortOrder: 3,
    durationLabel: '2 hours',
    durationDays: 1,
    startingPrice: 35,
    baseAdultPrice: 35,
    baseChildPrice: 22,
    privateSurcharge: 55,
    transferPrice: 18,
    capacityDefault: 24,
    unitCapacityDefault: 12,
    heroMedia: image('https://images.pexels.com/photos/30158465/pexels-photo-30158465.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-dunes.svg', {
      en: 'Camel caravan at dusk', fr: 'Caravane de chameaux au crépuscule', es: 'Caravana de camellos al anochecer', ar: 'قافلة جمال عند الغسق'
    }),
    gallery: [
      image('https://images.pexels.com/photos/30158465/pexels-photo-30158465.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-dunes.svg', { en: 'Dusk camel trek', fr: 'Balade au crépuscule', es: 'Paseo al anochecer', ar: 'رحلة وقت الغسق' }),
      image('https://images.pexels.com/photos/28267498/pexels-photo-28267498.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-dunes.svg', { en: 'Camel ride at sunrise', fr: 'Balade à dos de chameau au lever du soleil', es: 'Paseo en camello al amanecer', ar: 'ركوب الجمل عند الشروق' })
    ],
    addOns: [sharedAddOns.privateTransfer, sharedAddOns.sunsetDinner],
    content: {
      title: {
        en: 'Sunset Camel Trek', fr: 'Balade à dos de chameau au coucher du soleil', es: 'Paseo en camello al atardecer', ar: 'رحلة غروب على ظهر الجمل'
      },
      shortDescription: {
        en: 'A classic Merzouga moment with warm light, soft dunes, and a polished pace suited to photographs and first-time desert travellers.',
        fr: 'Un grand classique de Merzouga avec lumière chaude, dunes douces et rythme soigné, idéal pour les photos et une première découverte.',
        es: 'Un clásico de Merzouga con luz cálida, dunas suaves y un ritmo cuidado, ideal para fotos y primera experiencia en el desierto.',
        ar: 'واحدة من أجمل لحظات مرزوكة مع ضوء دافئ وكثبان ناعمة وإيقاع مناسب للصور وللمسافرين إلى الصحراء لأول مرة.'
      },
      longDescription: {
        en: 'The sunset camel trek is designed to feel atmospheric rather than hurried. We time departures to make the most of the light, offer a refined pace through the dunes, and keep the experience welcoming for guests who want beauty without intensity.',
        fr: 'La balade à dos de chameau au coucher du soleil est pensée pour créer une vraie atmosphère, sans précipitation. Les départs sont réglés pour profiter au mieux de la lumière, avec un rythme fluide dans les dunes.',
        es: 'El paseo en camello al atardecer está pensado para crear ambiente, no prisa. Ajustamos la salida para aprovechar la luz y mantener un ritmo cómodo entre las dunas.',
        ar: 'صُممت رحلة الغروب على الجمل لتكون تجربة غنية بالأجواء لا بالمبالغة في السرعة. نضبط وقت الانطلاق للاستفادة من الضوء مع وتيرة مريحة بين الكثبان.'
      },
      idealFor: {
        en: 'Couples, first-time visitors, photographers, short stays.',
        fr: 'Couples, premiers visiteurs, photographes, courts séjours.',
        es: 'Parejas, primeros visitantes, fotógrafos y estancias cortas.',
        ar: 'الأزواج، الزوار لأول مرة، المصورون، والإقامات القصيرة.'
      },
      meetingPoint: {
        en: 'Camel departure area in Merzouga or camp departure point.',
        fr: 'Zone de départ à Merzouga ou point de départ depuis le camp.',
        es: 'Zona de salida en Merzouga o salida desde el campamento.',
        ar: 'منطقة الانطلاق في مرزوكة أو نقطة الانطلاق من المخيم.'
      },
      included: [
        { en: 'Camel ride with guide', fr: 'Balade à dos de chameau avec guide', es: 'Paseo en camello con guía', ar: 'ركوب الجمل مع دليل' },
        { en: 'Sunset timing coordination', fr: 'Coordination selon le coucher du soleil', es: 'Coordinación con el horario del atardecer', ar: 'تنسيق مع توقيت الغروب' }
      ],
      exclusions: [
        { en: 'Camp stay unless combined', fr: 'Séjour au camp sauf combinaison', es: 'Estancia en campamento salvo combinación', ar: 'الإقامة في المخيم ما لم تُدمج' }
      ],
      highlights: [
        { en: 'Golden hour riding', fr: 'Balade à l’heure dorée', es: 'Paseo en la hora dorada', ar: 'ركوب في الساعة الذهبية' },
        { en: 'Cinematic photo potential', fr: 'Superbe potentiel photo', es: 'Gran potencial fotográfico', ar: 'فرص تصوير سينمائية' }
      ]
    }
  },
  {
    slug: 'sunrise-camel-ride',
    category: 'camel',
    featured: false,
    active: true,
    sortOrder: 4,
    durationLabel: '1.5 hours',
    durationDays: 1,
    startingPrice: 32,
    baseAdultPrice: 32,
    baseChildPrice: 20,
    privateSurcharge: 45,
    transferPrice: 18,
    capacityDefault: 20,
    unitCapacityDefault: 10,
    heroMedia: image('https://images.pexels.com/photos/28267498/pexels-photo-28267498.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-dunes.svg', {
      en: 'Sunrise camel ride in Merzouga', fr: 'Balade à dos de chameau au lever du soleil à Merzouga', es: 'Paseo en camello al amanecer en Merzouga', ar: 'رحلة جمل عند شروق الشمس في مرزوكة'
    }),
    gallery: [image('https://images.pexels.com/photos/28267498/pexels-photo-28267498.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-dunes.svg', { en: 'Sunrise camel', fr: 'Chameau au lever du soleil', es: 'Camello al amanecer', ar: 'جمل عند الشروق' })],
    addOns: [sharedAddOns.privateTransfer],
    content: {
      title: { en: 'Sunrise Camel Ride', fr: 'Balade à dos de chameau au lever du soleil', es: 'Paseo en camello al amanecer', ar: 'رحلة جمل وقت الشروق' },
      shortDescription: {
        en: 'A peaceful dawn ride through the dunes for travellers who prefer quiet light and soft desert air.',
        fr: 'Une sortie paisible à l’aube pour les voyageurs qui préfèrent la lumière douce et l’air calme du désert.',
        es: 'Un paseo tranquilo al amanecer para viajeros que prefieren la luz suave y el aire fresco del desierto.',
        ar: 'رحلة هادئة عند الفجر للمسافرين الذين يفضلون الضوء الناعم وهواء الصحراء اللطيف.'
      },
      longDescription: {
        en: 'For travellers who love calm mornings, the sunrise ride delivers a serene dune atmosphere and a more contemplative desert mood than the busier evening period.',
        fr: 'Pour les voyageurs qui aiment les matinées calmes, la balade au lever du soleil offre une atmosphère sereine dans les dunes et une ambiance plus contemplative que la période du soir.',
        es: 'Para quienes disfrutan las mañanas tranquilas, el paseo al amanecer ofrece una atmósfera serena y más contemplativa que la franja de la tarde.',
        ar: 'لمن يحبون الصباح الهادئ، تمنح رحلة الشروق أجواءً ساكنة بين الكثبان ومزاجاً صحراوياً أكثر تأملاً من فترة المساء.'
      },
      idealFor: { en: 'Early risers, photographers, peaceful travellers.', fr: 'Lève-tôt, photographes, voyageurs paisibles.', es: 'Madrugadores, fotógrafos y viajeros tranquilos.', ar: 'محبو الاستيقاظ المبكر والمصورون والباحثون عن الهدوء.' },
      meetingPoint: { en: 'Merzouga departure point or camp departure.', fr: 'Point de départ à Merzouga ou depuis le camp.', es: 'Punto de salida en Merzouga o desde el campamento.', ar: 'نقطة الانطلاق في مرزوكة أو من المخيم.' },
      included: [{ en: 'Camel ride with guide', fr: 'Balade avec guide', es: 'Paseo con guía', ar: 'رحلة مع دليل' }],
      exclusions: [{ en: 'Breakfast unless tied to a camp stay', fr: 'Petit-déjeuner sauf en formule camp', es: 'Desayuno salvo en paquete de campamento', ar: 'الفطور إلا إذا كان ضمن إقامة في المخيم' }],
      highlights: [{ en: 'Quiet dawn light', fr: 'Lumière calme de l’aube', es: 'Luz tranquila del amanecer', ar: 'ضوء الفجر الهادئ' }]
    }
  },
  {
    slug: 'camel-trekking-half-day',
    category: 'camel',
    featured: false,
    active: true,
    sortOrder: 5,
    durationLabel: 'Half day',
    durationDays: 1,
    startingPrice: 68,
    baseAdultPrice: 68,
    baseChildPrice: 35,
    privateSurcharge: 70,
    transferPrice: 18,
    capacityDefault: 14,
    unitCapacityDefault: 8,
    heroMedia: image('https://images.pexels.com/photos/29107895/pexels-photo-29107895.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-dunes.svg', { en: 'Camel caravan in Merzouga dunes', fr: 'Caravane de chameaux dans les dunes de Merzouga', es: 'Caravana de camellos en las dunas de Merzouga', ar: 'قافلة جمال في كثبان مرزوكة' }),
    gallery: [image('https://images.pexels.com/photos/29107895/pexels-photo-29107895.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-dunes.svg', { en: 'Camel trekking', fr: 'Trekking à dos de chameau', es: 'Trekking en camello', ar: 'تجوال بالجمال' })],
    addOns: [sharedAddOns.privateTransfer, sharedAddOns.sandboarding],
    content: {
      title: { en: 'Camel Trekking', fr: 'Trekking à dos de chameau', es: 'Trekking en camello', ar: 'تجوال بالجمال' },
      shortDescription: {
        en: 'A longer dune immersion for travellers who want more than a simple sunset circuit.',
        fr: 'Une immersion plus longue dans les dunes pour les voyageurs qui veulent davantage qu’une simple boucle au coucher du soleil.',
        es: 'Una inmersión más larga en las dunas para viajeros que quieren algo más que un simple paseo al atardecer.',
        ar: 'تجربة أطول في الكثبان للمسافرين الذين يريدون أكثر من جولة غروب قصيرة.'
      },
      longDescription: {
        en: 'This camel trekking format offers a deeper sense of space and a more travel-led rhythm through the dunes. It suits guests who want the Sahara to feel expansive rather than only photogenic.',
        fr: 'Ce format de trekking à dos de chameau offre une sensation d’espace plus forte et un rythme plus voyageur dans les dunes. Il convient aux clients qui veulent vivre le Sahara au-delà de la seule photo.',
        es: 'Este formato de trekking en camello ofrece una mayor sensación de espacio y un ritmo más de viaje dentro de las dunas. Es ideal para quienes quieren sentir el Sahara más allá de la simple fotografía.',
        ar: 'يمنح هذا النوع من الترحال بالجمال إحساساً أعمق بالمساحة وإيقاعاً أكثر ارتباطاً بالسفر الحقيقي بين الكثبان، وهو مناسب لمن يريدون الإحساس بالصحراء لا مجرد تصويرها.'
      },
      idealFor: { en: 'Travellers wanting a longer dune experience.', fr: 'Voyageurs voulant une expérience plus longue dans les dunes.', es: 'Viajeros que desean una experiencia más larga en las dunas.', ar: 'المسافرون الراغبون في تجربة أطول بين الكثبان.' },
      meetingPoint: { en: 'Merzouga camel departure point.', fr: 'Point de départ chameau à Merzouga.', es: 'Punto de salida de camellos en Merzouga.', ar: 'نقطة انطلاق الجمال في مرزوكة.' },
      included: [{ en: 'Extended guided camel route', fr: 'Itinéraire guidé prolongé', es: 'Ruta guiada prolongada', ar: 'مسار موجه ممتد' }],
      exclusions: [{ en: 'Meals unless combined with camp', fr: 'Repas sauf si combiné au camp', es: 'Comidas salvo si se combina con campamento', ar: 'الوجبات إلا إذا دُمجت مع المخيم' }],
      highlights: [{ en: 'Deeper desert immersion', fr: 'Immersion plus profonde', es: 'Mayor inmersión en el desierto', ar: 'انغماس أعمق في الصحراء' }]
    }
  },
  {
    slug: 'quad-atv-tour-1-hour',
    category: 'quad',
    featured: true,
    active: true,
    sortOrder: 6,
    durationLabel: '1 hour',
    durationDays: 1,
    startingPrice: 65,
    baseAdultPrice: 65,
    baseChildPrice: 0,
    privateSurcharge: 40,
    transferPrice: 18,
    capacityDefault: 16,
    unitCapacityDefault: 8,
    heroMedia: image('https://images.pexels.com/photos/35112819/pexels-photo-35112819.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: '4x4 vehicles in the dunes', fr: 'Véhicules dans les dunes', es: 'Vehículos entre las dunas', ar: 'مركبات بين الكثبان' }),
    gallery: [image('https://images.pexels.com/photos/35112819/pexels-photo-35112819.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'Dune adventure vehicles', fr: 'Véhicules d’aventure', es: 'Vehículos de aventura', ar: 'مركبات للمغامرة' })],
    addOns: [sharedAddOns.privateTransfer],
    content: {
      title: { en: 'Quad / ATV Tour – 1 Hour', fr: 'Tour en quad / ATV – 1 heure', es: 'Tour en quad / ATV – 1 hora', ar: 'جولة كواد / ATV – ساعة واحدة' },
      shortDescription: {
        en: 'A focused adrenaline experience across the dunes for guests who want action without taking over the day.',
        fr: 'Une expérience d’adrénaline ciblée dans les dunes pour les voyageurs qui veulent de l’action sans y consacrer toute la journée.',
        es: 'Una experiencia de adrenalina concentrada entre dunas para quienes quieren acción sin dedicar todo el día.',
        ar: 'تجربة مليئة بالحماس بين الكثبان لمن يريدون مغامرة قوية دون أن تستهلك اليوم كله.'
      },
      longDescription: {
        en: 'Our one-hour quad tour is built for guests who want a clean, exciting desert activity with a strong visual payoff. It works especially well as an add-on to a camp stay or transfer-based itinerary.',
        fr: 'Notre tour en quad d’une heure est conçu pour les clients qui veulent une activité désertique claire, vive et visuellement marquante. Il fonctionne particulièrement bien en complément d’un séjour au camp.',
        es: 'Nuestro tour en quad de una hora está pensado para quienes quieren una actividad clara, emocionante y muy visual. Funciona especialmente bien como complemento de una estancia en campamento.',
        ar: 'تم تصميم جولة الكواد لمدة ساعة للضيوف الذين يبحثون عن نشاط صحراوي واضح ومثير وغني بصرياً، وهي مناسبة جداً كإضافة إلى الإقامة في المخيم.'
      },
      idealFor: { en: 'Adventure lovers and short stays.', fr: 'Amateurs d’aventure et courts séjours.', es: 'Amantes de la aventura y estancias cortas.', ar: 'محبو المغامرة والإقامات القصيرة.' },
      meetingPoint: { en: 'Quad base in Merzouga.', fr: 'Base quad à Merzouga.', es: 'Base de quad en Merzouga.', ar: 'قاعدة انطلاق الكواد في مرزوكة.' },
      included: [{ en: 'Guided quad activity', fr: 'Activité quad guidée', es: 'Actividad guiada en quad', ar: 'نشاط كواد مع إرشاد' }],
      exclusions: [{ en: 'Camp stay and transfer unless selected', fr: 'Camp et transfert sauf sélection', es: 'Campamento y traslado salvo selección', ar: 'المخيم والنقل ما لم يتم اختيارهما' }],
      highlights: [{ en: 'Short premium adventure', fr: 'Aventure premium courte', es: 'Aventura premium corta', ar: 'مغامرة راقية قصيرة' }]
    }
  },
  {
    slug: 'quad-atv-tour-2-hours',
    category: 'quad',
    featured: false,
    active: true,
    sortOrder: 7,
    durationLabel: '2 hours',
    durationDays: 1,
    startingPrice: 110,
    baseAdultPrice: 110,
    baseChildPrice: 0,
    privateSurcharge: 60,
    transferPrice: 18,
    capacityDefault: 16,
    unitCapacityDefault: 8,
    heroMedia: image('https://images.pexels.com/photos/34911379/pexels-photo-34911379.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'Off-road vehicle in dunes', fr: 'Véhicule hors-piste dans les dunes', es: 'Vehículo todoterreno en las dunas', ar: 'مركبة في الكثبان' }),
    gallery: [image('https://images.pexels.com/photos/34911379/pexels-photo-34911379.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'Quad route terrain', fr: 'Terrain de quad', es: 'Terreno para quad', ar: 'مسار كواد' })],
    addOns: [sharedAddOns.privateTransfer],
    content: {
      title: { en: 'Quad / ATV Tour – 2 Hours', fr: 'Tour en quad / ATV – 2 heures', es: 'Tour en quad / ATV – 2 horas', ar: 'جولة كواد / ATV – ساعتان' },
      shortDescription: {
        en: 'A longer ride with more terrain, more dune time, and more visual variation for adventure-seeking guests.',
        fr: 'Une sortie plus longue avec davantage de terrain, davantage de dunes et plus de variété visuelle pour les voyageurs en quête d’aventure.',
        es: 'Una salida más larga con más terreno, más tiempo entre dunas y mayor variedad visual para viajeros aventureros.',
        ar: 'جولة أطول بمساحة أكبر من التضاريس ووقت أطول بين الكثبان وتنوع بصري أكبر لعشاق المغامرة.'
      },
      longDescription: {
        en: 'This two-hour format gives the activity a more exploratory feeling and works well for guests who want stronger adventure energy while keeping the experience private and organized.',
        fr: 'Ce format de deux heures donne un sentiment plus exploratoire à l’activité et convient aux clients qui souhaitent une énergie d’aventure plus marquée tout en gardant une organisation soignée.',
        es: 'Este formato de dos horas da un aire más exploratorio a la actividad y funciona bien para quienes buscan una energía de aventura más intensa con organización cuidada.',
        ar: 'يمنح هذا التنسيق لمدة ساعتين النشاط طابعاً استكشافياً أكبر، ويناسب الضيوف الذين يريدون جرعة أعلى من المغامرة مع تنظيم جيد.'
      },
      idealFor: { en: 'Adventure-focused guests.', fr: 'Clients orientés aventure.', es: 'Huéspedes orientados a la aventura.', ar: 'الضيوف الباحثون عن المغامرة.' },
      meetingPoint: { en: 'Merzouga quad base.', fr: 'Base quad de Merzouga.', es: 'Base de quad en Merzouga.', ar: 'قاعدة الكواد في مرزوكة.' },
      included: [{ en: 'Extended guided quad route', fr: 'Itinéraire quad prolongé guidé', es: 'Ruta guiada ampliada en quad', ar: 'مسار كواد ممتد مع إرشاد' }],
      exclusions: [{ en: 'Camp stay unless combined', fr: 'Camp sauf combinaison', es: 'Campamento salvo combinación', ar: 'المخيم ما لم يُدمج' }],
      highlights: [{ en: 'More dune terrain', fr: 'Davantage de terrain de dunes', es: 'Más terreno de dunas', ar: 'مساحة أكبر من الكثبان' }]
    }
  },
  {
    slug: 'private-4x4-erg-chebbi-tour',
    category: 'fourByFour',
    featured: true,
    active: true,
    sortOrder: 8,
    durationLabel: 'Half day',
    durationDays: 1,
    startingPrice: 150,
    baseAdultPrice: 150,
    baseChildPrice: 75,
    privateSurcharge: 0,
    transferPrice: 0,
    capacityDefault: 12,
    unitCapacityDefault: 3,
    heroMedia: image('https://images.pexels.com/photos/34911379/pexels-photo-34911379.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: '4x4 driving across dunes', fr: '4x4 traversant les dunes', es: '4x4 cruzando dunas', ar: 'سيارة 4x4 تعبر الكثبان' }),
    gallery: [image('https://images.pexels.com/photos/4968848/pexels-photo-4968848.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'SUV in desert', fr: 'SUV dans le désert', es: 'SUV en el desierto', ar: 'سيارة دفع رباعي في الصحراء' })],
    addOns: [sharedAddOns.sunsetDinner],
    content: {
      title: { en: 'Private 4x4 Erg Chebbi Tour', fr: 'Tour privé 4x4 Erg Chebbi', es: 'Tour privado 4x4 Erg Chebbi', ar: 'جولة خاصة 4x4 في عرق الشبي' },
      shortDescription: {
        en: 'A private off-road experience for guests who want comfort, flexibility, and a broader look at the landscape around the dunes.',
        fr: 'Une expérience tout-terrain privée pour les clients qui veulent confort, flexibilité et une vue plus large sur les paysages autour des dunes.',
        es: 'Una experiencia privada en todoterreno para quienes desean comodidad, flexibilidad y una mirada más amplia al paisaje que rodea las dunas.',
        ar: 'تجربة خاصة بالدفع الرباعي للضيوف الذين يريدون الراحة والمرونة ونظرة أوسع إلى المشهد حول الكثبان.'
      },
      longDescription: {
        en: 'The private 4x4 tour is ideal when you want desert exploration without the physical effort of longer camel or quad activity. It offers scenic access, flexibility in pacing, and excellent suitability for families and premium private groups.',
        fr: 'Le tour privé en 4x4 est idéal si vous souhaitez explorer le désert sans l’effort physique d’une activité plus longue en chameau ou en quad. Il offre un accès panoramique, une grande flexibilité de rythme et convient très bien aux familles.',
        es: 'El tour privado en 4x4 es ideal si deseas explorar el desierto sin el esfuerzo físico de actividades más largas en camello o quad. Ofrece acceso panorámico, flexibilidad y gran comodidad para familias y grupos privados.',
        ar: 'تعد جولة 4x4 الخاصة مثالية عندما ترغب في استكشاف الصحراء دون الجهد البدني لرحلات الجمال أو الكواد الطويلة. فهي تمنح وصولاً بانورامياً ومرونة في الإيقاع ومناسبة جداً للعائلات والمجموعات الخاصة.'
      },
      idealFor: { en: 'Families, private groups, travellers wanting comfort.', fr: 'Familles, groupes privés, voyageurs recherchant le confort.', es: 'Familias, grupos privados y viajeros que priorizan comodidad.', ar: 'العائلات والمجموعات الخاصة ومن يفضلون الراحة.' },
      meetingPoint: { en: 'Merzouga or arranged pick-up.', fr: 'Merzouga ou prise en charge organisée.', es: 'Merzouga o recogida organizada.', ar: 'مرزوكة أو نقطة استلام منظمة.' },
      included: [{ en: 'Private 4x4 vehicle and driver-guide', fr: 'Véhicule 4x4 privé avec conducteur-guide', es: 'Vehículo 4x4 privado con conductor-guía', ar: 'سيارة 4x4 خاصة مع سائق مرشد' }],
      exclusions: [{ en: 'Camp stay and meals unless selected', fr: 'Camp et repas sauf sélection', es: 'Campamento y comidas salvo selección', ar: 'المخيم والوجبات ما لم يتم اختيارها' }],
      highlights: [{ en: 'Comfort-led exploration', fr: 'Exploration orientée confort', es: 'Exploración centrada en la comodidad', ar: 'استكشاف مريح' }]
    }
  },
  {
    slug: 'full-day-desert-exploration',
    category: 'fourByFour',
    featured: false,
    active: true,
    sortOrder: 9,
    durationLabel: 'Full day',
    durationDays: 1,
    startingPrice: 240,
    baseAdultPrice: 240,
    baseChildPrice: 120,
    privateSurcharge: 0,
    transferPrice: 0,
    capacityDefault: 10,
    unitCapacityDefault: 3,
    heroMedia: image('https://images.pexels.com/photos/4968848/pexels-photo-4968848.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'SUV desert exploration', fr: 'Exploration du désert en SUV', es: 'Exploración del desierto en SUV', ar: 'استكشاف الصحراء بسيارة SUV' }),
    gallery: [image('https://images.pexels.com/photos/34911379/pexels-photo-34911379.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'Dune route', fr: 'Route dans les dunes', es: 'Ruta en dunas', ar: 'مسار في الكثبان' })],
    addOns: [sharedAddOns.sunsetDinner],
    content: {
      title: { en: 'Full-Day Desert Exploration', fr: 'Exploration du désert à la journée', es: 'Exploración completa del desierto', ar: 'استكشاف صحراوي ليوم كامل' },
      shortDescription: { en: 'A wider Sahara day with space for landscape stops, local rhythm, and a stronger sense of place.', fr: 'Une journée plus vaste dans le Sahara avec des arrêts paysages, du rythme local et une sensation plus forte du lieu.', es: 'Un día más amplio por el Sahara con paradas panorámicas, ritmo local y una mayor sensación del lugar.', ar: 'يوم صحراوي أوسع مع محطات بانورامية وإيقاع محلي وإحساس أقوى بالمكان.' },
      longDescription: { en: 'This full-day format is for guests who do not want to reduce Merzouga to a single quick activity. It opens the day for deeper discovery, varied landscapes, and a more editorial, travel-rich experience.', fr: 'Ce format à la journée s’adresse aux voyageurs qui ne veulent pas réduire Merzouga à une seule activité rapide. Il ouvre la journée à une découverte plus profonde, des paysages variés et une expérience plus riche.', es: 'Este formato de día completo es para viajeros que no quieren reducir Merzouga a una sola actividad rápida. Abre la jornada a un descubrimiento más profundo, paisajes variados y una experiencia más rica.', ar: 'هذا التنسيق اليومي الكامل مخصص للضيوف الذين لا يريدون اختزال مرزوكة في نشاط واحد سريع، بل يفتح اليوم لاكتشاف أعمق ومناظر متنوعة وتجربة أغنى.' },
      idealFor: { en: 'Slow travellers and private groups.', fr: 'Voyageurs lents et groupes privés.', es: 'Viajeros pausados y grupos privados.', ar: 'المسافرون الهادئون والمجموعات الخاصة.' },
      meetingPoint: { en: 'Merzouga or arranged start point.', fr: 'Merzouga ou point de départ organisé.', es: 'Merzouga o punto de salida acordado.', ar: 'مرزوكة أو نقطة انطلاق منسقة.' },
      included: [{ en: 'Private day touring', fr: 'Circuit privé à la journée', es: 'Ruta privada de día completo', ar: 'جولة خاصة ليوم كامل' }],
      exclusions: [{ en: 'Camp stay unless selected', fr: 'Camp sauf sélection', es: 'Campamento salvo selección', ar: 'المخيم ما لم يتم اختياره' }],
      highlights: [{ en: 'Broader landscape coverage', fr: 'Couverture paysagère élargie', es: 'Cobertura amplia del paisaje', ar: 'تغطية أوسع للمناظر' }]
    }
  },
  {
    slug: 'romantic-luxury-camp-experience',
    category: 'romantic',
    featured: true,
    active: true,
    sortOrder: 10,
    durationLabel: '1 night',
    durationDays: 1,
    startingPrice: 420,
    baseAdultPrice: 210,
    baseChildPrice: 0,
    privateSurcharge: 0,
    transferPrice: 90,
    capacityDefault: 4,
    unitCapacityDefault: 2,
    heroMedia: image('https://images.pexels.com/photos/30757368/pexels-photo-30757368.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-camp.svg', { en: 'Luxury desert camp romance', fr: 'Romance en camp de luxe', es: 'Romance en campamento de lujo', ar: 'أجواء رومانسية في مخيم فاخر' }),
    gallery: [image('https://images.pexels.com/photos/13869948/pexels-photo-13869948.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-camp.svg', { en: 'Romantic tent interior', fr: 'Intérieur romantique', es: 'Interior romántico', ar: 'داخلية رومانسية' })],
    addOns: [sharedAddOns.privateTransfer, sharedAddOns.sunsetDinner, sharedAddOns.specialCake],
    content: {
      title: { en: 'Romantic Luxury Camp Experience', fr: 'Expérience romantique en camp de luxe', es: 'Experiencia romántica en campamento de lujo', ar: 'تجربة رومانسية في مخيم فاخر' },
      shortDescription: { en: 'A desert stay designed for proposals, honeymoons, anniversaries, and private celebrations with atmosphere.', fr: 'Un séjour désertique pensé pour les demandes en mariage, lunes de miel, anniversaires et célébrations privées.', es: 'Una estancia en el desierto pensada para pedidas de mano, lunas de miel, aniversarios y celebraciones privadas.', ar: 'إقامة صحراوية مصممة لطلبات الزواج وشهر العسل والذكرى السنوية والاحتفالات الخاصة.' },
      longDescription: { en: 'This romantic format layers privacy, styling, and hospitality to create a desert stay with emotional impact. It is ideal when the trip carries personal significance and details matter.', fr: 'Ce format romantique superpose intimité, mise en scène et hospitalité pour créer un séjour désertique à forte valeur émotionnelle. Il est idéal quand le voyage a une signification personnelle.', es: 'Este formato romántico combina privacidad, ambientación y hospitalidad para crear una estancia con verdadero impacto emocional. Es ideal cuando el viaje tiene un significado especial.', ar: 'يجمع هذا التنسيق الرومانسي بين الخصوصية والتنسيق والضيافة لخلق إقامة صحراوية ذات أثر عاطفي واضح، وهو مثالي عندما تكون الرحلة مناسبة شخصية مهمة.' },
      idealFor: { en: 'Couples, proposals, honeymoons.', fr: 'Couples, demandes en mariage, lunes de miel.', es: 'Parejas, pedidas de mano y lunas de miel.', ar: 'الأزواج وطلبات الزواج وشهر العسل.' },
      meetingPoint: { en: 'Merzouga or private transfer arrangement.', fr: 'Merzouga ou transfert privé organisé.', es: 'Merzouga o traslado privado organizado.', ar: 'مرزوكة أو نقل خاص منظم.' },
      included: [{ en: 'Premium romantic camp stay', fr: 'Séjour romantique premium au camp', es: 'Estancia romántica premium en campamento', ar: 'إقامة رومانسية راقية في المخيم' }],
      exclusions: [{ en: 'Decor upgrades unless selected', fr: 'Options déco sauf sélection', es: 'Mejoras de decoración salvo selección', ar: 'ترقيات الديكور ما لم يتم اختيارها' }],
      highlights: [{ en: 'High emotional impact', fr: 'Fort impact émotionnel', es: 'Alto impacto emocional', ar: 'أثر عاطفي قوي' }]
    }
  },
  {
    slug: 'multi-day-desert-tour-from-marrakech',
    category: 'multiDay',
    featured: false,
    active: true,
    sortOrder: 11,
    durationLabel: '3 days+',
    durationDays: 3,
    startingPrice: 690,
    baseAdultPrice: 690,
    baseChildPrice: 340,
    privateSurcharge: 180,
    transferPrice: 0,
    capacityDefault: 8,
    unitCapacityDefault: 2,
    heroMedia: image('https://images.pexels.com/photos/4968848/pexels-photo-4968848.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'Multi-day journey through Morocco', fr: 'Voyage multi-jours à travers le Maroc', es: 'Viaje de varios días por Marruecos', ar: 'رحلة متعددة الأيام عبر المغرب' }),
    gallery: [image('https://images.pexels.com/photos/34911379/pexels-photo-34911379.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'Desert road journey', fr: 'Route désertique', es: 'Ruta por el desierto', ar: 'رحلة طريق صحراوية' })],
    addOns: [sharedAddOns.sunsetDinner],
    content: {
      title: { en: 'Multi-Day Desert Tour from Marrakech', fr: 'Circuit désert de plusieurs jours depuis Marrakech', es: 'Tour de varios días al desierto desde Marrakech', ar: 'جولة صحراوية متعددة الأيام من مراكش' },
      shortDescription: { en: 'A private route that connects Marrakech with the Sahara in a polished, comfortable way.', fr: 'Un itinéraire privé reliant Marrakech au Sahara de manière fluide et confortable.', es: 'Una ruta privada que conecta Marrakech con el Sahara de forma cómoda y bien organizada.', ar: 'مسار خاص يربط مراكش بالصحراء بطريقة مريحة ومتقنة.' },
      longDescription: { en: 'This experience is structured for international travellers who want the Sahara as part of a wider Moroccan journey, with private coordination, pacing, and comfort carried throughout the route.', fr: 'Cette expérience est pensée pour les voyageurs internationaux qui veulent intégrer le Sahara dans un voyage plus large au Maroc, avec coordination privée, bon rythme et confort sur tout le parcours.', es: 'Esta experiencia está pensada para viajeros internacionales que desean incluir el Sahara dentro de un viaje más amplio por Marruecos, con coordinación privada, ritmo adecuado y comodidad en todo el recorrido.', ar: 'تم تصميم هذه التجربة للمسافرين الدوليين الذين يريدون إدراج الصحراء ضمن رحلة مغربية أوسع، مع تنسيق خاص ووتيرة مناسبة وراحة مستمرة طوال المسار.' },
      idealFor: { en: 'International travellers, private couples, families.', fr: 'Voyageurs internationaux, couples privés, familles.', es: 'Viajeros internacionales, parejas privadas y familias.', ar: 'المسافرون الدوليون والأزواج والعائلات.' },
      meetingPoint: { en: 'Marrakech city pick-up.', fr: 'Prise en charge à Marrakech.', es: 'Recogida en Marrakech.', ar: 'استلام من مدينة مراكش.' },
      included: [{ en: 'Private multi-day routing', fr: 'Organisation privée sur plusieurs jours', es: 'Ruta privada de varios días', ar: 'تنظيم خاص لعدة أيام' }],
      exclusions: [{ en: 'Specific hotel upgrades unless agreed', fr: 'Surclassements hôteliers spécifiques sauf accord', es: 'Mejoras hoteleras específicas salvo acuerdo', ar: 'ترقيات الفنادق الخاصة إلا إذا تم الاتفاق عليها' }],
      highlights: [{ en: 'Seamless route design', fr: 'Itinéraire fluide', es: 'Diseño de ruta fluido', ar: 'تصميم مسار سلس' }]
    }
  },
  {
    slug: 'multi-day-desert-tour-from-fes',
    category: 'multiDay',
    featured: false,
    active: true,
    sortOrder: 12,
    durationLabel: '2-3 days',
    durationDays: 2,
    startingPrice: 520,
    baseAdultPrice: 520,
    baseChildPrice: 260,
    privateSurcharge: 160,
    transferPrice: 0,
    capacityDefault: 8,
    unitCapacityDefault: 2,
    heroMedia: image('https://images.pexels.com/photos/4968848/pexels-photo-4968848.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'Journey from Fes to Sahara', fr: 'Voyage de Fès au Sahara', es: 'Viaje de Fez al Sahara', ar: 'رحلة من فاس إلى الصحراء' }),
    gallery: [image('https://images.pexels.com/photos/34911379/pexels-photo-34911379.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'Morocco road', fr: 'Route marocaine', es: 'Ruta marroquí', ar: 'طريق مغربي' })],
    addOns: [sharedAddOns.sunsetDinner],
    content: {
      title: { en: 'Multi-Day Desert Tour from Fes', fr: 'Circuit désert de plusieurs jours depuis Fès', es: 'Tour de varios días al desierto desde Fez', ar: 'جولة صحراوية متعددة الأيام من فاس' },
      shortDescription: { en: 'A private Fes-to-Sahara route that balances travel time with comfort and desert arrival elegance.', fr: 'Un itinéraire privé Fès-Sahara qui équilibre temps de route, confort et belle arrivée au désert.', es: 'Una ruta privada Fez-Sahara que equilibra tiempo de viaje, comodidad y una llegada elegante al desierto.', ar: 'مسار خاص من فاس إلى الصحراء يوازن بين وقت الطريق والراحة ووصول أنيق إلى الصحراء.' },
      longDescription: { en: 'This route is ideal for travellers starting in Fes who want a direct but refined path into Merzouga. We shape the timing and service level to keep the transition into the desert smooth.', fr: 'Cet itinéraire est idéal pour les voyageurs qui partent de Fès et veulent un accès direct mais raffiné vers Merzouga. Nous travaillons le timing et le niveau de service pour que l’entrée dans le désert soit fluide.', es: 'Esta ruta es ideal para quienes empiezan en Fez y desean un acceso directo pero refinado hacia Merzouga. Ajustamos tiempos y servicio para que la transición al desierto sea fluida.', ar: 'هذا المسار مثالي للمسافرين الذين ينطلقون من فاس ويريدون دخولاً مباشراً لكن راقياً إلى مرزوكة، حيث نضبط التوقيت ومستوى الخدمة ليكون الانتقال إلى الصحراء سلساً.' },
      idealFor: { en: 'Travellers beginning in Fes.', fr: 'Voyageurs débutant à Fès.', es: 'Viajeros que comienzan en Fez.', ar: 'المسافرون الذين ينطلقون من فاس.' },
      meetingPoint: { en: 'Fes city or riad pick-up.', fr: 'Prise en charge à Fès.', es: 'Recogida en Fez.', ar: 'استلام من فاس.' },
      included: [{ en: 'Private desert routing from Fes', fr: 'Parcours privé depuis Fès', es: 'Ruta privada desde Fez', ar: 'مسار صحراوي خاص من فاس' }],
      exclusions: [{ en: 'Hotel upgrades unless selected', fr: 'Surclassements hôteliers sauf sélection', es: 'Mejoras hoteleras salvo selección', ar: 'ترقيات الفنادق ما لم يتم اختيارها' }],
      highlights: [{ en: 'Efficient premium routing', fr: 'Parcours premium efficace', es: 'Ruta premium eficiente', ar: 'مسار راقٍ وفعّال' }]
    }
  },
  {
    slug: 'airport-transfer',
    category: 'transfer',
    featured: false,
    active: true,
    sortOrder: 13,
    durationLabel: 'Custom',
    durationDays: 1,
    startingPrice: 90,
    baseAdultPrice: 90,
    baseChildPrice: 0,
    privateSurcharge: 0,
    transferPrice: 0,
    capacityDefault: 40,
    unitCapacityDefault: 6,
    heroMedia: image('https://images.pexels.com/photos/4968848/pexels-photo-4968848.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'Transfer route', fr: 'Itinéraire de transfert', es: 'Ruta de traslado', ar: 'مسار النقل' }),
    gallery: [image('https://images.pexels.com/photos/4968848/pexels-photo-4968848.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'Road transfer', fr: 'Transfert routier', es: 'Traslado por carretera', ar: 'نقل بري' })],
    addOns: [],
    content: {
      title: { en: 'Airport Transfer', fr: 'Transfert aéroport', es: 'Traslado desde/hasta aeropuerto', ar: 'نقل من / إلى المطار' },
      shortDescription: { en: 'Private arrival or departure support with direct coordination.', fr: 'Assistance privée à l’arrivée ou au départ avec coordination directe.', es: 'Asistencia privada de llegada o salida con coordinación directa.', ar: 'مساندة خاصة للوصول أو المغادرة مع تنسيق مباشر.' },
      longDescription: { en: 'When flight timing and reliability matter, our airport transfer option is the simplest way to keep the first and last legs of the journey smooth.', fr: 'Lorsque les horaires de vol et la fiabilité comptent, notre transfert aéroport est la manière la plus simple de garder le début et la fin du voyage fluides.', es: 'Cuando el horario del vuelo y la fiabilidad importan, nuestra opción de traslado al aeropuerto es la forma más sencilla de mantener fluido el inicio y el final del viaje.', ar: 'عندما يكون توقيت الرحلة والاعتمادية مهمين، فإن خيار النقل من وإلى المطار هو أبسط طريقة لجعل بداية الرحلة ونهايتها أكثر سلاسة.' },
      idealFor: { en: 'International arrivals and departures.', fr: 'Arrivées et départs internationaux.', es: 'Llegadas y salidas internacionales.', ar: 'الوصولات والمغادرات الدولية.' },
      meetingPoint: { en: 'Airport arrival hall or arranged meeting point.', fr: 'Hall d’arrivée ou point de rendez-vous convenu.', es: 'Sala de llegadas o punto de encuentro acordado.', ar: 'صالة الوصول أو نقطة لقاء متفق عليها.' },
      included: [{ en: 'Coordinated private transfer', fr: 'Transfert privé coordonné', es: 'Traslado privado coordinado', ar: 'نقل خاص منظم' }],
      exclusions: [{ en: 'Additional stops unless agreed', fr: 'Arrêts supplémentaires sauf accord', es: 'Paradas adicionales salvo acuerdo', ar: 'التوقفات الإضافية إلا إذا تم الاتفاق عليها' }],
      highlights: [{ en: 'Reliable arrival support', fr: 'Arrivée sécurisée', es: 'Apoyo fiable a la llegada', ar: 'دعم وصول موثوق' }]
    }
  },
  {
    slug: 'private-transfer',
    category: 'transfer',
    featured: false,
    active: true,
    sortOrder: 14,
    durationLabel: 'Custom',
    durationDays: 1,
    startingPrice: 120,
    baseAdultPrice: 120,
    baseChildPrice: 0,
    privateSurcharge: 0,
    transferPrice: 0,
    capacityDefault: 30,
    unitCapacityDefault: 5,
    heroMedia: image('https://images.pexels.com/photos/4968848/pexels-photo-4968848.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'Private transfer in Morocco', fr: 'Transfert privé au Maroc', es: 'Traslado privado en Marruecos', ar: 'نقل خاص في المغرب' }),
    gallery: [image('https://images.pexels.com/photos/34911379/pexels-photo-34911379.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'Private route', fr: 'Itinéraire privé', es: 'Ruta privada', ar: 'مسار خاص' })],
    addOns: [],
    content: {
      title: { en: 'Private Transfer', fr: 'Transfert privé', es: 'Traslado privado', ar: 'نقل خاص' },
      shortDescription: { en: 'Flexible transport for guests who want a clean, comfortable route between destinations.', fr: 'Transport flexible pour les voyageurs qui veulent un trajet propre, confortable et fluide.', es: 'Transporte flexible para viajeros que desean un trayecto limpio, cómodo y fluido.', ar: 'نقل مرن للضيوف الذين يريدون مساراً نظيفاً ومريحاً بين الوجهات.' },
      longDescription: { en: 'Private transfer can be used on its own or added around camp and touring services. It is designed to reduce travel friction and support higher-end itinerary planning.', fr: 'Le transfert privé peut être réservé seul ou ajouté autour des services de camp et de circuit. Il est conçu pour réduire les frictions du voyage et soutenir une planification haut de gamme.', es: 'El traslado privado puede reservarse por sí solo o añadirse a campamentos y tours. Está diseñado para reducir fricciones y apoyar una planificación de gama alta.', ar: 'يمكن حجز النقل الخاص بمفرده أو إضافته حول خدمات المخيم والجولات، وهو مصمم لتقليل عناء الطريق ودعم تخطيط الرحلات الراقية.' },
      idealFor: { en: 'Premium travellers, families, custom routes.', fr: 'Voyageurs premium, familles, trajets sur mesure.', es: 'Viajeros premium, familias y rutas a medida.', ar: 'المسافرون الراقيون والعائلات والمسارات المخصصة.' },
      meetingPoint: { en: 'Custom according to the route.', fr: 'Selon l’itinéraire choisi.', es: 'Según la ruta elegida.', ar: 'بحسب المسار المطلوب.' },
      included: [{ en: 'Private route coordination', fr: 'Coordination du trajet privé', es: 'Coordinación de ruta privada', ar: 'تنسيق المسار الخاص' }],
      exclusions: [{ en: 'Activity costs unless bundled', fr: 'Coût des activités sauf formule', es: 'Coste de actividades salvo paquete', ar: 'تكلفة الأنشطة إلا إذا كانت ضمن باقة' }],
      highlights: [{ en: 'Comfort and flexibility', fr: 'Confort et flexibilité', es: 'Comodidad y flexibilidad', ar: 'راحة ومرونة' }]
    }
  },
  {
    slug: 'custom-luxury-desert-tour',
    category: 'multiDay',
    featured: true,
    active: true,
    sortOrder: 15,
    durationLabel: 'Tailored',
    durationDays: 2,
    startingPrice: 0,
    baseAdultPrice: 0,
    baseChildPrice: 0,
    privateSurcharge: 0,
    transferPrice: 0,
    capacityDefault: 20,
    unitCapacityDefault: 5,
    heroMedia: image('https://images.pexels.com/photos/30158465/pexels-photo-30158465.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-dunes.svg', { en: 'Custom luxury desert journey', fr: 'Voyage désertique de luxe sur mesure', es: 'Viaje de lujo al desierto a medida', ar: 'رحلة صحراوية فاخرة حسب الطلب' }),
    gallery: [image('https://images.pexels.com/photos/34911379/pexels-photo-34911379.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-journey.svg', { en: 'Custom route', fr: 'Itinéraire sur mesure', es: 'Ruta a medida', ar: 'مسار حسب الطلب' })],
    addOns: [sharedAddOns.privateTransfer, sharedAddOns.sunsetDinner, sharedAddOns.specialCake],
    content: {
      title: { en: 'Custom Luxury Desert Tour', fr: 'Tour de luxe désertique sur mesure', es: 'Tour de lujo por el desierto a medida', ar: 'جولة صحراوية فاخرة مخصصة' },
      shortDescription: { en: 'For travellers who want the journey designed around their dates, style, and pace rather than around a fixed template.', fr: 'Pour les voyageurs qui veulent un voyage conçu autour de leurs dates, de leur style et de leur rythme plutôt qu’autour d’un modèle fixe.', es: 'Para viajeros que quieren un viaje diseñado según sus fechas, estilo y ritmo, no según una plantilla fija.', ar: 'للمسافرين الذين يريدون رحلة مصممة حول تواريخهم وأسلوبهم ووتيرتهم لا حول قالب ثابت.' },
      longDescription: { en: 'Custom luxury touring is where we can align stay length, route design, activities, transfer style, special dining, and pacing into one coherent desert journey.', fr: 'Le tour de luxe sur mesure permet d’aligner la durée du séjour, le tracé de l’itinéraire, les activités, le style de transfert, les dîners spéciaux et le rythme global en une seule expérience cohérente.', es: 'El tour de lujo a medida permite alinear duración, diseño de ruta, actividades, estilo de traslado, cenas especiales y ritmo general en una sola experiencia coherente.', ar: 'تتيح الجولة الفاخرة المخصصة مواءمة مدة الإقامة وتصميم المسار والأنشطة وأسلوب النقل والعشاء الخاص والوتيرة العامة في تجربة صحراوية واحدة متماسكة.' },
      idealFor: { en: 'Premium travellers who want a bespoke plan.', fr: 'Voyageurs premium souhaitant un plan sur mesure.', es: 'Viajeros premium que desean un plan a medida.', ar: 'المسافرون الراقيون الذين يريدون خطة مخصصة.' },
      meetingPoint: { en: 'Tailored to the itinerary.', fr: 'Adapté à l’itinéraire.', es: 'Adaptado al itinerario.', ar: 'حسب البرنامج.' },
      included: [{ en: 'Consultative itinerary design', fr: 'Conception consultative de l’itinéraire', es: 'Diseño consultivo del itinerario', ar: 'تصميم استشاري للبرنامج' }],
      exclusions: [{ en: 'Final scope depends on the confirmed plan', fr: 'Le périmètre final dépend du plan confirmé', es: 'El alcance final depende del plan confirmado', ar: 'النطاق النهائي يعتمد على الخطة المؤكدة' }],
      highlights: [{ en: 'Maximum flexibility', fr: 'Flexibilité maximale', es: 'Máxima flexibilidad', ar: 'أقصى درجات المرونة' }]
    }
  },
  {
    slug: 'family-desert-experience',
    category: 'family',
    featured: false,
    active: true,
    sortOrder: 16,
    durationLabel: '1 night+',
    durationDays: 1,
    startingPrice: 290,
    baseAdultPrice: 145,
    baseChildPrice: 72,
    privateSurcharge: 0,
    transferPrice: 90,
    capacityDefault: 16,
    unitCapacityDefault: 4,
    heroMedia: image('https://images.pexels.com/photos/29107895/pexels-photo-29107895.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-dunes.svg', { en: 'Family desert journey', fr: 'Aventure familiale dans le désert', es: 'Aventura familiar en el desierto', ar: 'رحلة عائلية في الصحراء' }),
    gallery: [image('https://images.pexels.com/photos/30757368/pexels-photo-30757368.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-camp.svg', { en: 'Family camp stay', fr: 'Séjour familial au camp', es: 'Estancia familiar en campamento', ar: 'إقامة عائلية في المخيم' })],
    addOns: [sharedAddOns.privateTransfer, sharedAddOns.sandboarding],
    content: {
      title: { en: 'Family Desert Experience', fr: 'Expérience désert en famille', es: 'Experiencia familiar en el desierto', ar: 'تجربة عائلية في الصحراء' },
      shortDescription: { en: 'A family-shaped desert plan with softer pacing, reassurance, and easy coordination.', fr: 'Un programme désertique pensé pour la famille, avec rythme doux, réassurance et coordination facile.', es: 'Un plan desértico pensado para familias, con ritmo más suave, tranquilidad y coordinación sencilla.', ar: 'برنامج صحراوي مصمم للعائلة بوتيرة أخف وطمأنينة وتنسيق سهل.' },
      longDescription: { en: 'The family desert experience brings together comfort, transport clarity, suitable pacing, and the possibility of adding light adventure without overloading the day.', fr: 'L’expérience famille réunit confort, clarté du transport, bon rythme et possibilité d’ajouter une aventure légère sans surcharger la journée.', es: 'La experiencia familiar reúne comodidad, claridad en el transporte, ritmo adecuado y posibilidad de añadir una aventura ligera sin sobrecargar el día.', ar: 'تجمع التجربة العائلية بين الراحة ووضوح ترتيبات النقل والوتيرة المناسبة وإمكانية إضافة مغامرة خفيفة دون إرهاق اليوم.' },
      idealFor: { en: 'Families with children and mixed-age groups.', fr: 'Familles avec enfants et groupes d’âges variés.', es: 'Familias con niños y grupos de edades mixtas.', ar: 'العائلات التي تضم أطفالاً ومجموعات بأعمار مختلفة.' },
      meetingPoint: { en: 'Merzouga or transfer pick-up.', fr: 'Merzouga ou prise en charge en transfert.', es: 'Merzouga o recogida en traslado.', ar: 'مرزوكة أو استلام عبر النقل.' },
      included: [{ en: 'Family-paced planning', fr: 'Planification adaptée à la famille', es: 'Planificación adaptada a familias', ar: 'تخطيط مناسب للعائلة' }],
      exclusions: [{ en: 'Special child equipment unless requested', fr: 'Équipement enfant spécifique sauf demande', es: 'Equipamiento infantil específico salvo petición', ar: 'المعدات الخاصة بالأطفال إلا عند الطلب' }],
      highlights: [{ en: 'Comfort-first design', fr: 'Conception orientée confort', es: 'Diseño orientado al confort', ar: 'تصميم يركز على الراحة' }]
    }
  },
  {
    slug: 'photography-private-sunset-experience',
    category: 'photography',
    featured: false,
    active: true,
    sortOrder: 17,
    durationLabel: '2.5 hours',
    durationDays: 1,
    startingPrice: 160,
    baseAdultPrice: 160,
    baseChildPrice: 80,
    privateSurcharge: 0,
    transferPrice: 25,
    capacityDefault: 6,
    unitCapacityDefault: 2,
    heroMedia: image('https://images.pexels.com/photos/30158465/pexels-photo-30158465.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-dunes.svg', { en: 'Private sunset photography in dunes', fr: 'Photographie privée au coucher du soleil', es: 'Fotografía privada al atardecer', ar: 'تصوير خاص وقت الغروب' }),
    gallery: [image('https://images.pexels.com/photos/30158465/pexels-photo-30158465.jpeg?auto=compress&cs=tinysrgb&w=1600', '/fallback-dunes.svg', { en: 'Sunset photography session', fr: 'Session photo au coucher du soleil', es: 'Sesión fotográfica al atardecer', ar: 'جلسة تصوير عند الغروب' })],
    addOns: [sharedAddOns.privateTransfer, sharedAddOns.sunsetDinner],
    content: {
      title: { en: 'Photography / Private Sunset Experience', fr: 'Photographie / expérience privée au coucher du soleil', es: 'Fotografía / experiencia privada al atardecer', ar: 'تجربة تصوير / غروب خاصة' },
      shortDescription: { en: 'A private golden-hour set-up designed for personal photography, couples, content creation, or a quiet signature moment.', fr: 'Une mise en scène privée à l’heure dorée pour la photo personnelle, les couples, la création de contenu ou un moment signature.', es: 'Un montaje privado en hora dorada pensado para fotografía personal, parejas, creación de contenido o un momento especial.', ar: 'تنسيق خاص في الساعة الذهبية مخصص للتصوير الشخصي أو للأزواج أو لصناع المحتوى أو للحظات الخاصة.' },
      longDescription: { en: 'This experience prioritizes timing, privacy, and aesthetics. Whether the goal is a quiet couple session, branded travel content, or a beautifully staged sunset moment, we focus on atmosphere and coordination.', fr: 'Cette expérience donne la priorité au timing, à l’intimité et à l’esthétique. Que l’objectif soit une séance couple, du contenu voyage ou un moment au coucher du soleil soigneusement mis en scène, nous misons sur l’atmosphère et la coordination.', es: 'Esta experiencia prioriza el tiempo, la privacidad y la estética. Ya sea para una sesión en pareja, contenido de viaje o un momento de atardecer cuidadosamente preparado, nos centramos en la atmósfera y la coordinación.', ar: 'تعطي هذه التجربة الأولوية للتوقيت والخصوصية والجمال البصري. سواء كان الهدف جلسة زوجية هادئة أو محتوى سفر أو لحظة غروب منسقة بعناية، فإننا نركز على الأجواء والتنظيم.' },
      idealFor: { en: 'Couples, photographers, creators, special moments.', fr: 'Couples, photographes, créateurs, moments spéciaux.', es: 'Parejas, fotógrafos, creadores y momentos especiales.', ar: 'الأزواج والمصورون وصناع المحتوى والمناسبات الخاصة.' },
      meetingPoint: { en: 'Private transfer or direct dune meeting point.', fr: 'Transfert privé ou point de rencontre direct dans les dunes.', es: 'Traslado privado o punto directo entre dunas.', ar: 'نقل خاص أو نقطة لقاء مباشرة بين الكثبان.' },
      included: [{ en: 'Private sunset coordination', fr: 'Coordination privée du coucher du soleil', es: 'Coordinación privada del atardecer', ar: 'تنسيق خاص للغروب' }],
      exclusions: [{ en: 'Professional photographer unless arranged', fr: 'Photographe professionnel sauf arrangement', es: 'Fotógrafo profesional salvo acuerdo', ar: 'مصور محترف إلا إذا تم الترتيب' }],
      highlights: [{ en: 'Editorial visual potential', fr: 'Fort potentiel visuel éditorial', es: 'Potencial visual editorial', ar: 'إمكانات بصرية تحريرية' }]
    }
  }
];
