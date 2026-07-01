import type { SessionState } from '@testpress/sentinel-core'
import type { DemoConfig } from '../types'

type Props = {
  config: DemoConfig
  flags: {
    canStart: boolean
    canPause: boolean
    canResume: boolean
    canStop: boolean
    canReset: boolean
  }
  errorMessage: string | null
  sessionState: SessionState
  onConfigChange: (key: keyof DemoConfig, value: string) => void
  actions: {
    onStart: () => void
    onPause: () => void
    onResume: () => void
    onStop: () => void
    onReset: () => void
  }
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  secret,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  disabled: boolean
  secret?: boolean
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-zinc-400 mb-1">{label}</label>
      <input
        className={`w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition
          focus:border-teal-500 focus:ring-1 focus:ring-teal-500
          disabled:opacity-40 disabled:cursor-not-allowed
          ${secret ? 'font-mono tracking-wider' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        type={secret ? 'password' : 'text'}
        disabled={disabled}
      />
    </div>
  )
}

export function ConfigPanel({ config, flags, errorMessage, sessionState, onConfigChange, actions }: Props) {
  const isActive = sessionState !== 'idle' && sessionState !== 'ready'

  return (
    <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 space-y-4">
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Credentials</h2>

      <Field
        label="Org Code"
        placeholder="acme-university"
        value={config.orgCode}
        onChange={v => onConfigChange('orgCode', v)}
        disabled={isActive}
      />
      <Field
        label="Session ID"
        placeholder="sess_abc123"
        value={config.sessionId}
        onChange={v => onConfigChange('sessionId', v)}
        disabled={isActive}
      />
      <Field
        label="Token"
        placeholder="tp_xxxxxxxx"
        value={config.token}
        onChange={v => onConfigChange('token', v)}
        disabled={isActive}
        secret
      />

      <div className="flex gap-2 pt-1">
        <button
          onClick={actions.onStart}
          disabled={!flags.canStart}
          className="flex-1 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-400 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          {isActive ? 'Sentinel Active' : 'Launch Sentinel'}
        </button>
        <button
          onClick={actions.onReset}
          disabled={!flags.canReset}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-25 disabled:pointer-events-none transition"
        >
          Reset
        </button>
      </div>

      {isActive && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={sessionState === 'paused' ? actions.onResume : actions.onPause}
            disabled={!flags.canPause && !flags.canResume}
            className="flex-1 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-25 disabled:pointer-events-none transition"
          >
            {sessionState === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={actions.onStop}
            disabled={!flags.canStop}
            className="flex-1 rounded-lg border border-red-800 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-900/40 disabled:opacity-25 disabled:pointer-events-none transition"
          >
            Stop
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 px-3 py-2 text-sm text-red-300">
          {errorMessage}
        </div>
      )}
    </section>
  )
}
