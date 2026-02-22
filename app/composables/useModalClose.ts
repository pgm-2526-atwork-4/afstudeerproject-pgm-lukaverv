export const useModalClose = (
  emit: (event: string, ...args: any[]) => void,
) => {
  const close = () => {
    emit("update:modelValue", false);
  };

  return { close };
};
