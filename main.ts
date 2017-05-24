import {Observable, Observer} from "rxjs";

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