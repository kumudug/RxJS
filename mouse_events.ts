import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';


let source = Observable.fromEvent(document, "mousemove");

source.subscribe(
    value => console.log(value),
    e => console.log(`error: ${e}`),
    () => console.log("Complete")
);