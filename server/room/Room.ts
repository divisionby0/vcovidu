class Room{
    private name:string;
    private sessionName:string;

    constructor(name:string, sessionName:string){
        this.name = name;
        this.sessionName = sessionName;

        console.log("new Room name="+this.name+"  sessionName="+this.sessionName);
    }
}
export = Room;