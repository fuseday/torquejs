const eventHandler = {
    handle(event) {
        if (event.type === 'BusEvent') {
            window.EventBus.$emit(event.name, event.payload)
        }
    },
}

export { eventHandler }
export default eventHandler
