import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/defer';


let button = document.getElementById("button");

let click = Observable.fromEvent(button, "click");
let output = document.getElementById("output");

function loadWithFetch(url: string){
    //return Observable.fromPromise(fetch(url).then(r => r.json()));

    /*
        If we just have the above line even if someone calls "loadWithFetch(movies.json)" and doesn't subscribe to it it will still bring movies.
        [ movies.json still in network tab ]
        In order to stop that and make the call lazy we do as below. 
    */

    return Observable.defer(() => {
        return Observable.fromPromise(fetch(url).then(r => r.json()));
    });
}

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