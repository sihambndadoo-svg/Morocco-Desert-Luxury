insert into public.site_settings (key, value, updated_by)
values
  ('responsePromise', '{"en":"Most booking requests are answered within a few hours, often sooner on WhatsApp follow-up.","fr":"La plupart des demandes reçoivent une réponse en quelques heures, souvent plus vite avec un suivi WhatsApp.","es":"La mayoría de las solicitudes reciben respuesta en pocas horas, a menudo antes con seguimiento por WhatsApp.","ar":"يتم الرد على معظم طلبات الحجز خلال بضع ساعات، وغالباً أسرع مع المتابعة عبر واتساب."}'::jsonb, 'seed')
on conflict (key) do update set value = excluded.value, updated_by = excluded.updated_by, updated_at = timezone('utc', now());

insert into public.testimonials (full_name, country, experience_slug, rating, quote, is_featured, is_visible, sort_order)
values
  ('Sophie & Antoine', 'France', 'romantic-luxury-camp-experience', 5, '{"en":"Elegant from the first message to the final sunrise. The camp felt intimate, polished, and deeply atmospheric.","fr":"Élégant du premier message jusqu’au dernier lever de soleil. Le camp était intime, soigné et très atmosphérique.","es":"Elegante desde el primer mensaje hasta el último amanecer. El campamento fue íntimo, cuidado y muy atmosférico.","ar":"تجربة أنيقة من أول رسالة حتى آخر شروق. كان المخيم حميمياً ومتقناً ومفعماً بالأجواء."}'::jsonb, true, true, 1),
  ('Julia M.', 'Germany', 'luxury-desert-camp-2-nights', 5, '{"en":"The booking process felt reassuringly clear. Transfer timing, camp details, and special requests were all handled beautifully.","fr":"Le processus de réservation était très clair. Les horaires de transfert, les détails du camp et les demandes spéciales ont été gérés avec soin.","es":"El proceso de reserva resultó muy claro. Los horarios de traslado, los detalles del campamento y las peticiones especiales se gestionaron con mucho cuidado.","ar":"كانت عملية الحجز واضحة ومطمئنة. تم التعامل مع مواعيد النقل وتفاصيل المخيم والطلبات الخاصة بشكل رائع."}'::jsonb, true, true, 2),
  ('Carlos & Elena', 'Spain', 'sunset-camel-trek', 5, '{"en":"A beautiful sunset ride and genuinely warm hosting. It felt private, calm, and worth every minute.","fr":"Une magnifique balade au coucher du soleil avec un accueil très chaleureux. Tout semblait privé, calme et précieux.","es":"Un precioso paseo al atardecer con una acogida realmente cálida. Se sintió privado, tranquilo y muy valioso.","ar":"رحلة غروب جميلة وضيافة دافئة حقاً. كانت التجربة خاصة وهادئة وتستحق كل دقيقة."}'::jsonb, true, true, 3)
on conflict do nothing;

insert into public.media_assets (key, media_type, url, fallback_url, page_key, category, alt, is_active, sort_order)
values
  ('home-hero-video', 'video', 'https://videos.pexels.com/video-files/2055056/2055056-hd_1920_802_25fps.mp4', '/fallback-hero.svg', 'home', 'hero', '{"en":"Desert hero video","fr":"Vidéo hero du désert","es":"Video hero del desierto","ar":"فيديو رئيسي للصحراء"}'::jsonb, true, 1)
on conflict (key) do update set url = excluded.url, fallback_url = excluded.fallback_url, alt = excluded.alt, is_active = excluded.is_active, updated_at = timezone('utc', now());
