import { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-4">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-700 dark:text-amber-300">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-serif text-3xl leading-tight text-stone-900 dark:text-white sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="text-base leading-8 text-stone-600 dark:text-stone-300">{description}</p>
        ) : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
