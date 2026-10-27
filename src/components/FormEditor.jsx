function FormEditor({ form, geriDon }) {
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

      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
        <p className="text-gray-500">Henüz soru eklenmedi.</p>
      </div>
    </section>
  );
}

export default FormEditor;
