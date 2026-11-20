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
