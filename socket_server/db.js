class UserManager {
    constructor() {
        this.users = new Map();
        this.sessionInfos = new Map();
        
        //this.users_name_wise = new Map()
    }

    addUser(userId, userInfo) {
        this.users.set(userId, userInfo);
       
    }

    removeUser(userId) {
        this.users.delete(userId);
    
    }

    getAllUsers() {
        return [...this.users.entries()]; // Returns an array of [key, value] pairs
    }

    getUser(userId) {
        return this.users.get(userId);
    }

    
    getSession(sessionId) {
        return this.sessionInfos.get(sessionId);
    }

    setSession(sessionId, userInfo) {
        this.sessionInfos.set(sessionId, userInfo);
    }
    
    removeSession(sessionId){
        this.sessionInfos.delete(sessionId)
    }

    getAllSessions() {
        return [...this.sessionInfos.entries()]; 
    }


}

module.exports = {
    UserManager

}