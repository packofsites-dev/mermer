import React, { useState } from 'react';
import { RESTAURANT_INFO } from '../data/menuData';
import { Button } from './Buttons';

export const LocationSection: React.FC = () => {
  const [showMapSketch, setShowMapSketch] = useState(false);

  return (
    <section
      id="elaqe"
      className="bg-bone py-14 sm:py-24 lg:py-32 scroll-mt-16"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Minimal Brand & Location Identity */}
          <div className="lg:col-span-6">
            <p className="text-xs tracking-[0.14em] uppercase font-sans text-charcoal/65 mb-3">
              Ünvan və Əlaqə
            </p>

            <h2 className="font-serif font-normal text-3xl sm:text-4xl lg:text-[44px] tracking-[0.18em] uppercase text-charcoal">
              {RESTAURANT_INFO.name}
            </h2>

            <address className="mt-5 sm:mt-6 not-italic space-y-1.5">
              <p className="font-serif text-2xl sm:text-[26px] text-charcoal leading-[1.3]">
                {RESTAURANT_INFO.locationShort}
              </p>
            </address>

            <div className="mt-6 pt-6 border-t hairline-border">
              <p className="text-xs font-sans tracking-[0.12em] uppercase text-charcoal/60 mb-1.5">
                Telefon
              </p>
              <a
                href={RESTAURANT_INFO.phoneHref}
                className="font-sans font-medium text-xl sm:text-2xl text-charcoal hover:text-olive transition-colors tabular-nums"
              >
                {RESTAURANT_INFO.phone}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button
                variant="secondary"
                onClick={() => setShowMapSketch((prev) => !prev)}
                className="w-full sm:w-auto"
              >
                {showMapSketch ? 'XƏRİTƏNİ BAĞLA' : 'XƏRİTƏDƏ GÖR'}
              </Button>
            </div>
          </div>

          {/* Right Column: Hours or Minimal Architectural Location View */}
          <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l hairline-border pt-8 lg:pt-0 lg:pl-12">
            {!showMapSketch ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-sans tracking-[0.14em] uppercase text-charcoal/60 mb-3">
                    İş Saatları
                  </h3>
                  <dl className="space-y-2.5 text-sm sm:text-[15px] font-sans text-charcoal tabular-nums">
                    <div className="flex justify-between gap-4 py-2 border-b hairline-border">
                      <dt className="text-charcoal/75">Hər gün</dt>
                      <dd className="font-medium">12:00 – 23:30</dd>
                    </div>
                    <div className="flex justify-between gap-4 py-2 border-b hairline-border">
                      <dt className="text-charcoal/75">Mətbəx</dt>
                      <dd>12:00 – 22:45</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-xs font-sans tracking-[0.14em] uppercase text-charcoal/60 mb-2">
                    Məkan
                  </h3>
                  <p className="font-sans text-sm sm:text-[15px] text-charcoal/80 leading-[1.65]">
                    İçərişəhər, Bakı, Azərbaycan. Əlavə məlumat üçün telefon nömrəmizlə əlaqə saxlaya bilərsiniz.
                  </p>
                </div>
              </div>
            ) : (
              <div className="border hairline-border p-5 sm:p-8 bg-bone rounded-[2px]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <p className="text-xs font-sans tracking-[0.12em] uppercase text-charcoal/60">
                      Ünvan Sxemi
                    </p>
                    <h3 className="font-serif text-xl text-charcoal mt-0.5">
                      {RESTAURANT_INFO.locationShort}
                    </h3>
                  </div>
                  <span className="text-xs font-sans text-charcoal/60 tabular-nums">
                    40.3661° Şm., 49.8372° Ş.
                  </span>
                </div>

                <div className="aspect-[16/10] w-full bg-charcoal/5 border hairline-border p-4 flex items-center justify-center relative">
                  <svg
                    viewBox="0 0 480 280"
                    className="w-full h-full text-charcoal"
                    fill="none"
                    aria-label="İçərişəhər sxemi"
                  >
                    <path
                      d="M40 240 L110 60 L360 40 L430 220"
                      stroke="currentColor"
                      strokeOpacity="0.25"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M130 250 C160 180, 210 130, 310 65"
                      stroke="currentColor"
                      strokeOpacity="0.55"
                      strokeWidth="2"
                    />
                    <path
                      d="M85 230 C115 150, 165 95, 290 50"
                      stroke="currentColor"
                      strokeOpacity="0.3"
                      strokeWidth="1"
                    />
                    <path
                      d="M170 190 L280 205 M225 135 L335 160"
                      stroke="currentColor"
                      strokeOpacity="0.3"
                      strokeWidth="1"
                    />
                    <circle cx="225" cy="135" r="7" fill="#41483A" />
                    <circle cx="225" cy="135" r="2.5" fill="#F2EEE7" />
                    <text
                      x="138"
                      y="134"
                      fill="#171614"
                      fontSize="11"
                      fontWeight="500"
                      letterSpacing="2"
                      fontFamily="DM Sans, sans-serif"
                    >
                      MƏRMƏR
                    </text>
                    <text
                      x="138"
                      y="148"
                      fill="#171614"
                      fillOpacity="0.65"
                      fontSize="9.5"
                      fontFamily="DM Sans, sans-serif"
                    >
                      İçərişəhər, Bakı
                    </text>
                  </svg>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-charcoal/75">
                  <span>{RESTAURANT_INFO.locationShort}</span>
                  <a
                    href={RESTAURANT_INFO.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-olive hover:text-charcoal font-medium underline underline-offset-4"
                  >
                    Xəritədə aç ↗
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
