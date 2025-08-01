export function formatFollowers(followers: number): string {
  if (followers >= 1000000) {
    return `${(followers / 1000000).toFixed(1)}M`
  }
  if (followers >= 1000) {
    return `${(followers / 1000).toFixed(1)}K`
  }
  return followers.toString()
}

export function getPopularityColor(popularity: number): string {
  if (popularity >= 80) return '#1DB954' // Spotify green
  if (popularity >= 60) return '#FFD700' // Gold
  if (popularity >= 40) return '#FFA500' // Orange
  if (popularity >= 20) return '#FF6347' // Tomato
  return '#808080' // Gray
}

// Genre translation mapping
const genreTranslations: Record<string, Record<string, string>> = {
  pt: {
    pop: 'Pop',
    rock: 'Rock',
    'hip hop': 'Hip Hop',
    rap: 'Rap',
    'r&b': 'R&B',
    soul: 'Soul',
    jazz: 'Jazz',
    blues: 'Blues',
    country: 'Country',
    folk: 'Folk',
    electronic: 'Eletrônica',
    dance: 'Dance',
    house: 'House',
    techno: 'Techno',
    trance: 'Trance',
    reggae: 'Reggae',
    reggaeton: 'Reggaeton',
    latin: 'Latina',
    salsa: 'Salsa',
    merengue: 'Merengue',
    'bossa nova': 'Bossa Nova',
    samba: 'Samba',
    mpb: 'MPB',
    forró: 'Forró',
    axé: 'Axé',
    pagode: 'Pagode',
    funk: 'Funk',
    trap: 'Trap',
    edm: 'EDM',
    indie: 'Indie',
    alternative: 'Alternativo',
    punk: 'Punk',
    metal: 'Metal',
    classical: 'Clássica',
    opera: 'Ópera',
    gospel: 'Gospel',
    christian: 'Cristã',
    world: 'Mundial',
    ambient: 'Ambiente',
    chill: 'Chill',
    'lo-fi': 'Lo-Fi',
    instrumental: 'Instrumental',
    acoustic: 'Acústica',
    live: 'Ao Vivo',
    soundtrack: 'Trilha Sonora',
    children: 'Infantil',
    comedy: 'Comédia',
    podcast: 'Podcast',
    audiobook: 'Audiobook',
  },
  en: {
    pop: 'Pop',
    rock: 'Rock',
    'hip hop': 'Hip Hop',
    rap: 'Rap',
    'r&b': 'R&B',
    soul: 'Soul',
    jazz: 'Jazz',
    blues: 'Blues',
    country: 'Country',
    folk: 'Folk',
    electronic: 'Electronic',
    dance: 'Dance',
    house: 'House',
    techno: 'Techno',
    trance: 'Trance',
    reggae: 'Reggae',
    reggaeton: 'Reggaeton',
    latin: 'Latin',
    salsa: 'Salsa',
    merengue: 'Merengue',
    'bossa nova': 'Bossa Nova',
    samba: 'Samba',
    mpb: 'MPB',
    forró: 'Forró',
    axé: 'Axé',
    pagode: 'Pagode',
    funk: 'Funk',
    trap: 'Trap',
    edm: 'EDM',
    indie: 'Indie',
    alternative: 'Alternative',
    punk: 'Punk',
    metal: 'Metal',
    classical: 'Classical',
    opera: 'Opera',
    gospel: 'Gospel',
    christian: 'Christian',
    world: 'World',
    ambient: 'Ambient',
    chill: 'Chill',
    'lo-fi': 'Lo-Fi',
    instrumental: 'Instrumental',
    acoustic: 'Acoustic',
    live: 'Live',
    soundtrack: 'Soundtrack',
    children: 'Children',
    comedy: 'Comedy',
    podcast: 'Podcast',
    audiobook: 'Audiobook',
  },
}

export function translateGenre(genre: string, language: string = 'pt'): string {
  const translations = genreTranslations[language] || genreTranslations.en
  const translatedGenre = translations[genre.toLowerCase()]

  if (translatedGenre) {
    return translatedGenre
  }

  // If no translation found, return the original genre with first letter capitalized
  return genre.charAt(0).toUpperCase() + genre.slice(1)
}

export function translateGenres(
  genres: string[],
  language: string = 'pt',
): string[] {
  return genres.map((genre) => translateGenre(genre, language))
}

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
