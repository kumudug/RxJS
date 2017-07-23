import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import "rxjs/add/operator/mergeMap";

let output = document.getElementById("output");
let button = document.getElementById("button");

let click = Observable.fromEvent(button, "click");

function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("load", () => {
            let data = JSON.parse(xhr.responseText);
            observer.next(data);
            //We can complete the observer cause we aren't expecting to receive any more data
            observer.complete();
        });

        xhr.open("GET", url);
        xhr.send();
    });
}

function renderMovies(movies) {
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    });
}

//Flat map flattens out the inner observable
click.flatMap(e => load("movies.json"))
    .subscribe(
    renderMovies,
    e => e.console.log(`error: ${e}`),
    () => console.log("complete")
    );


load("movies.json"); //This will do nothing. Cause an observable doesn't do any calls until it's subscribed. This is one advantage of using observables