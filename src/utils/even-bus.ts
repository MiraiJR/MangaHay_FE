const EventBus = {

  $on (eventType: any, callback: any) {
    document.addEventListener(eventType, (ev) => callback(ev.detail))
  },

  $dispatch (eventType: any, data: any) {
    const event = new CustomEvent(eventType, { detail: data })
    document.dispatchEvent(event)
  },

  $remove (eventType: any, callback: any) {
    document.removeEventListener(eventType, callback)
  }
}
export default EventBus