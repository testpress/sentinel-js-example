import { useState } from "react"

import type { Proctor } from "sentinel-js-sdk";

import InitializeSDK from "./components/InitializeSDK"
import StartProctor from "./components/StartProctor"
import Checkpoint from "./components/Checkpoint"
import EventCapture from "./components/EventCapture"
import StopProctor from "./components/StopProctor"


function App() {
  const [proctor, setProctor] = useState<Proctor | null>(null);
  const [step, setStep] = useState("1");
  return (
    <>
      <div className="max-w-5xl mx-auto p-5 min-h-screen bg-gray-200 text-gray-700">
      <h1 className="text-center text-4xl font-light text-gray-700 mb-8">Sentinel SDK Demo app</h1>
        {step === "1" && (
          <>
            <InitializeSDK />
            <StartProctor setStep={setStep} setProctor={setProctor} />
          </>
        )}
        {step === "2" && proctor &&(
          <>
            <Checkpoint proctor={proctor} />
            <EventCapture proctor={proctor} />
            <StopProctor setStep={setStep} proctor={proctor}/>
          </>
        )}
      </div>
    </>
  )
}

export default App
