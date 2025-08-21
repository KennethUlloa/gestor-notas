import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { nanoid } from "nanoid/non-secure";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ToastInfo = {
  title: string;
  description: string;
  duration?: number;
  type: "success" | "error";
};

export function useDefinedToast() {
  const toast = useToast();
  const [toastId, setToastId] = useState("");

  const showToast = (info: ToastInfo) => {
    if (toast.isActive(toastId)) {
      return;
    }
    const id = nanoid();
    setToastId(id);
    toast.show({
      id: nanoid(),
      placement: "top",
      duration: info.duration || 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action={info.type} variant="solid">
            <ToastTitle>{info.title}</ToastTitle>
            <ToastDescription>
              {info.description}
            </ToastDescription>
          </Toast>
        );
      },
    });
  };

  return {
    showToast,
  };
}

export function showError(error: string) {
  const { t } = useTranslation();
  useDefinedToast().showToast({
    title: "Error",
    description: error,
    type: "error",
  });
}
