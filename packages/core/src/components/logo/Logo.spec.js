import { mount } from '@vue/test-utils'
import Logo from '@owd-client/core/src/components/logo/Logo.vue';

test('renders the default logo', () => {
  const wrapper = mount(Logo, {
    global: {
      config: {
        owd: {
          desktop: {
            Logo: {
              options: { enabled: true }
            }
          }
        }
      }
    }
  })

  expect(wrapper.text()).toBe('owd-client')
})