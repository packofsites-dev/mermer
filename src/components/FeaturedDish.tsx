import React from 'react';
import { EditorialImage } from './EditorialImage';
import { MenuItem, menuItems } from '../data/menuData';
import { getFeaturedMenuItems } from '../utils/menuSelectors';

interface FeaturedDishCardProps {
  dish: MenuItem;
  index: number;
  layoutVariant: 'lead' | 'secondary';
}

export const FeaturedDish: React.FC<FeaturedDishCardProps> = ({
  dish,
  index,
  layoutVariant,
}) => {
  const formattedIndex = String(index + 1).padStart(2, '0');

  if (layoutVariant === 'lead') {
    return (
      <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center pb-12 sm:pb-16 border-b hairline-border">
        {dish.image && (
          <div className="lg:col-span-7">
            <EditorialImage
              src={dish.image}
              alt={dish.name}
              aspectClass="aspect-[4/3]"
            />
          </div>
        )}
        <div className={dish.image ? 'lg:col-span-5' : 'lg:col-span-12'}>
          <div className="flex items-center gap-2 text-xs font-sans tracking-[0.12em] uppercase text-charcoal/65 tabular-nums">
            <span>{formattedIndex}</span>
            <span aria-hidden="true">·</span>
            <span>{dish.category}</span>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
            <h3 className="font-serif font-normal text-2xl sm:text-3xl lg:text-[34px] leading-[1.15] text-charcoal">
              {dish.name}
            </h3>
            <span className="hidden sm:inline-block font-sans font-medium text-lg text-charcoal tabular-nums whitespace-nowrap shrink-0">
              {dish.price}
            </span>
          </div>

          {dish.description && (
            <p className="mt-2.5 sm:mt-4 font-sans text-sm sm:text-base leading-[1.65] text-charcoal/80">
              {dish.description}
            </p>
          )}

          <p className="mt-2.5 sm:hidden font-sans font-medium text-base text-charcoal tabular-nums">
            {dish.price}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col justify-between">
      <div>
        {dish.image && (
          <EditorialImage
            src={dish.image}
            alt={dish.name}
            aspectClass="aspect-[4/3]"
          />
        )}

        <div className="mt-4 sm:mt-5 flex items-center gap-2 text-xs font-sans tracking-[0.12em] uppercase text-charcoal/65 tabular-nums">
          <span>{formattedIndex}</span>
          <span aria-hidden="true">·</span>
          <span>{dish.category}</span>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
          <h3 className="font-serif font-normal text-2xl sm:text-[28px] leading-[1.2] text-charcoal">
            {dish.name}
          </h3>
          <span className="hidden sm:inline-block font-sans font-medium text-base sm:text-lg text-charcoal tabular-nums whitespace-nowrap shrink-0">
            {dish.price}
          </span>
        </div>

        {dish.description && (
          <p className="mt-2 font-sans text-sm sm:text-[15px] leading-[1.65] text-charcoal/80 max-w-lg">
            {dish.description}
          </p>
        )}

        <p className="mt-2 sm:hidden font-sans font-medium text-base text-charcoal tabular-nums">
          {dish.price}
        </p>
      </div>
    </article>
  );
};

interface FeaturedDishesSectionProps {
  items?: MenuItem[];
}

export const FeaturedDishesSection: React.FC<FeaturedDishesSectionProps> = ({
  items = menuItems,
}) => {
  const featuredDishes = getFeaturedMenuItems(items);

  // Do not render the section when featured dishes data is empty
  if (featuredDishes.length === 0) {
    return null;
  }

  const [leadDish, ...secondaryDishes] = featuredDishes;

  return (
    <section className="bg-bone border-b hairline-border py-14 sm:py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 sm:pb-14 border-b hairline-border">
          <div>
            <p className="text-xs tracking-[0.14em] uppercase font-sans text-charcoal/65 mb-2.5">
              Mətbəxdən Seçmələr
            </p>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl lg:text-[44px] leading-[1.12] text-charcoal">
              Seçilmiş Təqdimatlar
            </h2>
          </div>
        </div>

        {leadDish && (
          <div className="mt-10 sm:mt-14">
            <FeaturedDish dish={leadDish} index={0} layoutVariant="lead" />
          </div>
        )}

        {secondaryDishes.length > 0 && (
          <div className="mt-10 sm:mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
            {secondaryDishes.map((dish, idx) => (
              <div
                key={dish.id}
                className={
                  idx % 2 === 0
                    ? 'md:col-span-7'
                    : 'md:col-span-5 md:mt-10 lg:mt-14'
                }
              >
                <FeaturedDish
                  dish={dish}
                  index={idx + 1}
                  layoutVariant="secondary"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
