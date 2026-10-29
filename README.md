# Karakaş Mühendislik · Astro + Sveltia CMS

Next.js/Payload kaynağındaki Karakaş Mühendislik arayüzünün Astro statik çıktısıdır. Tasarım sistemi `bejamas/ui` ve Tailwind CSS v4 üzerine kuruludur; bileşenler `src/ui` ve `src/components` altında proje içinde tutulur.

## Komutlar

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm astro check
```

## Sveltia CMS

CMS arayüzü `/admin/` adresindedir. Konfigürasyon `public/admin/config.yml` dosyasında, içerik kaynakları ise `src/content/posts`, `src/data/site-settings.json` ve `src/data/services.json` altında bulunur.

Production deploy öncesinde `public/admin/config.yml` içindeki GitHub `repo` değeri bu projenin gerçek repository adresiyle değiştirilmelidir. Sveltia CMS, Astro için önerilen statik `public/admin/index.html` CDN kurulumuyla çalışır.

## Rota kapsamı

- Ana sayfa, hizmet listesi ve 17 hizmet detay sayfası
- `/blog`, `/posts`, kategori ve makale detay sayfaları
- `/kurye-firmalari` ve 27 kurye firma rehberi
- Süreç, hakkımızda, belgeler, marka listeleri ve iletişim
- KVKK, çerez ve kurumsal politika sayfaları
- Eski `/hizmetler/*`, `/posts/*` ve `/contact` uyumluluk rotaları
