function Header({ baslik, aciklama }) {
  return (
    <header>
      <h1>{baslik}</h1>
      <p>{aciklama}</p>
    </header>
  );
}

export default Header;
