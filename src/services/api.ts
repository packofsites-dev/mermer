import { MenuItem } from '../data/menuData';
import { mapRawSheetRowToMenuItem } from '../utils/menuSelectors';

export const GAS_WEB_APP_URL =
  import.meta.env.VITE_GAS_API_URL ||
  import.meta.env.VITE_API_URL ||
'https://script.google.com/macros/s/AKfycbx2-OdZXqyFQaZueLvjQ7QARzmrLLgXazcyvfFZLkspTNK73-_PTz6N0aGBhup1nGlzag/exec';
export const RESTAURANT_ID = 'mermer';

const TOKEN_STORAGE_KEY = 'mermer_gas_session_token';

export interface ApiResponse<T = unknown> {
  success: boolean;
  foods?: unknown[];
  data?: T;
  item?: unknown;
  food?: unknown;
  token?: string;
  sessionToken?: string;
  imageUrl?: string;
  url?: string;
  image?: string;
  error?: string;
  message?: string;
}

export interface CreateOrUpdateFoodInput {
  id?: string;
  name: string;
  category: string;
  description: string;
  price: string | number;
  image?: string;
  available: boolean;
  featured?: boolean;
}

export interface ImageUploadInput {
  fileName: string;
  mimeType: string;
  base64Data: string;
}

/**
 * Token Management
 */
export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setSessionToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearSessionToken(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getSessionToken());
}

/**
 * Low-level POST helper for Google Apps Script Web App.
 * Uses text/plain;charset=utf-8 to avoid CORS preflight (OPTIONS) failures on script.google.com.
 */
async function postToGas(
  payload: Record<string, unknown>
): Promise<ApiResponse> {
  const url = `${GAS_WEB_APP_URL}${
    GAS_WEB_APP_URL.includes('?') ? '&' : '?'
  }restaurantId=${RESTAURANT_ID}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({
      restaurantId: RESTAURANT_ID,
      ...payload,
    }),
    redirect: 'follow',
  });

  const text = await response.text();
  try {
    return JSON.parse(text) as ApiResponse;
  } catch {
    throw new Error('Serverdən gözlənilməz cavab alındı.');
  }
}

/**
 * Executes a POST action and automatically falls back to alias action names
 * if the Google Apps Script backend reports an unknown/invalid action name.
 */
async function postWithActionAliases(
  actions: string[],
  payload: Record<string, unknown>
): Promise<ApiResponse> {
  const token = getSessionToken();
  let lastResponse: ApiResponse = {
    success: false,
    error: 'Sorğu yerinə yetirilmədi.',
  };

  for (const action of actions) {
    const res = await postToGas({
      ...payload,
      action,
      ...(token ? { token, sessionToken: token } : {}),
    });

    lastResponse = res;

    if (res.success) {
      return res;
    }

    const errText = String(res.error || res.message || '').toLowerCase();

    // If token is invalid/expired, clear stored token and stop immediately
    if (errText.includes('unauthorized') || errText.includes('expired')) {
      clearSessionToken();
      throw new Error(res.error || 'Sessiya vaxtı bitib. Yenidən daxil olun.');
    }

    // Only try the next alias if the error indicates an unrecognized action name
    const isUnknownActionError =
      errText.includes('unknown action') ||
      errText.includes('invalid action') ||
      errText.includes('unsupported action') ||
      errText.includes('action not found');

    if (!isUnknownActionError) {
      break;
    }
  }

  throw new Error(
    lastResponse.error || lastResponse.message || 'Əməliyyat uğursuz oldu.'
  );
}

/**
 * Public GET: Load foods dynamically from Google Sheets via the Apps Script GET endpoint.
 */
export async function fetchMenuFoods(): Promise<MenuItem[]> {
  const url = `${GAS_WEB_APP_URL}${
  GAS_WEB_APP_URL.includes('?') ? '&' : '?'
}restaurantId=mermer&_t=${Date.now()}`;

  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Menyu yüklənmədi (${response.status})`);
  }

  const json = (await response.json()) as ApiResponse | unknown[];

  let rawList: unknown[] = [];
  if (Array.isArray(json)) {
    rawList = json;
  } else if (json && typeof json === 'object') {
    if (Array.isArray(json.foods)) {
      rawList = json.foods;
    } else if (Array.isArray(json.data)) {
      rawList = json.data;
    }
  }

  const mapped: MenuItem[] = [];
  rawList.forEach((raw, idx) => {
    if (raw && typeof raw === 'object') {
      const item = mapRawSheetRowToMenuItem(
        raw as Record<string, unknown>,
        idx
      );
      if (item) {
        mapped.push(item);
      }
    }
  });

  return mapped;
}

