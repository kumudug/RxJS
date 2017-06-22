//import {Observable, Observer} from "rxjs";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import './mouse_events'

let numbers = [ 1, 5, 10 ];
let source = Observable.from(numbers);

class MyObserver {

    next(value){
        console.log(`value: ${value}`);
    }

    error(e){
        console.log(`error: ${e}`);
    }

    complete(){
        console.log(`complete`);
    }
}

class MyObserver2 implements Observer<number> {

    next(value){
        console.log(`value: ${value}`);
    }

    error(e){
        console.log(`error: ${e}`);
    }

    complete(){
        console.log(`complete`);
    }
}

source.subscribe(new MyObserver());
source.subscribe(new MyObserver2());
source.subscribe(
    value => console.log(`value: ${value}`),
    e => console.log(`error: ${e}`),
    () => console.log(`complete`)
);

console.log(`Using Observable.create function`);

let source2 = Observable.create(observer => {
    for(let n of numbers){

        if(n===5){
            observer.error(`Something went wrong!`);
        }

        observer.next(n);
    }

    observer.complete();
});
source2.subscribe(new MyObserver());

let source3 = Observable.create(observer => {
    let index = 0;
    let produceValue = () => {
        observer.next(numbers[index++]);

        if(index < numbers.length){
            setTimeout(produceValue, 2000);
        }
        else{
            observer.complete();
        }
    }

    produceValue();
});
console.log(`With delay`);
source3.subscribe(
    value => console.log(`value: ${value}`),
    e => console.log(`error: ${e}`),
    () => console.log(`complete`)
);



let source4 = Observable.create(observer => {
    let index = 0;
    let produceValue = () => {
        observer.next(numbers[index++]);

        if(index < numbers.length){
            setTimeout(produceValue, 2000);
        }
        else{
            observer.complete();
        }
    }

    produceValue();
}).map(n => n * 2)
.filter(n => n > 4);

console.log(`With map and filter`);
source4.subscribe(
    value => console.log(`value after map: ${value}`),
    e => console.log(`error: ${e}`),
    () => console.log(`complete`)
);