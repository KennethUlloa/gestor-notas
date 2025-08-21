import {
    Select as _Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from "@/components/ui/select";
import { ChevronDownIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FieldWrapper, FieldWrapperProps } from "./input";

export type SelectOption = {
  id?: string;
  label: string;
  value: string;
};

type SelectProps = {
  value?: string;
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
  loadAsync?: () => Promise<SelectOption[]>;
  onSelect: (value: string) => void;
};

export function Select({
  value,
  options,
  placeholder,
  className,
  onSelect,
  loadAsync,
}: SelectProps) {
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>(
    options || []
  );

  useEffect(() => {
    if (loadAsync) {
      loadAsync().then(setSelectOptions);
    }
  }, []);

  const selectedOption = selectOptions.find((option) => option.value === value);

  return (
    <_Select onValueChange={onSelect} className={className}>
      <SelectTrigger variant="outline">
        <SelectInput placeholder={placeholder} value={selectedOption?.label} />
        <SelectIcon as={ChevronDownIcon} size="xl" />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {selectOptions.map((option) => (
            <SelectItem
              key={option?.id || option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </_Select>
  );
}

type SelectFieldProps = Omit<SelectProps, "className"> &
  Omit<FieldWrapperProps, "children"> & { selectClassName?: string };

export function SelectField({
  value,
  label,
  disabled,
  readonly,
  required,
  error,
  help,
  options,
  placeholder,
  className,
  selectClassName,
  onSelect,
  loadAsync,
}: SelectFieldProps) {
  return (
    <FieldWrapper
      label={label}
      disabled={disabled}
      readonly={readonly}
      required={required}
      error={error}
      help={help}
      className={className}
    >
      <Select
        value={value}
        placeholder={placeholder}
        options={options}
        onSelect={onSelect}
        loadAsync={loadAsync}
        className={selectClassName}
      />
    </FieldWrapper>
  );
}
