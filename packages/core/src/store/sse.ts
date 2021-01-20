import {VuexModule, Module, Mutation, Action, RegisterOptions} from "vuex-class-modules";

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
    const sse = new EventSource(process.env.VUE_APP_API_BASE_URL + 'sse')

    sse.onerror = () => {
      if (this.connected) {
        this.SET_CONNECTED(false)
      }

      console.error('Unable to connect to sse')

      sse.close()

      clearInterval(this.intervalReconnect)
      this.intervalReconnect = setInterval(() => this.connect(), 5000)
    }

    sse.onmessage = (message) => {
      clearInterval(this.intervalReconnect)

      if (!this.connected) {
        this.SET_CONNECTED(true)
      }

      const data: any = JSON.parse(message.data)

      if (Array.isArray(data)) {
        data.forEach((event) => this.LOG_EVENT(event))
      } else {
        this.LOG_EVENT(data)
      }
    }
  }
}
