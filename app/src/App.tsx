import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import type { SessionState } from '@testpress/sentinel-core'
import { Sentinel } from '@testpress/sentinel-core'
import { mountSentinelOverlay } from '@testpress/sentinel-ui'
import type { DemoConfig, LogEntry, WildcardSentinel } from './types'
import { DevHero } from './components/DevHero'
import { ConfigPanel } from './components/ConfigPanel'
import { StatePanel } from './components/StatePanel'
import { EventLogPanel } from './components/EventLogPanel'

const DEFAULTS: DemoConfig = {
  orgCode: 'b2zbsp',
  sessionId: '12fd02aa-024e-4937-921f-10c2030328d7',
  token: '7b832cbb-7ce7-4db9-a35f-f7a7d6c1ee80',
  apiBaseURL: 'https://app.tpsentinel.com',
}

function readConfigFromQuery(): DemoConfig {
  const params = new URLSearchParams(window.location.search)
  return {
    orgCode: params.get('orgCode') || params.get('org_code') || DEFAULTS.orgCode,
    sessionId: params.get('sessionId') || params.get('session_id') || DEFAULTS.sessionId,
    token: params.get('token') || DEFAULTS.token,
    apiBaseURL: params.get('apiBaseURL') || params.get('baseURL') || params.get('baseUrl') || DEFAULTS.apiBaseURL,
  }
}

function formatEventDetail(payload: unknown): string {
  if (payload === undefined) return 'No payload'
  if (typeof payload === 'string') return payload
  try {
    return JSON.stringify(
      payload,
      (_, value) => {
        if (value instanceof MediaStream) return { kind: 'MediaStream', id: value.id, active: value.active }
        if (value instanceof Error) return { name: value.name, message: value.message }
        return value
      },
      2,
    )
  } catch {
    return String(payload)
  }
}

export default function App() {
  let overlayContainer: HTMLDivElement | undefined
  let nextLogId = 0
  const sentinelWithWildcard = Sentinel as typeof Sentinel & WildcardSentinel

  const [config, setConfig] = useState<DemoConfig>(DEFAULTS)
  const [isOverlayMounted, setIsOverlayMounted] = useState(false)
  const [sessionState, setSessionState] = useState<SessionState>(Sentinel.getState())
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  const addLog = useCallback((event: string, payload: unknown) => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false })
    const entry: LogEntry = {
      id: nextLogId++,
      event,
      timestamp,
      detail: formatEventDetail(payload),
    }
    setLogs(current => [entry, ...current].slice(0, 40))
  }, [])

  const updateConfig = useCallback((key: keyof DemoConfig, value: string) => {
    setConfig(current => ({ ...current, [key]: value }))
  }, [])

  const stateTone = useMemo<'good' | 'warn' | 'bad' | 'neutral'>(() => {
    switch (sessionState) {
      case 'running': return 'good'
      case 'setup-in-progress':
      case 'paused': return 'warn'
      case 'failed': return 'bad'
      default: return 'neutral'
    }
  }, [sessionState])

  const canStart = useMemo(
    () => !isBusy && !isOverlayMounted && sessionState !== 'running' && sessionState !== 'setup-in-progress'
      && config.orgCode.trim() !== '' && config.sessionId.trim() !== '' && config.token.trim() !== '',
    [isBusy, isOverlayMounted, sessionState, config],
  )

  const canPause = useMemo(() => !isBusy && sessionState === 'running', [isBusy, sessionState])
  const canResume = useMemo(() => !isBusy && sessionState === 'paused', [isBusy, sessionState])
  const canStop = useMemo(() => !isBusy && (sessionState === 'running' || sessionState === 'paused'), [isBusy, sessionState])
  const canReset = useMemo(() => !isBusy && sessionState !== 'setup-in-progress', [isBusy, sessionState])

  const startSentinel = useCallback(async () => {
    setErrorMessage(null)
    setIsBusy(true)
    setIsOverlayMounted(true)
    try {
      const currentState = Sentinel.getState()
      if (currentState === 'failed' || currentState === 'stopped') {
        Sentinel.reset()
      }
      if (Sentinel.getState() === 'idle') {
        Sentinel.init(config)
        addLog('session:stateChanged', 'Initialized demo config')
      } else {
        await Sentinel.start()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setErrorMessage(message)
      addLog('setup:failed', { message })
    } finally {
      setSessionState(Sentinel.getState())
      setIsBusy(false)
    }
  }, [config, addLog])

  const pauseSentinel = useCallback(() => {
    Sentinel.pause()
    setSessionState(Sentinel.getState())
  }, [])

  const resumeSentinel = useCallback(async () => {
    await startSentinel()
  }, [startSentinel])

  const stopSentinel = useCallback(() => {
    setIsBusy(true)
    try {
      Sentinel.stop()
      setSessionState(Sentinel.getState())
      addLog('session:stateChanged', 'Sentinel stopped')
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setErrorMessage(message)
    } finally {
      setIsBusy(false)
    }
  }, [addLog])

  const resetSentinel = useCallback(() => {
    setErrorMessage(null)
    try {
      Sentinel.reset()
      setIsOverlayMounted(false)
      setSessionState(Sentinel.getState())
      addLog('session:stateChanged', 'Sentinel reset to idle')
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setErrorMessage(message)
    }
  }, [addLog])

  useEffect(() => {
    setConfig(readConfigFromQuery())
  }, [])

  useEffect(() => {
    if (!isOverlayMounted || !overlayContainer) return
    const overlay = mountSentinelOverlay({
      container: overlayContainer,
      sentinel: Sentinel,
      config: {
        consent: { enabled: true },
        sessionMonitor: { position: 'bottom-right' as const },
        theme: 'system' as const,
      },
    })

    const unsubscribe = sentinelWithWildcard.on('*', (eventName, payload) => {
      if (eventName === 'session:stateChanged') {
        setSessionState(payload as SessionState)
      }
      addLog(eventName, payload)
    })

    return () => {
      unsubscribe()
      overlay.unmount()
    }
  }, [isOverlayMounted, addLog])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(120,231,213,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(81,154,255,0.16),transparent_28%),linear-gradient(180deg,#07101d_0%,#0d1729_52%,#07101d_100%)] px-4 py-6 text-[#ebf1ff] sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <DevHero sessionState={sessionState} stateTone={stateTone} />

        <section className="grid items-start gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <ConfigPanel
            config={config}
            flags={{ canStart, canPause, canResume, canStop, canReset }}
            errorMessage={errorMessage}
            sessionState={sessionState}
            onConfigChange={updateConfig}
            actions={{
              onStart: () => void startSentinel(),
              onPause: pauseSentinel,
              onResume: () => void resumeSentinel(),
              onStop: stopSentinel,
              onReset: resetSentinel,
            }}
          />
          <StatePanel config={config} sessionState={sessionState} />
          <EventLogPanel logs={logs} onClearLogs={() => setLogs([])} />
        </section>
      </div>

      <div ref={el => { overlayContainer = el ?? undefined }} />
    </main>
  )
}
