import type { PublicEvents } from '@testpress/sentinel-core'

export interface DemoConfig {
  orgCode: string
  sessionId: string
  token: string
  apiBaseURL: string
}

export interface LogEntry {
  id: number
  event: string
  timestamp: string
  detail: string
}

export type EventName = keyof PublicEvents

export type WildcardSentinel = {
  on(
    type: '*',
    handler: (
      ...args: {
        [TEvent in EventName]: [type: TEvent, event: PublicEvents[TEvent]]
      }[EventName]
    ) => void,
  ): () => void
}
