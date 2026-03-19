'use client';

import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export function FAQAccordion({ items }: { items: Array<{ question: string; answer: string }> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="overflow-hidden rounded-3xl border border-black/5 bg-white dark:border-white/10 dark:bg-stone-950/60">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-start"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="font-serif text-xl text-stone-900 dark:text-white">{item.question}</span>
              {isOpen ? <Minus className="h-5 w-5 text-amber-700 dark:text-amber-300" /> : <Plus className="h-5 w-5 text-amber-700 dark:text-amber-300" />}
            </button>
            {isOpen ? (
              <div className="px-6 pb-6 text-sm leading-7 text-stone-600 dark:text-stone-300">{item.answer}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
