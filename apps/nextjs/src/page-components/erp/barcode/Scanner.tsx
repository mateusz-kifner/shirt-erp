import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import Quagga, { type QuaggaJSResultObject } from "@ericblade/quagga2";
import { validateBarcodeParity } from "./validator";

const BarcodeReader = () => {
  const webcamRef = useRef<Webcam>(null);
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<string>("");
  const [webcamReady, setWebcamReady] = useState(false);
  const [codes, setCodes] = useState<number[]>([]);

  useEffect(() => {
    if (webcamRef.current?.video) {
      setWebcamReady(true);
    }
  }, [webcamRef]);

  useEffect(() => {
    if (!webcamReady) return;

    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: webcamRef.current
            ? (webcamRef.current.video as Element)
            : undefined,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment", // or user
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: navigator.hardwareConcurrency || 2,
        decoder: {
          readers: ["ean_reader"], // barcode type to scan for
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
      },
    );

    const onDetected = (data: QuaggaJSResultObject) => {
      if (!scanned) {
        setScanned((currentScanned) => {
          // Use the functional form to ensure the most up-to-date value
          if (!currentScanned) {
            if (data.codeResult.code !== null) {
              const code = Number.parseInt(data.codeResult.code);
              if (validateBarcodeParity(code)) {
                setCodes((prev) => [...prev, code]);
                setResult(data.codeResult.code);
              } else {
                setResult("[Kod błędny]");
              }
            }
            return true;
          }
          return currentScanned;
        });
      }
    };

    Quagga.onDetected(onDetected);

    return () => {
      Quagga.offDetected(onDetected);
      Quagga.stop();
    };
  }, [webcamReady, scanned]);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        style={{
          width: "100%",
          height: "auto",
        }}
      />
      {scanned && <p>Scanned Result: {result}</p>}
      {codes.map((code) => (
        <div className="rounded bg-slate-800 p-2">{code}</div>
      ))}
    </div>
  );
};

export default BarcodeReader;
