import AsyncStorage from "@react-native-async-storage/async-storage";
import { DAYS_TO_MILLIS } from "./constants";

export enum Interval {
  DAYS = 1 * DAYS_TO_MILLIS,
  WEEKS = 7 * DAYS_TO_MILLIS,
  MONTHS = 30 * DAYS_TO_MILLIS,
}

export type IntervalType = keyof typeof Interval;

export type Settings = {
    intervalType: IntervalType;
    cleanInterval: number;
}

export const DefaultSettings: Settings = {
    intervalType: 'MONTHS',
    cleanInterval: 1
};

export async function getSettings(): Promise<Settings> {
    const value = await AsyncStorage.getItem('settings');
    if (!value) return DefaultSettings
    const obj = JSON.parse(value);
    return obj;
}

export async function saveSettings(settings: Settings) {
    const value = JSON.stringify(settings);
    await AsyncStorage.setItem('settings', value);
}
