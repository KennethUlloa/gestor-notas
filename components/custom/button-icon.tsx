import { ElementType } from "react";
import { Icon, IIConProps } from "../ui/icon";
import AnimatedPressable from "./animated-pressble";

type IconButtonProps = {
    as: ElementType;
    onPress?: () => void;
    iconProps?: IIConProps;
    className?: string
    style?: any
}

export function IconButton({ as: IconEl, onPress, iconProps, className, style }: IconButtonProps) {
    return <AnimatedPressable className={className || "rounded-md p-2 border border-background-300"} onPress={onPress} style={style}>
        <Icon as={IconEl} {...iconProps} />
    </AnimatedPressable>
}