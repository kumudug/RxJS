# RxJS


http://reactivex.io/rxjs/ - RxJS is ReaxtiveX in javascript

ReactiveX - API for asynchronous programming with observable streams


Typings was installed using the following command which created the typings.json file

    typings install dt~es6-shim --global --save


Typescript compiler config in - tsconfig.json


## In order to get Fetch working

typings uninstall es6-shim --save 
typings install dt~whatwg-streams --save --global [dt~ denotes it's in defeneately typed repo]
typings install dt~whatwg-fetch --save --global


