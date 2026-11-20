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
  return TYPE_LABELS[typeName] ?? typeName;
}

export function getPokemonTypeModifier(typeName: string): string {
  return typeName.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

