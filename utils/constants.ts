import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const stackOptions: NativeStackNavigationOptions = {
  headerShadowVisible: false,
  headerTitleAlign: "center",
};

export const PROJECT_COLORS = [
  "#f87171",
  "#fb9d4b",
  "#f9c74f",
  "#66b584",
  "#57c2f6",
];

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}
