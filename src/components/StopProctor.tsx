import { useState } from "react";
import { Proctor } from "sentinel-js-sdk";

type Props = {
	setStep: (newStep: string) => void;
	proctor: Proctor;
};

function StopProctor({ setStep, proctor }: Props) {
	const [status, setStatus] = useState("");

	async function stopProctoring(): Promise<void> {
		try {
			await proctor.stop();
			setStatus("Proctoring stopped");
		} catch (error) {
			setStatus(String(error));
		}
	}


	return (
		<>
			<div className="mb-5 p-5 border border-gray-200 rounded-lg bg-gray-50">
				<h2 className="text-xl font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">
					Stop Proctoring
				</h2>

				<div className="space-x-2">
					<button
						id="stopProctoring"
						onClick={stopProctoring}
						className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:shadow transition disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						Stop
					</button>
					<button
						id="resetSDK"
						onClick={async () => {await stopProctoring(); setStep("1");}}						
						className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:shadow transition disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						Reset SDK
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
		</>
	);
}

export default StopProctor;
