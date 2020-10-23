import store from '../store'

export default {
  methods: {
    onSseEvent(eventName, cb) {
      store.subscribe((mutation) => {
        if (mutation.type === 'core/sse/LOG_EVENT') {
          const event = mutation.payload

          if (eventName === event.name) {
            if (typeof cb === 'function') cb(event.data)
          }
        }
      })
    }
  }
}
