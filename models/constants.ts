import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const stackOptions: NativeStackNavigationOptions = {
  headerShadowVisible: false,
  headerTitleAlign: "center",
};

export const PROJECT_COLORS = {
  RED: "#f2aaaa",
  ORANGE: "#ebaf7c",
  YELLOW: "#f2d58f",
  GREEN: "#8ee8b0",
  BLUE: "#84ccf0",
  PURPLE: "#b4a7f6",
  GRAY: "#d4d4d4",
  LIME: "#ceed80",
  SKY: "#639be0"
};

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export const DAYS_TO_MILLIS = 24 * 60 * 60 * 1000;
