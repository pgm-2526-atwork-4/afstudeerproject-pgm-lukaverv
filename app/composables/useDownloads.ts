export const useDownloads = () => {
  // Track per-file download state: key is `${itemId}-${fileType}`
  const downloading = ref<Record<string, boolean>>({});

  /**
   * Download a file from a URL with a custom filename
   */
  const downloadFile = async (
    url: string,
    filename: string,
    fileType: string,
    itemId: string,
  ) => {
    const key = `${itemId}-${fileType}`;
    downloading.value[key] = true;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch file");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab if CORS blocks the fetch
      window.open(url, "_blank");
    } finally {
      downloading.value[key] = false;
    }
  };

  /**
   * Generate and download a license document for a purchased beat
   */
  const downloadLicenseDoc = (item: any) => {
    const licenseText: Record<string, string> = {
      BASIC:
        'Non-exclusive license. For personal and small commercial use (up to 10,000 streams). Credit required: "Prod. by ' +
        item.producer +
        '".',
      PREMIUM:
        'Non-exclusive license. For full commercial use (unlimited streams & sales). Credit required: "Prod. by ' +
        item.producer +
        '".',
      EXCLUSIVE:
        "Exclusive license. All rights transferred to buyer. Beat will be removed from sale. No credit required.",
    };

    const content = [
      "LICENSE AGREEMENT",
      "=================",
      "",
      "BEAT INFORMATION",
      "----------------",
      `Title:         ${item.title}`,
      `Producer:      ${item.producer}`,
      `Genre:         ${item.genre || "N/A"}`,
      `BPM:           ${item.bpm || "N/A"}`,
      `Key:           ${item.key || "N/A"}`,
      "",
      "PURCHASE DETAILS",
      "-----------------",
      `License Type:  ${item.licenseType}`,
      `Purchase Date: ${new Date(item.purchasedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      `Price Paid:    $${item.price.toFixed(2)}`,
      "",
      "LICENSE TERMS",
      "-------------",
      licenseText[item.licenseType] ?? "",
      "",
      "This document serves as proof of purchase and license grant.",
      "Issued by BeatStack.",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${item.title} - ${item.licenseType} License.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  return {
    downloading,
    downloadFile,
    downloadLicenseDoc,
  };
};
