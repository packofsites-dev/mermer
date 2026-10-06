import React, { useState } from 'react';
import { MenuItem as MenuItemType } from '../data/menuData';

interface MenuItemProps {
  item: MenuItemType;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  const isAvailable = item.available !== false;
  const hasValidImage = Boolean(
    item.image && item.image.trim().length > 0 && !imageError
  );

  return (
    <article
      className={`py-6 sm:py-7 border-b hairline-border last:border-b-0 transition-opacity ${
        !isAvailable ? 'opacity-55' : ''
      }`}
    >
      {/* MOBILE LAYOUT (< md):
          Yemək adı
          Qısa açıqlama
          Qiymət
          Şəkil (varsa)
      */}
      <div className="block md:hidden">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h4 className="font-sans font-medium text-base sm:text-[17px] text-charcoal leading-[1.35] break-words">
            {item.name}
          </h4>
          {!isAvailable && (
            <span className="text-[11px] font-sans tracking-[0.08em] uppercase text-charcoal/70">
              · Hazırda yoxdur
            </span>
          )}
        </div>

        {item.description && (
          <p className="mt-1.5 font-sans text-sm text-charcoal/75 leading-[1.6] break-words">
            {item.description}
          </p>
        )}

        <p className="mt-2.5 font-sans font-medium text-[15px] text-charcoal tabular-nums">
          {isAvailable ? item.price : `${item.price} · Bitib`}
        </p>

        {hasValidImage && (
          <div className="mt-4 overflow-hidden rounded-[2px] border hairline-border bg-charcoal/5 aspect-[4/3] max-w-sm">
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* DESKTOP & TABLET LAYOUT (>= md):
          yemək adı -------- qiymət
          qısa açıqlama
          (plus optional image if present)
      */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-8 items-start">
        <div className={hasValidImage ? 'md:col-span-8' : 'md:col-span-12'}>
          <div className="flex items-baseline gap-4">
            <div className="flex items-baseline gap-2.5 shrink-0 max-w-[72%]">
              <h4 className="font-sans font-medium text-[17px] lg:text-[18px] text-charcoal leading-[1.35]">
                {item.name}
              </h4>
              {!isAvailable && (
                <span className="text-xs font-sans tracking-[0.08em] uppercase text-charcoal/65 whitespace-nowrap">
                  · Hazırda yoxdur
                </span>
              )}
            </div>

            {/* Printed-menu leader line */}
            <div
              aria-hidden="true"
              className="flex-1 border-b hairline-border translate-y-[-4px] min-w-[24px]"
            />

            <span className="font-sans font-medium text-[16px] lg:text-[17px] text-charcoal tabular-nums whitespace-nowrap shrink-0">
              {item.price}
            </span>
          </div>

          {item.description && (
            <p className="mt-2 font-sans text-[15px] text-charcoal/75 leading-[1.65] max-w-2xl">
              {item.description}
            </p>
          )}
        </div>

        {hasValidImage && (
          <div className="md:col-span-4">
            <div className="overflow-hidden rounded-[2px] border hairline-border bg-charcoal/5 aspect-[4/3]">
              <img
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-[1.02]"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
