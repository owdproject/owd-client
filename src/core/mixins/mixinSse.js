export default {
  methods: {
    onSseEvent(eventName, cb) {
      this.$store.subscribe((mutation) => {
        if (mutation.type === 'core/sse/EVENT_LOG') {
          const event = mutation.payload;

          if (eventName === event.name) {
            if (typeof cb === 'function') cb(event.data);
          }
        }
      });
    }
  }
};
