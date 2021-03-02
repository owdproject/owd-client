import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'

import App from './App.vue'
import PageIndex from './pages/main/Index.vue'
import Logo from "@owd-client/core/src/components/logo/Logo";

describe('App.vue', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        core: {
          namespaced: true,
          modules: {
            client: {
              namespaced: true,
              modules: {
                state: {
                  title: 'lol'
                }
              }
            }
          }
        }
      }
    })
  })

  it('logo contains owd-client', () => {
    const wrapper = shallowMount(App, {
      store,
      stubs: {
        'router-view': PageIndex,
        'logo': Logo
      }
    })

    expect(wrapper.findComponent(Logo).html()).toContain('owd-client')
  })
})