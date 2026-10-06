import React from 'react';
import { MenuCategoryName, MenuItem as MenuItemType } from '../data/menuData';
import { MenuItem } from './MenuItem';

interface MenuCategoryProps {
  category: MenuCategoryName;
  items: MenuItemType[];
}

export const MenuCategory: React.FC<MenuCategoryProps> = ({
  category,
  items,
}) => {
  // Rule: If a category has 0 real items, do not render anything at all
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-14 lg:py-16 border-b hairline-border">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        {/* Category Title Column — Cormorant Garamond */}
        <div className="lg:col-span-4">
          <h2 className="font-serif font-normal text-2xl sm:text-3xl lg:text-[34px] text-charcoal tracking-[0.03em] leading-[1.15]">
            {category}
          </h2>
        </div>

        {/* Category Items List — DM Sans */}
        <div className="lg:col-span-8">
          <div className="divide-y hairline-border border-t lg:border-t-0 hairline-border">
            {items.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
