import Vue from 'vue'

/**
 * Handling nested state with dot notation strings
 *
 * Props: https://jasonwatmore.com/post/2018/09/10/vuejs-set-get-delete-reactive-nested-object-properties
 */
export default {
    setProp (obj, props, value) {
        const prop = props.shift()
        if (!obj[prop]) {
            Vue.set(obj, prop, {})
        }
        if (!props.length) {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                obj[prop] = { ...obj[prop], ...value }
            } else {
                obj[prop] = value
            }
            return
        }
        this.setProp(obj[prop], props, value)
    },

    getProp (obj, props) {
        const prop = props.shift()
        if (!obj[prop] || !props.length) {
            return obj[prop]
        }
        return this.getProp(obj[prop], props)
    },

    deleteProp (obj, props) {
        const prop = props.shift()
        if (!obj[prop]) {
            return
        }
        if (!props.length) {
            Vue.delete(obj, prop)
            return
        }
        deleteProp(obj[prop], props)
    },
}
