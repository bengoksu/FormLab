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
    <div>
      <Header
        baslik="FormLab"
        aciklama="Hayalindeki formları kolayca tasarla."
      />

      <h2 className="text-3xl font-bold text-purple-600">Yeni Form Oluştur</h2>

      <input
        type="text"
        placeholder="Form adını giriniz"
        value={formAdi}
        onChange={(event) => setFormAdi(event.target.value)}
      />

      <button onClick={formEkle}>Form Ekle</button>

      <h2>Oluşturulan Formlar</h2>

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
  );
}

export default App;
