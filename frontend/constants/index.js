import {Dimensions} from 'react-native'

export const SCREEN_WIDTH = Dimensions.get('window').width;

// N'oublie pas de specifier addresse ip:8000 apres le manage.py au backend
export const HOST_ADDRESS = "http://192.168.0.22";
//export const HOST_ADDRESS = "http://10.159.139.194";

// Schémas
export const PRIMARYCOLOR = "#297A90";//"#66A599"
export const SECONDARYCOLOR = "#F5F6F8";
export const TERTIARYCOLOR = "#FFFFFF";
export const PRIMARYCOLORSHADOW = "#1A4C5A";
export const BLACK = "#212121";//"#000000"
export const GREY = "#CFCFCF";//"#BBBCBE";
export const ORANGE = "#CD5D30";
export const ORANGESHADOW = "#954423";//"#A24926";
export const GREEN = "#69EAAA";
export const LIGHTBLUE = "#96EFE9";
export const ERRORCOLOR = "#AB2328";
export const SUCCESSCOLOR = "#228B22";

//Police, tailles etc.
export const FONTFAMILY = 'Nunito';
export const FONTFAMILYBOLD = 'Nunito Bold';
export const H1FONTSIZE = 28;
export const H2FONTSIZE = 20;
export const H3FONTSIZE = 16;
export const CONTENTFONTSIZE = 14;

// Limites d'utilisation
export const STREAKDAILYWORDS = 10;
export const MAXDAILYWORDS = 20;

// LearnScreen. Move there
export const DOUBLETAPDELAY = 200; // en millisecondes
export const TRANSLATIONDISPLAYTIME = 1500;
