"use strict"

import {Channel} from './channel';

import {Members} from './members';

export class PresenceChannel extends Channel{

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

    joining(callback){
        this.on('member_added', function(member, members, channel){
            callback(member, members, this);
        }.bind(this));
    }

    leaving(callback){
        this.on('member_removed', function(member, members, channel){
            callback(member, members, this);
        }.bind(this));
    }

    here(callback){
        let cb = function(member, members, channel){
            callback(member, members, channel);
        }
        this.joining(cb);
        this.leaving(cb);
    }
}

export default PresenceChannel;