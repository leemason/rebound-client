"use strict"

export class Members{

    constructor(members, id){
        this._members = members;

        this.count = Object.keys(members).length;

        this.me = this.findMe(id);
    }

    each(callback){
        for(let id in this._members){
            callback(this._members[id]);
        }
    }

    get(id){
        return this._members[id];
    }

    findMe(id){
        //loop members and find socket id
        for(let memberId in this._members){
            if(this._members.hasOwnProperty(memberId)){
                if(this._members[memberId].socket_ids.indexOf(id) != -1){
                    return this._members[memberId];
                }
            }
        }
    }

}

export default Members;