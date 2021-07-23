import Torque from './../src/Torque'

declare module 'vue/types/vue' {
    interface Vue {
        $torque: Torque
    }
}
