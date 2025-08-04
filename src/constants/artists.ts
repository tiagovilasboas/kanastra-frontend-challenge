// Enum para artistas populares do Spotify
export enum PopularArtists {
  JUSTIN_BIEBER = '1uNFoZAHBGtllmzznpCI3s',
  ED_SHEERAN = '6eUKZXaKkcviH0Ku9w2n3V',
  MICHAEL_JACKSON = '0TnOYISbd1XYRBk9myaseg',
  ARIANA_GRANDE = '3HqSLMAZ3g3d5poNaI7GOU',
  COLDPLAY = '4gzpq5DPGxSnKTe4SA8HAU',
  BRUNO_MARS = '0du5cEVh5yTK9QJze8zA0C',
  AVICII = '1vCWHaC5f2uS3yhpwWbIA6',
  KANYE_WEST = '5K4W6rqBFWDnAN6FQUkS6x',
  EMINEM = '7dGJo4pcD2V6oG8kP0tJRR',
  DRAKE = '4YRxDV8wJFPHPTeXepOstw',
  RIHANNA = '1mYsTxnqsietFxj1OgoGbG',
  LADY_GAGA = '5f4QpKfy7ptCHwTqspnSJI',
  DEADMAU5 = '2CIMQHirSU0MQqyYHq0eOx',
  PITBULL = '7C9X0H6LzHj8eK8jz06xGz',
  THE_WEEKND = '1Xyo4u8uXC1ZmMpatF05PJ',
  POST_MALONE = '246dkjvS1zLTtiykXe5h60',
  BILLIE_EILISH = '6qqNVTkY8uBg9cP3Jd7DAH',
  DUA_LIPA = '6M2wZ9GZgrQXHCFfjv46we',
  TAYLOR_SWIFT = '06HL4z0CvFAxyc27GXpf02',
  BAD_BUNNY = '4q3ewBCX7sLwd24euuV69X'
}

// Lista de IDs dos artistas populares (sem duplicatas)
export const POPULAR_ARTIST_IDS: string[] = [
  PopularArtists.JUSTIN_BIEBER,
  PopularArtists.ED_SHEERAN,
  PopularArtists.MICHAEL_JACKSON,
  PopularArtists.ARIANA_GRANDE,
  PopularArtists.COLDPLAY,
  PopularArtists.BRUNO_MARS,
  PopularArtists.AVICII,
  PopularArtists.KANYE_WEST,
  PopularArtists.EMINEM,
  PopularArtists.DRAKE,
  PopularArtists.RIHANNA,
  PopularArtists.LADY_GAGA,
  PopularArtists.DEADMAU5,
  PopularArtists.PITBULL,
  PopularArtists.THE_WEEKND,
  PopularArtists.POST_MALONE,
  PopularArtists.BILLIE_EILISH,
  PopularArtists.DUA_LIPA,
  PopularArtists.TAYLOR_SWIFT,
  PopularArtists.BAD_BUNNY
]

// Mapeamento de nomes dos artistas
export const ARTIST_NAMES: Record<PopularArtists, string> = {
  [PopularArtists.JUSTIN_BIEBER]: 'Justin Bieber',
  [PopularArtists.ED_SHEERAN]: 'Ed Sheeran',
  [PopularArtists.MICHAEL_JACKSON]: 'Michael Jackson',
  [PopularArtists.ARIANA_GRANDE]: 'Ariana Grande',
  [PopularArtists.COLDPLAY]: 'Coldplay',
  [PopularArtists.BRUNO_MARS]: 'Bruno Mars',
  [PopularArtists.AVICII]: 'Avicii',
  [PopularArtists.KANYE_WEST]: 'Kanye West',
  [PopularArtists.EMINEM]: 'Eminem',
  [PopularArtists.DRAKE]: 'Drake',
  [PopularArtists.RIHANNA]: 'Rihanna',
  [PopularArtists.LADY_GAGA]: 'Lady Gaga',
  [PopularArtists.DEADMAU5]: 'deadmau5',
  [PopularArtists.PITBULL]: 'Pitbull',
  [PopularArtists.THE_WEEKND]: 'The Weeknd',
  [PopularArtists.POST_MALONE]: 'Post Malone',
  [PopularArtists.BILLIE_EILISH]: 'Billie Eilish',
  [PopularArtists.DUA_LIPA]: 'Dua Lipa',
  [PopularArtists.TAYLOR_SWIFT]: 'Taylor Swift',
  [PopularArtists.BAD_BUNNY]: 'Bad Bunny'
} 