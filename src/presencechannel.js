"use strict"

import {Channel} from './channel';

export class PresenceChannel extends Channel{

    constructor(channel, socket){

        super(channel, socket);

        this._members = {};

        //register members cb
        this.socket.on(channel + ':member_added', function(data){
            this._members = data.members;
        }.bind(this));

        this.socket.on(channel + ':member_removed', function(data){
            this._members = data.members;
        }.bind(this));
    }

    members(){
        return this._members;
    }

    joining(callback){
        this.socket.on(this.channel + ':member_added', function(data){
            callback(data.members, this);
        }.bind(this));
    }

    leaving(callback){
        this.socket.on(this.channel + ':member_removed', function(data){
            callback(data.members, this);
        }.bind(this));
    }
}

export default PresenceChannel;