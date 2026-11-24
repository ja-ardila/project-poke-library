function About(): React.JSX.Element {
  return (
    <main className="about page__section">
      <section className="about__card" aria-labelledby="about-title">
        <p className="about__eyebrow">Sobre el autor</p>
        <h1 className="about__title" id="about-title">
          Hola, soy Juan Andrés Ardila
        </h1>
        <p className="about__text">
          Estoy construyendo Poké Library como un proyecto full stack para
          practicar React, TypeScript, consumo de APIs y, en la siguiente
          etapa, autenticación y persistencia de datos.
        </p>
        <p className="about__text">
          La aplicación comienza como una Pokédex sencilla y evolucionará
          hasta permitir que cada usuario organice sus preferencias y notas
          personales.
        </p>
      </section>
    </main>
  );
}

export default About;

