function Header({ baslik, aciklama }) {
  return (
    <header className="mb-8 border-b border-gray-100 pb-6">
      <h1 className="text-3xl font-bold tracking-tight text-purple-700 sm:text-4xl">
        {baslik}
      </h1>
      <p className="mt-2 text-sm text-gray-500 sm:text-base">{aciklama}</p>
    </header>
  );
}

export default Header;
