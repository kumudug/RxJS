import { Observable } from "rxjs/Observable";

export function load(url: string) {
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

export function loadWithFetch(url: string){
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