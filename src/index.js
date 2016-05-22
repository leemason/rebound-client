"use strict"

import {Socket as engine} from 'engine.io-client';

import {EventEmitter} from 'events';

import {Channel} from './channel';

import {PresenceChannel} from './presencechannel';

export class Socket extends EventEmitter {

    constructor(path, csrf){
        super();

        this.socket = new engine(path);

        this.channels = {};

        //proxy connect calls to event system
        this.socket.on('connect', function(){
            this.emit('connect', this);
        }.bind(this));

        this.send({
            event: 'socket:csrf',
            data: {
                token: csrf
            },
            channel: null
        });

        //proxy close calls to event system
        this.socket.on('close', function(){
            this.emit('close', this);
        }.bind(this));

        //proxy message calls to event system after parsing json
        this.socket.on('message', function(data){
            data = JSON.parse(data);
            this.emit(data.event, data, this);
        }.bind(this));
    }

    subscribe(channel){
        this.channels[channel] = (this.channels.hasOwnProperty(channel)) ? this.channels[channel] : new Channel(channel, this);

        return this.channels[channel];
    }

    channel(channel){
        return this.subscribe(channel);
    }

    private(channel){
        return this.subscribe('private-' + channel);
    }

    presence(channel){

        channel = 'presence-' + channel;

        this.channels[channel] = (this.channels.hasOwnProperty(channel)) ? this.channels[channel] : new PresenceChannel(channel, this);

        return this.channels[channel];
    }

    join(channel){
        return this.presence(channel);
    }

    leave(channel){
            let channels = [channel, 'private-' + channel, 'presence-' + channel];

            channels.forEach(function(channelName){
                this.channel(channelName).leave();
            }.bind(this));
    }

    send(data){
        this.socket.send(JSON.stringify(data));
    }

    socketId(){
        return this.socket.id;
    }
}

export default Socket;