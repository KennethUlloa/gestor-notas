import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import migrations from "@/drizzle/migrations";
import "@/global.css";
import "@/i18n";
import { stackOptions } from "@/utils/constants";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { ActivityIndicator } from "react-native";

const DATABASE_NAME = "tasks-list";


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
          <Stack screenOptions={stackOptions}/>
        </GluestackUIProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
