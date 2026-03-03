export function useWaveform() {
  async function generateWaveform(audioUrl: string, bars = 80): Promise<number[]> {
    try {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const rawData = audioBuffer.getChannelData(0);
      const blockSize = Math.floor(rawData.length / bars);
      const heights: number[] = [];

      for (let i = 0; i < bars; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockSize * i + j] ?? 0);
        }
        const avg = sum / blockSize;
        heights.push(Math.min(Math.max(avg * 200, 30), 95));
      }

      await audioContext.close();
      return heights;
    } catch {
      // Fallback random pattern
      return Array(bars).fill(0).map(() => Math.random() * 65 + 30);
    }
  }

  return { generateWaveform };
}
