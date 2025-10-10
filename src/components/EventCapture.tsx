import { useState } from "react"
import type { Proctor } from "sentinel-js-sdk";

type Props = {
  proctor: Proctor;
};

function EventCapture({ proctor }: Props) {
  const [eventName, setEventName] = useState("user_interaction");
  const [eventData, setEventData] = useState<object>({
    action: 'click',
    element: 'submit-button'
  });
  const [eventDataText, setEventDataText] = useState(JSON.stringify(eventData, null, 2));
  const [status, setStatus] = useState("")

  
  function handleEventDataChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setEventDataText(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setEventData(parsed);
      setStatus("");
    } catch (error) {
      setStatus(String(error));
    }
  }

  async function captureCustomEvent(): Promise<void> {
    try {
      await proctor.capture(eventName, eventData);
      setStatus(`Event captured: ${eventName}`);
    } catch (error) {
      setStatus(String(error));
    }
  }

  return (
    <>
      <div className="mb-5 p-5 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">Event Capture</h2>
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center gap-3">
            <label htmlFor="eventName" className="w-32 font-semibold text-gray-700">Event:</label>
            <input type="text" id="eventName" placeholder="Enter event name" value={eventName} onChange={(e) => setEventName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>

          <div className="flex items-start gap-3">
            <label htmlFor="eventData" className="w-32 font-semibold text-gray-700 pt-2">Event data:</label>
            <textarea
              id="eventData"
              value={eventDataText}
              onChange={handleEventDataChange}
              rows={6}
              spellCheck={false}
              className="flex-1 p-3 min-h-[120px] font-mono rounded bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y"
            />
          </div>
        </div>
        <button id="captureBtn" onClick={captureCustomEvent}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:shadow transition disabled:bg-gray-400 disabled:cursor-not-allowed">Capture
          Event</button>
        {status && (
          <div className="mt-3">
            <div className="px-3 py-2 rounded font-medium mt-2 bg-gray-100 text-gray-700 border border-gray-300">
              {status}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default EventCapture