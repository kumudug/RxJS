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

function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("load", () => {
            if (xhr.status == 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                //We can complete the observer cause we aren't expecting to receive any more data
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        });

        xhr.open("GET", url);
        xhr.send();
        //Retrying when the call fails
        //}).retry(3);
    }).retryWhen(retryStrategy({ attempts: 3, delay: 1500 }));
}

function retryStrategy({attempts = 4, delay = 1000}) {
    //This gets the error being passed from the observable. In this instance it's the "xhr.statusText"
    return function (errors) {
        return errors.
            scan((acc, value) => {
                console.log(acc, value);
                return acc + 1;
            }, 0)//0 is the starting number of accuminator (acc)
            .takeWhile(acc => acc < attempts) //Retry until accumilator is less than attempts.
            .delay(delay); //delay each call by 1 second
    }
}

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