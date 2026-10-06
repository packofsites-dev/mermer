import React from 'react';
import { RESTAURANT_INFO } from '../data/menuData';

interface FooterProps {
  onNavigateMenu: () => void;
  onNavigateHomeSection: (sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateMenu,
  onNavigateHomeSection,
}) => {
  return (
    <footer className="bg-charcoal text-bone border-t hairline-border-dark">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start pb-12 sm:pb-16 border-b hairline-border-dark">
          {/* Brand & Slogan */}
          <div className="md:col-span-5">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onNavigateHomeSection();
              }}
              className="font-serif font-normal text-2xl sm:text-3xl tracking-[0.24em] text-bone uppercase inline-block"
            >
              {RESTAURANT_INFO.name}
            </a>
            <p className="mt-4 font-serif text-xl sm:text-2xl text-stone leading-[1.4]">
              {RESTAURANT_INFO.slogan}
            </p>
          </div>

          {/* Location & Phone */}
          <div className="md:col-span-4 space-y-2 font-sans text-sm text-bone/85">
            <p className="text-xs tracking-[0.14em] uppercase text-stone mb-3">
              Ünvan və Əlaqə
            </p>
            <p>İçərişəhər, Bakı</p>
            <p className="pt-1">
              <a
                href={RESTAURANT_INFO.phoneHref}
                className="text-bone hover:text-stone transition-colors tabular-nums font-medium"
              >
                {RESTAURANT_INFO.phone}
              </a>
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <p className="text-xs tracking-[0.14em] uppercase text-stone mb-3 font-sans">
              Bölmələr
            </p>
            <ul className="space-y-3 text-xs tracking-[0.14em] uppercase font-sans">
              <li>
                <button
                  type="button"
                  onClick={onNavigateMenu}
                  className="text-bone/85 hover:text-stone transition-colors cursor-pointer py-1"
                >
                  MENYU
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateHomeSection('haqqimizda')}
                  className="text-bone/85 hover:text-stone transition-colors cursor-pointer py-1"
                >
                  HAQQIMIZDA
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateHomeSection('elaqe')}
                  className="text-bone/85 hover:text-stone transition-colors cursor-pointer py-1"
                >
                  ƏLAQƏ
                </button>
              </li>
              <li>
                <a
                  href={RESTAURANT_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone/85 hover:text-stone transition-colors inline-block py-1"
                >
                  İNSTAQRAM
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans text-bone/55">
          <p>© {new Date().getFullYear()} MƏRMƏR. Bütün hüquqlar qorunur.</p>
          <p className="tabular-nums">{RESTAURANT_INFO.hours.daily}</p>
        </div>
      </div>
    </footer>
  );
};
