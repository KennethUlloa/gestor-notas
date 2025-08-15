import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import migrations from "@/drizzle/migrations";
import "@/global.css";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Slot } from "expo-router";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { ActivityIndicator, StatusBar } from "react-native";

const DATABASE_NAME = "mi-camino";

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  
  useMigrations(db, migrations);
  useDrizzleStudio(expoDb);

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
      >
        <GluestackUIProvider mode="dark">
          <StatusBar backgroundColor={"#fff"} />
            <Slot />
        </GluestackUIProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
