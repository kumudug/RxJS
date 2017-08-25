import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/onErrorResumeNext';
import 'rxjs/add/operator/catch';

let source = Observable.create(observer => {
    observer.next(1);
    observer.next(2);
    observer.error("Stop!"); //It won't go beyond this point
    observer.next(3);
    observer.complete();
});

let source2 = Observable.merge(
    Observable.of(1),
    Observable.from([2,3,4]),
    Observable.throw(new Error("Stop!")), //It won't go beyond this point
    Observable.of(5)
);

let source3 = Observable.onErrorResumeNext(
    Observable.of(1),
    Observable.from([2,3,4]),
    Observable.throw(new Error("Stop!")), //It will keep going
    Observable.of(5)
);

let source4 = Observable.merge(
    Observable.of(1),
    Observable.from([2,3,4]),
    Observable.throw(new Error("Stop!")), //It will keep going
    Observable.of(5)
).catch(e => {
    console.log(`cauthing: ${e}`);
    return Observable.of(10);
});

class MyObserver {

    next(value) {
        console.log(`HandlingErrors - value: ${value}`);
    }

    error(error) {
        console.log(`HandlingErrors - error: ${error}`);
    }

    complete() {
        console.log(`complete`);
    }
}

source.subscribe(new MyObserver()
    /*value => console.log(`HandlingErrors - value: ${value}`),
    error => console.error(`HandlingErrors - error: ${error}`),
    () => console.log("complete")*/
);

source2.subscribe(new MyObserver());
source3.subscribe(new MyObserver());
source4.subscribe(new MyObserver());