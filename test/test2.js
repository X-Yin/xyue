function MyButton(name, age) {
    this.name = name;
    this.age = age;
    this.Ctor = this.constructor;
}

MyButton.base = 'what';

const myButton = new MyButton('jack', 30);
console.log(myButton.Ctor.base);