import React from 'react';
import { Button } from './Buttons';
import { EditorialImage } from './EditorialImage';
import { IMAGES, RESTAURANT_INFO } from '../data/menuData';

interface HeroProps {
  onOpenMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenMenu }) => {
  return (
    <section className="bg-bone border-b hairline-border pt-6 pb-12 sm:pt-12 sm:pb-20 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Left Column: Restrained Editorial Typography */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-xs tracking-[0.14em] uppercase font-sans text-charcoal/75 mb-3 sm:mb-5">
                İçərişəhər · Bakı
              </p>

              <h1 className="font-serif font-normal text-3xl min-[360px]:text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] tracking-[-0.01em] text-charcoal [text-wrap:balance]">
                Kökümüzdən gələn, bu günə aid.
              </h1>

              <p className="mt-4 sm:mt-6 font-sans text-[15px] sm:text-[17px] leading-[1.6] text-charcoal/85 max-w-md">
                Müasir Azərbaycan mətbəxi
                <br />
                İçərişəhərin daş divarları arasında.
              </p>
            </div>

            <div className="mt-7 sm:mt-10">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenMenu}
                className="w-full sm:w-auto"
              >
                MENYUYA BAX
              </Button>
            </div>

            {/* Quiet operational details */}
            <div className="mt-8 sm:mt-12 pt-5 border-t hairline-border flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-sans text-charcoal/70 tabular-nums">
              <span>{RESTAURANT_INFO.hours.daily}</span>
              <span aria-hidden="true">·</span>
              <span>{RESTAURANT_INFO.locationShort}</span>
              <span aria-hidden="true">·</span>
              <a
                href={RESTAURANT_INFO.phoneHref}
                className="hover:text-charcoal transition-colors underline underline-offset-4"
              >
                {RESTAURANT_INFO.phone}
              </a>
            </div>
          </div>

          {/* Right Column: Large Editorial Photograph */}
          <div className="lg:col-span-7">
            <EditorialImage
              src={IMAGES.hero}
              alt="Mərmər restoranında daş masa üzərində müasir Azərbaycan mətbəxi və təbii gün işığı"
              aspectClass="aspect-[4/3] sm:aspect-[16/10]"
              priority={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