/**
 * Admin Login
 */
export async function adminLogin(
  password: string,
  username = 'admin'
): Promise<string> {
  const res = await postToGas({
    action: 'login',
    username: username.trim() || 'admin',
    password,
  });

  const token = res.token || res.sessionToken;
  if (!res.success || !token) {
    const rawErr = String(res.error || res.message || '');
    if (rawErr.toLowerCase().includes('invalid credentials')) {
      throw new Error('İstifadəçi adı və ya şifrə yanlışdır.');
    }
    throw new Error(rawErr || 'Giriş məlumatları yanlışdır.');
  }

  setSessionToken(token);
  return token;
}

/**
 * Admin Logout
 */
export async function adminLogout(): Promise<void> {
  const token = getSessionToken();
  clearSessionToken();
  if (token) {
    try {
      await postToGas({ action: 'logout', token });
    } catch {
      // Ignore network errors on logout
    }
  }
}

/**
 * Admin Create Food
 */
export async function createFoodItem(
  input: CreateOrUpdateFoodInput
): Promise<ApiResponse> {
  const cleanPrice = String(input.price).trim();
  const foodPayload = {
    name: input.name.trim(),
    category: input.category.trim(),
    description: input.description.trim(),
    price: cleanPrice,
    image: input.image ? input.image.trim() : '',
    available: Boolean(input.available),
    featured: Boolean(input.featured),
  };

  return postWithActionAliases(
    ['create', 'addFood', 'createFood', 'add'],
    {
      ...foodPayload,
      food: foodPayload,
      item: foodPayload,
    }
  );
}

/**
 * Admin Update Food
 */
export async function updateFoodItem(
  id: string,
  input: CreateOrUpdateFoodInput
): Promise<ApiResponse> {
  const cleanPrice = String(input.price).trim();
  const foodPayload = {
    id,
    name: input.name.trim(),
    category: input.category.trim(),
    description: input.description.trim(),
    price: cleanPrice,
    image: input.image ? input.image.trim() : '',
    available: Boolean(input.available),
    featured: Boolean(input.featured),
  };

  return postWithActionAliases(
    ['update', 'updateFood', 'editFood', 'edit'],
    {
      ...foodPayload,
      food: foodPayload,
      item: foodPayload,
    }
  );
}

/**
 * Admin Delete Food
 */
export async function deleteFoodItem(id: string): Promise<ApiResponse> {
  return postWithActionAliases(
    ['delete', 'deleteFood', 'removeFood', 'remove'],
    {
      id,
      foodId: id,
      itemId: id,
    }
  );
}

/**
 * Admin Availability Toggle
 */
export async function toggleFoodAvailability(
  item: MenuItem,
  nextAvailable?: boolean
): Promise<ApiResponse> {
  const available =
    typeof nextAvailable === 'boolean' ? nextAvailable : !item.available;

  const updatedPayload = {
    id: item.id,
    foodId: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    price: item.price,
    image: item.image || '',
    available,
    featured: Boolean(item.featured),
  };

  return postWithActionAliases(
    ['toggleAvailability', 'updateAvailability', 'update', 'updateFood'],
    {
      ...updatedPayload,
      food: updatedPayload,
      item: updatedPayload,
    }
  );
}

/**
 * Admin Image Upload (Base64 -> Google Apps Script -> Google Drive)
 */
export async function uploadFoodImage(
  input: ImageUploadInput
): Promise<string> {
  const cleanBase64 = input.base64Data.includes(',')
    ? input.base64Data.split(',')[1]
    : input.base64Data;

  const res = await postWithActionAliases(
    ['uploadImage', 'upload', 'uploadPhoto'],
    {
      fileName: input.fileName,
      filename: input.fileName,
      name: input.fileName,
      mimeType: input.mimeType,
      contentType: input.mimeType,
      base64: cleanBase64,
      base64Data: cleanBase64,
      data: cleanBase64,
      image: input.base64Data,
    }
  );

  const uploadedUrl =
    res.imageUrl ||
    res.url ||
    res.image ||
    (res.data && typeof res.data === 'object'
      ? (res.data as Record<string, string>).imageUrl ||
        (res.data as Record<string, string>).url
      : undefined);

  if (!uploadedUrl) {
    throw new Error('Şəkil yükləndi, lakin URL qaytarılmadı.');
  }

  return uploadedUrl;
}
