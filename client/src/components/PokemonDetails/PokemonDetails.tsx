import { useLayoutEffect, useRef } from 'react';

import type { Pokemon, PokemonSpecies } from '../../interfaces';
import {
  getPokemonTypeLabel,
  getPokemonTypeModifier,
} from '../../utils/pokemonTypes';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Popup from '../Popup/Popup';
import Preloader from '../Preloader/Preloader';

interface PokemonDetailsProps {
  errorMessage: string | null;
  isLoading: boolean;
  onClose: () => void;
  onRetry: () => void;
  pokemon: Pokemon | null;
  species: PokemonSpecies | null;
}

const STAT_LABELS: Record<string, string> = {
  Attack: 'Ataque',
  Defense: 'Defensa',
  Hp: 'PS',
  'Special Attack': 'Ataque especial',
  'Special Defense': 'Defensa especial',
  Speed: 'Velocidad',
};

const HABITAT_LABELS: Record<string, string> = {
  Cave: 'Cueva',
  Forest: 'Bosque',
  Grassland: 'Pradera',
  Mountain: 'Montaña',
  Rare: 'Raro',
  'Rough Terrain': 'Terreno escarpado',
  Sea: 'Mar',
  Urban: 'Ciudad',
  'Waters Edge': 'Orilla del agua',
};

function formatMeasurement(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 1,
  }).format(value / 10);
}

function getGenderDistribution(genderRate: number): string {
  if (genderRate < 0) {
    return 'Sin género';
  }

  const femalePercentage = genderRate * 12.5;
  const malePercentage = 100 - femalePercentage;
  const percentageFormatter = new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 1,
  });

  return (
    percentageFormatter.format(malePercentage) +
    '% macho · ' +
    percentageFormatter.format(femalePercentage) +
    '% hembra'
  );
}

function getHabitatLabel(habitat: string | null): string {
  if (!habitat) {
    return 'No disponible';
  }

  return HABITAT_LABELS[habitat] ?? habitat;
}

