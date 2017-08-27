import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/defer';

import { loadWithFetch } from './loader';

let button = document.getElementById("button");

let click = Observable.fromEvent(button, "click");
let output = document.getElementById("output");

function renderMovies(movies) {

    let div = document.createElement("div");
    div.innerText = 'Loading with Fetch';
    output.appendChild(div);

    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    });
}

//Flat map flattens out the inner observable
click.flatMap(e => loadWithFetch("movies.json")) 
//click.flatMap(e => load("movies.json"))
    .subscribe(
    renderMovies,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
    );

loadWithFetch("movies.json");