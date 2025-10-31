import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const stackOptions: NativeStackNavigationOptions = {
  headerShadowVisible: false,
  headerTitleAlign: "center",
};

export const PROJECT_COLORS = [
  "#f2aaaa", // red
  "#f5c49a", // orange
  "#f2d58f", // yellow
  "#8ee8b0", // green
  "#84ccf0", // blue
  "#b4a7f6", // purple
];

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}
