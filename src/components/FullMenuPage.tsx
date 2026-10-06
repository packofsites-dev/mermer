import React, { useState, useEffect } from 'react';
import {
  MenuCategoryName,
  MenuItem,
  menuItems as defaultMenuItems,
  RESTAURANT_INFO,
} from '../data/menuData';
import {
  getActiveCategories,
  getItemsByCategory,
} from '../utils/menuSelectors';
import { MenuCategory } from './MenuCategory';
import { Button } from './Buttons';

const ALL_CATEGORIES_KEY = 'BÜTÜN';

interface FullMenuPageProps {
  initialCategory?: MenuCategoryName;
  items?: MenuItem[];
  isLoading?: boolean;
  onBackHome: () => void;
}

export const FullMenuPage: React.FC<FullMenuPageProps> = ({
  initialCategory,
  items = defaultMenuItems,
  onBackHome,
}) => {
  // Dynamically extract categories with > 0 real items from the backend data
  const activeCategories = getActiveCategories(items);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory && activeCategories.includes(initialCategory)
      ? initialCategory
      : ALL_CATEGORIES_KEY
  );

  useEffect(() => {
    if (initialCategory && activeCategories.includes(initialCategory)) {
      setSelectedCategory(initialCategory);
    } else if (
      selectedCategory !== ALL_CATEGORIES_KEY &&
      !activeCategories.includes(selectedCategory)
    ) {
      setSelectedCategory(ALL_CATEGORIES_KEY);
    }
  }, [initialCategory, activeCategories, selectedCategory]);

  const isAllSelected = selectedCategory === ALL_CATEGORIES_KEY;

  const categoriesToDisplay = isAllSelected
    ? activeCategories
    : activeCategories.filter((c) => c === selectedCategory);

  return (
    <div className="min-h-screen bg-bone pb-20">
      {/* Printed Menu Header */}
      <div className="border-b hairline-border pt-6 pb-8 sm:pt-12 sm:pb-12 bg-bone">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <button
              type="button"
              onClick={onBackHome}
              className="min-h-[44px] inline-flex items-center text-xs font-sans tracking-[0.12em] uppercase text-charcoal/80 hover:text-charcoal transition-colors cursor-pointer"
            >
              ← Əsas səhifəyə qayıt
            </button>

            <span className="text-xs font-sans tracking-[0.1em] uppercase text-charcoal/60">
              {RESTAURANT_INFO.locationShort}
            </span>
          </div>

          <div>
            <h1 className="font-serif font-normal text-3xl sm:text-5xl text-charcoal tracking-[0.04em]">
              MƏRMƏR — Menyu
            </h1>
            <p className="mt-2.5 font-sans text-sm sm:text-base text-charcoal/75 max-w-xl leading-[1.6]">
              {RESTAURANT_INFO.slogan}
            </p>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar — Includes "BÜTÜN" plus all populated categories */}
      {activeCategories.length > 0 && (
        <div className="sticky top-16 sm:top-20 z-30 bg-bone/95 border-b hairline-border">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            <div
              role="tablist"
              aria-label="Menyu kateqoriyaları"
              className="flex items-center gap-2.5 sm:gap-3 py-3 overflow-x-auto no-scrollbar overscroll-x-contain touch-pan-x"
            >
              {/* "BÜTÜN" (All Categories) Tab */}
              <button
                type="button"
                role="tab"
                aria-selected={isAllSelected}
                onClick={() => setSelectedCategory(ALL_CATEGORIES_KEY)}
                className={`px-4 py-2.5 sm:px-4 sm:py-2.5 min-h-[42px] text-xs tracking-[0.1em] uppercase font-sans font-medium rounded-[2px] border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer select-none ${
                  isAllSelected
                    ? 'bg-olive text-bone border-olive'
                    : 'bg-bone text-charcoal/80 border-charcoal/15 hover:border-charcoal/40 hover:text-charcoal'
                }`}
              >
                {ALL_CATEGORIES_KEY}
              </button>

              {activeCategories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2.5 sm:px-4 sm:py-2.5 min-h-[42px] text-xs tracking-[0.1em] uppercase font-sans font-medium rounded-[2px] border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer select-none ${
                      isSelected
                        ? 'bg-olive text-bone border-olive'
                        : 'bg-bone text-charcoal/80 border-charcoal/15 hover:border-charcoal/40 hover:text-charcoal'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Selected Category Content — Only rendered when category has > 0 items */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        {categoriesToDisplay.map((category) => {
          const categoryItems = getItemsByCategory(items, category);
          if (categoryItems.length === 0) return null;
          return (
            <MenuCategory
              key={category}
              category={category}
              items={categoryItems}
            />
          );
        })}

        {/* Printed Menu Footer / Return Action */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-xs font-sans text-charcoal/65 tabular-nums">
            {RESTAURANT_INFO.addressFull} · {RESTAURANT_INFO.phone}
          </p>

          <Button
            variant="secondary"
            onClick={onBackHome}
            className="w-full sm:w-auto"
          >
            ƏSAS SƏHİFƏ
          </Button>
        </div>
      </div>
    </div>
  );
};
