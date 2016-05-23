"use strict"

import {Channel} from './channel';

import {Members} from './members';

export class PresenceChannel extends Channel{

    /**
     * Create a new class instance.
     */
    constructor(channel, socket){

        super(channel, socket);

        this.members = new Members({}, socket.socketId());

        //register members cb
        this.socket.on(channel + ':member_added', function(data){
            this.members = new Members(data.members, this.socket.socketId());
            this.emit('member_added', data.member, this.members, this);
        }.bind(this));

        this.socket.on(channel + ':member_removed', function(data){
            this.members = new Members(data.members, this.socket.socketId());
            this.emit('member_removed', data.member, this.members, this);
        }.bind(this));
    }

    /**
     * Listen for someone joining the channel.
     */
    joining(callback){
        this.on('member_added', function(member, members, channel){
            callback(member, members, this);
        }.bind(this));
    }

    /**
     * Listen for someone leaving the channel.
     */
    leaving(callback){
        this.on('member_removed', function(member, members, channel){
            callback(member, members, this);
        }.bind(this));
    }

    /**
     * Register a callback to be called anytime the member list changes.
     */
    here(callback){
        this.joining(callback);
        this.leaving(callback);
    }
}

export default PresenceChannel;