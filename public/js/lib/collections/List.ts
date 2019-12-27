/// <reference path="iterators/ListIterator.ts"/>
class List<T> {
    private id:string;
    private items: Array<T>;


    constructor(id) {
        if(id){
            this.id = id;
        }
        this.items = [];
    }

    size(): number {
        return this.items.length;
    }

    add(value: T): void {
        this.items.push(value);
    }

    get(index: number): T {
        return this.items[index];
    }
    remove(index: number):void{
        this.items.splice(index,1);
    }
    clear():void{
        this.items = [];
    }
    getIterator():ListIterator{
        return new ListIterator(this);
    }
    setId(id:string):void{
        this.id = id;
    }
    getId():string{
        return this.id;
    }
}
