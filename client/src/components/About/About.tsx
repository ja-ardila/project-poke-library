function About(): React.JSX.Element {
  return (
    <main className="about page__section">
      <section className="about__card" aria-labelledby="about-title">
        <p className="about__eyebrow">Sobre el autor</p>
        <h1 className="about__title" id="about-title">
          Hola, soy Juan Andrés Ardila
        </h1>
        <p className="about__text">
          Construí Poké Library como un proyecto full stack para poner en
          práctica React, TypeScript, consumo de APIs, autenticación y
          persistencia de datos.
        </p>
        <p className="about__text">
          La aplicación combina una Pokédex de Kanto con una biblioteca privada
          en la que cada usuario puede organizar sus preferencias y notas
          personales.
        </p>
      </section>
    </main>
  );
}

export default About;

