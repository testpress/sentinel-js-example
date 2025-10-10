import { useState } from "react";
import { TPSentinelSDK } from "sentinel-js-sdk";
import type { Proctor, ProctoringPolicies } from "sentinel-js-sdk";

type Props = {
  setStep: (newStep: string) => void;
  setProctor: (newProctor: Proctor) => void;
};

function StartProctor({ setStep, setProctor }: Props) {
  const [sessionId, setSessionId] = useState("session-123");
  const [sessionToken, setSessionToken] = useState("session-token-abc");
  const [policies, setPolicies] = useState<ProctoringPolicies>({
    enableSnapshot: true,
    snapshotInterval: 30,
    recordingEnabled: true,
    recordingMaxDuration: 3600,
  });
  const [policiesText, setPoliciesText] = useState(JSON.stringify(policies, null, 2));
  const tpSentinelSDK = TPSentinelSDK.getInstance();
  const [status, setStatus] = useState("");

  async function startProctor(): Promise<void> {
    try {
      const proctor = await tpSentinelSDK.startProctor(sessionId, sessionToken, policies);
      setProctor(proctor);
      setStatus(`Proctoring active - Session ${sessionId}`);
      setStep("2")
    } catch (error) {
      setStatus(String(error));
    }
  }

  function handlePoliciesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setPoliciesText(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setPolicies(parsed);
      setStatus("");
    } catch {
      setStatus("Invalid JSON in policies");
    }
  }

  return (
    <div className="mb-5 p-5 border border-gray-200 rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">Proctoring Session</h2>
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center gap-3">
          <label htmlFor="sessionId" className="w-32 font-semibold text-gray-700">Session ID:</label>
          <input
            type="text"
            id="sessionId"
            placeholder="Enter session ID"
            value={sessionId}
            onChange={e => setSessionId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sessionToken" className="w-32 font-semibold text-gray-700">Token:</label>
          <input
            type="text"
            id="sessionToken"
            placeholder="Enter session token"
            value={sessionToken}
            onChange={e => setSessionToken(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div className="flex items-start gap-3">
          <label htmlFor="policies" className="w-32 font-semibold text-gray-700 pt-2">Policies:</label>
          <textarea
            id="policies"
            value={policiesText}
            onChange={handlePoliciesChange}
            rows={6}
            spellCheck={false}
            className="flex-1 p-3 min-h-[150px] font-mono rounded bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          id="startBtn"
          onClick={startProctor}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:shadow transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Start Proctoring
        </button>

      </div>

      {status && (
        <div className="mt-3">
          <div className="px-3 py-2 rounded font-medium mt-2 bg-gray-100 text-gray-700 border border-gray-300">
            {status}
          </div>
        </div>
      )}
    </div>
  );
}

export default StartProctor;
