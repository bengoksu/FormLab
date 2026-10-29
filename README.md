
# 💜 FormLab

### Modern ve Dinamik Form Oluşturma Uygulaması

FormLab, kullanıcıların kodlama bilgisine ihtiyaç duymadan kendi formlarını oluşturabildiği, düzenleyebildiği ve özelleştirebildiği modern ve kullanıcı dostu bir web uygulamasıdır.

React ve JavaScript kullanılarak geliştirilen FormLab; dinamik soru yönetimi, sürükle-bırak ile sıralama, hazır form şablonları, canlı önizleme ve tema özelleştirme gibi özellikleri bir araya getirir.


## 🌐 Canlı Demo

**[FormLab'ı Deneyin](https://stupendous-froyo-74a064.netlify.app/)**

---

## 🚀 Özellikler

### 📋 Form Yönetimi

- Yeni form oluşturma
- Mevcut formları listeleme
- Form adını düzenleme
- Form silme
- Mevcut formları çoğaltma
- Formları tüm soruları ve ayarlarıyla bağımsız olarak kopyalama
- Hazır şablonlardan form oluşturma
- Form açıklaması ekleme ve düzenleme
- Form tema rengini özelleştirme
- Değişiklikleri kontrollü olarak kaydetme

### ✏️ Dinamik Soru Yönetimi

- Soru ekleme, düzenleme ve silme
- Soru türünü belirleme
- Soruları zorunlu veya isteğe bağlı yapma
- Sürükle-bırak ile soru sıralama
- Seçenekli sorularda seçenek ekleme, düzenleme ve silme
- Soruların ve seçeneklerin LocalStorage üzerinden korunması

### 🧩 Desteklenen Soru Türleri

| Soru Türü | Açıklama |
|-----------|----------|
| Kısa Metin | Tek satırlık metin cevapları |
| Paragraf | Uzun metin cevapları |
| Çoktan Seçmeli | Tek seçenek işaretleme |
| Onay Kutuları | Birden fazla seçenek işaretleme |
| Açılır Liste | Listeden tek seçenek seçme |
| Tarih | Takvim üzerinden tarih seçme |

### 📚 Hazır Form Şablonları

FormLab, kullanıcıların sıfırdan soru hazırlamadan form oluşturmalarını sağlayan altı şablon sunar:

- Boş Form
- Etkinlik Kayıt Formu
- Geri Bildirim Formu
- İş Başvuru Formu
- Anket Formu
- İletişim Formu

Şablonlarla oluşturulan formlar düzenlenebilir ve kişiselleştirilebilir.

### 🎨 Kullanıcı Deneyimi ve Tasarım

- Modern SaaS dashboard tasarımı
- Form ve soru istatistikleri
- Canlı form önizlemesi
- Doldurulabilir form sayfası
- Form bağlantısı oluşturma ve kopyalama
- Form çoğaltma
- Düzenleme, Önizleme ve Ayarlar sekmeleri
- Altı farklı tema rengi
- Modern modal pencereler
- Yumuşak ekran geçişleri ve animasyonlar
- Responsive tasarım
- Mobil ve tablet uyumluluğu

### 💾 Veri Yönetimi

- LocalStorage ile form verilerini saklama
- JSON formatında form dışa aktarma
- JSON dosyasından form içe aktarma
- Mevcut formları silmeden yeni form yükleme
- Sayfa yenilendiğinde verileri koruma

---

## 🛠️ Kullanılan Teknolojiler

| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| React | Component tabanlı kullanıcı arayüzü |
| JavaScript | Uygulama mantığı ve dinamik etkileşimler |
| Vite | Geliştirme ortamı ve proje derleme |
| Tailwind CSS | Modern ve responsive tasarım |
| dnd-kit | Sürükle-bırak ile soru sıralama |
| LocalStorage | Tarayıcı üzerinde veri saklama |
| HTML5 & CSS3 | Sayfa yapısı ve stillendirme |
| Git & GitHub | Versiyon kontrolü |
| Netlify | Uygulamayı yayınlama |

---

## 📂 Proje Yapısı

```text
FormLab/
├── public/
├── src/
│   ├── components/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Kurulum

Projeyi yerel ortamda çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### 1. Repository'yi klonlayın

```bash
git clone https://github.com/bengoksu/FormLab.git
```

### 2. Proje dizinine geçin

```bash
cd FormLab
```

### 3. Bağımlılıkları yükleyin

```bash
npm install
```

### 4. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Terminalde gösterilen yerel adres üzerinden uygulamayı açabilirsiniz.

### 5. Üretim derlemesi oluşturun

```bash
npm run build
```

Kod kalitesini kontrol etmek için:

```bash
npm run lint
```

---

## 💾 Veri Saklama ve Paylaşım

FormLab, tamamen frontend odaklı bir uygulamadır. Form verileri tarayıcının LocalStorage alanında saklanır.

Bu nedenle:

- Formlar kullanılan tarayıcıya özeldir.
- Tarayıcı verileri temizlendiğinde kayıtlı formlar kaybolabilir.
- Formlar JSON formatında dışa aktarılıp başka bir tarayıcıya içe aktarılabilir.
- Form paylaşım bağlantıları yalnızca ilgili form verisinin bulunduğu tarayıcıda çalışır.
- Sunucu tabanlı kullanıcı hesabı veya yanıt toplama sistemi bulunmamaktadır.

Bu yapı sayesinde uygulama backend veya veritabanı gerektirmeden kullanılabilir.

---

## 🎯 Projenin Amacı

FormLab, modern frontend geliştirme teknolojilerini kullanarak dinamik, etkileşimli ve kullanıcı dostu bir web uygulaması oluşturmak amacıyla geliştirilmiştir.

Proje sürecinde aşağıdaki konular üzerinde çalışılmıştır:

- React component mimarisi
- Props kullanımı
- useState ve useEffect ile state yönetimi
- CRUD işlemleri
- Dinamik form oluşturma
- Koşullu render işlemleri
- Dizi ve nesne yönetimi
- LocalStorage ile veri kalıcılığı
- Sürükle-bırak etkileşimleri
- Kullanıcı girdilerinin doğrulanması
- Responsive tasarım
- Modern arayüz ve kullanıcı deneyimi
- Git/GitHub ile versiyon kontrolü
- Netlify üzerinden deployment

---

## 📸 Ekran Görüntüleri

### 🏠 Ana Sayfa
Formların yönetildiği ve genel istatistiklerin görüntülendiği dashboard.

<img width="1550" height="871" alt="Image" src="https://github.com/user-attachments/assets/819c52aa-c2c9-47c2-82c3-8064a1c2fe15" />

### ✏️ Form Editörü
Dinamik soruların oluşturulduğu, düzenlendiği ve sürükle-bırak ile sıralandığı çalışma alanı.

<img width="1427" height="877" alt="image" src="https://github.com/user-attachments/assets/66c5354e-c80c-4a3a-b1a6-d309cb7b12c0" />

### 👁️ Canlı Önizleme
Hazırlanan formun kullanıcıya nasıl görüneceğini gösteren önizleme ekranı.

<img width="1141" height="851" alt="image" src="https://github.com/user-attachments/assets/a89adab4-3cc3-4079-99f1-86e9a82585b9" />

### 📚 Hazır Form Şablonları
Farklı kullanım amaçları için sunulan hazır form şablonları.

<img width="1391" height="826" alt="image" src="https://github.com/user-attachments/assets/924bbd6c-e7b9-46d1-8c8f-d997490f0402" />

### ✏️ Form Ayarı
Form açıklaması eklenebilen ve kullanıcı isteğine göre form renginin değişebildiği alan.

<img width="1133" height="685" alt="image" src="https://github.com/user-attachments/assets/923f3588-9354-4209-bb11-47c35e6a0533" />
---

## 👩‍💻 Geliştirici

**Göksu Balaban**

Bilgisayar Mühendisliği Öğrencisi

GitHub: [@bengoksu](https://github.com/bengoksu)

---

<p align="center">
  React & JavaScript ile geliştirildi 💜
</p>
