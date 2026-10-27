export const INTRO_STORAGE_KEY = 'forge-intro-seen'

/** La voix ne se rejoue jamais dans la même session. */
export const VOICE_STORAGE_KEY = 'forge-voice-played'

/**
 * Téléphones, tablettes tactiles et petits écrans : pas d'intro automatique (page légère et rapide).
 * Doit rester identique à la règle `.intro-root` de globals.css, pour que le serveur et le client s'accordent.
 */
export const INTRO_LEAN_QUERY = '(max-width: 767px), (hover: none), (pointer: coarse)'
