import { useColorConfig } from "@/components/ui/gluestack-ui-provider/config";
import { Icon } from "@/components/ui/icon";
import { Stack, Tabs } from "expo-router";
import { Settings, SquareChartGantt, Tags } from "lucide-react-native";
import { useTranslation } from "react-i18next";

function TabLayout() {
  const { t } = useTranslation();
  const colors = useColorConfig();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs
        screenOptions={{ tabBarActiveTintColor: colors.parsed.primary900 }}
      >
        <Tabs.Screen
          name="projects/list"
          options={{
            tabBarLabel: t("projects.titles.list"),
            tabBarIcon: ({ color }) => (
              <Icon as={SquareChartGantt} size="md" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="categories/list"
          options={{
            tabBarLabel: t("categories.titles.list"),
            tabBarIcon: ({ color }) => (
              <Icon as={Tags} size="md" color={color} />
            ),
          }}
        />
        <Tabs.Screen name="settings" options={{
          tabBarLabel: t("settings.title"),
          tabBarIcon: ({ color }) => (
            <Icon as={Settings} size="md" color={color} />
          ),
        }} />
      </Tabs>
    </>
  );
}

export default TabLayout;
