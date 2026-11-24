# Poké Library

Poké Library es una enciclopedia full stack de Pokémon construida con React,
TypeScript, Vite, Express y MongoDB. El catálogo público consulta PokéAPI y las
cuentas autorizadas pueden organizar una biblioteca privada con preferencias y
notas personales.

## Catálogo público

- Catálogo inicial de los Pokémon de Kanto, IDs 1 a 151.
- Búsqueda por nombre o número.
- Información general obtenida de /pokemon/{id or name}.
- Información descriptiva obtenida de /pokemon-species/{id or name}.
- Página principal y página «Sobre el autor».
- Interfaz adaptable desde 320 px.

## Autorización y biblioteca privada

- Registro e inicio de sesión en las rutas `/signup` y `/signin`.
- JWT almacenado en `localStorage` y restauración de la sesión al recargar.
- Contexto global `currentUser` para compartir los datos de la persona.
- Encabezado diferente para visitantes y usuarios autorizados.
- Ruta protegida `/mypokemon`, con redirección al inicio de sesión.
- Guardado de Pokémon como favoritos o como «No me gusta» desde su detalle.
- Dos listas privadas, cambio de preferencia y notas editables en un popup.
- Eliminación con confirmación desde la biblioteca privada.

## Funcionalidad actual

- Carga inicial de 12 Pokémon y carga incremental sin perder los anteriores.
- Búsqueda directa por nombre o número dentro de la Pokédex de Kanto.
- Los 17 tipos presentes en Kanto están disponibles desde el primer bloque.
- Cada filtro carga hasta 12 Pokémon propios y pagina sus resultados sin
  depender de los Pokémon visibles en el catálogo general.
- Orden por número o por nombre.
- Estados accesibles de carga, error, validación y resultados vacíos.
- Tarjetas reutilizables con imagen, número, nombre y tipos.
- Ficha de detalle accesible al seleccionar una tarjeta, con cierre por botón,
  superposición o tecla Escape y restauración del foco.
- Consulta diferida de la especie: `/pokemon-species/{id}` se solicita solo al
  abrir el detalle y cuenta con carga, error y reintento propios.

## Presentación de los datos

Las tarjetas del catálogo muestran número, imagen, nombre y tipos. El detalle
modal amplía esa información con altura, peso, habilidades, seis estadísticas,
descripción, género, generación, hábitat y las clasificaciones legendario,
mítico o bebé cuando correspondan.

## Arquitectura

    project-poke-library/
    ├── client/   # React, TypeScript, Vite, React Router y estilos BEM
    ├── server/   # Express, TypeScript, MongoDB, JWT y API REST propia
    └── package.json

El proyecto toma como referencia la separación de responsabilidades de
web_project_around_full, sin modificar ese repositorio.

La documentación de la API propia, sus rutas y las capturas de sus pruebas en
Postman están disponibles en el [README del servidor](server/README.md#evidencias-visuales-en-postman).

## Comandos

Instala las dependencias desde la raíz:

    npm install

Configura las variables de cada aplicación a partir de `client/.env.example` y
`server/.env.example`. Después, inicia la API en una terminal:

    cd server
    npm install
    npm run dev

Inicia el cliente en http://localhost:3000 desde otra terminal:

    cd client
    npm install
    npm run dev

Comprueba la calidad y genera la compilación de producción:

    npm run lint
    npm run build

Por defecto, el cliente usa `http://localhost:3001` como API propia. La
variable `VITE_API_URL` permite cambiar ese origen sin modificar el código.

## API de terceros

La aplicación utilizará exclusivamente los recursos de Pokémon y especies de
[PokéAPI v2](https://pokeapi.co/docs/v2).

### Capa de datos

El cliente mantiene separadas las respuestas originales de PokéAPI y los
modelos simplificados que consumirá React:

- interfaces/PokeApi.ts describe las respuestas de los dos endpoints.
- interfaces/Pokemon.ts define los modelos internos de la aplicación.
- utils/pokemonMappers.ts normaliza imágenes, nombres, tipos, habilidades,
  estadísticas y textos localizados.
- utils/pokeApi.ts centraliza solicitudes, validación, errores, cancelación y
  caché en memoria.
- utils/kantoTypeIndex.ts relaciona cada tipo de Kanto con sus IDs para paginar
  filtros usando exclusivamente solicitudes /pokemon/{id}.

La información de especie prioriza contenido en español, utiliza inglés como
respaldo y limpia los saltos y caracteres de control de las descripciones.