function PokemonDetails({
  errorMessage,
  isLoading,
  onClose,
  onRetry,
  pokemon,
  species,
}: PokemonDetailsProps): React.JSX.Element | null {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const nameTextRef = useRef<HTMLSpanElement>(null);
  const displayName = species?.name ?? pokemon?.name ?? '';

  useLayoutEffect(() => {
    const nameElement = nameRef.current;
    const nameTextElement = nameTextRef.current;

    if (!nameElement || !nameTextElement) {
      return;
    }

    let isActive = true;

    const fitName = (): void => {
      nameElement.style.removeProperty('font-size');

      const baseFontSize = Number.parseFloat(
        window.getComputedStyle(nameElement).fontSize,
      );
      const safeWidth = nameElement.clientWidth - 8;
      const requiredWidth = nameTextElement.getBoundingClientRect().width;

      if (requiredWidth <= safeWidth || safeWidth <= 0) {
        return;
      }

      const minimumFontSize = 2.2 * Number.parseFloat(
        window.getComputedStyle(document.documentElement).fontSize,
      );
      const fittedFontSize = Math.max(
        minimumFontSize,
        baseFontSize * (safeWidth / requiredWidth),
      );

      nameElement.style.fontSize = fittedFontSize + 'px';
    };

    fitName();

    const resizeObserver = new ResizeObserver(fitName);
    resizeObserver.observe(nameElement.parentElement ?? nameElement);

    void document.fonts.ready.then(() => {
      if (isActive) {
        fitName();
      }
    });

    return () => {
      isActive = false;
      resizeObserver.disconnect();
    };
  }, [displayName]);

  if (!pokemon) {
    return null;
  }

  const formattedId = String(pokemon.id).padStart(3, '0');
  const titleId = 'pokemon-details-' + pokemon.id;

  return (
    <Popup
      contentClassName="popup__content_type_pokemon"
      isOpen
      onClose={onClose}
      titleId={titleId}
    >
      <article className="pokemon-details">
        <header className="pokemon-details__hero">
          <div className="pokemon-details__image-wrapper">
            <img
              className="pokemon-details__image"
              src={pokemon.imageUrl}
              alt={displayName}
            />
          </div>

          <div className="pokemon-details__summary">
            <p className="pokemon-details__number">#{formattedId}</p>
            <div className="pokemon-details__badges">
              {species?.isLegendary && (
                <span className="pokemon-details__badge pokemon-details__badge_legendary">
                  Legendario
                </span>
              )}
              {species?.isMythical && (
                <span className="pokemon-details__badge pokemon-details__badge_mythical">
                  Mítico
                </span>
              )}
              {species?.isBaby && (
                <span className="pokemon-details__badge">Bebé</span>
              )}
            </div>
            <h2
              className="pokemon-details__name"
              id={titleId}
              ref={nameRef}
            >
              <span ref={nameTextRef}>{displayName}</span>
            </h2>

            <ul className="pokemon-details__types" aria-label="Tipos">
              {pokemon.types.map((type) => (
                <li
                  className={
                    'pokemon-card__type pokemon-card__type_' +
                    getPokemonTypeModifier(type.name)
                  }
                  key={type.slot}
                >
                  {getPokemonTypeLabel(type.name)}
                </li>
              ))}
            </ul>

            <dl className="pokemon-details__measurements">
              <div className="pokemon-details__measurement">
                <dt>Altura</dt>
                <dd>{formatMeasurement(pokemon.height)} m</dd>
              </div>
              <div className="pokemon-details__measurement">
                <dt>Peso</dt>
                <dd>{formatMeasurement(pokemon.weight)} kg</dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="pokemon-details__body">
          <section
            className="pokemon-details__section pokemon-details__section_species"
            aria-labelledby={titleId + '-species'}
          >
            <h3
              className="pokemon-details__section-title"
              id={titleId + '-species'}
            >
              Información de la especie
            </h3>

            {isLoading && (
              <Preloader label="Cargando información de la especie" />
            )}

            {errorMessage && (
              <ErrorMessage
                message={errorMessage}
                onRetry={onRetry}
              />
            )}

            {species && (
              <>
                <p className="pokemon-details__category">
                  {species.category ?? 'Categoría no disponible'}
                </p>
                <p className="pokemon-details__description">
                  {species.description ??
                    'No hay una descripción disponible para este Pokémon.'}
                </p>
                <dl className="pokemon-details__facts">
                  <div className="pokemon-details__fact">
                    <dt>Generación</dt>
                    <dd>{species.generation}</dd>
                  </div>
                  <div className="pokemon-details__fact">
                    <dt>Hábitat</dt>
                    <dd>{getHabitatLabel(species.habitat)}</dd>
                  </div>
                  <div className="pokemon-details__fact">
                    <dt>Género</dt>
                    <dd>{getGenderDistribution(species.genderRate)}</dd>
                  </div>
                </dl>
              </>
            )}
          </section>

          <section
            className="pokemon-details__section pokemon-details__section_abilities"
            aria-labelledby={titleId + '-abilities'}
          >
            <h3
              className="pokemon-details__section-title"
              id={titleId + '-abilities'}
            >
              Habilidades
            </h3>
            <ul className="pokemon-details__abilities">
              {pokemon.abilities.map((ability) => (
                <li
                  className="pokemon-details__ability"
                  key={ability.slot}
                >
                  <span>{ability.name}</span>
                  {ability.isHidden && (
                    <span className="pokemon-details__hidden">
                      Oculta
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section
            className="pokemon-details__section pokemon-details__section_stats"
            aria-labelledby={titleId + '-stats'}
          >
            <h3
              className="pokemon-details__section-title"
              id={titleId + '-stats'}
            >
              Estadísticas base
            </h3>
            <ul className="pokemon-details__stats">
              {pokemon.stats.map((stat) => (
                <li className="pokemon-details__stat" key={stat.name}>
                  <div className="pokemon-details__stat-heading">
                    <span>{STAT_LABELS[stat.name] ?? stat.name}</span>
                    <strong>{stat.baseValue}</strong>
                  </div>
                  <progress
                    className="pokemon-details__progress"
                    max="255"
                    value={stat.baseValue}
                    aria-label={
                      (STAT_LABELS[stat.name] ?? stat.name) +
                      ': ' +
                      stat.baseValue
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </Popup>
  );
}

export default PokemonDetails;

