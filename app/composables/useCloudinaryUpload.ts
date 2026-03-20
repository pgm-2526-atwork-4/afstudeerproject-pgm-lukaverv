export const useCloudinaryUpload = () => {
  const config = useRuntimeConfig();

  type UploadOptions = {
    folder?: string;
    cropping?: boolean;
    croppingAspectRatio?: number;
    clientAllowedFormats?: string[];
    maxFileSize?: number;
    uploadPreset?: string;
  };

  const openUploadWidget = (
    onSuccess: (url: string, info?: any) => void,
    options: UploadOptions = {},
  ) => {
    const cloudName = (config.public.cloudinary as any).cloudName;
    const uploadPreset =
      options.uploadPreset || (config.public.cloudinary as any).uploadPreset;

    if (!cloudName || !uploadPreset) {
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
          clientAllowedFormats: options.clientAllowedFormats || [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
          ],
          maxFileSize: options.maxFileSize || 5000000,
          folder: options.folder || "profiles",
          cropping: options.cropping ?? true,
          showSkipCropButton: false,
          croppingAspectRatio: options.croppingAspectRatio || 1,
          croppingDefaultSelectionRatio: 0.8,
          croppingShowDimensions: true,
          croppingCoordinatesMode: "custom",
        },
        (err: any, result: any) => {
          if (!err && result?.event === "success") {
            // Use eager transformation if available, otherwise use original
            const url =
              result.info.eager?.[0]?.secure_url || result.info.secure_url;
            onSuccess(url, result.info);
          }
        },
      );
      widget.open();
    }
  };

  return { openUploadWidget };
};
