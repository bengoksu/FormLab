import { useState, useEffect, useRef } from "react";
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
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
            aktifEkran === "ana_sayfa"
              ? "bg-purple-50 text-purple-700"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <span className="text-base">⌂</span>
          Ana Sayfa
        </button>
        <button
          type="button"
          onClick={() => ekranDegistir("formlar")}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
            aktifEkran === "formlar"
              ? "bg-purple-50 font-semibold text-purple-700"
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

  const [formlar, setFormlar] = useState(() => {
    const kayitliFormlar = localStorage.getItem("formlab_formlar");

    return kayitliFormlar ? JSON.parse(kayitliFormlar) : [];
  });
  const formOlusturmaRef = useRef(null);

  // Formları LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("formlab_formlar", JSON.stringify(formlar));
  }, [formlar]);

  // Yeni form oluştur
  function formEkle() {
    if (formAdi.trim() === "") {
      alert("Lütfen bir form adı giriniz.");
      return;
    }
    const yeniForm = {
      id: crypto.randomUUID(),
      ad: formAdi.trim(),
      sorular: [],
    };

    setFormlar([...formlar, yeniForm]);
    setFormAdi("");
  }

  // Form sil
  function formSil(silinecekId) {
    const kalanFormlar = formlar.filter((form) => form.id !== silinecekId);

    setFormlar(kalanFormlar);
  }

  // Form adını güncelle
  function formGuncelle(guncellenecekId) {
    const yeniAd = prompt("Yeni form adını giriniz:");

    if (yeniAd === null || yeniAd.trim() === "") {
      return;
    }

    const guncellenmisFormlar = formlar.map((form) => {
      if (form.id === guncellenecekId) {
        return {
          ...form,
          ad: yeniAd.trim(),
        };
      }

      return form;
    });

    setFormlar(guncellenmisFormlar);
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

  function yeniFormAlaninaGit() {
    formOlusturmaRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    formOlusturmaRef.current?.focus();
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#1E293B]">
      {aktifForm ? (
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
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
        <div className="mx-auto flex min-h-screen max-w-[1440px]">
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
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                    aktifEkran === "ana_sayfa"
                      ? "bg-purple-50 text-purple-700"
                      : "text-slate-500"
                  }`}
                >
                  Ana Sayfa
                </button>
                <button
                  type="button"
                  onClick={() => ekranDegistir("formlar")}
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                    aktifEkran === "formlar"
                      ? "bg-purple-50 font-semibold text-purple-700"
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
                  onClick={() => {
                    if (aktifEkran !== "formlar") {
                      setAktifEkran("formlar");
                      setTimeout(yeniFormAlaninaGit, 0);
                    } else {
                      yeniFormAlaninaGit();
                    }
                  }}
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

              {aktifEkran === "formlar" && (
                <section
                ref={formOlusturmaRef}
                id="form-olustur"
                tabIndex="-1"
                className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6"
              >
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Yeni form oluştur
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Çalışmana başlamak için formuna bir isim ver.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    placeholder="Form adı"
                    value={formAdi}
                    onChange={(event) => setFormAdi(event.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  />
                  <button
                    type="button"
                    onClick={formEkle}
                    className="rounded-xl bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
                  >
                    Form Ekle
                  </button>
                </div>
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
                        className="group flex min-w-0 flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
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
                          className="group flex min-w-0 flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
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
      </div>
  );
}

export default App;
