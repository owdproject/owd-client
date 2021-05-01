import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";

let reconnectTimeout: any = null

// @ts-ignore
import config from '@/../client.config'

@Module
export default class SseVuexModule extends VuexModule {
  private eventSource: any = null
  private connected: boolean = false

  @Mutation
  SET_EVENT_SOURCE(eventSource: any) {
    this.eventSource = eventSource
  }

  @Mutation
  SET_CONNECTED(value: boolean) {
    this.connected = value
  }

  @Mutation
  LOG_EVENT(value: any) {}

  @Action
  initialize() {
    this.connect()
  }

  @Action
  connect() {
    if (!config.sse.enabled) {
      return console.error(`[OWD] SSE isn't enabled by configuration`)
    }

    if (this.connected) {
      return console.error('[OWD] Already connected to SSE')
    }

    const sse = new EventSource(config.sse.server)

    sse.onerror = () => {
      // reset connected status
      if (this.connected) {
        this.SET_CONNECTED(false)
      }

      sse.close()

      // reconnect after X seconds
      if (config.sse.reconnectOnError) {
        clearTimeout(reconnectTimeout)
        reconnectTimeout = setTimeout(() => this.connect(), config.sse.reconnectTimeout | 2000)
      }
    }

    sse.onmessage = (message) => {
      clearTimeout(reconnectTimeout)

      // set as connected
      if (!this.connected) {
        this.SET_CONNECTED(true)
      }

      const data: any = JSON.parse(message.data)

      // log each event using a mutation
      if (Array.isArray(data)) {
        data.forEach((event) => this.LOG_EVENT(event))
      } else {
        this.LOG_EVENT(data)
      }
    }

    this.SET_EVENT_SOURCE(sse)
  }

  @Action
  disconnect() {
    if (this.eventSource && this.connected) {
      this.eventSource.close()
      this.SET_CONNECTED(false)
    }
  }
}
