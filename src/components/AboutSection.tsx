import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="haqqimizda"
      className="bg-bone border-b hairline-border py-14 sm:py-24 lg:py-28 scroll-mt-16"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Section Kicker */}
          <div className="lg:col-span-4">
            <p className="text-xs tracking-[0.14em] uppercase font-sans text-charcoal/70">
              Haqqımızda · Mətbəx Fəlsəfəsi
            </p>
            <div className="mt-6 pt-6 border-t hairline-border hidden lg:block">
              <p className="font-serif italic text-xl text-charcoal/80 leading-relaxed">
                “Dad yaddaşdır; onu qorumağın ən doğru yolu bu günün dili ilə danışmaqdır.”
              </p>
            </div>
          </div>

          {/* Right Column: Main Editorial Statement */}
          <div className="lg:col-span-8">
            <h2 className="font-serif font-normal text-3xl sm:text-4xl lg:text-[46px] leading-[1.12] tracking-[-0.01em] text-charcoal [text-wrap:balance]">
              Keçmişi təkrarlamırıq. Onu yenidən bişiririk.
            </h2>

            <p className="mt-5 sm:mt-8 font-serif font-normal text-xl sm:text-2xl leading-[1.45] text-charcoal max-w-2xl">
              Mərmər Azərbaycan mətbəxinin tanış dadlarını müasir texnika, seçilmiş məhsullar və daha təmiz təqdimatla yenidən düşünür.
            </p>

            <div className="mt-7 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 font-sans text-sm sm:text-[15px] leading-[1.7] text-charcoal/80">
              <p>
                İçərişəhərin əsrlik əhəngdaşı divarları arasında yerləşən mətbəximizdə od, kömür və mövsümi yerli məhsul əsas söz sahibidir. Biz klassik reseptləri toxunulmaz muzey eksponatı kimi görmürük — onların kökündəki dadı saxlayır, artıq ağırlığı azaldır və hər inqrediyentin öz təbii strukturunu önə çıxarırıq.
              </p>
              <p>
                Abşeronun zəfəranından, dağ ətəklərinin yabanı göyərtilərindən və bağ meyvələrindən gələn məhsullar hər gün qısa və dürüst menyuya çevrilir. Süfrədə artıq bəzək yoxdur — yalnız daş, ağac, kətan və yeməyin özü.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
