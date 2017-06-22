import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';

let circle = document.getElementById("circle");

let source = Observable.fromEvent(document, "mousemove")
                        .map((e : MouseEvent) => {
                            return {
                                x: e.clientX,
                                y: e.clientY
                            }
                        })
                        .filter(value => value.x < 500)
                        .delay(300);

function onNext(value){
    circle.style.left = value.x;
    circle.style.top = value.y;
}

source.subscribe(
    //value => console.log(value),
    onNext,
    e => console.log(`error: ${e}`),
    () => console.log("Complete")
);