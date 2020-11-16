import {VuexModule, Module, Mutation, Action, RegisterOptions} from "vuex-class-modules";
import axios from "axios";

const authDefaultUsername = 'guest'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL

interface StoreClientAccount {
  username: string;
  token: string;
}

@Module
export default class AuthModule extends VuexModule {
  private account: StoreClientAccount = {
    username: authDefaultUsername,
    token: ''
  }

  get loggedUser() {
    return this.account
  }

  @Mutation
  ACCOUNT_SET(account: StoreClientAccount) {
    this.account = account
  }

  @Mutation
  ACCOUNT_RESET() {
    this.account = {
      username: authDefaultUsername,
      token: ''
    }
  }

  /**
   * Login user
   * todo not implemented
   *
   * @param data
   * @returns {Promise<any>}
   */
  @Action
  login(data: { username: string, password: string }) {
    return new Promise((resolve, reject) => {
      axios
        .post(API_BASE_URL + 'auth/login', {
          username: data.username,
          password: data.password
        })
        .then(response => {
          this.ACCOUNT_SET({
            username: response.data.username,
            token: response.data.token
          })
          resolve(response.data)
        })
        .catch(() => {
          this.ACCOUNT_RESET()
          reject()
        })
    })
  }

  /**
   * Check user token
   * todo not implemented
   *
   * @param data
   * @returns {Promise<any>}
   */
  @Action
  checkToken({}) {
    return new Promise((resolve, reject) => {
      axios
        .post(API_BASE_URL + 'auth/check', { token: this.account.token })
        .then(() => resolve())
        .catch(() => {
          this.ACCOUNT_RESET()
          reject()
        })
    })
  }

  /**
   * Logout
   */
  @Action
  logout() {
    this.ACCOUNT_RESET()
  }
}
