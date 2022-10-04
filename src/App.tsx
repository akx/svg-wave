import React from "react";
import computeWave, { WaveFunc } from "./computeWave";

const squiggle = "M100,100 C150,100,150,250,200,200";
const mdnHeart = `M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z`;
const rect = "M100,100 h100 v100 h-100 z";

const waveFuncs: Record<string, WaveFunc> = {
  sine: (phase: number, amp: number) => Math.sin(phase) * amp,
  saw: (phase: number, amp: number) =>
    -amp + ((phase / Math.PI / 2) % 1) * amp * 2,
  square: (phase: number, amp: number) =>
    (phase / Math.PI / 2) % 1 > 0.5 ? -amp : amp,
};

export default function App() {
  const pathRef = React.useRef<SVGPathElement>(null);
  const [amp, setAmp] = React.useState(3);
  const [freq, setFreq] = React.useState(10);
  const [res, setRes] = React.useState(2);
  const [phase, setPhase] = React.useState(0);
  const [wavePath, setWavePath] = React.useState("");
  const [path, setPath] = React.useState(squiggle);
  const [wave, setWave] = React.useState("sine");
  React.useLayoutEffect(() => {
    if (pathRef.current) {
      setWavePath(
        computeWave(pathRef.current, freq, amp, phase, res, waveFuncs[wave]),
      );
    }
  }, [path, amp, freq, phase, res, wave]);
  const changeWave = (e: React.ChangeEvent<HTMLInputElement>) =>
    setWave(e.target.value);

  return (
    <div className="App">
      <a href="https://stackoverflow.com/a/73948865/51685">
        See this Stack Overflow question and my answer...
      </a>
      <hr />
      <label>
        <span>Original path string</span>
        <input value={path} onChange={(e) => setPath(e.target.value)} />
      </label>
      <label>
        <span>Examples</span>
        <button onClick={() => setPath(squiggle)}>Squiggle</button>
        <button onClick={() => setPath(mdnHeart)}>MDN Heart</button>
        <button onClick={() => setPath(rect)}>Get Rectangle</button>
      </label>
      <label>
        <span>Amplitude (as SVG units)</span>
        <input
          type="range"
          min={0}
          max={50}
          value={amp}
          onChange={(e) => setAmp(e.target.valueAsNumber)}
        />
        {amp.toFixed(2)}
      </label>
      <label>
        <span>Phase (0..1)</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={phase}
          onChange={(e) => setPhase(e.target.valueAsNumber)}
        />
        {phase.toFixed(2)}
      </label>
      <label>
        <span>Frequency (as multiples of path length)</span>
        <input
          type="range"
          min={0}
          max={20}
          step={0.05}
          value={freq}
          onChange={(e) => setFreq(e.target.valueAsNumber)}
        />
        {freq.toFixed(2)}
      </label>
      <label>
        <span>Resolution (as SVG units)</span>
        <input
          type="range"
          min={0.1}
          max={5}
          step={0.05}
          value={res}
          onChange={(e) => setRes(e.target.valueAsNumber)}
        />
        {res.toFixed(2)}
      </label>
      <label>
        <span>Wave</span>
        <div>
          <label>
            <input
              type="radio"
              checked={wave === "sine"}
              value="sine"
              onChange={changeWave}
            />
            Sine
          </label>
          <label>
            <input
              type="radio"
              checked={wave === "saw"}
              value="saw"
              onChange={changeWave}
            />
            Saw
          </label>
          <label>
            <input
              type="radio"
              checked={wave === "square"}
              value="square"
              onChange={changeWave}
            />
            Square
          </label>
        </div>
      </label>
      <svg viewBox="0 0 300 300">
        <path d={path} fill="none" stroke="red" ref={pathRef} />
        <path d={wavePath} fill="none" stroke="blue" />
      </svg>
    </div>
  );
}
