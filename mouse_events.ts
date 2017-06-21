import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

let source = Observable.fromEvent(document, "mousemove")
                        .map((e : MouseEvent) => {
                            return {
                                x: e.clientX,
                                y: e.clientY
                            }
                        })
                        .filter(value => value.x < 500);


source.subscribe(
    value => console.log(value),
    e => console.log(`error: ${e}`),
    () => console.log("Complete")
);