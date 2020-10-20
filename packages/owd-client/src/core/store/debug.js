export default {
  namespaced: true,

  state: {
    logs: []
  },

  mutations: {
    LOG(state, txt) {
      const date = new Date

      let seconds = date.getSeconds(); if (seconds.length === 1) seconds = `0${seconds}`
      let minutes = date.getMinutes(); if (minutes.length === 1) minutes = `0${minutes}`
      let hour = date.getHours(); if (hour.length === 1) hour = `0${hour}`

      const time = `${hour}:${minutes}:${seconds}`

      state.logs.unshift(`[${time}] ${txt}`)
    }
  }
}