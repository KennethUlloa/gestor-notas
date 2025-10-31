import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";
import { IntervalUnit, schema, SettingsKeys } from "./schema";

export function DBSeeder() {
  const ctx = useSQLiteContext();
  const db = drizzle(ctx, { schema });

  const seed = async () => {
    await db
      .insert(schema.settings)
      .values({ name: SettingsKeys.CLEAN_UP_INTERVAL, value: "1" })
      .onConflictDoNothing();

    await db
      .insert(schema.settings)
      .values({
        name: SettingsKeys.CLEAN_UP_INTERVAL,
        value: IntervalUnit.MONTHS,
      })
      .onConflictDoNothing();
  };

  useEffect(() => {
    seed();
  }, []);

  return null;
}
