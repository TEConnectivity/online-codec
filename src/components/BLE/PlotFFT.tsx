import FFT from "fft.js";
import Plot from "react-plotly.js";

/* eslint-disable react-hooks/exhaustive-deps */

interface myProps {
    rawData?: number[]
    bw_mode: number
}

const BW_MODE_SAMPLING: Record<number, number> = {
    0x00: 512,
    0x01: 1024,
    0x02: 2048,
    0x03: 4096,
    0x04: 8192,
    0x05: 12288,
    0x06: 16384,
    0x07: 20480,
    0x08: 24576,
    0x09: 28672,
    0x0A: 32768,
    0x0B: 36864,
    0x0C: 40960,
    0x0D: 45056,
    0x0E: 49152,
    0x0F: 53248,
};

export default function App(props: myProps) {




    function computeFFT(signal: number[], fs: number) {
        const fftSize = signal.length; // 4096
        const fft = new FFT(fftSize);

        // Create input (real and imaginary) and output buffers
        const input = fft.createComplexArray();
        const output = fft.createComplexArray();

        // Copy signal into input real part (fft.js uses interleaved format)
        for (let i = 0; i < fftSize; i++) {
            input[2 * i] = signal[i];  // Real part
            input[2 * i + 1] = 0;      // Imaginary part (set to 0)
        }

        // Perform FFT (output is stored in `output`)
        fft.transform(output, input);

        // Compute magnitude spectrum (first half of FFT output)
        const magnitude = new Array(fftSize / 2).fill(0).map((_, i) =>
            Math.sqrt(output[2 * i] ** 2 + output[2 * i + 1] ** 2)
        );

        // Compute frequency bins
        const frequencyBins = new Array(fftSize / 2).fill(0).map((_, i) => (i * fs) / fftSize);

        return { magnitude, frequencyBins };
    }

    // Example usage
    // const fs = 1000; // Example sampling frequency in Hz
    // const sample_size = 4096
    // const signal = new Array(sample_size).fill(0).map((_, i) => Math.sin(2 * Math.PI * 50 * i / fs)); // Simulated sine wave at 50 Hz
    // const { magnitude, frequencyBins } = computeFFT(signal, fs);

    // const normalized_magnitude = magnitude.map((value) => value / (sample_size / 2))
    // console.log('Magnitude Spectrum:', normalized_magnitude);
    // console.log('Frequency Bins:', frequencyBins);

    // Make sure rawData is available
    if (!props.rawData || props.rawData.length === 0) {
        return <div>No data available for FFT</div>;
    }

    // Use bw_mode from props to get the sampling frequency
    const fs = BW_MODE_SAMPLING[props.bw_mode];

    if (!fs) {
        return <div>Invalid BW mode</div>;
    }

    // Compute FFT with the rawData
    const { magnitude, frequencyBins } = computeFFT(props.rawData, fs);

    // Normalize magnitude
    const normalized_magnitude = magnitude.map((value) => value / (props.rawData!.length / 2));



    return (
        <Plot
            data={[
                {
                    x: frequencyBins,
                    y: normalized_magnitude,
                    type: "bar",
                    marker: { color: "blue" },
                },
            ]}
            layout={{
                title: { text: "FFT Spectrum" },
                xaxis: { title: "Frequency (Hz)", type: "linear" },
                yaxis: { title: "Magnitude" },
                barmode: "group", // Optional: "group" to group bars (if you have multiple traces)
                bargap: 0.5, // Controls the gap between bars (value between 0 and 1)
                bargroupgap: 0.55, // Space between groups of bars, but not needed here for a single trace

            }}
            config={{ responsive: true }}
            style={{ width: "100%", height: "400px" }}
        />


    );
};
