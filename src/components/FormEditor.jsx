import { useState } from "react";

function FormEditor({ form, geriDon, soruEkle, soruSil }) {
  const [soruBasligi, setSoruBasligi] = useState("");
  const sorular = form.sorular || [];

  function kisaMetinSorusuEkle() {
    const baslik = soruBasligi.trim();

    if (baslik === "") {
      return;
    }

    soruEkle(form.id, {
      id: crypto.randomUUID(),
      baslik,
      tur: "kisa_metin",
      zorunlu: false,
    });
    setSoruBasligi("");
  }

  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-purple-600">Form düzenleyici</p>
          <h2 className="mt-1 text-3xl font-bold text-gray-800">{form.ad}</h2>
        </div>

        <button
          type="button"
          onClick={geriDon}
          className="rounded-lg bg-purple-50 px-4 py-2 font-medium text-purple-700 hover:bg-purple-100"
        >
          Formlarıma Dön
        </button>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Kısa Metin Sorusu Ekle
        </h3>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Soru başlığını giriniz"
            value={soruBasligi}
            onChange={(event) => setSoruBasligi(event.target.value)}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-purple-500"
          />

          <button
            type="button"
            onClick={kisaMetinSorusuEkle}
            className="rounded-lg bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700"
          >
            Kısa Metin Sorusu Ekle
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {sorular.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <p className="text-gray-500">Henüz soru eklenmedi.</p>
          </div>
        ) : (
          sorular.map((soru) => (
            <div
              key={soru.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-medium text-gray-800">{soru.baslik}</p>
                <p className="mt-1 text-sm text-gray-500">Kısa metin</p>
              </div>

              <button
                type="button"
                onClick={() => soruSil(form.id, soru.id)}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                Sil
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default FormEditor;
