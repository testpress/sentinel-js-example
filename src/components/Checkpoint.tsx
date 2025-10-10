import { useState } from "react"
import type { Proctor, ProctoringPolicies } from "sentinel-js-sdk";

type Props = {
  proctor: Proctor;
};

function Checkpoint({ proctor }: Props) {
  const [checkpointId, setCheckpointId] = useState("checkpoint_1")
  const [policies, setPolicies] = useState<ProctoringPolicies>({
    enableSnapshot: true,
    snapshotInterval: 30,
  });
  const [policiesText, setPoliciesText] = useState(JSON.stringify(policies, null, 2));
  const [status, setStatus] = useState("");

  async function setCheckpoint(): Promise<void> {
    try {
      await proctor.setCheckpoint(checkpointId, policies);
      setStatus(`Checkpoint set: ${checkpointId}`)
    } catch (error) {
      setStatus(String(error))
    }
  }

  async function completeCheckpoint(): Promise<void> {
    try {
      await proctor.completeCheckpoint(checkpointId);
      setStatus(`Checkpoint completed: ${checkpointId}`)
    } catch (error) {
      setStatus(String(error))
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
    <>
      <div className="mb-5 p-5 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">Checkpoint</h2>
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center gap-3">
            <label htmlFor="checkpointId" className="w-32 font-semibold text-gray-700">Checkpoint:</label>
            <input type="text" id="checkpointId" placeholder="Enter checkpoint ID" value={checkpointId} onChange={(e) => setCheckpointId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <label htmlFor="policies" className="w-32 font-semibold text-gray-700 pt-2">Policies:</label>
          <textarea
            id="policies"
            value={policiesText}
            onChange={handlePoliciesChange}
            rows={6}
            spellCheck={false}
            className="flex-1 p-3 min-h-[90px] font-mono rounded bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y"
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button id="setCheckpointBtn" onClick={setCheckpoint}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:shadow transition disabled:bg-gray-400 disabled:cursor-not-allowed">Set
            Checkpoint</button>
          <button id="completeCheckpointBtn" onClick={completeCheckpoint}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:shadow transition disabled:bg-gray-400 disabled:cursor-not-allowed">Complete
            Checkpoint</button>
        </div>
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

export default Checkpoint