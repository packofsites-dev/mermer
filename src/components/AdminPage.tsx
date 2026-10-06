import React, { useState } from 'react';
import { MenuItem, RESTAURANT_INFO } from '../data/menuData';
import {
  adminLogin,
  adminLogout,
  createFoodItem,
  deleteFoodItem,
  isAuthenticated,
  toggleFoodAvailability,
  updateFoodItem,
  uploadFoodImage,
} from '../services/api';
import { getActiveCategories } from '../utils/menuSelectors';
import { Button } from './Buttons';

interface AdminPageProps {
  items: MenuItem[];
  isLoadingMenu: boolean;
  onRefreshMenu: () => Promise<void>;
  onBackHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  items,
  isLoadingMenu,
  onRefreshMenu,
  onBackHome,
}) => {
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Form state for Create / Update
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [available, setAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const existingCategories = getActiveCategories(items);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setCategory('');
    setDescription('');
    setPrice('');
    setImage('');
    setAvailable(true);
    setFeatured(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      await adminLogin(password, username);
      setAuthenticated(true);
      setPassword('');
      await onRefreshMenu();
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Giriş zamanı xəta baş verdi.'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setAuthenticated(false);
    resetForm();
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setDescription(item.description || '');
    setPrice(item.price.replace(/\s*₼$/, '').trim());
    setImage(item.image || '');
    setAvailable(item.available !== false);
    setFeatured(Boolean(item.featured));
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFeedback(null);

    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Fayl oxunmadı.'));
        reader.readAsDataURL(file);
      });

      const uploadedUrl = await uploadFoodImage({
        fileName: file.name,
        mimeType: file.type || 'image/jpeg',
        base64Data,
      });

      setImage(uploadedUrl);
      setFeedback({
        type: 'success',
        text: 'Şəkil uğurla yükləndi.',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Şəkil yüklənərkən xəta baş verdi.';
      setFeedback({ type: 'error', text: message });
      if (!isAuthenticated()) {
        setAuthenticated(false);
      }
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category.trim() || !price.trim()) {
      setFeedback({
        type: 'error',
        text: 'Yemək adı, kateqoriya və qiymət mütləqdir.',
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      if (editingId) {
        await updateFoodItem(editingId, {
          id: editingId,
          name,
          category,
          description,
          price,
          image,
          available,
          featured,
        });
        setFeedback({
          type: 'success',
          text: 'Məhsul məlumatları yeniləndi.',
        });
      } else {
        await createFoodItem({
          name,
          category,
          description,
          price,
          image,
          available,
          featured,
        });
        setFeedback({
          type: 'success',
          text: 'Yeni məhsul menyuya əlavə edildi.',
        });
      }

      resetForm();
      await onRefreshMenu();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Əməliyyat zamanı xəta baş verdi.';
      setFeedback({ type: 'error', text: message });
      if (!isAuthenticated()) {
        setAuthenticated(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    setBusyItemId(item.id);
    setFeedback(null);
    try {
      await toggleFoodAvailability(item, !item.available);
      await onRefreshMenu();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Status dəyişdirilə bilmədi.';
      setFeedback({ type: 'error', text: message });
      if (!isAuthenticated()) {
        setAuthenticated(false);
      }
    } finally {
      setBusyItemId(null);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    setBusyItemId(item.id);
    setFeedback(null);
    try {
      await deleteFoodItem(item.id);
      if (editingId === item.id) {
        resetForm();
      }
      await onRefreshMenu();
      setFeedback({
        type: 'success',
        text: `"${item.name}" menyudan silindi.`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Silinmə zamanı xəta baş verdi.';
      setFeedback({ type: 'error', text: message });
      if (!isAuthenticated()) {
        setAuthenticated(false);
      }
    } finally {
      setBusyItemId(null);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] bg-bone flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md border hairline-border p-6 sm:p-10 bg-bone rounded-[2px]">
          <div className="flex items-center justify-between gap-4 pb-5 border-b hairline-border">
            <div>
              <p className="text-xs font-sans tracking-[0.14em] uppercase text-charcoal/60">
                {RESTAURANT_INFO.name}
              </p>
              <h1 className="font-serif font-normal text-2xl sm:text-3xl text-charcoal mt-1">
                Menyu İdarəetməsi
              </h1>
            </div>
            <button
              type="button"
              onClick={onBackHome}
              className="text-xs font-sans tracking-[0.1em] uppercase text-charcoal/70 hover:text-charcoal cursor-pointer"
            >
              ← Sayta qayıt
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-sans tracking-[0.1em] uppercase text-charcoal/70 mb-1.5"
              >
                İstifadəçi adı
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-bone border hairline-border rounded-[2px] text-sm font-sans text-charcoal focus:outline-none focus:border-olive"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-sans tracking-[0.1em] uppercase text-charcoal/70 mb-1.5"
              >
                Şifrə
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-bone border hairline-border rounded-[2px] text-sm font-sans text-charcoal focus:outline-none focus:border-olive"
              />
            </div>

            {authError && (
              <p className="text-xs font-sans text-charcoal bg-stone/25 px-3.5 py-2.5 border hairline-border">
                {authError}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={authLoading}
              className="w-full"
            >
              {authLoading ? 'YOXLANILIR...' : 'DAXİL OL'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone py-10 sm:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b hairline-border">
          <div>
            <p className="text-xs font-sans tracking-[0.14em] uppercase text-charcoal/60">
              {RESTAURANT_INFO.name} · Menyu Sistemi
            </p>
            <h1 className="font-serif font-normal text-3xl sm:text-4xl text-charcoal mt-1">
              Menyu İdarəetmə Paneli
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="sm" onClick={onBackHome}>
              SAYTA QAYIT
            </Button>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              ÇIXIŞ
            </Button>
          </div>
        </div>

        {feedback && (
          <div
            className={`mt-6 px-4 py-3 border hairline-border text-sm font-sans flex items-center justify-between ${
              feedback.type === 'error'
                ? 'bg-charcoal text-bone'
                : 'bg-stone/20 text-charcoal'
            }`}
          >
            <span>{feedback.text}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-xs uppercase tracking-[0.1em] ml-4 cursor-pointer"
            >
              Bağla
            </button>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Create / Edit Form */}
          <div className="lg:col-span-5 border hairline-border p-6 sm:p-8 bg-bone rounded-[2px]">
            <div className="flex items-center justify-between pb-4 border-b hairline-border">
              <h2 className="font-serif text-2xl text-charcoal">
                {editingId ? 'Məhsulu Redaktə Et' : 'Yeni Məhsul Əlavə Et'}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-sans tracking-[0.1em] uppercase text-charcoal/70 hover:text-charcoal cursor-pointer"
                >
                  Ləğv et
                </button>
              )}
            </div>

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-sans tracking-[0.1em] uppercase text-charcoal/70 mb-1.5">
                  Yemək adı *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-bone border hairline-border rounded-[2px] text-sm font-sans text-charcoal focus:outline-none focus:border-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-sans tracking-[0.1em] uppercase text-charcoal/70 mb-1.5">
                  Kateqoriya *
                </label>
                <input
                  type="text"
                  required
                  list="mermer-category-suggestions"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-bone border hairline-border rounded-[2px] text-sm font-sans text-charcoal focus:outline-none focus:border-olive"
                />
                <datalist id="mermer-category-suggestions">
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-sans tracking-[0.1em] uppercase text-charcoal/70 mb-1.5">
                  Qiymət (₼) *
                </label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-bone border hairline-border rounded-[2px] text-sm font-sans text-charcoal focus:outline-none focus:border-olive tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-sans tracking-[0.1em] uppercase text-charcoal/70 mb-1.5">
                  Açıqlama
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-bone border hairline-border rounded-[2px] text-sm font-sans text-charcoal focus:outline-none focus:border-olive resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans tracking-[0.1em] uppercase text-charcoal/70 mb-1.5">
                  Şəkil (keçid və ya fayl yükləmə)
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Şəkil keçidi daxil edin..."
                  className="w-full px-3.5 py-2.5 bg-bone border hairline-border rounded-[2px] text-sm font-sans text-charcoal focus:outline-none focus:border-olive mb-2"
                />
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center justify-center px-4 py-2 text-xs font-sans tracking-[0.08em] uppercase border hairline-border rounded-[2px] cursor-pointer hover:bg-stone/20 transition-colors">
                    <span>
                      {uploadingImage ? 'Şəkil yüklənir...' : 'Cihazdan şəkil seç'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="text-xs font-sans text-charcoal/65 hover:text-charcoal underline cursor-pointer"
                    >
                      Şəkli təmizlə
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-6">
                <label className="inline-flex items-center gap-2 text-sm font-sans text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="accent-olive w-4 h-4"
                  />
                  <span>Mövcuddur (Aktiv)</span>
                </label>

                <label className="inline-flex items-center gap-2 text-sm font-sans text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-olive w-4 h-4"
                  />
                  <span>Seçilmiş təqdimat</span>
                </label>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting || uploadingImage}
                  className="w-full"
                >
                  {submitting
                    ? 'YADDA SAXLANILIR...'
                    : editingId
                      ? 'DƏYİŞİKLİKLƏRİ YADDA SAXLA'
                      : 'MENYUYA ƏLAVƏ ET'}
                </Button>
              </div>
            </form>
          </div>

          {/* Existing Items List */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between pb-4 border-b hairline-border">
              <h2 className="font-serif text-2xl text-charcoal">
                Mövcud Menyu Siyahısı ({items.length})
              </h2>
              <button
                type="button"
                onClick={() => onRefreshMenu()}
                disabled={isLoadingMenu}
                className="text-xs font-sans tracking-[0.1em] uppercase text-olive hover:text-charcoal cursor-pointer"
              >
                {isLoadingMenu ? 'Yenilənir...' : 'Yenilə ↻'}
              </button>
            </div>

            {items.length === 0 ? (
              <p className="py-10 text-sm font-sans text-charcoal/65">
                {isLoadingMenu
                  ? 'Menyu məlumatları yüklənir...'
                  : 'Menyu siyahısında hazırda heç bir məhsul yoxdur.'}
              </p>
            ) : (
              <div className="divide-y hairline-border">
                {items.map((item) => {
                  const isBusy = busyItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-sans tracking-[0.1em] uppercase text-charcoal/60">
                            {item.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-xs font-sans tabular-nums font-medium text-charcoal">
                            {item.price}
                          </span>
                          {!item.available && (
                            <span className="text-xs font-sans uppercase text-charcoal/60">
                              · Bitib
                            </span>
                          )}
                        </div>

                        <h3 className="font-sans font-medium text-base text-charcoal">
                          {item.name}
                        </h3>

                        {item.description && (
                          <p className="text-xs font-sans text-charcoal/70 max-w-lg">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleToggleAvailable(item)}
                          className="px-3 py-1.5 text-xs font-sans tracking-[0.06em] uppercase border hairline-border rounded-[2px] hover:bg-stone/20 cursor-pointer"
                        >
                          {item.available ? 'Bitib et' : 'Aktiv et'}
                        </button>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleStartEdit(item)}
                          className="px-3 py-1.5 text-xs font-sans tracking-[0.06em] uppercase border hairline-border rounded-[2px] hover:bg-stone/20 cursor-pointer"
                        >
                          Redaktə
                        </button>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDelete(item)}
                          className="px-3 py-1.5 text-xs font-sans tracking-[0.06em] uppercase border hairline-border text-charcoal/75 hover:bg-charcoal hover:text-bone rounded-[2px] cursor-pointer transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
