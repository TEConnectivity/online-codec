import { Box, Checkbox, useBoolean } from "@chakra-ui/react";
import { Layout } from "plotly.js";
import { useEffect, useRef, useState } from "react";
import Plot from "react-plotly.js";
import { LastMeasurementType } from "./BLE";

/* eslint-disable react-hooks/exhaustive-deps */

interface myProps {
  incomingData?: LastMeasurementType
}

export default function App(props: myProps) {

  // Effect to handle data when incomingData changes
  useEffect(() => {
    if (props.incomingData) {
      handleDataChange(); // Update the plot whenever incomingData changes
    }
  }, [props.incomingData]); // Runs when incomingData changes

  // DUMMY DATA GENERATOR
  const [liveDummyData, setliveDummyData] = useBoolean(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  function handleLiveDummyCheckbox(event: any) {
    setliveDummyData.toggle();

    console.log(new Date().toISOString())
    console.log(new Date(Date.now()).toISOString())

    if (event.target.checked) {
      // Start generating data every 100ms
      intervalRef.current = setInterval(() => {
        const value = Math.random() * 10; // Random value between 0 and 10

        const now = new Date();
        const nowIso = now.toISOString();

        setScatter((prevData) => ({
          ...prevData,
          x: [...prevData.x, nowIso],
          y: [...prevData.y, value],
        }));

        switch (selectedRangeButtonRef.current) {
          case ("10s"):
            const nowMinus10s = new Date(now.getTime() - 10 * 1000); // Subtract 10 seconds
            const nowMinus10sIso = nowMinus10s.toISOString();
            setLayout((prevLayout) => ({
              ...prevLayout,
              xaxis: { ...prevLayout.xaxis, autorange: false, range: [nowMinus10sIso, nowIso] }
            }));
            break;
          case ("1min"):
            const nowMinus1min = new Date(now.getTime() - 60 * 1000); // Subtract 1min
            const nowMinus1minIso = nowMinus1min.toISOString();
            setLayout((prevLayout) => ({
              ...prevLayout,
              xaxis: { ...prevLayout.xaxis, autorange: false, range: [nowMinus1minIso, nowIso] }
            }));
            break;
        }

      }, 100);
    } else {
      // Stop data generation
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }
  // Clear interval when the component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  const plotRef = useRef(null);


  // Checkbox state : live mode
  const [liveViewCheckbox, setLiveViewCheckbox] = useBoolean(true)

  function handleLiveViewCheckbox(event: React.ChangeEvent<HTMLInputElement>): void {
    setLiveViewCheckbox.toggle();
    console.log(layout.xaxis?.range)
    if (event.target.checked) {
      setLayout((prevLayout) => ({
        ...prevLayout,
        xaxis: { ...prevLayout.xaxis, autorange: true }
      }));
    }
    else {
      setLayout((prevLayout) => ({
        ...prevLayout,
        xaxis: { ...prevLayout.xaxis, autorange: false }
      }));
    }
  }


  interface ScatterDataType {
    x: string[];
    y: number[];
    type: "scatter";
    mode: 'lines' | 'markers' | 'lines+markers';
    line: object
    marker: { color: string };
  }

  const [scatter, setScatter] = useState<ScatterDataType>({
    x: [],
    y: [],
    type: 'scatter',
    mode: 'lines',
    line: { shape: "spline" },
    marker: { color: 'red' },
  });


  const [selectedRangeButton, setSelectedRangeButton] = useState<"10s" | "1min" | null>(null);
  const selectedRangeButtonRef = useRef(selectedRangeButton);
  // Update the ref whenever the state changes
  useEffect(() => {
    selectedRangeButtonRef.current = selectedRangeButton;
  }, [selectedRangeButton]);

  // Store layout state to persist zoom level
  const [layout, setLayout] = useState<Partial<Layout>>({
    title: { text: 'Measurement Data' },
    xaxis: {
      autorange: true,
      type: "date",
      rangeselector: {
        buttons: [
          {
            count: 10,
            label: '10s',
            step: 'second',
            stepmode: 'backward'
          },
          {
            count: 1,
            label: '1min',
            step: 'minute',
            stepmode: 'backward'
          }
        ]
      },
      rangeslider: {
        visible: true
      }
    },
    yaxis: { autorange: true }
  });

  // Handle user zoom/pan interactions
  const handleRelayout = (event: Readonly<Plotly.PlotRelayoutEvent>) => {
    setLiveViewCheckbox.off();

    // console.log("handleLayout! :", event)

    // This type of weird event (range[0]) come when a built-in button is pressed
    if (event["xaxis.range[0]"]) {
      const start = event["xaxis.range[0]"] as unknown as string
      const end = event["xaxis.range[1]"] as unknown as string
      const startDate = new Date(start.replace(/([+-]\d{2}:\d{2}|Z)$/, "")) //delete timezone
      const endDate = new Date(end.replace(/([+-]\d{2}:\d{2}|Z)$/, ""))

      const delta = Math.abs(endDate.getTime() - startDate.getTime());

      if (delta === 10 * 1000) {
        setSelectedRangeButton("10s");
        console.log("10s")
      } else if (delta === 60 * 1000) {
        setSelectedRangeButton("1min");
        console.log("1mn")
      } else {
        setSelectedRangeButton(null); // User manually panned/zoomed
      }
    }
    else {
      setSelectedRangeButton(null); // User manually panned/zoomed
    }

  };


  function handleDataChange() {

    if (props.incomingData) {
      const data = props.incomingData

      const now = new Date()
      const nowIso = now.toISOString()

      setScatter((prevData) => ({ ...prevData, x: [...prevData.x, nowIso], y: [...prevData.y, data.sensor32] }))
      // TODO : Use extendTraces instead, to increase performance when dealing with large amount of data
      // extendTraces(plotRef.current!, { x: [nowIso], y: [value.sensor32] }, 0)

      switch (selectedRangeButtonRef.current) {
        case ("10s"):
          const nowMinus10s = new Date(now.getTime() - 10 * 1000); // Subtract 10 seconds
          const nowMinus10sIso = nowMinus10s.toISOString();
          setLayout((prevLayout) => ({
            ...prevLayout,
            xaxis: { ...prevLayout.xaxis, autorange: false, range: [nowMinus10sIso, nowIso] }
          }));
          break;
        case ("1min"):
          const nowMinus1min = new Date(now.getTime() - 60 * 1000); // Subtract 1min
          const nowMinus1minIso = nowMinus1min.toISOString();
          setLayout((prevLayout) => ({
            ...prevLayout,
            xaxis: { ...prevLayout.xaxis, autorange: false, range: [nowMinus1minIso, nowIso] }
          }));
          break;
      }
    }
  }

  return (
    <Box>

      <Checkbox hidden isChecked={liveDummyData} onChange={handleLiveDummyCheckbox}>Live dummy data</Checkbox>
      <Checkbox hidden isChecked={liveViewCheckbox} onChange={handleLiveViewCheckbox}>Live View</Checkbox>
      <Plot
        ref={plotRef}
        data={[scatter]}
        layout={layout}
        onRelayout={handleRelayout} // Capture zoom & pan
      />
    </Box>

  );
};
