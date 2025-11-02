import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "../ui/actionsheet";

export type ItemOption = {
  id: string;
  label: string;
  icon?: React.ComponentProps<typeof Icon>["as"];
  iconSize?: "sm" | "md" | "lg";
  iconColor?: string;
  iconClassName?: string;
  textClassName?: string;
  className?: string;
  onPress?: (option: string) => void;
};

type ItemOptionsProps = {
  options: ItemOption[];
  isOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export function ItemOptions({
  options,
  isOpen,
  onOpen,
  onClose,
}: ItemOptionsProps) {
  return (
    <Actionsheet isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {options.map((option) => (
            <ActionsheetItem
              key={option.id}
              onPress={() => {
                option.onPress?.(option.id);
                onClose?.();
              }}
              className={option.className}
            >
              {option.icon && (
                <Icon
                  as={option.icon}
                  size={option.iconSize}
                  color={option.iconColor}
                  className={option.iconClassName}
                />
              )}
              <ActionsheetItemText className={option.textClassName}>
                {option.label}
              </ActionsheetItemText>
            </ActionsheetItem>
          ))}
        </ActionsheetContent>
      </SafeAreaView>
    </Actionsheet>
  );
}

export function useItemOptions() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ItemOption[]>([]);

  const show = (options: ItemOption[]) => {
    setOptions(options);
    setIsOpen(true);
  };

  return {
    options,
    isOpen,
    setOptions,
    show,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
  };
}

type ActionSheetWrapperProps = {
  isOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
};

export function ActionSheetWrapper({
  isOpen,
  onOpen,
  onClose,
  children,
}: ActionSheetWrapperProps) {
  return (
    <Actionsheet isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {children}
        </ActionsheetContent>
      </SafeAreaView>
    </Actionsheet>
  );
}
