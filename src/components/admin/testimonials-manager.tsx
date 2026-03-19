'use client';

import { useMemo, useState } from 'react';
import { Eye, EyeOff, Loader2, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { Experience, Testimonial } from '@/types';
import { cn, getLocalizedText } from '@/lib/utils';

type EditableTestimonial = {
  id?: string;
  full_name: string;
  country: string;
  experience_slug: string;
  rating: number;
  quote: {
    en: string;
    fr: string;
    es: string;
    ar: string;
  };
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
};

function createEmptyTestimonial(sortOrder = 1): EditableTestimonial {
  return {
    full_name: '',
    country: '',
    experience_slug: '',
    rating: 5,
    quote: { en: '', fr: '', es: '', ar: '' },
    is_featured: false,
    is_visible: true,
    sort_order: sortOrder,
  };
}

function normalizeTestimonial(input: Partial<Testimonial> | null | undefined, sortOrder = 1): EditableTestimonial {
  return {
    id: input?.id,
    full_name: String(input?.full_name ?? ''),
    country: String(input?.country ?? ''),
    experience_slug: String(input?.experience_slug ?? ''),
    rating: Number(input?.rating ?? 5),
    quote: {
      en: String(input?.quote?.en ?? ''),
      fr: String(input?.quote?.fr ?? ''),
      es: String(input?.quote?.es ?? ''),
      ar: String(input?.quote?.ar ?? ''),
    },
    is_featured: Boolean(input?.is_featured),
    is_visible: input?.is_visible ?? true,
    sort_order: Number(input?.sort_order ?? sortOrder),
  };
}

export function TestimonialsManager({
  initialTestimonials,
  experiences,
}: {
  initialTestimonials: Testimonial[];
  experiences: Experience[];
}) {
  const sortedInitialTestimonials = useMemo(
    () => [...initialTestimonials].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)),
    [initialTestimonials]
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(sortedInitialTestimonials);
  const [form, setForm] = useState<EditableTestimonial>(
    sortedInitialTestimonials.length
      ? normalizeTestimonial(sortedInitialTestimonials[0], Number(sortedInitialTestimonials[sortedInitialTestimonials.length - 1]?.sort_order ?? 0) + 1)
      : createEmptyTestimonial(1)
  );
  const [selectedId, setSelectedId] = useState<string | undefined>(sortedInitialTestimonials[0]?.id);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const nextSortOrder = Math.max(1, ...testimonials.map((item) => Number(item.sort_order ?? 0))) + 1;

  function startCreate() {
    setSelectedId(undefined);
    setForm(createEmptyTestimonial(nextSortOrder));
    setMessage(null);
  }

  function startEdit(testimonial: Testimonial) {
    setSelectedId(testimonial.id);
    setForm(normalizeTestimonial(testimonial, nextSortOrder));
    setMessage(null);
  }

  async function onSave() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: form.id || undefined,
          full_name: form.full_name,
          country: form.country,
          experience_slug: form.experience_slug || null,
          rating: Number(form.rating),
          quote: form.quote,
          is_featured: form.is_featured,
          is_visible: form.is_visible,
          sort_order: Number(form.sort_order || nextSortOrder),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not save testimonial.');
      const saved = data.testimonial as Testimonial | undefined;
      if (saved) {
        setTestimonials((current) => {
          const others = current.filter((item) => item.id !== saved.id);
          return [...others, saved].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
        });
        setSelectedId(saved.id);
        setForm(normalizeTestimonial(saved, nextSortOrder));
      }
      setMessage('Review saved successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save testimonial.');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id?: string) {
    if (!id) {
      setMessage('This review does not have a database id yet, so it cannot be deleted from the dashboard.');
      return;
    }
    if (!window.confirm('Delete this review from the dashboard?')) return;

    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/testimonials?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not delete testimonial.');
      const nextTestimonials = testimonials.filter((item) => item.id !== id);
      setTestimonials(nextTestimonials);
      if (selectedId === id) {
        const nextSelected = nextTestimonials[0];
        if (nextSelected) {
          setSelectedId(nextSelected.id);
          setForm(normalizeTestimonial(nextSelected, nextSortOrder));
        } else {
          setSelectedId(undefined);
          setForm(createEmptyTestimonial(1));
        }
      }
      setMessage('Review deleted successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not delete testimonial.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-4 rounded-[1.75rem] border border-black/5 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-stone-900">Guest reviews</h2>
            <p className="mt-2 text-sm leading-7 text-stone-600">
              Edit, hide, feature, or delete any review shown on the public website.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            New review
          </button>
        </div>

        <div className="grid gap-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id ?? `${testimonial.full_name}-${testimonial.sort_order}`}
              className={cn(
                'rounded-[1.5rem] border p-4 transition',
                selectedId === testimonial.id ? 'border-amber-400 bg-amber-50' : 'border-black/5 bg-stone-50'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-stone-900">{testimonial.full_name}</h3>
                    {testimonial.is_visible ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                        <Eye className="h-3.5 w-3.5" />
                        Visible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-stone-200 px-2.5 py-1 text-[11px] font-semibold text-stone-700">
                        <EyeOff className="h-3.5 w-3.5" />
                        Hidden
                      </span>
                    )}
                    {testimonial.is_featured ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                        <Star className="h-3.5 w-3.5" />
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-stone-500">
                    {testimonial.country} · {testimonial.rating}/5
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(testimonial)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-stone-700"
                    aria-label={`Edit ${testimonial.full_name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(testimonial.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700"
                    aria-label={`Delete ${testimonial.full_name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-stone-600">“{testimonial.quote?.en ?? ''}”</p>
              {testimonial.experience_slug ? (
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone-500">{testimonial.experience_slug}</p>
              ) : null}
            </article>
          ))}
          {!testimonials.length ? <p className="text-sm text-stone-500">No reviews yet.</p> : null}
        </div>
      </div>

      <div className="space-y-4 rounded-[1.75rem] border border-black/5 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-stone-900">{form.id ? 'Edit review' : 'Create review'}</h2>
            <p className="mt-2 text-sm leading-7 text-stone-600">
              Manage multilingual review text and public visibility from one place.
            </p>
          </div>
          {form.id ? (
            <button
              type="button"
              onClick={startCreate}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-stone-700"
            >
              New instead
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-stone-800">
            Guest name
            <input
              value={form.full_name}
              onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-stone-800">
            Country
            <input
              value={form.country}
              onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-stone-800">
            Experience
            <select
              value={form.experience_slug}
              onChange={(event) => setForm((current) => ({ ...current, experience_slug: event.target.value }))}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
            >
              <option value="">No linked experience</option>
              {experiences.map((experience) => (
                <option key={experience.slug} value={experience.slug}>
                  {getLocalizedText(experience.content.title, 'en')}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-stone-800">
            Rating
            <input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) || 5 }))}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-stone-800">
            Sort order
            <input
              type="number"
              min={1}
              value={form.sort_order}
              onChange={(event) => setForm((current) => ({ ...current, sort_order: Number(event.target.value) || 1 }))}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
            />
          </label>
          <div className="grid gap-3 rounded-[1.5rem] border border-black/5 bg-stone-50 p-4 md:col-span-1">
            <label className="flex items-center gap-3 text-sm font-medium text-stone-800">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(event) => setForm((current) => ({ ...current, is_featured: event.target.checked }))}
                className="h-4 w-4 rounded border-stone-300 text-amber-600"
              />
              Feature this review on the home page
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-stone-800">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(event) => setForm((current) => ({ ...current, is_visible: event.target.checked }))}
                className="h-4 w-4 rounded border-stone-300 text-amber-600"
              />
              Show this review publicly
            </label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(['en', 'fr', 'es', 'ar'] as const).map((locale) => (
            <label key={locale} className="space-y-2 text-sm font-medium text-stone-800">
              Quote ({locale.toUpperCase()})
              <textarea
                rows={5}
                value={form.quote[locale]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    quote: { ...current.quote, [locale]: event.target.value },
                  }))
                }
                className="w-full rounded-[1.5rem] border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none"
              />
            </label>
          ))}
        </div>

        {message ? <p className="text-sm text-stone-600">{message}</p> : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save review
          </button>
          {form.id ? (
            <button
              type="button"
              onClick={() => onDelete(form.id)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 disabled:opacity-70"
            >
              <Trash2 className="h-4 w-4" />
              Delete review
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
