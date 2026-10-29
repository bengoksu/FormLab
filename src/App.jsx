import { useState, useEffect, useRef, useCallback } from "react";
import Header from "./components/Header";
import FormEditor from "./components/FormEditor";

const DESTEKLENEN_SORU_TURLERI = new Set([
  "kisa_metin",
  "paragraf",
  "coktan_secmeli",
  "onay_kutulari",
  "acilir_liste",
  "tarih",
]);
const TEMA_RENKLERI = new Set([
  "#7C3AED",
  "#2563EB",
  "#059669",
  "#E11D48",
  "#EA580C",
  "#0F172A",
]);
const JSON_DOSYA_BOYUTU_LIMITI = 2 * 1024 * 1024;

function DashboardSidebar({ aktifEkran, ekranDegistir }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white p-5 lg:block">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-lg font-bold text-white shadow-sm">
          F
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">
          FormLab
        </span>
      </div>

      <nav className="mt-10 space-y-2" aria-label="Ana navigasyon">
        <button
          type="button"
          onClick={() => ekranDegistir("ana_sayfa")}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-all duration-200 ease-out ${
            aktifEkran === "ana_sayfa"
              ? "bg-purple-50 text-purple-700 shadow-sm"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <span className="text-base">⌂</span>
          Ana Sayfa
        </button>
        <button
          type="button"
          onClick={() => ekranDegistir("formlar")}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-all duration-200 ease-out ${
            aktifEkran === "formlar"
              ? "bg-purple-50 font-semibold text-purple-700 shadow-sm"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <span className="text-base">▤</span>
          Formlarım
        </button>
      </nav>
    </aside>
  );
}

function getPaylasimFormId() {
  const eslesenYol = window.location.pathname.match(/^\/f\/([^/]+)\/?$/);

  if (!eslesenYol) {
    return null;
  }

  try {
    return decodeURIComponent(eslesenYol[1]);
  } catch {
    return eslesenYol[1];
  }
}

function PaylasilanForm({ form }) {
  const [cevaplar, setCevaplar] = useState({});
  const [gonderildi, setGonderildi] = useState(false);
  const temaRengi = form.temaRengi || "#7C3AED";

  function cevapGuncelle(soruId, cevap) {
    setCevaplar((mevcutCevaplar) => ({
      ...mevcutCevaplar,
      [soruId]: cevap,
    }));
    setGonderildi(false);
  }

  function onayKutusuDegistir(soruId, secenek) {
    const mevcutCevaplar = cevaplar[soruId] || [];
    const yeniCevaplar = mevcutCevaplar.includes(secenek)
      ? mevcutCevaplar.filter((cevap) => cevap !== secenek)
      : [...mevcutCevaplar, secenek];

    cevapGuncelle(soruId, yeniCevaplar);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] px-4 py-6 text-[#1E293B] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 font-bold text-white">
            F
          </div>
          <span className="font-bold tracking-tight text-slate-800">FormLab</span>
        </header>

        <main className="page-shell space-y-5">
          <section
            className="rounded-2xl border border-[#E5E7EB] border-t-4 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8"
            style={{ borderTopColor: temaRengi }}
          >
            <p className="text-sm font-semibold" style={{ color: temaRengi }}>
              Form
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">
              {form.ad}
            </h1>
            {form.aciklama ? (
              <p className="mt-2 text-sm text-slate-600">{form.aciklama}</p>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                Aşağıdaki alanları doldurabilirsiniz.
              </p>
            )}
          </section>

          <section className="space-y-4">
            {(form.sorular || []).map((soru) => (
              <div
                key={soru.id}
                className="question-card rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6"
              >
                <label
                  htmlFor={`paylasilan-${soru.id}`}
                  className="font-medium text-slate-800"
                >
                  {soru.baslik}
                  {soru.zorunlu && <span className="ml-1 text-red-600">*</span>}
                </label>

                {soru.tur === "paragraf" && (
                  <textarea
                    id={`paylasilan-${soru.id}`}
                    rows="4"
                    value={cevaplar[soru.id] || ""}
                    onChange={(event) =>
                      cevapGuncelle(soru.id, event.target.value)
                    }
                    placeholder="Cevabınızı yazınız"
                    className="mt-3 w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  />
                )}

                {soru.tur === "kisa_metin" && (
                  <input
                    id={`paylasilan-${soru.id}`}
                    type="text"
                    value={cevaplar[soru.id] || ""}
                    onChange={(event) =>
                      cevapGuncelle(soru.id, event.target.value)
                    }
                    placeholder="Cevabınızı yazınız"
                    className="mt-3 w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  />
                )}

                {soru.tur === "tarih" && (
                  <input
                    id={`paylasilan-${soru.id}`}
                    type="date"
                    value={cevaplar[soru.id] || ""}
                    onChange={(event) =>
                      cevapGuncelle(soru.id, event.target.value)
                    }
                    className="mt-3 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  />
                )}

                {soru.tur === "coktan_secmeli" && (
                  <div className="mt-3 space-y-2">
                    {(soru.secenekler || []).map((secenek, index) => (
                      <label
                        key={`${soru.id}-${index}`}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <input
                          type="radio"
                          name={`paylasilan-${soru.id}`}
                          value={secenek}
                          checked={cevaplar[soru.id] === secenek}
                          onChange={(event) =>
                            cevapGuncelle(soru.id, event.target.value)
                          }
                          className="h-4 w-4 accent-purple-600"
                        />
                        {secenek}
                      </label>
                    ))}
                  </div>
                )}

                {soru.tur === "onay_kutulari" && (
                  <div className="mt-3 space-y-2">
                    {(soru.secenekler || []).map((secenek, index) => (
                      <label
                        key={`${soru.id}-${index}`}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <input
                          type="checkbox"
                          value={secenek}
                          checked={(cevaplar[soru.id] || []).includes(secenek)}
                          onChange={() =>
                            onayKutusuDegistir(soru.id, secenek)
                          }
                          className="h-4 w-4 rounded accent-purple-600"
                        />
                        {secenek}
                      </label>
                    ))}
                  </div>
                )}

                {soru.tur === "acilir_liste" && (
                  <select
                    id={`paylasilan-${soru.id}`}
                    value={cevaplar[soru.id] || ""}
                    onChange={(event) =>
                      cevapGuncelle(soru.id, event.target.value)
                    }
                    className="mt-3 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  >
                    <option value="">Bir seçenek seçin</option>
                    {(soru.secenekler || []).map((secenek, index) => (
                      <option key={`${soru.id}-${index}`} value={secenek}>
                        {secenek}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </section>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setGonderildi(true)}
              className="rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:brightness-90 active:scale-[0.98]"
              style={{ backgroundColor: temaRengi }}
            >
              Gönder
            </button>
            {gonderildi && (
              <p className="text-sm font-medium text-purple-700" role="status">
                Bu form bir prototiptir. Yanıtlar henüz kaydedilmiyor.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function PaylasilanFormHatasi() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FC] px-4 py-8 text-center text-[#1E293B]">
      <div className="page-shell w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 font-bold text-purple-600">
          F
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-800">
          Form bulunamadı
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Bu form bağlantısı geçersiz olabilir veya form artık mevcut olmayabilir.
        </p>
      </div>
    </div>
  );
}

const FORM_SABLONLARI = [
  {
    id: "bos_form",
    ad: "Boş Form",
    aciklama: "Kendi sorularınızı sıfırdan oluşturun.",
    ikon: "＋",
    sorular: [],
  },
  {
    id: "etkinlik_kayit",
    ad: "Etkinlik Kayıt Formu",
    aciklama: "Katılımcı bilgilerini hızlıca toplayın.",
    ikon: "✦",
    sorular: [
      { baslik: "Adınız ve soyadınız", tur: "kisa_metin", zorunlu: true },
      { baslik: "E-posta adresiniz", tur: "kisa_metin", zorunlu: true },
      { baslik: "Etkinliğe nasıl katılacaksınız?", tur: "coktan_secmeli", zorunlu: true, secenekler: ["Yüz yüze", "Çevrim içi"] },
      { baslik: "Varsa özel isteklerinizi paylaşın", tur: "paragraf", zorunlu: false },
    ],
  },
  {
    id: "geri_bildirim",
    ad: "Geri Bildirim Formu",
    aciklama: "Deneyimleri ve önerileri anlamlandırın.",
    ikon: "♡",
    sorular: [
      { baslik: "Genel deneyiminizi nasıl değerlendirirsiniz?", tur: "coktan_secmeli", zorunlu: true, secenekler: ["Çok iyi", "İyi", "Orta", "Geliştirilmeli"] },
      { baslik: "En beğendiğiniz şey neydi?", tur: "kisa_metin", zorunlu: false },
      { baslik: "Deneyiminizi geliştirmek için öneriniz var mı?", tur: "paragraf", zorunlu: false },
    ],
  },
  {
    id: "is_basvurusu",
    ad: "İş Başvuru Formu",
    aciklama: "Aday bilgilerini düzenli şekilde toplayın.",
    ikon: "◆",
    sorular: [
      { baslik: "Adınız ve soyadınız", tur: "kisa_metin", zorunlu: true },
      { baslik: "E-posta adresiniz", tur: "kisa_metin", zorunlu: true },
      { baslik: "Başvurduğunuz pozisyon", tur: "kisa_metin", zorunlu: true },
      { baslik: "Kendinizden ve deneyimlerinizden bahsedin", tur: "paragraf", zorunlu: true },
    ],
  },
  {
    id: "anket_formu",
    ad: "Anket Formu",
    aciklama: "Görüşleri ve memnuniyet düzeyini ölçün.",
    ikon: "☷",
    sorular: [
      { baslik: "Adınız Soyadınız", tur: "kisa_metin", zorunlu: false },
      {
        baslik: "Yaş Aralığınız",
        tur: "coktan_secmeli",
        zorunlu: false,
        secenekler: ["18 yaş altı", "18–24", "25–34", "35–44", "45 ve üzeri"],
      },
      {
        baslik: "Hizmetimizi Nasıl Değerlendirirsiniz?",
        tur: "coktan_secmeli",
        zorunlu: false,
        secenekler: ["Çok iyi", "İyi", "Orta", "Kötü", "Çok kötü"],
      },
      {
        baslik: "Hizmetimizi Başkalarına Önerir misiniz?",
        tur: "coktan_secmeli",
        zorunlu: false,
        secenekler: ["Evet", "Hayır", "Kararsızım"],
      },
      { baslik: "Eklemek İstedikleriniz", tur: "paragraf", zorunlu: false },
    ],
  },
  {
    id: "iletisim_formu",
    ad: "İletişim Formu",
    aciklama: "İletişim taleplerini kolayca toplayın.",
    ikon: "✉",
    sorular: [
      { baslik: "Adınız Soyadınız", tur: "kisa_metin", zorunlu: true },
      { baslik: "E-posta Adresiniz", tur: "kisa_metin", zorunlu: true },
      { baslik: "Konu", tur: "kisa_metin", zorunlu: true },
      { baslik: "Mesajınız", tur: "paragraf", zorunlu: true },
      {
        baslik: "Size Nasıl Ulaşalım?",
        tur: "coktan_secmeli",
        zorunlu: false,
        secenekler: ["E-posta", "Telefon"],
      },
    ],
  },
];

function App() {
  const [formAdi, setFormAdi] = useState("");
  const [aktifFormId, setAktifFormId] = useState(null);
  const [aktifEkran, setAktifEkran] = useState(() => {
    const kayitliEkran = sessionStorage.getItem("formlab_aktif_ekran");

    return kayitliEkran === "formlar" ? "formlar" : "ana_sayfa";
  });
  const [paylasimFormId, setPaylasimFormId] = useState(() =>
    getPaylasimFormId(),
  );
  const [yeniFormModal, setYeniFormModal] = useState({
    acik: false,
    ad: "",
    sablonId: "bos_form",
    closing: false,
  });
  const [yeniFormHata, setYeniFormHata] = useState("");
  const [formDuzenleme, setFormDuzenleme] = useState({
    acik: false,
    formId: null,
    ad: "",
    closing: false,
  });
  const [formDuzenlemeHata, setFormDuzenlemeHata] = useState("");
  const [removingFormIds, setRemovingFormIds] = useState(new Set());
  const [formCogaltilmaBildirimi, setFormCogaltilmaBildirimi] =
    useState(false);
  const [jsonBildirimi, setJsonBildirimi] = useState(null);
  const [paylasimModal, setPaylasimModal] = useState({
    acik: false,
    formId: null,
    closing: false,
    kopyalandi: false,
  });

  const [formlar, setFormlar] = useState(() => {
    const kayitliFormlar = localStorage.getItem("formlab_formlar");

    return kayitliFormlar ? JSON.parse(kayitliFormlar) : [];
  });
  const yeniFormInputRef = useRef(null);
  const formDuzenlemeInputRef = useRef(null);
  const paylasimInputRef = useRef(null);
  const jsonDosyaInputRef = useRef(null);

  // Formları LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("formlab_formlar", JSON.stringify(formlar));
  }, [formlar]);

  useEffect(() => {
    const handlePopState = () => setPaylasimFormId(getPaylasimFormId());

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function yeniFormModalAc() {
    setYeniFormModal({
      acik: true,
      ad: "Boş Form",
      sablonId: "bos_form",
      closing: false,
    });
    setYeniFormHata("");
    setFormAdi("Boş Form");
  }

  const yeniFormModalKapat = useCallback(() => {
    if (yeniFormModal.closing) {
      return;
    }

    setYeniFormModal((mevcut) => ({ ...mevcut, closing: true }));
    setYeniFormHata("");
    setFormAdi("");

    window.setTimeout(() => {
      setYeniFormModal({
        acik: false,
        ad: "",
        sablonId: "bos_form",
        closing: false,
      });
    }, 220);
  }, [yeniFormModal.closing]);

  useEffect(() => {
    if (!yeniFormModal.acik) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        yeniFormModalKapat();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    yeniFormInputRef.current?.focus();
    yeniFormInputRef.current?.select();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [yeniFormModal.acik, yeniFormModalKapat]);

  const formDuzenlemeKapat = useCallback(() => {
    if (formDuzenleme.closing) {
      return;
    }

    setFormDuzenleme((mevcut) => ({ ...mevcut, closing: true }));
    setFormDuzenlemeHata("");

    window.setTimeout(() => {
      setFormDuzenleme({ acik: false, formId: null, ad: "", closing: false });
    }, 220);
  }, [formDuzenleme.closing]);

  function formPaylasimAc(formId) {
    setPaylasimModal({
      acik: true,
      formId,
      closing: false,
      kopyalandi: false,
    });
  }

  const formPaylasimKapat = useCallback(() => {
    if (paylasimModal.closing) {
      return;
    }

    setPaylasimModal((mevcut) => ({ ...mevcut, closing: true }));
    window.setTimeout(() => {
      setPaylasimModal({
        acik: false,
        formId: null,
        closing: false,
        kopyalandi: false,
      });
    }, 220);
  }, [paylasimModal.closing]);

  useEffect(() => {
    if (!paylasimModal.acik) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        formPaylasimKapat();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    paylasimInputRef.current?.focus();
    paylasimInputRef.current?.select();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [paylasimModal.acik, formPaylasimKapat]);

  async function formBaglantisiniKopyala(formId) {
    const url = `${window.location.origin}/f/${encodeURIComponent(formId)}`;

    try {
      await navigator.clipboard.writeText(url);
      setPaylasimModal((mevcut) => ({ ...mevcut, kopyalandi: true }));
    } catch (error) {
      console.error("Form bağlantısı kopyalanamadı.", error);
      setPaylasimModal((mevcut) => ({ ...mevcut, kopyalandi: false }));
    }
  }

  function formBaglantisiniAc(formId) {
    const url = `${window.location.origin}/f/${encodeURIComponent(formId)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    if (!formDuzenleme.acik) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        formDuzenlemeKapat();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    formDuzenlemeInputRef.current?.focus();
    formDuzenlemeInputRef.current?.select();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [formDuzenleme.acik, formDuzenlemeKapat]);

  // Yeni form oluştur
  function formEkle(
    yeniAdMetni = formAdi,
    sablonId = yeniFormModal.sablonId,
  ) {
    const ad = (yeniAdMetni ?? "").trim();

    if (!ad) {
      setYeniFormHata("Form adı boş olamaz.");
      return;
    }

    const secilenSablon = FORM_SABLONLARI.find(
      (sablon) => sablon.id === sablonId,
    ) || FORM_SABLONLARI[0];
    const yeniForm = {
      id: crypto.randomUUID(),
      ad,
      aciklama: "",
      temaRengi: "#7C3AED",
      sorular: secilenSablon.sorular.map((soru) => ({
        ...soru,
        id: crypto.randomUUID(),
        ...(soru.secenekler ? { secenekler: [...soru.secenekler] } : {}),
      })),
    };

    setFormlar((mevcutFormlar) => [...mevcutFormlar, yeniForm]);
    setAktifFormId(yeniForm.id);
    setFormAdi("");
    setYeniFormModal({
      acik: false,
      ad: "",
      sablonId: "bos_form",
      closing: false,
    });
    setYeniFormHata("");
  }

  // Form sil
  function formSil(silinecekId) {
    setRemovingFormIds((mevcut) => new Set([...mevcut, silinecekId]));

    window.setTimeout(() => {
      setFormlar((mevcutFormlar) =>
        mevcutFormlar.filter((form) => form.id !== silinecekId),
      );
      setRemovingFormIds((mevcut) => {
        const sonraki = new Set(mevcut);
        sonraki.delete(silinecekId);
        return sonraki;
      });
    }, 180);
  }

  function guvenliDosyaAdi(ad) {
      const dosyaAdi = ad
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();

      return `${dosyaAdi || "form"}.json`;
    }

    function formDisaAktar(form) {
      const json = JSON.stringify(form, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = guvenliDosyaAdi(form.ad);
      link.click();
      URL.revokeObjectURL(url);
      setJsonBildirimi({ tur: "basari", mesaj: "Form dışa aktarıldı" });
      window.setTimeout(() => setJsonBildirimi(null), 2200);
    }

    function formVerisiniDogrula(veri) {
      if (!veri || typeof veri !== "object" || Array.isArray(veri)) {
        return "JSON bir form nesnesi içermelidir.";
      }

      if (typeof veri.ad !== "string" || veri.ad.trim() === "") {
        return "Form adı geçerli bir metin olmalıdır.";
      }

      if (!Array.isArray(veri.sorular)) {
        return "Form sorular dizisi içermelidir.";
      }

      for (const [index, soru] of veri.sorular.entries()) {
        if (!soru || typeof soru !== "object" || Array.isArray(soru)) {
          return `${index + 1}. soru geçerli değil.`;
        }

        if (
          typeof soru.baslik !== "string" ||
          soru.baslik.trim() === "" ||
          !DESTEKLENEN_SORU_TURLERI.has(soru.tur) ||
          typeof soru.zorunlu !== "boolean"
        ) {
          return `${index + 1}. sorunun başlık, tür veya zorunluluk bilgisi geçersiz.`;
        }

        const secenekGerekli =
          soru.tur === "coktan_secmeli" ||
          soru.tur === "onay_kutulari" ||
          soru.tur === "acilir_liste";

        if (
          secenekGerekli &&
          (!Array.isArray(soru.secenekler) ||
            soru.secenekler.length < 2 ||
            soru.secenekler.some(
              (secenek) => typeof secenek !== "string" || secenek.trim() === "",
            ))
        ) {
          return `${index + 1}. soru en az iki geçerli seçenek içermelidir.`;
        }
      }

      return null;
    }

    async function formIceriAktar(event) {
      const dosya = event.target.files?.[0];
      event.target.value = "";

      if (!dosya) {
        return;
      }

      if (!dosya.name.toLowerCase().endsWith(".json")) {
        setJsonBildirimi({
          tur: "hata",
          mesaj: "Lütfen yalnızca .json dosyası seçin.",
        });
        window.setTimeout(() => setJsonBildirimi(null), 3000);
        return;
      }

      if (dosya.size > JSON_DOSYA_BOYUTU_LIMITI) {
        setJsonBildirimi({
          tur: "hata",
          mesaj: "JSON dosyası en fazla 2 MB olabilir.",
        });
        return;
      }

      try {
        const veri = JSON.parse(await dosya.text());
        const hata = formVerisiniDogrula(veri);

        if (hata) {
          setJsonBildirimi({ tur: "hata", mesaj: hata });
          return;
        }

        const yeniForm = {
          ...veri,
          id: crypto.randomUUID(),
          ad: veri.ad.trim(),
          aciklama: typeof veri.aciklama === "string" ? veri.aciklama : "",
          temaRengi: TEMA_RENKLERI.has(veri.temaRengi)
            ? veri.temaRengi
            : "#7C3AED",
          sorular: veri.sorular.map((soru) => ({
            ...soru,
            id: crypto.randomUUID(),
            baslik: soru.baslik.trim(),
            ...(soru.secenekler
              ? {
                  secenekler: soru.secenekler.map((secenek) =>
                    secenek.trim(),
                  ),
                }
              : {}),
          })),
        };

        setFormlar((mevcutFormlar) => [...mevcutFormlar, yeniForm]);
        setJsonBildirimi({
          tur: "basari",
          mesaj: "Form içe aktarıldı",
        });
      } catch {
        setJsonBildirimi({
          tur: "hata",
          mesaj: "Geçerli bir JSON dosyası seçin.",
        });
      }

      window.setTimeout(() => setJsonBildirimi(null), 3000);
    }

  function formCogaltil(formId) {
    const kaynakForm = formlar.find((form) => form.id === formId);

    if (!kaynakForm) {
      return;
    }

    const kopyaForm = structuredClone(kaynakForm);
    kopyaForm.id = crypto.randomUUID();
    kopyaForm.ad = `${kaynakForm.ad} (Kopya)`;
    kopyaForm.sorular = (kaynakForm.sorular || []).map((soru) => ({
      ...soru,
      id: crypto.randomUUID(),
      ...(soru.secenekler
        ? { secenekler: [...soru.secenekler] }
        : {}),
    }));

    setFormlar((mevcutFormlar) => [...mevcutFormlar, kopyaForm]);
    setFormCogaltilmaBildirimi(true);
    window.setTimeout(() => setFormCogaltilmaBildirimi(false), 2200);
  }

  // Form adını güncelle
  function formGuncelle(guncellenecekId) {
    const form = formlar.find((item) => item.id === guncellenecekId);

    if (!form) {
      return;
    }

    setFormDuzenleme({
      acik: true,
      formId: guncellenecekId,
      ad: form.ad,
      closing: false,
    });
    setFormDuzenlemeHata("");
  }

  function formGuncelleKaydet() {
    const yeniAd = formDuzenleme.ad.trim();

    if (!yeniAd) {
      setFormDuzenlemeHata("Form adı boş olamaz.");
      return;
    }

    setFormlar((mevcutFormlar) =>
      mevcutFormlar.map((form) =>
        form.id === formDuzenleme.formId ? { ...form, ad: yeniAd } : form,
      ),
    );

    formDuzenlemeKapat();
  }

  // Seçilen formu aç
  function formAc(id) {
    setAktifFormId(id);
  }

  function ekranDegistir(ekran) {
    setAktifFormId(null);
    setAktifEkran(ekran);
    sessionStorage.setItem("formlab_aktif_ekran", ekran);
  }

  function soruEkle(formId, yeniSoru) {
    setFormlar((mevcutFormlar) =>
      mevcutFormlar.map((form) => {
        if (form.id !== formId) {
          return form;
        }

        return {
          ...form,
          sorular: [...(form.sorular || []), yeniSoru],
        };
      }),
    );
  }

  function formAyarlariGuncelle(formId, degisiklikler) {
    setFormlar((mevcutFormlar) =>
      mevcutFormlar.map((form) =>
        form.id === formId ? { ...form, ...degisiklikler } : form,
      ),
    );
  }

  function soruSil(formId, soruId) {
    setFormlar((mevcutFormlar) =>
      mevcutFormlar.map((form) => {
        if (form.id !== formId) {
          return form;
        }

        return {
          ...form,
          sorular: (form.sorular || []).filter((soru) => soru.id !== soruId),
        };
      }),
    );
  }

  function soruGuncelle(formId, soruId, degisiklikler) {
    setFormlar((mevcutFormlar) =>
      mevcutFormlar.map((form) => {
        if (form.id !== formId) {
          return form;
        }

        return {
          ...form,
          sorular: (form.sorular || []).map((soru) =>
            soru.id === soruId ? { ...soru, ...degisiklikler } : soru,
          ),
        };
      }),
    );
  }

  function soruSirala(formId, aktifSoruId, hedefSoruId) {
    setFormlar((mevcutFormlar) =>
      mevcutFormlar.map((form) => {
        if (form.id !== formId) {
          return form;
        }

        const sorular = form.sorular || [];
        const eskiIndex = sorular.findIndex(
          (soru) => soru.id === aktifSoruId,
        );
        const yeniIndex = sorular.findIndex(
          (soru) => soru.id === hedefSoruId,
        );

        if (eskiIndex === -1 || yeniIndex === -1 || eskiIndex === yeniIndex) {
          return form;
        }

        const yeniSorular = [...sorular];
        const [tasınanSoru] = yeniSorular.splice(eskiIndex, 1);
        yeniSorular.splice(yeniIndex, 0, tasınanSoru);

        return {
          ...form,
          sorular: yeniSorular,
        };
      }),
    );
  }

  const aktifForm = formlar.find((form) => form.id === aktifFormId);
  const toplamSoru = formlar.reduce(
    (toplam, form) => toplam + (form.sorular || []).length,
    0,
  );
  const zorunluSoru = formlar.reduce(
    (toplam, form) =>
      toplam +
      (form.sorular || []).filter((soru) => soru.zorunlu === true).length,
    0,
  );
  const paylasilanForm = paylasimFormId
    ? formlar.find((form) => form.id === paylasimFormId)
    : null;
  const paylasimModalForm = paylasimModal.formId
    ? formlar.find((form) => form.id === paylasimModal.formId)
    : null;

  if (paylasimFormId) {
    return paylasilanForm ? (
      <PaylasilanForm form={paylasilanForm} />
    ) : (
      <PaylasilanFormHatasi />
    );
  }

  return (
    <>
      <style>{`
        .page-shell {
          animation: pageFade 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .form-card,
        .question-card,
        .modal-panel,
        .surface-card {
          transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease, opacity 200ms ease;
        }

        .form-card:hover,
        .question-card:hover {
          transform: translateY(-2px);
        }

        .form-card {
          animation: cardIn 220ms ease-out both;
        }

        .form-card.is-removing {
          animation: cardOut 180ms ease-in forwards;
        }

        .question-card {
          animation: cardIn 220ms ease-out both;
        }

        .question-card.is-removing {
          animation: cardOut 180ms ease-in forwards;
        }

        .modal-backdrop {
          animation: backdropIn 260ms ease-out both;
        }

        .modal-backdrop.closing {
          animation: backdropOut 220ms ease-in both;
        }

        .modal-panel {
          animation: modalIn 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .modal-panel.closing {
          animation: modalOut 220ms ease-in both;
        }

        @keyframes pageFade {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardOut {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }

        @keyframes backdropIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes backdropOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes modalIn {
          0% { opacity: 0; transform: scale(0.97) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes modalOut {
          0% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.98) translateY(8px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .page-shell,
          .form-card,
          .question-card,
          .modal-backdrop,
          .modal-panel {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-[#F8F9FC] text-[#1E293B]">
        {aktifForm ? (
          <div key={`editor-${aktifForm.id}`} className="page-shell mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="surface-card rounded-2xl bg-white p-5 shadow-sm sm:p-8">
              <Header
                baslik="FormLab"
                aciklama="Hayalindeki formları kolayca tasarla."
              />
              <FormEditor
                form={aktifForm}
                geriDon={() => ekranDegistir("formlar")}
                soruEkle={soruEkle}
                soruSil={soruSil}
                soruGuncelle={soruGuncelle}
                soruSirala={soruSirala}
                formAyarlariGuncelle={formAyarlariGuncelle}
              />
            </div>
          </div>
        ) : (
        <div key={`dashboard-${aktifEkran}`} className="page-shell mx-auto flex min-h-screen max-w-[1440px]">
          <DashboardSidebar
            aktifEkran={aktifEkran}
            ekranDegistir={ekranDegistir}
          />

          <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 font-bold text-white">
                  F
                </div>
                <span className="font-bold text-slate-800">FormLab</span>
              </div>
              <nav className="flex gap-1" aria-label="Mobil navigasyon">
                <button
                  type="button"
                  onClick={() => ekranDegistir("ana_sayfa")}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ease-out ${
                    aktifEkran === "ana_sayfa"
                      ? "bg-purple-50 text-purple-700 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Ana Sayfa
                </button>
                <button
                  type="button"
                  onClick={() => ekranDegistir("formlar")}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ease-out ${
                    aktifEkran === "formlar"
                      ? "bg-purple-50 font-semibold text-purple-700 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Formlarım
                </button>
              </nav>
            </div>

            <div className="mx-auto max-w-6xl">
              <header className="flex flex-col gap-5 border-b border-gray-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-2 text-sm font-semibold text-purple-600">
                    {aktifEkran === "ana_sayfa" ? "Genel bakış" : "Çalışma alanı"}
                  </p>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                    {aktifEkran === "ana_sayfa" ? "Formlarını yönet" : "Formlarım"}
                  </h1>
                  <p className="mt-2 text-sm text-slate-500 sm:text-base">
                    {aktifEkran === "ana_sayfa"
                      ? "Formlarını oluştur, düzenle ve kolayca yönet."
                      : "Oluşturduğun tüm formları buradan yönet."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={yeniFormModalAc}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6D28D9]"
                >
                  <span className="text-lg leading-none">+</span>
                  Yeni Form
                </button>
              </header>

              {aktifEkran === "ana_sayfa" && (
                <section className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  ["Toplam Form", formlar.length, "Oluşturulan tüm formlar"],
                  ["Toplam Soru", toplamSoru, "Tüm formlardaki sorular"],
                  ["Zorunlu Soru", zorunluSoru, "Yanıtlanması gerekenler"],
                ].map(([baslik, deger, aciklama], index) => (
                  <div
                    key={baslik}
                    className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-slate-500">{baslik}</p>
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-sm font-bold text-purple-600">
                        {index === 0 ? "▤" : index === 1 ? "?" : "*"}
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-bold text-slate-800">{deger}</p>
                    <p className="mt-1 text-xs text-slate-400">{aciklama}</p>
                  </div>
                ))}
                </section>
              )}

              {aktifEkran === "ana_sayfa" && (
              <section className="mt-8">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Son formlar</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Son oluşturduğun formlara hızlıca göz at.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => ekranDegistir("formlar")}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Tümünü gör
                  </button>
                </div>

                {formlar.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm sm:p-12">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-xl text-purple-600">
                      +
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-800">
                      Henüz form oluşturmadınız
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                      İlk formunu oluşturmak için “Yeni Form” butonunu kullan.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {formlar.slice(-4).reverse().map((form) => (
                      <div
                        key={form.id}
                        className={`form-card group flex min-w-0 flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:border-purple-200 hover:shadow-md ${
                          removingFormIds.has(form.id) ? "is-removing" : ""
                        }`}
                      >
                        <div className="flex min-w-0 items-start justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                              ▤
                            </div>
                            <div className="min-w-0">
                              <h3 className="truncate font-semibold text-slate-800">
                                {form.ad}
                              </h3>
                              <p className="mt-1 text-sm text-slate-500">
                                {(form.sorular || []).length} soru
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                            Form
                          </span>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                          <button type="button" onClick={() => formAc(form.id)} className="flex-1 rounded-lg bg-[#7C3AED] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#6D28D9]">Formu Aç</button>
                          <button type="button" onClick={() => formGuncelle(form.id)} className="rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-100">Düzenle</button>
                          <button type="button" onClick={() => formPaylasimAc(form.id)} className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100">Paylaş</button>
                          <button type="button" onClick={() => formCogaltil(form.id)} className="rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-100">Çoğalt</button>
                          <button type="button" onClick={() => formSil(form.id)} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">Sil</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              )}

              {aktifEkran === "formlar" && (
                <section className="mt-8">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Formlarım</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Oluşturduğun tüm formları buradan yönet.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        ref={jsonDosyaInputRef}
                        type="file"
                        accept=".json,application/json"
                        onChange={formIceriAktar}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => jsonDosyaInputRef.current?.click()}
                        className="rounded-lg bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
                      >
                        İçe Aktar
                      </button>
                      <span className="text-sm font-medium text-slate-400">
                        {formlar.length} form
                      </span>
                    </div>
                  </div>

                  {formlar.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm sm:p-12">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-xl text-purple-600">
                        +
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-800">
                        Henüz form oluşturmadınız
                      </h3>
                      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                        İlk formunu oluşturmak için yukarıdaki alandan bir form adı gir.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {formlar.map((form) => (
                        <div
                          key={form.id}
                          className={`form-card group flex min-w-0 flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:border-purple-200 hover:shadow-md ${
                            removingFormIds.has(form.id) ? "is-removing" : ""
                          }`}
                        >
                          <div className="flex min-w-0 items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                ▤
                              </div>
                              <div className="min-w-0">
                                <h3 className="truncate font-semibold text-slate-800">
                                  {form.ad}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                  {(form.sorular || []).length} soru
                                </p>
                              </div>
                            </div>
                            <span className="shrink-0 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                              Form
                            </span>
                          </div>
                          <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                            <button
                              type="button"
                              onClick={() => formAc(form.id)}
                              className="flex-1 rounded-lg bg-[#7C3AED] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
                            >
                              Formu Aç
                            </button>
                            <button
                              type="button"
                              onClick={() => formGuncelle(form.id)}
                              className="rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
                            >
                              Düzenle
                            </button>
                            <button
                              type="button"
                              onClick={() => formPaylasimAc(form.id)}
                              className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                            >
                              Paylaş
                            </button>
                            <button
                              type="button"
                              onClick={() => formDisaAktar(form)}
                              className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                            >
                              Dışa Aktar
                            </button>
                            <button
                              type="button"
                              onClick={() => formCogaltil(form.id)}
                              className="rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
                            >
                              Çoğalt
                            </button>
                            <button
                              type="button"
                              onClick={() => formSil(form.id)}
                              className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </div>
          </main>
        </div>
      )}

      {formCogaltilmaBildirimi && (
        <div
          className="fixed bottom-5 right-5 z-40 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg"
          role="status"
        >
          Form çoğaltıldı
        </div>
      )}

      {jsonBildirimi && (
        <div
          className={`fixed bottom-5 left-5 z-40 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-lg ${
            jsonBildirimi.tur === "hata"
              ? "border-red-100 text-red-700"
              : "border-emerald-100 text-emerald-700"
          }`}
          role="status"
        >
          {jsonBildirimi.mesaj}
        </div>
      )}

      {yeniFormModal.acik && (
        <div
          className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px] ${
            yeniFormModal.closing ? "closing" : ""
          }`}
          onClick={yeniFormModalKapat}
          role="presentation"
        >
          <div
            className={`modal-panel flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.18)] sm:p-6 ${
              yeniFormModal.closing ? "closing" : ""
            }`}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="yeni-form-baslik"
          >
            <div className="mb-5 shrink-0">
              <h2
                id="yeni-form-baslik"
                className="text-xl font-bold text-slate-800"
              >
                Yeni Form
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Formunuz için bir isim girin.
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <p className="mb-3 text-sm font-semibold text-slate-700">
                Bir şablon seçin
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {FORM_SABLONLARI.map((sablon) => {
                  const secili = yeniFormModal.sablonId === sablon.id;

                  return (
                    <button
                      key={sablon.id}
                      type="button"
                      onClick={() =>
                        (() => {
                          setYeniFormModal((mevcut) => ({
                            ...mevcut,
                            sablonId: sablon.id,
                            ad: sablon.ad,
                          }));
                          setFormAdi(sablon.ad);
                          setYeniFormHata("");
                        })()
                      }
                      className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                        secili
                          ? "border-purple-500 bg-purple-50 shadow-sm ring-2 ring-purple-100"
                          : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/40"
                      }`}
                      aria-pressed={secili}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ${
                            secili
                              ? "bg-purple-600 text-white"
                              : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {sablon.ikon}
                        </span>
                        <span className="font-semibold text-slate-800">
                          {sablon.ad}
                        </span>
                      </span>
                      <span className="mt-3 block text-xs leading-5 text-slate-500">
                        {sablon.aciklama}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label htmlFor="yeni-form-input" className="sr-only">
              Form adı
            </label>
            <input
              id="yeni-form-input"
              ref={yeniFormInputRef}
              type="text"
              value={formAdi}
              onChange={(event) => {
                setFormAdi(event.target.value);
                setYeniFormModal((mevcut) => ({
                  ...mevcut,
                  ad: event.target.value,
                }));
                if (yeniFormHata) {
                  setYeniFormHata("");
                }
              }}
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              placeholder="Form adı"
            />

            {yeniFormHata && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {yeniFormHata}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={yeniFormModalKapat}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => formEkle(formAdi, yeniFormModal.sablonId)}
                className="rounded-xl bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
              >
                Form Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {formDuzenleme.acik && (
        <div
          className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px] ${
            formDuzenleme.closing ? "closing" : ""
          }`}
          onClick={formDuzenlemeKapat}
          role="presentation"
        >
          <div
            className={`modal-panel w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.18)] sm:p-6 ${
              formDuzenleme.closing ? "closing" : ""
            }`}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-duzenle-baslik"
          >
            <div className="mb-5">
              <h2
                id="form-duzenle-baslik"
                className="text-xl font-bold text-slate-800"
              >
                Formu Düzenle
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Form adını güncelleyin.
              </p>
            </div>

            <label htmlFor="form-duzenleme-input" className="sr-only">
              Form adı
            </label>
            <input
              id="form-duzenleme-input"
              ref={formDuzenlemeInputRef}
              type="text"
              value={formDuzenleme.ad}
              onChange={(event) => {
                setFormDuzenleme((mevcut) => ({ ...mevcut, ad: event.target.value }));
                if (formDuzenlemeHata) {
                  setFormDuzenlemeHata("");
                }
              }}
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              placeholder="Form adı"
            />

            {formDuzenlemeHata && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {formDuzenlemeHata}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={formDuzenlemeKapat}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={formGuncelleKaydet}
                className="rounded-xl bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {paylasimModal.acik && paylasimModalForm && (
        <div
          className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px] ${
            paylasimModal.closing ? "closing" : ""
          }`}
          onClick={formPaylasimKapat}
          role="presentation"
        >
          <div
            className={`modal-panel w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.18)] sm:p-6 ${
              paylasimModal.closing ? "closing" : ""
            }`}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-paylas-baslik"
          >
            <div className="mb-5">
              <h2
                id="form-paylas-baslik"
                className="text-xl font-bold text-slate-800"
              >
                Formu Paylaş
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {paylasimModalForm.ad} formunun bağlantısını paylaşın.
              </p>
            </div>

            <label htmlFor="form-paylasim-linki" className="sr-only">
              Form bağlantısı
            </label>
            <input
              id="form-paylasim-linki"
              ref={paylasimInputRef}
              type="text"
              readOnly
              value={`${window.location.origin}/f/${encodeURIComponent(paylasimModalForm.id)}`}
              className="w-full rounded-xl border border-[#E5E7EB] bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />

            <p className="mt-3 rounded-xl bg-purple-50 p-3 text-xs leading-5 text-purple-800">
              Bu sürümde bağlantı yalnızca formun kayıtlı olduğu tarayıcıda çalışır.
            </p>

            {paylasimModal.kopyalandi && (
              <p className="mt-3 text-sm font-medium text-emerald-600" role="status">
                Bağlantı panoya kopyalandı.
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={formPaylasimKapat}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => formBaglantisiniAc(paylasimModalForm.id)}
                className="rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
              >
                Formu Aç
              </button>
              <button
                type="button"
                onClick={() => formBaglantisiniKopyala(paylasimModalForm.id)}
                className="rounded-xl bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
              >
                Bağlantıyı Kopyala
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default App;
