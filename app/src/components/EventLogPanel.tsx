import type { LogEntry } from '../types'

type Props = {
  logs: LogEntry[]
  onClearLogs: () => void
}

export function EventLogPanel({ logs, onClearLogs }: Props) {
  return (
    <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 flex flex-col min-h-0 lg:col-span-2">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-800">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Event Log</h2>
        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="text-[13px] text-zinc-600 hover:text-zinc-400 transition"
          >
            Clear
          </button>
        )}
      </div>
      <div className="h-48 overflow-y-auto p-5 space-y-1.5 font-mono text-[13px]">
        {logs.length === 0 ? (
          <p className="text-zinc-600 text-sm font-sans">
            Fill in the credentials and click <span className="text-teal-400">Launch Sentinel</span> to begin.
          </p>
        ) : (
          logs.map(entry => (
            <div key={entry.id} className="flex gap-3 text-[13px] leading-relaxed">
              <span className="shrink-0 text-zinc-600 tabular-nums w-20">{entry.timestamp}</span>
              <span className="shrink-0 text-zinc-500 w-28 truncate">{entry.event}</span>
              <span className="text-zinc-300 break-all">{entry.detail}</span>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
