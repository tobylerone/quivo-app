import {Dimensions} from 'react-native'

export const SCREEN_WIDTH = Dimensions.get('window').width

// N'oublie pas de specifier addresse ip:8000 apres
// le manage.py au backend
export const HOST_ADDRESS = 'http://192.168.0.22'

// Schémas
export const PRIMARYCOLOR = "#444365"
export const SECONDARYCOLOR = "#ffffff"//"#b4d7d5"
export const TERTIARYCOLOR = "#b4d7d5"
export const OFFWHITE = "#ebdfd3"

//Police, tailles etc.
export const H1FONTSIZE = 28
export const H2FONTSIZE = 20
export const H3FONTSIZE = 16
export const CONTENTFONTSIZE = 14

// Page d'apprentissage
export const DOUBLETAPDELAY = 200 // en millisecondes
export const TRANSLATIONDISPLAYTIME = 1500
