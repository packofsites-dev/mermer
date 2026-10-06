import { MenuCategoryName, MenuItem } from '../data/menuData';

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  'COLD STARTERS': 'SOYUQ BAŞLANĞICLAR',
  'HOT STARTERS': 'İSTİ BAŞLANĞICLAR',
  'STARTERS': 'BAŞLANĞICLAR',
  'APPETIZERS': 'BAŞLANĞICLAR',
  'MAIN DISHES': 'ƏSAS YEMƏKLƏR',
  'MAIN COURSES': 'ƏSAS YEMƏKLƏR',
  'MAINS': 'ƏSAS YEMƏKLƏR',
  'SOUPS': 'ŞORBALAR',
  'SOUP': 'ŞORBALAR',
  'SALADS': 'SALATLAR',
  'SALAD': 'SALATLAR',
  'GRILL': 'QRİL / ODDA',
  'GRILL / FIRE': 'QRİL / ODDA',
  'BBQ': 'QRİL / ODDA',
  'SIDES': 'QARNİRLƏR',
  'SIDE DISHES': 'QARNİRLƏR',
  'GARNISHES': 'QARNİRLƏR',
  'DESSERTS': 'ŞİRİNİYYATLAR',
  'DESSERT': 'ŞİRİNİYYATLAR',
  'SWEETS': 'ŞİRİNİYYATLAR',
  'DRINKS': 'İÇKİLƏR',
  'BEVERAGES': 'İÇKİLƏR',
  'PIZZA': 'PİZZA',
  'PIZZAS': 'PİZZA',
  'BURGERS': 'BURGERLƏR',
  'BURGER': 'BURGERLƏR',
  'PASTA': 'PASTA',
  'SEAFOOD': 'DƏNİZ MƏHSULLARI',
  'BREAKFAST': 'SƏHƏR YEMƏYİ',
};

const TEXT_TRANSLATIONS: Record<string, string> = {
  'tomato, mozzarella and fresh basil': 'Pomidor, motsarella və təzə reyhan',
  'crispy chicken, lettuce and special sauce':
    'Xırçıltılı toyuq, kahı və xüsusi sous',
  'chicken burger': 'Toyuq Burgeri',
  'burgers': 'Burgerlər',
  'test dish': 'Sınaq yeməyi',
  'popular': 'Seçilmiş',
};

export function translateCategoryToAz(rawCategory: string): string {
  const trimmed = rawCategory.trim();
  if (!trimmed) return '';
  const upperKey = trimmed.toUpperCase();
  if (CATEGORY_TRANSLATIONS[upperKey]) {
    return CATEGORY_TRANSLATIONS[upperKey];
  }
  return trimmed.toLocaleUpperCase('az-AZ');
}

export function translateTextToAz(rawText: string): string {
  const trimmed = rawText.trim();
  if (!trimmed) return '';
  const lowerKey = trimmed.toLowerCase();
  if (TEXT_TRANSLATIONS[lowerKey]) {
    return TEXT_TRANSLATIONS[lowerKey];
  }
  return trimmed;
}

/**
 * Normalizes Google Drive share/view URLs into direct embeddable image URLs.
 */
export function resolveImageUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  const trimmed = rawUrl.trim();
  if (!trimmed) return undefined;

  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const driveId = fileDMatch?.[1] || idParamMatch?.[1];

  if (driveId && trimmed.includes('drive.google.com')) {
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }

  return trimmed;
}

/**
 * Validates and returns real menu items that have a non-empty name and category.
 */
export function getValidMenuItems(items: MenuItem[]): MenuItem[] {
  if (!Array.isArray(items)) return [];
  return items.filter(
    (item) =>
      Boolean(item && item.id) &&
      Boolean(item.name && item.name.trim().length > 0) &&
      Boolean(item.category && item.category.trim().length > 0)
  );
}

/**
 * Filter items belonging to a specific category.
 */
export function getItemsByCategory(
  items: MenuItem[],
  category: MenuCategoryName
): MenuItem[] {
  const normalizedTarget = category.trim().toLocaleUpperCase('az-AZ');
  return getValidMenuItems(items).filter(
    (item) =>
      item.category.trim().toLocaleUpperCase('az-AZ') === normalizedTarget
  );
}

/**
 * Dynamically extracts unique categories that have > 0 real menu items from the backend data.
 */
export function getActiveCategories(items: MenuItem[]): MenuCategoryName[] {
  const validItems = getValidMenuItems(items);
  const seen = new Set<string>();
  const categories: MenuCategoryName[] = [];

  for (const item of validItems) {
    const cleanCategory = item.category.trim();
    const key = cleanCategory.toLocaleUpperCase('az-AZ');
    if (cleanCategory && !seen.has(key)) {
      seen.add(key);
      categories.push(cleanCategory);
    }
  }

  return categories;
}

/**
 * Filter featured dishes (featured === true and available !== false) for the home page section.
 */
export function getFeaturedMenuItems(items: MenuItem[]): MenuItem[] {
  return getValidMenuItems(items).filter(
    (item) => Boolean(item.featured) && item.available !== false
  );
}

/**
 * Maps a raw JSON row from Google Sheets / Google Apps Script GET endpoint to MenuItem.
 */
export function mapRawSheetRowToMenuItem(
  row: Record<string, unknown>,
  fallbackIndex: number
): MenuItem | null {
  const nameRaw =
    row.name ?? row.Name ?? row.title ?? row.Title ?? row.foodName ?? '';
  const name = translateTextToAz(String(nameRaw));
  if (!name) {
    return null;
  }

  const categoryRaw =
    row.category ?? row.Category ?? row.kateqoriya ?? row.section ?? '';
  const category = translateCategoryToAz(String(categoryRaw));
  if (!category) {
    return null;
  }

  const descriptionRaw =
    row.description ?? row.Description ?? row.desc ?? row.ingredients ?? '';
  const description = translateTextToAz(String(descriptionRaw));

  const priceVal = row.price ?? row.Price ?? '';
  const rawPrice = String(priceVal).trim();
  const formattedPrice =
    rawPrice && !rawPrice.includes('₼') && !rawPrice.includes('AZN')
      ? `${rawPrice} ₼`
      : rawPrice.replace(/AZN/gi, '₼');

  const imageVal =
    row.image ??
    row.Image ??
    row.imageUrl ??
    row.image_url ??
    row.photo ??
    undefined;
  const image = imageVal ? resolveImageUrl(String(imageVal)) : undefined;

  const availableVal =
    row.available !== undefined
      ? row.available
      : row.avaliable !== undefined
        ? row.avaliable
        : row.Available !== undefined
          ? row.Available
          : row.isAvailable;

  const isAvailable =
    availableVal === undefined ||
    availableVal === null ||
    availableVal === '' ||
    availableVal === true ||
    String(availableVal).toLowerCase() === 'true' ||
    String(availableVal) === '1';

  const featuredVal =
    row.featured !== undefined
      ? row.featured
      : row.Featured !== undefined
        ? row.Featured
        : row.isFeatured;

  const isFeatured =
    featuredVal === true ||
    String(featuredVal).toLowerCase() === 'true' ||
    String(featuredVal) === '1';

  const idVal = row.id ?? row.ID ?? row.Id ?? `item-${fallbackIndex}`;

  return {
    id: String(idVal),
    name,
    category,
    description,
    price: formattedPrice,
    image,
    available: isAvailable,
    featured: isFeatured,
  };
}
