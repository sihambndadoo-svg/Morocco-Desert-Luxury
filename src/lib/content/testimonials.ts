import { Testimonial } from '@/types';

export const defaultTestimonials: Testimonial[] = [
  {
    full_name: 'Sophie R.',
    country: 'France',
    experience_slug: 'romantic-luxury-camp-experience',
    rating: 5,
    is_featured: true,
    is_visible: true,
    sort_order: 1,
    quote: {
      en: 'The experience felt private, polished, and genuinely warm. The timing, the camp atmosphere, and the owner communication were all excellent.',
      fr: 'L’expérience était privée, soignée et sincèrement chaleureuse. Le timing, l’atmosphère du camp et la communication avec le propriétaire étaient excellents.',
      es: 'La experiencia se sintió privada, cuidada y realmente cálida. El timing, la atmósfera del campamento y la comunicación con el propietario fueron excelentes.',
      ar: 'كانت التجربة خاصة ومتقنة ودافئة فعلاً. كان التوقيت وأجواء المخيم والتواصل مع المالك ممتازة.'
    }
  },
  {
    full_name: 'Daniel M.',
    country: 'Spain',
    experience_slug: 'private-4x4-erg-chebbi-tour',
    rating: 5,
    is_featured: true,
    is_visible: true,
    sort_order: 2,
    quote: {
      en: 'Everything was clear before arrival, which made the trip feel safe and premium. The 4x4 day through the dunes was beautiful.',
      fr: 'Tout était clair avant l’arrivée, ce qui rendait le voyage rassurant et premium. La journée en 4x4 dans les dunes était magnifique.',
      es: 'Todo estaba claro antes de llegar, lo que hizo que el viaje se sintiera seguro y premium. El día en 4x4 por las dunas fue precioso.',
      ar: 'كان كل شيء واضحاً قبل الوصول، وهذا جعل الرحلة تبدو آمنة وراقية. كان يوم 4x4 بين الكثبان رائعاً.'
    }
  },
  {
    full_name: 'Layla A.',
    country: 'United Kingdom',
    experience_slug: 'luxury-desert-camp-2-nights',
    rating: 5,
    is_featured: true,
    is_visible: true,
    sort_order: 3,
    quote: {
      en: 'Two nights was the perfect choice. We never felt rushed, and the camp stay had exactly the warm luxury feel we were hoping for.',
      fr: 'Deux nuits étaient le bon choix. Nous ne nous sommes jamais sentis pressés et le camp avait exactement la sensation de luxe chaleureux que nous recherchions.',
      es: 'Dos noches fue la opción perfecta. Nunca nos sentimos apurados y la estancia tuvo justo esa sensación de lujo cálido que esperábamos.',
      ar: 'كانت الليلتان الخيار المثالي. لم نشعر بالعجلة أبداً، وكانت الإقامة تحمل بالضبط ذلك الإحساس بالفخامة الدافئة الذي كنا نريده.'
    }
  }
];
