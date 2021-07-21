import Vue from 'vue'
import torque from './core'
import handler from "./core/responseHandler";
const version = require('./../package.json').version

const install = Vue => Vue.prototype.$torque = torque

const plugin = { install, version }

const mixinObj = {
    methods: {
        //Backend for frontend
        $bff(entrypoint, payload, callback) {
            return window.axios
                .post(`/_torque/message/${entrypoint}`, payload)
                .then(response => {
                    if (handler.mustStopHandling(response)) {
                        return response
                    }
                    return handler.jumper(this, response)
                })
                .catch(error => {
                    if (handler.mustStopHandlingError(error)) {
                        return error
                    }
                    return handler.jumperError(this, error)
                })
        },
    }
}

Vue.mixin(mixinObj)

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin)
    window.Vue.mixin(mixinObj)
}
