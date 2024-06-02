import {Dimensions} from 'react-native'

export const SCREEN_WIDTH = Dimensions.get('window').width;

// N'oublie pas de specifier addresse ip:8000 apres le manage.py au backend
//export const HOST_ADDRESS = "http://192.168.0.22";
//export const HOST_ADDRESS = "http://10.159.139.194";
export const HOST_ADDRESS = "http://10.97.182.141";

// Schémas
export const PRIMARYCOLOR = "#297A90";//"#66A599"
export const SECONDARYCOLOR = "#F5F5F4";//"#F7ECDC";//"#F9EAE8";
export const TERTIARYCOLOR = "#FBFAF5";//"#FEFDFF";//Nice cream: "#FBFAF5";
export const PRIMARYCOLORSHADOW = "#1A4C5A";
export const BLACK = "#1A4C5A";//"#212121";
export const GREY = "#CFCFCF";//"#BBBCBE";
export const LIGHTGREY = "#EEEEEE";
export const ORANGE = "#CD5D30";
export const PURPLE = "#CDBBEE";
export const ORANGESHADOW = "#954423";//"#A24926";
export const GREEN = "#69EAAA";
export const LIGHTBLUE = "#96EFE9";
export const ERRORCOLOR = "#AB2328";
export const SUCCESSCOLOR = "#228B22";

export const GOLD = "#D4AF37";
export const SILVER = "#C0C0C0";
export const BRONZE = "#9F7A34";

// New lighter theme
export const ORANGEREGULAR = "#F9A047";
export const GREENREGULAR = "#4FCF46";
export const BLUEREGULAR = "#2592FC";
export const PURPLEREGULAR = "#A094F1";

export const PRIMARYCOLORLIGHT = "#D1E0E1";
export const LIGHTBLUELIGHT = "#D9F7F1";
export const ORANGELIGHT = "#FBE8D2";
export const GREENLIGHT = "#D9F1D2";
export const BLUELIGHT = "#D0E5F6";
export const PURPLELIGHT = "#E9E6F4";

//Police, tailles etc.
export const FONTFAMILY = 'Nunito';
export const FONTFAMILYBOLD = 'Nunito Bold';
export const H1FONTSIZE = 28;
export const H2FONTSIZE = 20;
export const H3FONTSIZE = 16;
export const CONTENTFONTSIZE = 14;

// Limites d'utilisation
export const MAXDAILYWORDS = 500;
export const WORDSPERAD = 10;

// LearnScreen. Move there
export const DOUBLETAPDELAY = 200; // en millisecondes
export const TRANSLATIONDISPLAYTIME = 1500;
export const DOUBLETAPEFFECTDELAY = 200;
