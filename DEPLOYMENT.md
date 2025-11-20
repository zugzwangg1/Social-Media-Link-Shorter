# Netlify Deployment Rehberi 🚀

Bu rehber, Social Link Hub projesini Netlify'a deploy etmek için adım adım talimatlar içerir.

## 📋 Ön Hazırlık

### 1. Backend'i Deploy Et (Önce!)

Backend'i deploy etmeden önce frontend'i deploy etmeyin. Backend için öneriler:
- **Render.com** (Ücretsiz tier)
- **Railway.app** (Ücretsiz tier)
- **Heroku** (Ücretli)
- **DigitalOcean App Platform**

Backend deploy edildiğinde URL'ini not alın (örn: `https://your-app.onrender.com`)

### 2. MongoDB Hazırlayın

MongoDB Atlas'ta ücretsiz cluster oluşturun:
1. https://www.mongodb.com/cloud/atlas/register
2. Free tier seçin
3. Cluster oluşturun
4. Database Access'te user oluşturun
5. Network Access'te IP whitelist ekleyin (0.0.0.0/0 - tüm IP'ler)
6. Connection string'i kopyalayın

## 🌐 Netlify'a Deploy

### Yöntem 1: Netlify Dashboard (Önerilen)

1. **Netlify'a Giriş Yapın**
   - https://app.netlify.com/
   - GitHub ile giriş yapın

2. **Yeni Site Ekleyin**
   - "Add new site" > "Import an existing project"
   - GitHub'ı seçin
   - Repository'nizi seçin: `Social-Media-Link-Shorter`

3. **Build Ayarları**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/build
   ```

4. **Environment Variables Ekleyin**
   
   Site settings > Environment variables > Add a variable
   
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

5. **Deploy Edin**
   - "Deploy site" butonuna tıklayın
   - Build tamamlanana kadar bekleyin (~2-3 dakika)

### Yöntem 2: Netlify CLI

```bash
# Netlify CLI'yi yükleyin
npm install -g netlify-cli

# Netlify'a login olun
netlify login

# Frontend klasörüne gidin
cd frontend

# Build alın
npm run build

# Deploy edin
netlify deploy --prod
```

## ⚙️ Environment Variables

### Frontend (.env)

Netlify dashboard'da şu environment variable'ı ekleyin:

```env
REACT_APP_API_URL=https://your-backend-url.com
```

### Backend Environment Variables

Backend servisinizde (Render/Railway) şunları ekleyin:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-link-hub
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d
PORT=5000

# OAuth (Opsiyonel)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-url.com/api/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=https://your-backend-url.com/api/auth/github/callback

# Frontend URL (CORS için)
FRONTEND_URL=https://your-netlify-site.netlify.app
```

## 🔧 Netlify Konfigürasyonu

Proje root'unda `netlify.toml` dosyası zaten mevcut:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📝 Deploy Sonrası Kontrol Listesi

- [ ] Site açılıyor mu?
- [ ] API bağlantısı çalışıyor mu?
- [ ] Login/Register çalışıyor mu?
- [ ] Link ekleme/düzenleme çalışıyor mu?
- [ ] Public profile sayfaları açılıyor mu?
- [ ] Kar yağışı animasyonu çalışıyor mu?

## 🐛 Sorun Giderme

### Build Hatası

```bash
# Local'de build test edin
cd frontend
npm run build
```

### API Bağlantı Hatası

1. Backend URL'ini kontrol edin
2. CORS ayarlarını kontrol edin (backend'de FRONTEND_URL)
3. Environment variable'ları kontrol edin

### 404 Hatası

`netlify.toml` dosyasındaki redirects ayarını kontrol edin.

## 🎯 Backend Deploy Önerileri

### Render.com (Önerilen - Ücretsiz)

1. https://render.com/ - Sign up
2. "New +" > "Web Service"
3. GitHub repo'nuzu bağlayın
4. Ayarlar:
   ```
   Name: social-link-hub-api
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```
5. Environment variables ekleyin
6. "Create Web Service"

### Railway.app

1. https://railway.app/ - Sign up
2. "New Project" > "Deploy from GitHub repo"
3. Repository seçin
4. Root directory: `backend`
5. Environment variables ekleyin
6. Deploy

## 🔗 Faydalı Linkler

- [Netlify Docs](https://docs.netlify.com/)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [React Deployment](https://create-react-app.dev/docs/deployment/)

## 📞 Destek

Sorun yaşarsanız:
1. Netlify build logs'u kontrol edin
2. Browser console'u kontrol edin
3. Backend logs'u kontrol edin
4. GitHub Issues'da soru sorun

---

**Not:** İlk deploy'dan sonra her GitHub push'unda Netlify otomatik olarak yeniden deploy eder! 🎉
