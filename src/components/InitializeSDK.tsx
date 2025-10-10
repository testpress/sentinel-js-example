import { useState } from "react";

import { TPSentinelSDK } from "sentinel-js-sdk";


function InitializeSDK() {
  const tpSentinelSDK = TPSentinelSDK.getInstance();
  const [organizationID, setOrganizationID] = useState(
    "123e4567-e89b-12d3-a456-426614174000"
  );
  const [status, setStatus] = useState("");

  async function initializeSDK(): Promise<void> {
    try {
      tpSentinelSDK.initialize(organizationID);
      setStatus("SDK initialized successfully!")
    } catch (error) {
      setStatus(String(error));
    }
  }

  return (
    <div className="">
      <div className="mb-0">
        <div className="mb-5 p-5 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">
            SDK Initialization
          </h2>
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-3">
              <label 
                className="w-32 font-semibold text-gray-700"
                htmlFor="orgId"
              >
                Organization ID:
              </label>
              <input
                type="text"
                id="orgId"
                onChange={(event) => setOrganizationID(event.target.value)}
                placeholder="Enter organization code"
                value={organizationID}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
          <button
            onClick={initializeSDK}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium shadow-sm hover:shadow transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Initialize SDK
          </button>

          {status && (
            <div id="initStatus" className="mt-3">
              <div className="px-3 py-2 rounded font-medium mt-2 bg-gray-100 text-gray-700 border border-gray-300">
                {status}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InitializeSDK;
