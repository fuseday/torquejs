// @ts-nocheck
/** https://www.npmjs.com/package/flat */
const flat = require('flat');
import dd from './dd'
import nesting from './nesting'
import Vue from 'vue'
import eventHandler from './eventHandler'

const responseHandler = {

    jumper(component, response) {
        this.response = response
        this.component = component

        this.handleJumperState()
        this.handleJumperToasts()
        this.handleJumperValidator()
        this.handleJumperEvents()
        // TODO: handle => store()
        // TODO: handle => storeGlobal()
        // TODO: handle => eventGlobal()
        // TODO: handle => callback()

        return response
    },

    jumperError(component, error) {
        this.component = component
        this.error = error
        console.log(this.response);
        dd.showHtmlModal(this.response.data)
        if (error.response && error.response.status === 422) {
            Vue.set(this.component, 'errors', error.response.data.errors)
        }
    },

    handleJumperState() {
        if (typeof this.response.data['state'] !== 'object') {
            return
        }
        const flattenedState = flat(this.response.data.state)
        for (let key in flattenedState) {
            nesting.setProp(this.component, key.split('.'), flattenedState[key])
        }
    },

    handleJumperEvents() {
        if (typeof this.response.data['events'] !== 'object') {
            return
        }
        for(let event of this.response.data['events']) {
            eventHandler.handle(event)
        }
    },

    mustStopHandling(response) {
        this.response = response
        if (this.isCsrfTokenExpired() || this.needsDieDump()) {
            return true
        }
    },

    needsDieDump() {
        if (dd.isOutputFromDump(this.response.data) || this.response.status >= 400) {
            dd.showHtmlModal(this.response.data)
        }
    },

    mustStopHandlingError(error) {
        this.error = error
        this.response = error.response
        if (this.response && typeof this.response === 'object' && this.isCsrfTokenExpired()) {
            return true
        }
    },

    isCsrfTokenExpired() {
        if (this.response.status === 419) {
            // TODO implement a customizable way, i.e. a callback
            confirm(
                'This page has expired due to inactivity.\n'
                + 'Would you like to refresh the page?'
            ) && window.location.reload()
            return true
        }
    },

    handleJumperToasts() {
        if (typeof this.response.data['toasts'] !== 'object') {
            return
        }
        for (let toast of this.response.data['toasts']) {
            window.EventBus.$emit('notify',
                {
                    message: {
                        text: toast.message,
                        icon: toast.icon,
                    },
                    color: toast.color
                }
            )
        }
    },

    handleJumperValidator() {
        const validator = this.response.data['validator']
        if (typeof validator !== 'object' || Array.isArray(validator) && ! validator.length) {
            return
        }
        Vue.set(this.component, 'errors', validator.errors)
    },
}

export default responseHandler
