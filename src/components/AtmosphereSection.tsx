import React from 'react';
import { IMAGES } from '../data/menuData';
import { EditorialImage } from './EditorialImage';

export const AtmosphereSection: React.FC = () => {
  return (
    <section className="bg-charcoal text-bone py-14 sm:py-24 lg:py-32 border-b hairline-border-dark">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-10 sm:mb-14">
          <div className="lg:col-span-7">
            <p className="text-xs tracking-[0.16em] uppercase font-sans text-stone mb-3">
              Məkan və Atmosfer · İçərişəhər
            </p>
            <h2 className="font-serif font-light text-3xl sm:text-4xl lg:text-[44px] leading-[1.12] tracking-[0.01em] text-bone [text-wrap:balance]">
              Daşın sərinliyi, ağacın istiliyi və gün işığının sakitliyi.
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="font-sans text-sm sm:text-base text-bone/80 leading-[1.7] tracking-[0.01em]">
              Mərmər səs-küylü nümayişdən uzaqdır. Köhnə Bakı daşının toxuması, tünd ağac masalar, mat metal detallar və boyanmamış kətan süfrələr yeməyin dadını ön plana çıxaran sakit bir fon yaradır.
            </p>
          </div>
        </div>

        {/* Large Architectural Interior Photograph */}
        <EditorialImage
          src={IMAGES.interior}
          alt="Mərmər restoranının İçərişəhərdəki daş tağlı interyeri, tünd ağac masalar və təbii işıq"
          aspectClass="aspect-[4/3] sm:aspect-[16/9]"
        />

        {/* Material Language Index */}
        <div className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t hairline-border-dark grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <p className="text-xs font-sans tracking-[0.14em] uppercase text-stone">
              Abşeron Əhəngdaşı
            </p>
            <p className="mt-2 font-sans text-sm text-bone/75 leading-[1.6]">
              Əsrlik qala divarlarının təbii nəfəsi və toxunulmamış daş səthlər.
            </p>
          </div>

          <div>
            <p className="text-xs font-sans tracking-[0.14em] uppercase text-stone">
              Tünd Ağac və Mat Metal
            </p>
            <p className="mt-2 font-sans text-sm text-bone/75 leading-[1.6]">
              Yerli ustalar tərəfindən hazırlanmış massiv ağac masalar və sakit işıqlandırma.
            </p>
          </div>

          <div>
            <p className="text-xs font-sans tracking-[0.14em] uppercase text-stone">
              Əl İşi Keramika
            </p>
            <p className="mt-2 font-sans text-sm text-bone/75 leading-[1.6]">
              Hər yeməyin temperaturuna və rənginə uyğun bişirilmiş mat gil qablar.
            </p>
          </div>

          <div>
            <p className="text-xs font-sans tracking-[0.14em] uppercase text-stone">
              Təbii Kətan
            </p>
            <p className="mt-2 font-sans text-sm text-bone/75 leading-[1.6]">
              Ağardılmamış sümük rəngli kətan salfetlər və sadə masa düzülüşü.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
