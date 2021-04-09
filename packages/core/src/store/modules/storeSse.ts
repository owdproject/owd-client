import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";

let reconnectTimeout: any = null

@Module
export default class SseVuexModule extends VuexModule {
  private eventSource: any = null

  private connected: boolean = false

  @Mutation
  SET_CONNECTED(value: boolean) {
    this.connected = value
  }

  @Mutation
  LOG_EVENT(value: any) {}

  @Action
  connect() {
    if (this.connected) {
      return console.error('[OWD] Already connected to SSE')
    }

    const sse = new EventSource(process.env.VUE_APP_API_BASE_URL + 'sse')

    sse.onerror = () => {
      // reset connected status
      if (this.connected) {
        this.SET_CONNECTED(false)
      }

      sse.close()

      // reconnect after X seconds
      clearTimeout(reconnectTimeout)
      reconnectTimeout = setTimeout(() => this.connect(), 5000)
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
  }
}
