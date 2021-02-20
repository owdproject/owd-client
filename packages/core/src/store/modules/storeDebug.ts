import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";

@Module
export default class DebugVuexModule extends VuexModule {
  private logs: string[] = []

  @Mutation
  LOG(txt: string) {
    const date = new Date

    let seconds = date.getSeconds().toString();
    if (seconds.length === 1) seconds = `0${seconds}`

    let minutes = date.getMinutes().toString();
    if (minutes.length === 1) minutes = `0${minutes}`

    let hour = date.getHours().toString();
    if (hour.length === 1) hour = `0${hour}`

    const time = `${hour}:${minutes}:${seconds}`

    const logText = `[${time}] ${txt}`

    console.log(logText)

    this.logs.unshift(logText)
  }
}