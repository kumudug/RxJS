import { Observable } from "rxjs/Observable";

let button = document.getElementById("button");
let output = document.getElementById("output");
let click = Observable.fromEvent(button, "click");

function loadWithFetch(url: string) {
    //return Observable.fromPromise(fetch(url).then(r => r.json()));

    /*
        If we just have the above line even if someone calls "loadWithFetch(movies.json)" and doesn't subscribe to it it will still bring movies.
        [ movies.json still in network tab ]
        In order to stop that and make the call lazy we do as below. 
    */

    return Observable.defer(() => {
        return Observable.fromPromise(fetch(url).then(r => {
            if (r.status === 200) {
                return r.json();
            } else {
                return Promise.reject(r);
            }
        }))//.retryWhen(retryStrategy()); //if retry is here the network request won't go on. it will just retry the resolve part of the observable
    }).retryWhen(retryStrategy()); //this will send more network requests
}

/*
In this function it will retry the number of attemtps and the takeWhile will keep producing an observable for those number of attempts
This will make the observable end without an error. This will not propagate an error to the subscriber
*/
export function retryStrategy({attempts = 4, delay = 1000} = {}) {
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

export function retryStrategyPropagateError({attempts = 4, delay = 1000} = {}) {
    //This gets the error being passed from the observable. In this instance it's the "xhr.statusText"
    return function (errors) {
        return errors.
            scan((acc, value) => {
                acc += 1;
                if(acc < attempts){
                    return acc;
                }
                else{
                    throw new Error(value); //This throw will not throw an unhandled exception cause the retryWhen has a try catch and it will propergate this error to the callers error function
                }
            }, 0)//0 is the starting number of accuminator (acc)
            .delay(delay); //delay each call by 1 second
    }
}

function renderMovies(movies) {

    let div = document.createElement("div");
    div.innerText = 'handling_errors_retry_strategy';
    output.appendChild(div);

    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    });
}


//Flat map flattens out the inner observable
click.flatMap(e => loadWithFetch("moviesaaa.json"))
    //click.flatMap(e => load("movies.json"))
    .subscribe(
    renderMovies,
    e => console.log(`handling_errors_retry_strategy_error: ${e}`),
    () => console.log("handling_errors_retry_strategy_complete")
    );