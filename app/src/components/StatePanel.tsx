import type { SessionState } from '@testpress/sentinel-core'
import type { DemoConfig } from '../types'

const STATE_LABELS: Record<SessionState, string> = {
  idle: 'Idle',
  ready: 'Ready',
  'setup-in-progress': 'Setup in Progress',
  running: 'Running',
  paused: 'Paused',
  stopped: 'Stopped',
  failed: 'Failed',
}

type Props = {
  config: DemoConfig
  sessionState: SessionState
}

export function StatePanel({ config, sessionState }: Props) {
  return (
    <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 space-y-3">
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Session Info</h2>

      <div className="space-y-2 text-[13px]">
        <div className="flex justify-between">
          <span className="text-zinc-500">State</span>
          <span className="text-zinc-300 font-medium">{STATE_LABELS[sessionState]}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Org Code</span>
          <span className="text-zinc-300 font-mono text-[12px]">{config.orgCode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Session ID</span>
          <span className="text-zinc-300 font-mono text-[12px] truncate max-w-[180px]">{config.sessionId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">API Base URL</span>
          <span className="text-zinc-300 font-mono text-[12px] truncate max-w-[180px]">{config.apiBaseURL}</span>
        </div>
      </div>
    </section>
  )
}
