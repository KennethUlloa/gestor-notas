import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { DBSeeder } from "@/db/seed";
import { DBInitialTasks } from "@/db/tasks";
import migrations from "@/drizzle/migrations";
import "@/global.css";
import "@/i18n";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { ActivityIndicator } from "react-native";

const DATABASE_NAME = "tasks-list";


export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  
  useMigrations(db, migrations);

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
      >
        <DBSeeder />
        <DBInitialTasks />
        <GluestackUIProvider mode="light">
            <Stack screenOptions={{ headerShown: false }} />
        </GluestackUIProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
