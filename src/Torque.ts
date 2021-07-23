// @ts-nocheck
import torque from "./core";
import Vue from "vue"
const version = require('./../package.json').version

class Torque {

    static _instance = null;
    static get instance() {
        return Torque._instance || (Torque._instance = new Torque())
    }

    constructor() {}

    plugin({ mixin = true } = {}) {
        if (mixin) {
            this.installMixin()
        }
        return {
            install(Vue) {
                /**
                 * @type {Torque}
                 */
                Vue.prototype.$torque = Torque.instance
            },
            version,
        }
    }

    installMixin() {
        const mixinObj = {
            methods: {
                $backend(entrypoint, payload) {
                    return torque.bff(this, entrypoint, payload)
                },
            }
        }
        Vue.mixin(mixinObj)
    }

    bff(component, entrypoint, payload) {
        return torque.bff(component, entrypoint, payload)
    }

}

export default Torque
