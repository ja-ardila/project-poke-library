# Poké Library

Poké Library es una enciclopedia web de Pokémon construida con React,
TypeScript y Vite. La primera etapa presenta una aplicación pública que
consulta PokéAPI; una etapa posterior incorporará autenticación y una
biblioteca privada con favoritos, Pokémon que no le gustan al usuario y notas.

## Alcance de la primera etapa

- Catálogo inicial de los Pokémon de Kanto, IDs 1 a 151.
- Búsqueda por nombre o número.
- Información general obtenida de /pokemon/{id or name}.
- Información descriptiva obtenida de /pokemon-species/{id or name}.
- Página principal y página «Sobre el autor».
- Interfaz adaptable desde 320 px.

## Funcionalidad actual

- Carga inicial de 12 Pokémon y carga incremental sin perder los anteriores.
- Búsqueda directa por nombre o número dentro de la Pokédex de Kanto.
- Los 17 tipos presentes en Kanto están disponibles desde el primer bloque.
- Cada filtro carga hasta 12 Pokémon propios y pagina sus resultados sin
  depender de los Pokémon visibles en el catálogo general.
- Orden por número o por nombre.
- Estados accesibles de carga, error, validación y resultados vacíos.
- Tarjetas reutilizables con imagen, número, nombre y tipos.

## Presentación de los datos

Las tarjetas del catálogo mostrarán número, imagen, nombre y tipos. El detalle
modal ampliará esa información con altura, peso, habilidades, estadísticas,
descripción, género, generación, hábitat y las clasificaciones legendario o
mítico cuando correspondan.

## Arquitectura

    project-poke-library/
    ├── client/   # React, TypeScript, Vite, React Router y estilos BEM
    ├── server/   # Reservado para la API propia de la etapa full stack
    └── package.json

El proyecto toma como referencia la separación de responsabilidades de
web_project_around_full, sin modificar ese repositorio.

## Comandos

Instala las dependencias desde la raíz:

    npm run install:all

Inicia el cliente en http://localhost:3000:

    npm run dev:client

Comprueba la calidad y genera la compilación de producción:

    npm run lint:client
    npm run build:client

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
