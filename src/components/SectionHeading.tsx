import React from 'react';

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  theme?: 'light' | 'dark';
  align?: 'left' | 'split';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  description,
  theme = 'light',
  align = 'left',
  className = '',
}) => {
  const isDark = theme === 'dark';

  if (align === 'split' && description) {
    return (
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end ${className}`}
      >
        <div className="lg:col-span-7">
          {kicker && (
            <p
              className={`text-xs tracking-[0.14em] uppercase mb-3 font-sans ${
                isDark ? 'text-stone' : 'text-charcoal/65'
              }`}
            >
              {kicker}
            </p>
          )}
          <h2
            className={`font-serif font-normal text-3xl sm:text-4xl lg:text-[44px] leading-[1.12] tracking-[-0.01em] [text-wrap:balance] ${
              isDark ? 'text-bone' : 'text-charcoal'
            }`}
          >
            {title}
          </h2>
        </div>
        <div className="lg:col-span-5">
          <p
            className={`font-sans text-[15px] sm:text-base leading-[1.65] max-w-prose ${
              isDark ? 'text-bone/80' : 'text-charcoal/80'
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl ${className}`}>
      {kicker && (
        <p
          className={`text-xs tracking-[0.14em] uppercase mb-3 font-sans ${
            isDark ? 'text-stone' : 'text-charcoal/65'
          }`}
        >
          {kicker}
        </p>
      )}
      <h2
        className={`font-serif font-normal text-3xl sm:text-4xl lg:text-[44px] leading-[1.12] tracking-[-0.01em] [text-wrap:balance] ${
          isDark ? 'text-bone' : 'text-charcoal'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 font-sans text-[15px] sm:text-base leading-[1.65] max-w-prose ${
            isDark ? 'text-bone/80' : 'text-charcoal/80'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
