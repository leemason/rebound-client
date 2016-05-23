"use strict"

export class EventFormatter {

    /**
     * Create a new class instance.
     */
    constructor(namespace){
        this.namespace = namespace;
    }

    /**
     * Format the given event name.
     */
    format(event)
    {
        if (event.charAt(0) != '\\') {
            event = this.namespace + '.' + event;
        } else {
            event = event.substr(1);
        }

        return event.replace(/\./g, '\\');
    }
}

export default EventFormatter;