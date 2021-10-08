import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";
import {OwdEvent, OwdEventConfig, OwdEvents} from "@owd-client/types";

// @ts-ignore
import config from '/@/../client.config'

const reconnectTimeout: { [key: string]: ReturnType<typeof setTimeout> } = {}

@Module
export default class StoreSse extends VuexModule {
  private events: OwdEvents = {}

  @Mutation
  SET_EVENT(data: OwdEvent) {
    this.events[data.name] = data
  }

  @Mutation
  SET_CONNECTED(data: {name: string, value: boolean }) {
    this.events[data.name].connected = data.value
  }

  @Mutation
  LOG_EVENT(value: any) {}

  @Action
  initialize() {
    if (config.sse.enabled) {
      this.connect()
    }
  }

  @Action
  connect(event: string|OwdEventConfig = 'default') {
    // is sse globally enabled?
    if (!config.sse.enabled) {
      if (debug) console.error(`[owd] SSE integration is disabled by configuration`)

      return false
    }

    // define sse event config
    const eventConfig: OwdEventConfig = {
      name: (typeof event === 'string' ? event : event.name),
      url: '/api/sse',
      reconnectOnError: (typeof event === 'string' ? false : event.reconnectOnError),
      reconnectTimeout: (typeof event === 'string' ? config.sse.reconnectTimeout : event.reconnectTimeout)
    }

    // check if already to this sse
    if (Object.prototype.hasOwnProperty.call(this.events, eventConfig.name) && this.events[eventConfig.name].connected) {
      return console.error('[owd] already connected to this SSE: ' + eventConfig.name)
    }

    // overwrite sse url if provided by event param
    if (typeof event === 'object' && Object.prototype.hasOwnProperty.call(event, 'url')) {
      eventConfig.url = event.url
    } else {
      if (eventConfig.name !== 'default') {
        eventConfig.url += eventConfig.name
      }
    }

    const eventInstance: OwdEvent = {
      ...eventConfig,
      source: new EventSource(eventConfig.url),
      connected: false
    }

    // assign sse to vuex
    this.SET_EVENT(eventInstance)

    eventInstance.source.onerror = () => {
      // set sse disconnected
      if (this.events[eventConfig.name].connected) {
        this.SET_CONNECTED({name: eventConfig.name, value: false})
      }

      eventInstance.source.close()

      // reconnect after X seconds
      if (eventInstance.reconnectOnError) {
        clearTimeout(reconnectTimeout[eventConfig.name])

        reconnectTimeout[eventConfig.name] = setTimeout(() => this.connect(), config.sse.reconnectTimeout | 2000)
      }
    }

    eventInstance.source.onmessage = (message) => {
      clearTimeout(reconnectTimeout[eventConfig.name])

      // set sse connected
      if (!this.events[eventConfig.name].connected) {
        this.SET_CONNECTED({name: eventConfig.name, value: true})
      }

      const data: any = JSON.parse(message.data)

      // log each event using a mutation
      if (Array.isArray(data)) {
        data.forEach((event) => this.LOG_EVENT(event))
      } else {
        this.LOG_EVENT(data)
      }
    }
  }

  @Action
  disconnect(event: string|OwdEventConfig = 'default') {
    const eventName: string = (typeof event === 'string' ? event : event.name)

    if (Object.prototype.hasOwnProperty.call(this.events, eventName) && this.events[eventName].connected) {
      this.events[eventName].source.close()

      // set sse disconnected
      this.SET_CONNECTED({name: eventName, value: false})
    }
  }
}
