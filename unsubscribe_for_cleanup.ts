import { Observable } from "rxjs/Observable";

let output = document.getElementById("output");

/*
In this function it will retry the number of attemtps and the takeWhile will keep producing an observable for those number of attempts
This will make the observable end without an error. This will not propagate an error to the subscriber
*/
export function retryStrategy({ attempts = 4, delay = 1000 } = {}) {
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

function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        let onLoad = () => {
            if (xhr.status == 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                //We can complete the observer cause we aren't expecting to receive any more data
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        };

        xhr.addEventListener("load", onLoad);

        xhr.open("GET", url);
        xhr.send();
        //Retrying when the call fails
        //}).retry(3);

        //If you return a function from the Observable.create this will become the unsubscribe method
        //Unsubscribe will automatically be called on retry logics
        return () => {
            xhr.removeEventListener("load", onload);
            xhr.abort();
        }

    }).retryWhen(retryStrategy({ attempts: 3, delay: 1500 }));
}

function renderMovies(movies) {

    let div = document.createElement("div");
    div.innerText = 'Unsubscribe for cleanup';
    output.appendChild(div);

    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    });
}

let subscription = load("movies.json")
    .subscribe(
    renderMovies,
    e => console.log(`cleanup - error: ${e}`),
    () => console.log(`cleanup - complete`)
    );

console.log(subscription);
subscription.unsubscribe(); //Look in network tab. The status of the movies.json request would be canceled