import { useState, useRef, useCallback, useEffect } from 'react'
import { Sentinel } from '@testpress/sentinel-core'
import { mountSentinelOverlay } from '@testpress/sentinel-ui'
import type { SessionState } from '@testpress/sentinel-core'

type LogEntry = { time: string; message: string }

const STORAGE_KEY = 'sentinel-demo-creds'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { orgCode: '', sessionId: '', token: '' }
}

function save(orgCode: string, sessionId: string, token: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ orgCode, sessionId, token }))
}

const BADGES: Record<SessionState, { bg: string; label: string }> = {
  idle:               { bg: 'bg-zinc-700', label: 'Idle' },
  ready:              { bg: 'bg-sky-500', label: 'Ready' },
  'setup-in-progress':{ bg: 'bg-amber-500', label: 'Setup…' },
  running:            { bg: 'bg-emerald-500', label: 'Running' },
  paused:             { bg: 'bg-amber-500', label: 'Paused' },
  stopped:            { bg: 'bg-red-500', label: 'Stopped' },
  failed:             { bg: 'bg-red-600', label: 'Failed' },
}

function LogLine({ entry }: { entry: LogEntry }) {
  return (
    <div className="flex gap-3 text-[13px] leading-relaxed">
      <span className="shrink-0 text-zinc-600 tabular-nums w-20">{entry.time}</span>
      <span className="text-zinc-300 break-all">{entry.message}</span>
    </div>
  )
}

export default function App() {
  const saved = loadSaved()
  const [orgCode, setOrgCode] = useState(saved.orgCode)
  const [sessionId, setSessionId] = useState(saved.sessionId)
  const [token, setToken] = useState(saved.token)
  const [state, setState] = useState<SessionState>('idle')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [active, setActive] = useState(false)
  const overlayRef = useRef<{ unmount: () => void } | null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef(Sentinel)

  useEffect(() => {
    if (!logRef.current) return
    logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  const log = useCallback((message: string) => {
    setLogs(p => [...p, { time: new Date().toLocaleTimeString(), message }])
  }, [])

  const handleLaunch = useCallback(() => {
    save(orgCode, sessionId, token)
    setActive(true)
    const s = sentinelRef.current

    s.on('*', ((event: string, payload?: unknown) => {
      const p = payload ? ` ${JSON.stringify(payload)}` : ''
      log(`[event] ${event}${p}`)
    }) as any)

    s.on('session:stateChanged', (st: SessionState) => {
      setState(st)
    })

    s.init({ orgCode, sessionId, token })
    log('Sentinel.init() ✓')

    const container = document.getElementById('sentinel-overlay')!
    const overlay = mountSentinelOverlay({ container, sentinel: s })
    overlayRef.current = overlay
    log('mountSentinelOverlay() ✓')
  }, [orgCode, sessionId, token, log])

  const handleReset = useCallback(() => {
    if (overlayRef.current) {
      overlayRef.current.unmount()
      overlayRef.current = null
    }
    sentinelRef.current.reset()
    setState('idle')
    setLogs([])
    setActive(false)
  }, [])

  const badge = BADGES[state]

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100 flex flex-col">
      {/* ── header ── */}
      <header className="border-b border-zinc-800 px-5 py-3 flex items-center gap-3">
        <span className="size-2 rounded-full bg-teal-400" />
        <h1 className="text-sm font-semibold tracking-tight">Sentinel Demo</h1>
        <span className="ml-auto text-[13px] text-zinc-500">
          <span className="hidden sm:inline">@testpress/sentinel-ui </span>v1.0.0
        </span>
      </header>

      {/* ── body ── */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0">
        {/* ─── panel — form ─── */}
        <section className="w-full lg:w-96 shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-800 p-5 space-y-4">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Credentials</h2>

          <Field label="Org Code" placeholder="acme-university" value={orgCode} onChange={setOrgCode} disabled={active} />
          <Field label="Session ID" placeholder="sess_abc123" value={sessionId} onChange={setSessionId} disabled={active} />
          <Field label="Token" placeholder="tp_xxxxxxxx" value={token} onChange={setToken} disabled={active} secret />

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleLaunch}
              disabled={!orgCode || !sessionId || !token || active}
              className="flex-1 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-400 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              {active ? 'Sentinel Active' : 'Launch Sentinel'}
            </button>
            <button
              onClick={handleReset}
              disabled={!active}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-25 disabled:pointer-events-none transition"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-2 text-[13px] text-zinc-500">
            Session state
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${badge.bg}`}>
              {badge.label}
            </span>
          </div>
        </section>

        {/* ─── right column ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* overlay mount */}
          <div
            id="sentinel-overlay"
            className="relative min-h-[140px] border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 flex items-center justify-center"
          >
            {!active && (
              <div className="text-center select-none">
                <div className="text-2xl mb-1 opacity-20">🛡</div>
                <p className="text-xs text-zinc-600">Overlay renders here once launched</p>
              </div>
            )}
          </div>

          {/* event log */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-800">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Event Log</h2>
              {logs.length > 0 && (
                <button
                  onClick={() => setLogs([])}
                  className="text-[13px] text-zinc-600 hover:text-zinc-400 transition"
                >
                  Clear
                </button>
              )}
            </div>
            <div ref={logRef} className="flex-1 overflow-y-auto p-5 space-y-1.5 font-mono text-[13px]">
              {logs.length === 0 && (
                <p className="text-zinc-600 text-sm font-sans">
                  Fill in the credentials and click <span className="text-teal-400">Launch Sentinel</span> to begin.
                </p>
              )}
              {logs.map((entry, i) => (
                <LogLine key={i} entry={entry} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

/* ─── reusable field ─── */

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
