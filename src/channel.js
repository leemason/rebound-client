"use strict"

import {EventEmitter} from 'events';

export class Channel extends EventEmitter{

    /**
     * Create a new class instance.
     */
    constructor(channel, socket){

        super();

        this._connected = false;

        this.channel = channel;
        this.socket = socket;

        //register activation cb
        this.socket.on(channel + ':subscription_succeeded', function(data){
            this._connected = true;
            this.emit('connected', this);
        }.bind(this));

        //request activation
        this.connect();

        //register left cb
        this.socket.on(channel + ':left', function(data){
            this._connected = false;
            this.emit('disconnected', this);
        }.bind(this));
    }

    /**
     * Connect if left.
     */
    connect(){
        if(!this.connected()){
            this.socket.send({event: 'subscribe', channel: this.channel});
        }
    }

    /**
     * Return connected status
     */
    connected(){
        return this._connected;
    }

    /**
     * Register a callback to be called on successfully joining the channel.
     */
    then(cb){
        //if connected run cb
        if(this.connected()){
            cb(this);
        }else{
            //else register callback on subscribed
            this.on('connected', cb);
        }
    }

    /**
     * Listen for an event on the channel instance.
     */
    listen(event, orcb){

        event = this.socket.formatter.format(event);

        var cb = function(data){
            if(data.event == event && data.channel == this.channel){
                orcb(data);
            }
        }.bind(this);

        this.socket.on(event, cb);
    }

    /**
     * Leave channel.
     */
    leave(){
        //request leave
        this.socket.send({event: 'leave', channel: this.channel});
    }
}

export default Channel;