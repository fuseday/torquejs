import handler from './responseHandler'

const torque = {
    /*
     * Get a nested property from an object, in a secure way, with dot notation string.
     * Ie: getSafe(obj, 'level.anotherLevel.propertyName')
     */
    getSafe(object, dotNotationString) {
        return dotNotationString.split('.').reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, object)
    },
}
window.Torque = torque
export { torque }
export default torque
