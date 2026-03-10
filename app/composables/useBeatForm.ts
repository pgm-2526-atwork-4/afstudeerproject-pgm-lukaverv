import type { Ref } from "vue";

export const useBeatForm = (
  beatCoverUrl: Ref<string>,
  wavUrl: Ref<string>,
  mp3Url: Ref<string>,
  tags: Ref<string[]>,
  tagInput: Ref<string>,
  audioDuration?: Ref<number>,
) => {
  const config = useRuntimeConfig();
  const { openUploadWidget } = useCloudinaryUpload();

  // Upload handlers
  const handleBeatCoverUpload = () => {
    openUploadWidget(
      (url: string) => {
        beatCoverUrl.value = url;
      },
      {
        folder: "beatstack-beat-covers",
        cropping: true,
        croppingAspectRatio: 1,
        maxFileSize: 10 * 1024 * 1024, // 10 MB
      },
    );
  };

  const handleWavUpload = () => {
    openUploadWidget(
      (url: string) => {
        wavUrl.value = url;
      },
      {
        uploadPreset: (config.public.cloudinary as any).audioPreset,
        folder: "beatstack-audio-files/wav",
        clientAllowedFormats: ["wav"],
        maxFileSize: 100 * 1024 * 1024, // 100 MB
        cropping: false,
      },
    );
  };

  const handleMp3Upload = () => {
    openUploadWidget(
      (url: string, info?: any) => {
        mp3Url.value = url;
        // Capture duration from Cloudinary if available
        if (audioDuration && info?.duration) {
          audioDuration.value = Math.round(info.duration);
        }
      },
      {
        uploadPreset: (config.public.cloudinary as any).audioPreset,
        folder: "beatstack-audio-files/mp3",
        clientAllowedFormats: ["mp3"],
        maxFileSize: 50 * 1024 * 1024, // 50 MB
        cropping: false,
      },
    );
  };

  // Tag management
  const addTag = () => {
    const trimmedTag = tagInput.value.trim().toLowerCase();
    if (
      trimmedTag &&
      tags.value.length < 3 &&
      !tags.value.includes(trimmedTag)
    ) {
      tags.value.push(trimmedTag);
      tagInput.value = "";
    }
  };

  const removeTag = (index: number) => {
    tags.value.splice(index, 1);
  };

  return {
    handleBeatCoverUpload,
    handleWavUpload,
    handleMp3Upload,
    addTag,
    removeTag,
  };
};
