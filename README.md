# Social Link Hub 🎄

Linktree benzeri, modern Christmas temalı sosyal medya link paylaşım platformu.

## Özellikler

- 🎄 Modern Christmas temalı UI (Kar yağışı animasyonu, altın ve kırmızı renkler)
- 🔐 Güvenli kimlik doğrulama (Email/Password + OAuth)
- 🔗 Link yönetimi (Ekle, düzenle, sil, sırala)
- 📊 Analitik ve istatistikler
- 🎨 Profil özelleştirme
- 🔒 Kapsamlı güvenlik önlemleri

## Teknolojiler

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Passport.js (OAuth)
- Helmet, Rate Limiting, Input Sanitization

### Frontend
- React 18
- React Router
- Axios
- Space-themed CSS

## Kurulum

### Backend

```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm start
```

## Geliştirme

Proje spec-driven development metodolojisi ile geliştirilmiştir.

Spec dokümanları:
- `.kiro/specs/social-link-hub/requirements.md` - Gereksinimler
- `.kiro/specs/social-link-hub/design.md` - Tasarım
- `.kiro/specs/social-link-hub/tasks.md` - Görevler

## Test

```bash
# Backend testleri
cd backend
npm test

# Frontend testleri
cd frontend
npm test
```

## Lisans

MIT
