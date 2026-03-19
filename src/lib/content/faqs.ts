import { LocalizedString } from '@/types';

export interface FAQItem {
  question: LocalizedString;
  answer: LocalizedString;
  category: 'general' | 'camp' | 'activities' | 'arrival' | 'payments';
}

export const faqs: FAQItem[] = [
  {
    category: 'general',
    question: {
      en: 'How far in advance should I book?',
      fr: 'Combien de temps à l’avance faut-il réserver ?',
      es: '¿Con cuánta antelación debo reservar?',
      ar: 'كم من الوقت يجب أن أحجز مسبقاً؟'
    },
    answer: {
      en: 'For high-demand dates, especially spring, festive season, and premium weekends, we recommend booking as early as possible. Last-minute requests are welcome but subject to availability.',
      fr: 'Pour les dates très demandées, notamment au printemps, pendant la période festive et les week-ends premium, nous recommandons de réserver le plus tôt possible. Les demandes de dernière minute sont les bienvenues selon disponibilité.',
      es: 'Para fechas de alta demanda, especialmente primavera, temporada festiva y fines de semana premium, recomendamos reservar lo antes posible. Las solicitudes de última hora son bienvenidas según disponibilidad.',
      ar: 'في التواريخ ذات الطلب المرتفع، خاصة في الربيع وفترة الأعياد وعطلات نهاية الأسبوع المميزة، ننصح بالحجز المبكر قدر الإمكان. كما نقبل الطلبات المتأخرة حسب التوفر.'
    }
  },
  {
    category: 'camp',
    question: {
      en: 'Are the luxury camp tents private and comfortable?',
      fr: 'Les tentes du camp de luxe sont-elles privées et confortables ?',
      es: '¿Las tiendas del campamento de lujo son privadas y cómodas?',
      ar: 'هل خيام المخيم الفاخر خاصة ومريحة؟'
    },
    answer: {
      en: 'Yes. The experience is designed around privacy, quality bedding, warm hosting, and an elevated desert atmosphere. Exact tent styling can evolve by season, but the service level remains premium.',
      fr: 'Oui. L’expérience est pensée autour de l’intimité, d’une literie de qualité, d’un accueil chaleureux et d’une atmosphère désertique raffinée. Le style précis des tentes peut évoluer selon la saison, mais le niveau de service reste premium.',
      es: 'Sí. La experiencia está diseñada en torno a la privacidad, buena ropa de cama, atención cálida y una atmósfera desértica refinada. El estilo exacto de la tienda puede cambiar según la temporada, pero el nivel de servicio sigue siendo premium.',
      ar: 'نعم. تم تصميم التجربة حول الخصوصية وجودة الفراش والضيافة الدافئة وأجواء صحراوية راقية. قد يختلف أسلوب الخيام حسب الموسم، لكن مستوى الخدمة يبقى فاخراً.'
    }
  },
  {
    category: 'activities',
    question: {
      en: 'Can I combine camp, camel, quad, and transfer in one reservation?',
      fr: 'Puis-je combiner camp, chameau, quad et transfert dans une seule réservation ?',
      es: '¿Puedo combinar campamento, camello, quad y traslado en una sola reserva?',
      ar: 'هل يمكنني الجمع بين المخيم والجمال والكواد والنقل في حجز واحد؟'
    },
    answer: {
      en: 'Absolutely. The booking system supports one main experience plus additional services, and we regularly arrange combinations such as camp plus sunset camel ride plus private transfer.',
      fr: 'Absolument. Le système de réservation prend en charge une expérience principale avec des services additionnels, et nous organisons régulièrement des combinaisons comme camp + coucher du soleil à dos de chameau + transfert privé.',
      es: 'Por supuesto. El sistema de reservas admite una experiencia principal con servicios adicionales, y organizamos con frecuencia combinaciones como campamento + paseo en camello al atardecer + traslado privado.',
      ar: 'بالتأكيد. يدعم نظام الحجز تجربة رئيسية مع خدمات إضافية، وننظم باستمرار تركيبات مثل المخيم مع رحلة غروب على الجمل مع نقل خاص.'
    }
  },
  {
    category: 'arrival',
    question: {
      en: 'Do you help with arrival and meeting point coordination?',
      fr: 'Aidez-vous pour l’arrivée et la coordination du point de rendez-vous ?',
      es: '¿Ayudan con la llegada y el punto de encuentro?',
      ar: 'هل تساعدون في تنسيق الوصول ونقطة اللقاء؟'
    },
    answer: {
      en: 'Yes. After confirmation, we send the appropriate arrival instructions according to your route, transfer type, and selected services. This helps reduce operational confusion on the day.',
      fr: 'Oui. Après confirmation, nous envoyons les bonnes consignes d’arrivée selon votre itinéraire, le type de transfert et les services choisis. Cela réduit les confusions le jour même.',
      es: 'Sí. Después de la confirmación enviamos las instrucciones de llegada adecuadas según tu ruta, tipo de traslado y servicios elegidos. Esto evita confusiones el día de llegada.',
      ar: 'نعم. بعد التأكيد نرسل تعليمات الوصول المناسبة حسب مسارك ونوع النقل والخدمات المختارة، مما يقلل أي ارتباك يوم الوصول.'
    }
  },
  {
    category: 'payments',
    question: {
      en: 'Can I reserve before online payment is fully connected?',
      fr: 'Puis-je réserver avant que le paiement en ligne soit complètement connecté ?',
      es: '¿Puedo reservar antes de que el pago en línea esté totalmente conectado?',
      ar: 'هل يمكنني الحجز قبل تفعيل الدفع الإلكتروني بشكل كامل؟'
    },
    answer: {
      en: 'Yes. Booking requests are saved even when gateway integrations are still in placeholder mode. We can confirm, request a deposit manually, or agree on pay-on-arrival according to the booking.',
      fr: 'Oui. Les demandes de réservation sont enregistrées même lorsque les passerelles de paiement sont encore en mode provisoire. Nous pouvons confirmer, demander un acompte manuellement ou convenir d’un paiement à l’arrivée selon le dossier.',
      es: 'Sí. Las solicitudes de reserva se guardan incluso cuando las pasarelas de pago siguen en modo provisional. Podemos confirmar, pedir un depósito manual o acordar pago a la llegada según la reserva.',
      ar: 'نعم. يتم حفظ طلبات الحجز حتى عندما تكون بوابات الدفع في وضع تجريبي أو مؤقت. ويمكننا التأكيد أو طلب عربون يدوياً أو الاتفاق على الدفع عند الوصول حسب الحجز.'
    }
  },
  {
    category: 'general',
    question: {
      en: 'Is the desert experience suitable for families and children?',
      fr: 'L’expérience dans le désert convient-elle aux familles et aux enfants ?',
      es: '¿La experiencia en el desierto es adecuada para familias y niños?',
      ar: 'هل التجربة الصحراوية مناسبة للعائلات والأطفال؟'
    },
    answer: {
      en: 'Yes, and we can adapt the rhythm, activity level, and transfer planning to family travel. The family desert experience is built specifically for comfort, pacing, and reassurance.',
      fr: 'Oui, et nous pouvons adapter le rythme, le niveau d’activité et la logistique des transferts aux familles. L’expérience famille est pensée précisément pour le confort, le bon rythme et la sérénité.',
      es: 'Sí, y podemos adaptar el ritmo, el nivel de actividad y la logística de traslado al viaje familiar. La experiencia familiar está pensada específicamente para comodidad y tranquilidad.',
      ar: 'نعم، ويمكننا تكييف الوتيرة ومستوى الأنشطة وترتيبات النقل لتناسب السفر العائلي. تم تصميم تجربة العائلة خصيصاً للراحة والطمأنينة.'
    }
  }
];


export { faqs as faqItems };
