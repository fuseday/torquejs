import handler from './responseHandler'

const torque = {
    /*
     * Get a nested property from an object, in a secure way, with dot notation string.
     * Ie: getSafe(obj, 'level.anotherLevel.propertyName')
     */
    getSafe(object, dotNotationString) {
        return dotNotationString.split('.').reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, object)
    },

    bff(component, entrypoint, payload) {
        return window.axios
            .post(`/_torque/message/${entrypoint}`, payload)
            .then(response => {
                if (handler.mustStopHandling(response)) {
                    return response
                }
                return handler.jumper(component, response)
            })
            .catch(error => {
                if (handler.mustStopHandlingError(error)) {
                    return error
                }
                return handler.jumperError(component, error)
            })
    },

}
window.Torque = torque
export { torque }
export default torque
