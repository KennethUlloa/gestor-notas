import { router, usePathname } from "expo-router";
import { SquareChartGantt, Tags } from "lucide-react-native";
import { View } from "react-native";
import NavItem from "./nav-item";

function baseRoute() {
    const pathname = usePathname();
    return pathname.split('?')[0];
}

function Navbar() {
  const handleRouting = (href: string) => {
    // @ts-ignore
    router.push(href);
  };

  const currentRoute = baseRoute();

  return (
    <View className="flex flex-row gap-5 w-full p-5 max-w-full bg-background-0">
      <NavItem
        label="Projects"
        href="/projects/list"
        icon={SquareChartGantt}
        onSelect={handleRouting}
        selected={currentRoute === '/projects/list'}
      />
      <NavItem
        label="Categories"
        href="/categories/list"
        icon={Tags}
        onSelect={handleRouting}
        selected={currentRoute === '/categories/list'}
      />
    </View>
  );
}

export default Navbar;
