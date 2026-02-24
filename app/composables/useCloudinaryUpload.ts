export const useCloudinaryUpload = () => {
  const config = useRuntimeConfig();

  const openUploadWidget = (onSuccess: (url: string) => void) => {
    const cloudName = (config.public.cloudinary as any).cloudName;
    const uploadPreset = (config.public.cloudinary as any).uploadPreset;

    if (!cloudName || !uploadPreset) {
      console.error("Upload configuration missing");
      return;
    }

    // @ts-ignore
    if (typeof window !== "undefined" && window.cloudinary) {
      // @ts-ignore
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ["local"],
          multiple: false,
          maxFiles: 1,
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
          maxFileSize: 5000000,
          folder: "profiles",
          cropping: true,
          showSkipCropButton: false,
          croppingAspectRatio: 1,
          croppingDefaultSelectionRatio: 0.8,
          croppingShowDimensions: true,
          croppingCoordinatesMode: "custom",
        },
        (err: any, result: any) => {
          if (!err && result?.event === "success") {
            // Use eager transformation if available, otherwise use original
            const url =
              result.info.eager?.[0]?.secure_url || result.info.secure_url;
            onSuccess(url);
          }
        },
      );
      widget.open();
    }
  };

  return { openUploadWidget };
};
