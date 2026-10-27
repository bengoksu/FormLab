import { useState, useEffect } from "react";
import Header from "./components/Header";
import FormEditor from "./components/FormEditor";

function App() {
  const [formAdi, setFormAdi] = useState("");
  const [aktifFormId, setAktifFormId] = useState(null);

  const [formlar, setFormlar] = useState(() => {
    const kayitliFormlar = localStorage.getItem("formlab_formlar");

    return kayitliFormlar ? JSON.parse(kayitliFormlar) : [];
  });

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

  if (aktifForm) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm">
          <Header
            baslik="FormLab"
            aciklama="Hayalindeki formları kolayca tasarla."
          />
          <FormEditor
            form={aktifForm}
            geriDon={() => setAktifFormId(null)}
            soruEkle={soruEkle}
            soruSil={soruSil}
            soruGuncelle={soruGuncelle}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm">
        <Header
          baslik="FormLab"
          aciklama="Hayalindeki formları kolayca tasarla."
        />

        {/* Form oluşturma alanı */}
        <h2 className="text-3xl font-bold text-purple-600">
          Yeni Form Oluştur
        </h2>

        <div className="mt-6 flex gap-3">
          <input
            type="text"
            placeholder="Form adını giriniz"
            value={formAdi}
            onChange={(event) => setFormAdi(event.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
          />

          <button
            onClick={formEkle}
            className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700"
          >
            + Form Ekle
          </button>
        </div>

        {/* Form listesi */}
        <h2 className="mt-10 mb-5 text-2xl font-semibold text-gray-800">
          Oluşturulan Formlar
        </h2>

        {formlar.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <div className="mb-4 text-4xl">📄</div>

            <h3 className="text-lg font-semibold text-gray-800">
              Henüz form oluşturmadınız
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              İlk formunuzu oluşturmak için yukarıdaki alana bir form adı girin.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {formlar.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                    📄
                  </div>

                  <h3 className="font-medium text-gray-800">{form.ad}</h3>
                </div>

                <div className="flex gap-2">
                  {/* Formu Aç */}
                  <button
                    onClick={() => formAc(form.id)}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                  >
                    Formu Aç
                  </button>

                  {/* Düzenle */}
                  <button
                    onClick={() => formGuncelle(form.id)}
                    className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100"
                  >
                    Düzenle
                  </button>

                  {/* Sil */}
                  <button
                    onClick={() => formSil(form.id)}
                    className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
