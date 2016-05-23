"use strict"

export class Members{

    /**
     * Create a new class instance.
     */
    constructor(members, id){
        this._members = members;

        this.count = Object.keys(members).length;

        this.me = this.findMe(id);
    }

    /**
     * Loop each member and pass to callback.
     */
    each(callback){
        for(let id in this._members){
            callback(this._members[id]);
        }
    }

    /**
     * Get member by id.
     */
    get(id){
        return this._members[id];
    }

    /**
     * Set the .me property by matching the socket id against the members list.
     */
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