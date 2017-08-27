/*Web Hypertext Application Technology
https://fetch.spec.whatwg.org/*/

import { load } from './loader';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/retry";
import "rxjs/add/operator/retryWhen";
import "rxjs/add/operator/scan";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/delay";

let output = document.getElementById("output");
let button = document.getElementById("button");

let click = Observable.fromEvent(button, "click");

function renderMovies(movies) {
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    });
}

//Flat map flattens out the inner observable
click.flatMap(e => load("moviess.json")) //change the url and make the request fail
//click.flatMap(e => load("movies.json"))
    .subscribe(
    renderMovies,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
    );


//load("movies.json"); //This will do nothing. Cause an observable doesn't do any calls until it's subscribed. This is one advantage of using observables