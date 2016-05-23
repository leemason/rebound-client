"use strict"

import {EventEmitter} from 'events';

export class Channel extends EventEmitter{

    constructor(channel, socket){

        super();

        this.connected = false;

        this.channel = channel;
        this.socket = socket;

        //register activation cb
        this.socket.on(channel + ':subscription_succeeded', function(data){
            this.connected = true;
            this.emit('connected', this);
        }.bind(this));

        //request activation
        this.connect();

        //register left cb
        this.socket.on(channel + ':left', function(data){
            this.connected = false;
            this.emit('disconnected', this);
        }.bind(this));
    }

    connect(){
        this.socket.send({event: 'subscribe', channel: this.channel});
    }

    connected(){
        return this.connected;
    }

    then(cb){
        //if connected run cb
        if(this.connected()){
            cb(this);
        }else{
            //else register callback on subscribed
            this.on('connected', cb);
        }
    }

    listen(event, orcb){

        var cb = function(data){
            if(data.event == event && data.channel == this.channel){
                orcb(data);
            }
        }.bind(this);

        this.socket.on(event, cb);
    }

    leave(){
        //request leave
        this.socket.send({event: 'leave', channel: this.channel});
    }
}

export default Channel;