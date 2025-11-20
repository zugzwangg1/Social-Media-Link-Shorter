# Social Link Hub - Kurulum Rehberi

## Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (v4.4 veya üzeri)
- npm veya yarn

## Kurulum Adımları

### 1. MongoDB'yi Başlatın

```bash
# MongoDB'nin çalıştığından emin olun
mongod
```

### 2. Backend Kurulumu

```bash
# Backend klasörüne gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# .env dosyasını kontrol edin ve gerekli değişkenleri ayarlayın
# Özellikle JWT_SECRET'i değiştirin!

# Sunucuyu başlatın
npm run dev
```

Backend http://localhost:5001 adresinde çalışacak.

### 3. Frontend Kurulumu

Yeni bir terminal açın:

```bash
# Frontend klasörüne gidin
cd frontend

# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npm start
```

Frontend http://localhost:3000 adresinde çalışacak.

## İlk Kullanım

1. Tarayıcınızda http://localhost:3000 adresine gidin
2. "Kayıt Ol" butonuna tıklayın
3. Email, kullanıcı adı ve şifre ile kayıt olun
4. Dashboard'a yönlendirileceksiniz
5. "Linklerim" sekmesinden yeni linkler ekleyin
6. "Profil" sekmesinden profilinizi özelleştirin
7. "Profilimi Görüntüle" butonu ile public profilinizi görün

## OAuth Kurulumu (Opsiyonel)

### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun
3. "APIs & Services" > "Credentials" bölümüne gidin
4. "Create Credentials" > "OAuth 2.0 Client ID" seçin
5. Authorized redirect URIs: `http://localhost:5001/api/auth/google/callback`
6. Client ID ve Client Secret'i backend/.env dosyasına ekleyin

### Microsoft OAuth

1. [Azure Portal](https://portal.azure.com/) adresine gidin
2. "Azure Active Directory" > "App registrations" bölümüne gidin
3. "New registration" ile yeni uygulama oluşturun
4. Redirect URI: `http://localhost:5001/api/auth/microsoft/callback`
5. Client ID ve Client Secret'i backend/.env dosyasına ekleyin

## Özellikler

✅ Kullanıcı kaydı ve girişi (Email/Password)
✅ OAuth ile giriş (Google, Microsoft)
✅ Link yönetimi (Ekle, düzenle, sil, sırala, aktif/pasif)
✅ Profil özelleştirme (İsim, bio, profil resmi, tema rengi)
✅ Kullanıcı adı değiştirme
✅ Şifre sıfırlama
✅ Analytics (Profil görüntüleme, link tıklama sayıları)
✅ Uzay temalı modern UI
✅ Responsive tasarım
✅ Güvenlik (Rate limiting, input sanitization, XSS protection, CSRF protection)

## Güvenlik Notları

- Production ortamında mutlaka JWT_SECRET değerini değiştirin
- HTTPS kullanın
- MongoDB bağlantı string'ini güvenli tutun
- OAuth credentials'ları asla commit etmeyin
- Rate limiting ayarlarını ihtiyacınıza göre düzenleyin

## Sorun Giderme

### MongoDB bağlantı hatası
- MongoDB'nin çalıştığından emin olun
- MONGODB_URI'nin doğru olduğunu kontrol edin

### Port zaten kullanımda
- Backend için: PORT değişkenini .env dosyasında değiştirin
- Frontend için: package.json'da port ayarını değiştirin

### OAuth çalışmıyor
- Redirect URI'lerin doğru olduğundan emin olun
- Client ID ve Secret'ların doğru girildiğini kontrol edin
- OAuth provider'da uygulamanın aktif olduğunu kontrol edin

## Geliştirme

```bash
# Backend testleri çalıştır
cd backend
npm test

# Frontend testleri çalıştır
cd frontend
npm test
```

## Production Build

```bash
# Frontend build
cd frontend
npm run build

# Backend production mode
cd backend
NODE_ENV=production npm start
```

## Lisans

MIT

## Destek

Sorularınız için issue açabilirsiniz.
