class User{
    private name:string;
    private password:string;

    constructor(name:string, password:string){
        this.name = name;
        this.password = password;
    }

    public getName():string{
        return this.name;
    }

    public getPassword():string{
        return this.password;
    }
}
