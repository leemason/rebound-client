"use strict"

import {Socket as engine} from 'engine.io-client';

import {EventEmitter} from 'events';

import {Channel} from './channel';

import {PresenceChannel} from './presencechannel';

import {EventFormatter} from './eventformatter';

export class Socket extends EventEmitter {

    /**
     * Create a new class instance.
     */
    constructor(path, opts){
        super();

        if('object' == typeof path){
            path.path = '/rebound';
        }else{
            opts = opts || {};
            opts.path = '/rebound';
        }

        this.csrf = (opts.hasOwnProperty('csrf')) ? opts.csrf : this.csrfToken();

        this.socket = new engine(path, opts);

        this.formatter = new EventFormatter('App.Events');

        this.channels = {};

        this._connected = false;

        //proxy connect calls to event system
        this.socket.on('connect', function(){
            this.emit('connect', this);
        }.bind(this));

        this.send({
            event: 'socket:csrf',
            data: {
                token: this.csrf
            },
            channel: null
        });

        this.on('socket:csrf:saved', function(data){
            //were ready to go
            this._connected = true;
            this.emit('connected', this);
        }.bind(this));

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

    /**
     * Extract the CSRF token from the page.
     */
    csrfToken() {
        var selector = document.querySelector(
            'meta[name="csrf-token"]'
        );

        if ( ! selector) {
            return null;
        } else {
            return selector.getAttribute('content');
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
     * Listen for an event on a channel instance.
     */
    subscribe(channel){
        this.channels[channel] = (this.channels.hasOwnProperty(channel)) ? this.channels[channel] : new Channel(channel, this);

        return this.channels[channel];
    }

    /**
     * Get a channel instance by name.
     */
    channel(channel){
        return this.subscribe(channel);
    }

    /**
     * Get a private channel instance by name.
     */
    private(channel){
        return this.subscribe('private-' + channel);
    }

    /**
     * Get a presence channel instance by name.
     */
    presence(channel){

        channel = 'presence-' + channel;

        this.channels[channel] = (this.channels.hasOwnProperty(channel)) ? this.channels[channel] : new PresenceChannel(channel, this);

        return this.channels[channel];
    }

    /**
     * Get a presence channel instance by name.
     */
    join(channel){
        return this.presence(channel);
    }

    /**
     * Leave the given channel.
     */
    leave(channel){
            let channels = [channel, 'private-' + channel, 'presence-' + channel];

            channels.forEach(function(channelName){
                this.channel(channelName).leave();
            }.bind(this));
    }

    send(data){
        this.socket.send(JSON.stringify(data));
    }

    /**
     * Get the Socket ID for the connection.
     */
    socketId(){
        return this.socket.id;
    }

    /**
     * Set the default event namespace.
     */
    namespace(value)
    {
        this.formatter = new EventFormatter(value);
    }
}

export default Socket;