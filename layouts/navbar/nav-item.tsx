import { Icon } from "@/components/ui/icon";
import { Pressable, Text } from "react-native";

type NavItemProps = {
    label: string;
    href: string;
    icon: React.ElementType;
    selected?: boolean;
    onSelect?: (href: string) => void;
}

function NavItem({ label, href, icon, selected, onSelect }: NavItemProps) {
    return <Pressable onPress={() => onSelect?.(href)} className="flex flex-col gap-1 items-center justify-center flex-1">
        <Icon as={icon} size="md" className={`${selected ? 'text-primary-900' : 'text-typography-500'}`} />
        <Text className={`text-sm ${selected ? 'font-bold text-primary-900' : 'text-typography-500'}`}>{label}</Text>
    </Pressable>
}

export default NavItem;