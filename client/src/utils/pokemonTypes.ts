const TYPE_LABELS: Record<string, string> = {
  Bug: 'Bicho',
  Dark: 'Siniestro',
  Dragon: 'Dragón',
  Electric: 'Eléctrico',
  Fairy: 'Hada',
  Fighting: 'Lucha',
  Fire: 'Fuego',
  Flying: 'Volador',
  Ghost: 'Fantasma',
  Grass: 'Planta',
  Ground: 'Tierra',
  Ice: 'Hielo',
  Normal: 'Normal',
  Poison: 'Veneno',
  Psychic: 'Psíquico',
  Rock: 'Roca',
  Steel: 'Acero',
  Water: 'Agua',
};

export function getPokemonTypeLabel(typeName: string): string {
  const normalizedTypeName =
    typeName.charAt(0).toUpperCase() + typeName.slice(1).toLowerCase();

  return TYPE_LABELS[normalizedTypeName] ?? normalizedTypeName;
}

export function getPokemonTypeModifier(typeName: string): string {
  return typeName.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

