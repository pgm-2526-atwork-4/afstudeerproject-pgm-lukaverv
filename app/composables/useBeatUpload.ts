import type { Ref } from "vue";

export const useBeatUpload = (
  beatCoverUrl: Ref<string>,
  wavUrl: Ref<string>,
  mp3Url: Ref<string>,
  audioDuration?: Ref<number>,
) => {
  const config = useRuntimeConfig();
  const { openUploadWidget } = useCloudinaryUpload();

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

  return {
    handleBeatCoverUpload,
    handleWavUpload,
    handleMp3Upload,
  };
};
