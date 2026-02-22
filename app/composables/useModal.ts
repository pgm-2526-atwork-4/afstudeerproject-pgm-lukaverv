export const useModal = (emit: (event: string, ...args: any[]) => void) => {
  const close = () => {
    emit("update:modelValue", false);
  };

  return { close };
};
