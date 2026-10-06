import React, { useState } from 'react';
import { RESTAURANT_INFO } from '../data/menuData';

interface NavbarProps {
  activeView: 'home' | 'menu';
  onNavigateHome: (sectionId?: string) => void;
  onNavigateMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigateHome,
  onNavigateMenu,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (target: 'menu' | 'haqqimizda' | 'elaqe') => {
    setMobileMenuOpen(false);
    if (target === 'menu') {
      onNavigateMenu();
    } else {
      onNavigateHome(target);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-bone border-b hairline-border">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            onNavigateHome();
          }}
          className="font-serif font-normal text-xl min-[360px]:text-2xl sm:text-[26px] tracking-[0.2em] sm:tracking-[0.26em] text-charcoal uppercase focus-visible:outline-2 focus-visible:outline-olive whitespace-nowrap shrink-0"
        >
          {RESTAURANT_INFO.name}
        </a>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          aria-label="Əsas naviqasiya"
          className="hidden md:flex items-center gap-10 text-xs tracking-[0.14em] uppercase font-sans text-charcoal"
        >
          <a
            href="/menu"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('menu');
            }}
            className={`py-2 transition-colors duration-200 border-b cursor-pointer whitespace-nowrap ${
              activeView === 'menu'
                ? 'border-olive text-charcoal font-medium'
                : 'border-transparent text-charcoal/80 hover:text-charcoal hover:border-charcoal/40'
            }`}
          >
            MENYU
          </a>
          <a
            href="/#haqqimizda"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('haqqimizda');
            }}
            className="py-2 transition-colors duration-200 border-b border-transparent text-charcoal/80 hover:text-charcoal hover:border-charcoal/40 cursor-pointer whitespace-nowrap"
          >
            HAQQIMIZDA
          </a>
          <a
            href="/#elaqe"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('elaqe');
            }}
            className="py-2 transition-colors duration-200 border-b border-transparent text-charcoal/80 hover:text-charcoal hover:border-charcoal/40 cursor-pointer whitespace-nowrap"
          >
            ƏLAQƏ
          </a>
        </nav>

        {/* Zone 3: Mobile Hamburger / Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Menyunu bağla' : 'Menyunu aç'}
            className="inline-flex items-center justify-center gap-2.5 px-3 min-h-[44px] min-w-[44px] text-xs tracking-[0.12em] uppercase font-sans text-charcoal border hairline-border rounded-[2px] cursor-pointer"
          >
            <span>{mobileMenuOpen ? 'BAĞLA' : 'MENYU'}</span>
            <span
              aria-hidden="true"
              className="flex flex-col justify-center gap-[4px] w-4"
            >
              <span
                className={`block h-[1px] w-full bg-charcoal transition-transform duration-200 ${
                  mobileMenuOpen ? 'translate-y-[2.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[1px] w-full bg-charcoal transition-transform duration-200 ${
                  mobileMenuOpen ? '-translate-y-[2.5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-bone border-b hairline-border px-4 pt-3 pb-6">
          <nav
            aria-label="Mobil naviqasiya"
            className="flex flex-col divide-y hairline-border"
          >
            <a
              href="/menu"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('menu');
              }}
              className="min-h-[48px] py-3 text-left text-xs tracking-[0.14em] uppercase font-sans font-medium text-charcoal flex items-center justify-between cursor-pointer"
            >
              <span>MENYU</span>
              <span className="text-charcoal/60">Menyu səhifəsi</span>
            </a>
            <a
              href="/#haqqimizda"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('haqqimizda');
              }}
              className="min-h-[48px] py-3 text-left text-xs tracking-[0.14em] uppercase font-sans font-medium text-charcoal flex items-center justify-between cursor-pointer"
            >
              <span>HAQQIMIZDA</span>
              <span className="text-charcoal/60">Fəlsəfə və məkan</span>
            </a>
            <a
              href="/#elaqe"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('elaqe');
              }}
              className="min-h-[48px] py-3 text-left text-xs tracking-[0.14em] uppercase font-sans font-medium text-charcoal flex items-center justify-between cursor-pointer"
            >
              <span>ƏLAQƏ</span>
              <span className="text-charcoal/60">İçərişəhər, Bakı</span>
            </a>
          </nav>

          <div className="mt-4 pt-2">
            <a
              href={RESTAURANT_INFO.phoneHref}
              className="w-full min-h-[46px] inline-flex items-center justify-center text-xs tracking-[0.08em] font-sans text-charcoal border hairline-border rounded-[2px] tabular-nums"
            >
              {RESTAURANT_INFO.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
