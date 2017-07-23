import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';

let circle = document.getElementById("circle");
let button = document.getElementById("button");
let output = document.getElementById("output");

let source = Observable.fromEvent(document, "mousemove")
                        .map((e : MouseEvent) => {
                            return {
                                x: e.clientX,
                                y: e.clientY
                            }
                        })
                        .filter(value => value.x < 500)
                        .delay(300);

let click = Observable.fromEvent(button, "click");

function onNext(value){
    circle.style.left = value.x;
    circle.style.top = value.y;
}

function load(url: string){
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => {
        let movies = JSON.parse(xhr.responseText);
        movies.forEach(m => {
            let div = document.createElement("div");
            div.innerText = m.title;
            output.appendChild(div);
        });
    });
}

source.subscribe(
    //value => console.log(value),
    onNext,
    e => console.log(`error: ${e}`),
    () => console.log("Complete")
);

click.subscribe(
    e => load("movies.json"),
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);