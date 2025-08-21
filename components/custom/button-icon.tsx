import { ElementType } from "react";
import { Icon } from "../ui/icon";
import AnimatedPressable from "./animated-pressble";

type IconButtonProps = {
    as: ElementType;
    onPress: () => void;
}

export function IconButton({ as: IconEl, onPress }: IconButtonProps) {
    return <AnimatedPressable className="p-2 border border-background-300 rounded-md" onPress={onPress}>
        <Icon as={IconEl} />
    </AnimatedPressable>
}