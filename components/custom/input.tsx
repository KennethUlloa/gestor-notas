import { Input, InputField } from "@/components/ui/input";
import { ReactNode } from "react";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { AlertCircleIcon } from "../ui/icon";
import { Textarea, TextareaInput } from "../ui/textarea";

export interface FieldInputProps {
  type: "password" | "text";
  onChangeText: (text: string) => void;
  icon?: ReactNode;
  value?: string;
  label?: string;
  placeholder?: string;
  help?: string;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
}

export function FieldInput({
  type,
  value,
  label,
  placeholder,
  help,
  error,
  icon,
  disabled,
  readonly,
  required,
  onChangeText,
}: FieldInputProps) {
  return (
    <FormControl
      isInvalid={!!error}
      isDisabled={disabled}
      isReadOnly={readonly}
      isRequired={required}
    >
      {label && (
        <FormControlLabel>
          <FormControlLabelText bold={true}>{label}</FormControlLabelText>
        </FormControlLabel>
      )}
      <Input>
        <InputField
          type={type}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
        {icon}
      </Input>
      {help && (
        <FormControlHelper>
          <FormControlHelperText>{help}</FormControlHelperText>
        </FormControlHelper>
      )}

      {error && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}

type TextInputProps = {
  value?: string;
  label?: string;
  placeholder?: string;
  help?: string;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  onChangeText?: (text: string) => void;
};

export function TextAreaInput({
  label,
  value,
  placeholder,
  help,
  error,
  disabled,
  readonly,
  required,
  onChangeText,
}: TextInputProps) {
  return (
    <FormControl
      isInvalid={!!error}
      isDisabled={disabled}
      isReadOnly={readonly}
      isRequired={required}
    >
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Textarea
        isDisabled={disabled}
        isReadOnly={readonly}
        isRequired={required}
        isInvalid={!!error}
      >
        <TextareaInput
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          style={{ textAlignVertical: "top" }}
        />
      </Textarea>
      {help && (
        <FormControlHelper>
          <FormControlHelperText>{help}</FormControlHelperText>
        </FormControlHelper>
      )}
      {error && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}

export type FieldWrapperProps = {
  label?: string;
  help?: string;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function FieldWrapper({
  label,
  help,
  error,
  disabled,
  readonly,
  required,
  className,
  children,
}: FieldWrapperProps) {
  return (
    <FormControl
      isInvalid={!!error}
      isDisabled={disabled}
      isReadOnly={readonly}
      isRequired={required}
      className={className}
    >
      {label && (
        <FormControlLabel>
          <FormControlLabelText bold={true}>{label}</FormControlLabelText>
        </FormControlLabel>
      )}
      {children}
      {help && (
        <FormControlHelper>
          <FormControlHelperText>{help}</FormControlHelperText>
        </FormControlHelper>
      )}

      {error && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
