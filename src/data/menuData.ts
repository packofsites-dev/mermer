export type MenuCategoryName = string;

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategoryName;
  description: string;
  price: string;
  image?: string;
  available: boolean;
  featured?: boolean;
}

export const IMAGES = {
  hero: '/src/assets/images/hero_stone_table_1791232274478.jpg',
  interior: '/src/assets/images/interior_limestone_vault_1791232320534.jpg',
} as const;

export const RESTAURANT_INFO = {
  name: 'MƏRMƏR',
  slogan: 'Kökümüzdən gələn, bu günə aid.',
  cuisine: 'Müasir Azərbaycan mətbəxi',
  locationShort: 'İçərişəhər, Bakı, Azərbaycan',
  addressFull: 'İçərişəhər, Bakı, Azərbaycan',
  phone: '+994 12 555 14 14',
  phoneHref: 'tel:+994125551414',
  instagramUrl: 'https://instagram.com',
  mapUrl: 'https://maps.google.com/?q=Icherisheher+Baku+Azerbaijan',
  hours: {
    daily: 'Hər gün: 12:00 – 23:30',
    kitchen: 'Mətbəx: 12:00 – 22:45',
  },
} as const;

/**
 * Empty initial state — foods and categories are loaded dynamically from the Google Apps Script backend.
 */
export const menuItems: MenuItem[] = [];
