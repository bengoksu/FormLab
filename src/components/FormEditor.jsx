import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function FormOnizleme({ form }) {
  const [cevaplar, setCevaplar] = useState({});
  const [gonderildi, setGonderildi] = useState(false);
  const sorular = form.sorular || [];

  function cevapGuncelle(soruId, cevap) {
    setCevaplar((mevcutCevaplar) => ({
      ...mevcutCevaplar,
      [soruId]: cevap,
    }));
    setGonderildi(false);
  }

  return (
    <div className="page-shell space-y-5 rounded-xl border border-gray-200 bg-slate-50 p-5 transition-opacity duration-200 sm:p-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-medium text-purple-600">Form önizleme</p>
        <h3 className="mt-1 text-2xl font-bold text-gray-800">{form.ad}</h3>
        <p className="mt-2 text-sm text-gray-500">
          Bu ekran, formu dolduracak kişilerin göreceği görünümü gösterir.
        </p>
      </div>

      {sorular.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-500">Önizlenecek soru bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorular.map((soru) => (
            <div
              key={soru.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <label
                htmlFor={`onizleme-${soru.id}`}
                className="font-medium text-gray-800"
              >
                {soru.baslik}
                {soru.zorunlu && <span className="ml-1 text-red-600">*</span>}
              </label>

              {soru.tur === "paragraf" && (
                <textarea
                  id={`onizleme-${soru.id}`}
                  rows="4"
                  value={cevaplar[soru.id] || ""}
                  onChange={(event) =>
                    cevapGuncelle(soru.id, event.target.value)
                  }
                  placeholder="Cevabınızı yazınız"
                  className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              )}

              {soru.tur === "kisa_metin" && (
                <input
                  id={`onizleme-${soru.id}`}
                  type="text"
                  value={cevaplar[soru.id] || ""}
                  onChange={(event) =>
                    cevapGuncelle(soru.id, event.target.value)
                  }
                  placeholder="Cevabınızı yazınız"
                  className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              )}

              {soru.tur === "coktan_secmeli" && (
                <div className="mt-3 space-y-2">
                  {(soru.secenekler || []).map((secenek, index) => (
                    <label
                      key={`${soru.id}-${index}`}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <input
                        type="radio"
                        name={`onizleme-${soru.id}`}
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
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => setGonderildi(true)}
          className="rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700 active:scale-[0.98]"
        >
          Gönder
        </button>
        {gonderildi && (
          <p className="text-sm font-medium text-purple-700" role="status">
            Bu bir önizlemedir. Yanıtlar kaydedilmedi.
          </p>
        )}
      </div>
    </div>
  );
}

function SortableSoruKarti({
  soru,
  duzenlenenSoruId,
  duzenlemeyiBaslat,
  soruyuKaydet,
  duzenlemeyiIptalEt,
  duzenlenenBaslik,
  setDuzenlenenBaslik,
  duzenlenenSecenekler,
  setDuzenlenenSecenekler,
  secenekGuncelle,
  secenekSil,
  secenekEkle,
  duzenlemeHatasi,
  setDuzenlemeHatasi,
  soruCevapAlaniGoster,
  zorunlulukDegistir,
  formId,
  soruSil,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: soru.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`question-card rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${
        isDragging ? "relative z-10 shadow-lg ring-2 ring-purple-200" : ""
      }`}
    >
      <div className="flex gap-3">
        <button
          type="button"
          className="mt-1 flex h-9 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-slate-400 transition hover:bg-purple-50 hover:text-purple-600 active:cursor-grabbing"
          {...listeners}
          {...attributes}
          aria-label={`${soru.baslik} sorusunun sırasını değiştirmek için sürükleyin`}
        >
          <span aria-hidden="true" className="grid grid-cols-2 gap-0.5">
            {Array.from({ length: 6 }, (_, index) => (
              <span
                key={index}
                className="h-1 w-1 rounded-full bg-current"
              />
            ))}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          {duzenlenenSoruId === soru.id ? (
            <div>
              <input
                type="text"
                value={duzenlenenBaslik}
                onChange={(event) => {
                  setDuzenlenenBaslik(event.target.value);
                  setDuzenlemeHatasi("");
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-purple-500"
              />

              {soru.tur === "coktan_secmeli" && (
                <div className="mt-3 space-y-2">
                  {duzenlenenSecenekler.map((secenek, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={secenek}
                        onChange={(event) =>
                          secenekGuncelle(
                            setDuzenlenenSecenekler,
                            index,
                            event.target.value,
                          )
                        }
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                      />
                      {duzenlenenSecenekler.length > 2 && (
                        <button
                          type="button"
                          onClick={() =>
                            secenekSil(setDuzenlenenSecenekler, index)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => secenekEkle(setDuzenlenenSecenekler)}
                    className="rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100"
                  >
                    + Seçenek Ekle
                  </button>
                </div>
              )}

              {duzenlemeHatasi && (
                <p className="mt-2 text-sm text-red-600">{duzenlemeHatasi}</p>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => soruyuKaydet(soru)}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={duzenlemeyiIptalEt}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  {soru.baslik}
                  {soru.zorunlu && <span className="ml-1 text-red-600">*</span>}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {soru.tur === "paragraf"
                    ? "Paragraf"
                    : soru.tur === "coktan_secmeli"
                      ? "Çoktan seçmeli"
                      : "Kısa metin"}
                </p>
                {soruCevapAlaniGoster(soru)}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={soru.zorunlu === true}
                    onChange={() => zorunlulukDegistir(soru)}
                    className="h-4 w-4 accent-purple-600"
                  />
                  Zorunlu
                </label>

                <button
                  type="button"
                  onClick={() => duzenlemeyiBaslat(soru)}
                  className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100"
                >
                  Düzenle
                </button>

                <button
                  type="button"
                  onClick={() => soruSil(formId, soru.id)}
                  className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                >
                  Sil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FormEditor({ form, geriDon, soruEkle, soruSil, soruGuncelle, soruSirala }) {
  const [soruBasligi, setSoruBasligi] = useState("");
  const [soruTuru, setSoruTuru] = useState("kisa_metin");
  const [secenekler, setSecenekler] = useState(["", ""]);
  const [secenekHatasi, setSecenekHatasi] = useState("");
  const [duzenlenenSoruId, setDuzenlenenSoruId] = useState(null);
  const [duzenlenenBaslik, setDuzenlenenBaslik] = useState("");
  const [duzenlenenSecenekler, setDuzenlenenSecenekler] = useState([]);
  const [duzenlemeHatasi, setDuzenlemeHatasi] = useState("");
  const [gorunum, setGorunum] = useState("duzenleme");
  const sorular = form.sorular || [];
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function secenekEkle(setter) {
    setter((mevcutSecenekler) => [...mevcutSecenekler, ""]);
  }

  function secenekGuncelle(setter, index, deger) {
    setter((mevcutSecenekler) =>
      mevcutSecenekler.map((secenek, secenekIndex) =>
        secenekIndex === index ? deger : secenek,
      ),
    );
  }

  function secenekSil(setter, index) {
    setter((mevcutSecenekler) =>
      mevcutSecenekler.filter(
        (_, secenekIndex) => secenekIndex !== index,
      ),
    );
  }

  function temizSecenekleriAl(mevcutSecenekler) {
    return mevcutSecenekler
      .map((secenek) => secenek.trim())
      .filter((secenek) => secenek !== "");
  }

  function soruEklemeFormunuSifirla() {
    setSoruBasligi("");
    setSoruTuru("kisa_metin");
    setSecenekler(["", ""]);
    setSecenekHatasi("");
  }

  function soruOlustur() {
    const baslik = soruBasligi.trim();

    if (baslik === "") {
      return;
    }

    const yeniSoru = {
      id: crypto.randomUUID(),
      baslik,
      tur: soruTuru,
      zorunlu: false,
    };

    if (soruTuru === "coktan_secmeli") {
      const temizSecenekler = temizSecenekleriAl(secenekler);

      if (temizSecenekler.length < 2) {
        setSecenekHatasi("En az iki dolu seçenek eklemelisiniz.");
        return;
      }

      yeniSoru.secenekler = temizSecenekler;
    }

    soruEkle(form.id, yeniSoru);
    soruEklemeFormunuSifirla();
  }

  function turDegistir(tur) {
    setSoruTuru(tur);
    setSecenekHatasi("");
  }

  function duzenlemeyiBaslat(soru) {
    setDuzenlenenSoruId(soru.id);
    setDuzenlenenBaslik(soru.baslik);
    setDuzenlenenSecenekler(
      soru.tur === "coktan_secmeli" ? [...(soru.secenekler || [])] : [],
    );
    setDuzenlemeHatasi("");
  }

  function duzenlemeyiIptalEt() {
    setDuzenlenenSoruId(null);
    setDuzenlenenBaslik("");
    setDuzenlenenSecenekler([]);
    setDuzenlemeHatasi("");
  }

  function soruyuKaydet(soru) {
    const baslik = duzenlenenBaslik.trim();
    const degisiklikler = { baslik };

    if (baslik === "") {
      setDuzenlemeHatasi("Soru başlığı boş bırakılamaz.");
      return;
    }

    if (soru.tur === "coktan_secmeli") {
      const temizSecenekler = temizSecenekleriAl(duzenlenenSecenekler);

      if (temizSecenekler.length < 2) {
        setDuzenlemeHatasi("En az iki dolu seçenek eklemelisiniz.");
        return;
      }

      degisiklikler.secenekler = temizSecenekler;
    }

    soruGuncelle(form.id, soru.id, degisiklikler);
    duzenlemeyiIptalEt();
  }

  function zorunlulukDegistir(soru) {
    soruGuncelle(form.id, soru.id, {
      zorunlu: !soru.zorunlu,
    });
  }

  function suruklemeBitti(event) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      soruSirala(form.id, active.id, over.id);
    }
  }

  function soruCevapAlaniGoster(soru) {
    if (soru.tur === "paragraf") {
      return (
        <textarea
          rows="3"
          readOnly
          placeholder="Cevabınızı yazınız"
          className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      );
    }

    if (soru.tur === "coktan_secmeli") {
      return (
        <div className="mt-3 space-y-2">
          {(soru.secenekler || []).map((secenek, index) => (
            <label key={`${soru.id}-${index}`} className="flex items-center gap-2 text-sm text-gray-600">
              <input type="radio" name={`soru-${soru.id}`} disabled />
              {secenek}
            </label>
          ))}
        </div>
      );
    }

    return (
      <input
        type="text"
        readOnly
        placeholder="Cevabınızı yazınız"
        className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-medium text-purple-600">Form düzenleyici</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-800 sm:text-3xl">
            {form.ad}
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <button
            type="button"
            onClick={geriDon}
            className="rounded-lg bg-purple-50 px-4 py-2 font-medium text-purple-700 transition hover:bg-purple-100"
          >
            Formlarıma Dön
          </button>
          <div
            className="inline-flex rounded-lg bg-slate-100 p-1"
            role="tablist"
            aria-label="Form görünümü"
          >
            <button
              type="button"
              role="tab"
              aria-selected={gorunum === "duzenleme"}
              onClick={() => setGorunum("duzenleme")}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                gorunum === "duzenleme"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Düzenleme
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={gorunum === "onizleme"}
              onClick={() => setGorunum("onizleme")}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                gorunum === "onizleme"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Önizleme
            </button>
          </div>
        </div>
      </div>

      {gorunum === "onizleme" ? (
        <FormOnizleme key="onizleme" form={form} />
      ) : (
      <>
      <div key="duzenleme" className="page-shell rounded-xl border border-gray-200 bg-slate-50 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800">Soru Ekle</h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Soru başlığını giriniz"
            value={soruBasligi}
            onChange={(event) => setSoruBasligi(event.target.value)}
            className="min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />

          <select
            value={soruTuru}
            onChange={(event) => turDegistir(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          >
            <option value="kisa_metin">Kısa Metin</option>
            <option value="paragraf">Paragraf</option>
            <option value="coktan_secmeli">Çoktan Seçmeli</option>
          </select>
        </div>

        {soruTuru === "coktan_secmeli" && (
          <div className="mt-4 space-y-2">
            {secenekler.map((secenek, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={secenek}
                  placeholder={`Seçenek ${index + 1}`}
                  onChange={(event) =>
                    secenekGuncelle(setSecenekler, index, event.target.value)
                  }
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-purple-500"
                />
                {secenekler.length > 2 && (
                  <button
                    type="button"
                    onClick={() => secenekSil(setSecenekler, index)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => secenekEkle(setSecenekler)}
              className="rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100"
            >
              + Seçenek Ekle
            </button>

            {secenekHatasi && (
              <p className="text-sm text-red-600">{secenekHatasi}</p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={soruOlustur}
          className="mt-4 rounded-lg bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700"
        >
          Soru Ekle
        </button>
      </div>

      <div className="space-y-3">
        {sorular.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <p className="text-gray-500">Henüz soru eklenmedi.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={suruklemeBitti}
          >
            <SortableContext
              items={sorular.map((soru) => soru.id)}
              strategy={verticalListSortingStrategy}
            >
              {sorular.map((soru) => (
                <SortableSoruKarti
                  key={soru.id}
                  soru={soru}
                  duzenlenenSoruId={duzenlenenSoruId}
                  duzenlemeyiBaslat={duzenlemeyiBaslat}
                  soruyuKaydet={soruyuKaydet}
                  duzenlemeyiIptalEt={duzenlemeyiIptalEt}
                  duzenlenenBaslik={duzenlenenBaslik}
                  setDuzenlenenBaslik={setDuzenlenenBaslik}
                  duzenlenenSecenekler={duzenlenenSecenekler}
                  setDuzenlenenSecenekler={setDuzenlenenSecenekler}
                  secenekGuncelle={secenekGuncelle}
                  secenekSil={secenekSil}
                  secenekEkle={secenekEkle}
                  duzenlemeHatasi={duzenlemeHatasi}
                  setDuzenlemeHatasi={setDuzenlemeHatasi}
                  soruCevapAlaniGoster={soruCevapAlaniGoster}
                  zorunlulukDegistir={zorunlulukDegistir}
                  formId={form.id}
                  soruSil={soruSil}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
      </>
      )}
    </section>
  );
}

export default FormEditor;
