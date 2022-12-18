export default class ElementsFactory{
    public elements : Array<JSX.Element>;
    constructor(elementsList : Array<JSX.Element>){
        this.elements = elementsList;
    }

    public getRandom(){
        return this.elements[Math.floor(Math.random() * this.elements.length)];
    }

    public getAll(){
        return this.elements;
    }
}