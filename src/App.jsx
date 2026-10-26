import { useState } from "react";
import Header from "./components/Header";

function App() {
  const [formAdi, setFormAdi] = useState("");
  const [formlar, setFormlar] = useState([]);

  function formEkle() {
    if (formAdi.trim() === "") {
      alert("Lütfen bir form adı giriniz.");
      return;
    }

    const yeniForm = {
      id: crypto.randomUUID(),
      ad: formAdi.trim(),
    };

    setFormlar([...formlar, yeniForm]);
    setFormAdi("");
  }

  function formSil(silinecekId) {
    const kalanFormlar = formlar.filter((form) => form.id !== silinecekId);

    setFormlar(kalanFormlar);
  }

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

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm">
        <Header
          baslik="FormLab"
          aciklama="Hayalindeki formları kolayca tasarla."
        />

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

        <h2 className="mt-10 mb-5 text-2xl font-semibold text-gray-800">
          Oluşturulan Formlar
        </h2>

        <ul>
          {formlar.map((form) => (
            <li key={form.id}>
              {form.ad}

              <button onClick={() => formSil(form.id)}>Sil</button>
              <button onClick={() => formGuncelle(form.id)}>Güncelle</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
