import { type ThemeDefinition } from "vuetify";

export const MainThemeColors = {
  green: "#00BD62", //"#55B02E",
  red: "#e93030",
  redlight: "#E57373",
  greenlight: "#66BB6A",
  background: "#141414",
  darkgreen: "#161716",
  surface: "#1F1F21",
  grey: "#71717A",
  lightgrey: "#B8B8B8",
  white: "#FFFFFF",
};
export const MAIN_THEME = "mainTheme";

export const mainTheme: ThemeDefinition = {
  dark: false,
  colors: MainThemeColors,
};
