import type { SessionState } from '@testpress/sentinel-core'

const STATE_BADGES: Record<SessionState, { bg: string; label: string }> = {
  idle:               { bg: 'bg-zinc-700', label: 'Idle' },
  ready:              { bg: 'bg-sky-500', label: 'Ready' },
  'setup-in-progress':{ bg: 'bg-amber-500', label: 'Setup…' },
  running:            { bg: 'bg-emerald-500', label: 'Running' },
  paused:             { bg: 'bg-amber-500', label: 'Paused' },
  stopped:            { bg: 'bg-red-500', label: 'Stopped' },
  failed:             { bg: 'bg-red-600', label: 'Failed' },
}

type Props = {
  sessionState: SessionState
  stateTone: 'good' | 'warn' | 'bad' | 'neutral'
}

export function DevHero({ sessionState, stateTone }: Props) {
  const badge = STATE_BADGES[sessionState]

  return (
    <header className="mb-8 flex items-center gap-3">
      <span className={`size-2.5 rounded-full ${
        stateTone === 'good' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
        stateTone === 'warn' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' :
        stateTone === 'bad' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
        'bg-zinc-600'
      }`} />
      <h1 className="text-lg font-bold tracking-tight">Sentinel Demo</h1>
      <span className="ml-auto flex items-center gap-2 text-[13px] text-zinc-500">
        @testpress/sentinel-ui v1.0.0
      </span>
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${badge.bg}`}>
        {badge.label}
      </span>
    </header>
  )
}
