import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";

@Module
export default class SseVuexModule extends VuexModule {
  private eventSource: any = null
  private intervalReconnect: any = null

  private connected: boolean = true

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

      console.error('[OWD] Unable to connect to SSE')

      sse.close()

      // reconnect after X seconds
      clearInterval(this.intervalReconnect)
      this.intervalReconnect = setInterval(() => this.connect(), 5000)
    }

    sse.onmessage = (message) => {
      clearInterval(this.intervalReconnect)

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
