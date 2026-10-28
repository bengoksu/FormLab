import { useState, useEffect, useRef, useCallback } from "react";
import Header from "./components/Header";
import FormEditor from "./components/FormEditor";

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

function App() {
  const [formAdi, setFormAdi] = useState("");
  const [aktifFormId, setAktifFormId] = useState(null);
  const [aktifEkran, setAktifEkran] = useState("ana_sayfa");
  const [yeniFormModal, setYeniFormModal] = useState({
    acik: false,
    ad: "",
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

  const [formlar, setFormlar] = useState(() => {
    const kayitliFormlar = localStorage.getItem("formlab_formlar");

    return kayitliFormlar ? JSON.parse(kayitliFormlar) : [];
  });
  const yeniFormInputRef = useRef(null);
  const formDuzenlemeInputRef = useRef(null);

  // Formları LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("formlab_formlar", JSON.stringify(formlar));
  }, [formlar]);

  function yeniFormModalAc() {
    setYeniFormModal({ acik: true, ad: "", closing: false });
    setYeniFormHata("");
    setFormAdi("");
  }

  const yeniFormModalKapat = useCallback(() => {
    if (yeniFormModal.closing) {
      return;
    }

    setYeniFormModal((mevcut) => ({ ...mevcut, closing: true }));
    setYeniFormHata("");
    setFormAdi("");

    window.setTimeout(() => {
      setYeniFormModal({ acik: false, ad: "", closing: false });
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
  function formEkle(yeniAdMetni = formAdi) {
    const ad = (yeniAdMetni ?? "").trim();

    if (!ad) {
      setYeniFormHata("Form adı boş olamaz.");
      return;
    }

    const yeniForm = {
      id: crypto.randomUUID(),
      ad,
      sorular: [],
    };

    setFormlar((mevcutFormlar) => [...mevcutFormlar, yeniForm]);
    setAktifFormId(yeniForm.id);
    setFormAdi("");
    setYeniFormModal({ acik: false, ad: "", closing: false });
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
                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Formlarım</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Oluşturduğun tüm formları buradan yönet.
                      </p>
                    </div>
                    <span className="text-sm font-medium text-slate-400">
                      {formlar.length} form
                    </span>
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

      {yeniFormModal.acik && (
        <div
          className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px] ${
            yeniFormModal.closing ? "closing" : ""
          }`}
          onClick={yeniFormModalKapat}
          role="presentation"
        >
          <div
            className={`modal-panel w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.18)] sm:p-6 ${
              yeniFormModal.closing ? "closing" : ""
            }`}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="yeni-form-baslik"
          >
            <div className="mb-5">
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
                onClick={() => formEkle(formAdi)}
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
    </div>
    </>
  );
}

export default App;
