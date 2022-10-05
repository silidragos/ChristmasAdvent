export default class GiftFactory{
    public elements : Array<any>;
    constructor(elementsList : Array<any>){
        this.elements = elementsList;
    }

    public getRandom(){
        return this.elements[Math.floor(Math.random() * this.elements.length)];
    }
}