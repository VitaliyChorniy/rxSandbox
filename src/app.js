import $ from 'jquery'
import Rx from 'rxjs/Rx'

/* Observable from event */
const result = $('#result')

const mouseMoveStream$ = Rx.Observable.fromEvent(document, 'mousemove')

mouseMoveStream$.subscribe(e => {
  result.html(`Y: ${e.clientY} X: ${e.clientX}`)
}, err => {
  console.log('oops err', err)
}, () => {
  console.log('stream ended')
})

/* Observabele from Data object */
const posts = new Set([
  { title: 'first title', body: 'first body' },
  { title: 'second title', body: 'second body' },
  { title: 'second title', body: 'second body' },
  { title: 'second title', body: 'second body' }
])
const postsBox = $('#posts')
const postsStream$ = Rx.Observable.from(posts)
                      .map(post => {
                        post.title = post.title + 123
                        return post
                      })

postsStream$.subscribe(
  post => {
    postsBox.append(`<li><h3>${post.title}</h3><br><p>${post.body}</p></li>`)
  },
  err => console.log('err occured', err),
  success => console.log('Finished!')
)

const postsStreamPluck$ = Rx.Observable.from(posts)
                          .pluck('title')

postsStreamPluck$.subscribe(
  post => {
    postsBox.append(`<i>${post}</i> `)
  },
  err => console.log('err occured', err),
  success => console.log('Finished!')
)

/* Observable from sratch */
const source$ = new Rx.Observable(observer => {
  console.log('Initialized observer')

  observer.next('First Value')
  observer.next('Second value')

  observer.error(new Error('Smth went wrong'))

  setTimeout(() => {
    observer.next('Third value')
    observer.complete()
  }, 3000)
})

source$
.catch(err => Rx.Observable.of(err))
.subscribe(
  ev => {
    console.log(ev)
  },
  err => {
    console.log(err)
  },
  success => {
    console.log(success)
  }
)

/* Observable from Promices */

function getUserData (name) {
  return $.ajax({
    url: 'https://api.github.com/users/' + name,
    dataType: 'jsonp'
  }).promise()
}

/*
const gitUserObserver$ = Rx.Observable.fromEvent($('#userSearch'), 'keyup')

gitUserObserver$.subscribe(
  value => {
    Rx.Observable.fromPromise(getUserData(value.target.value))
      .subscribe(
        user => {
          $('#name').html(user.data.name)
          $('#repos').html(`Public repos ${user.data.public_repos}`)
        },
        error => console.log('error getting user', error),
        sucess => console.log('success getting user data')
      )
  }
)
*/

Rx.Observable.fromEvent($('#userSearch'), 'keyup')
  .map(event => event.target.value)
  .switchMap(name => Rx.Observable.fromPromise(getUserData(name)))
  .subscribe(
    user => {
      $('#name').html(user.data.name)
      $('#repos').html(`Public repos ${user.data.public_repos}`)
    },
    error => console.log('error getting user', error),
    sucess => console.log('success getting user data')
  )

/* some simple examples */

const test1$ = Rx.Observable.interval(1000)
                .take(5)

test1$.subscribe(
  val => {
    console.log(val)
  },
  err => {
    console.log(err)
  },
  success => {
    console.log('Success')
  }
)
// first number is when to start observing
// second number is interval
const test2$ = Rx.Observable.timer(2000, 2000)
                .take(5)

test2$.subscribe(
  val => {
    console.log(val)
  },
  err => {
    console.log(err)
  },
  success => {
    console.log('Success')
  }
)

// from what number to start and with what to finish
const test3$ = Rx.Observable.range(25, 100)
                .take(5)

test3$.subscribe(
  val => {
    console.log(val)
  },
  err => {
    console.log(err)
  },
  success => {
    console.log('Success')
  }
)

/* merging Observables */

Rx.Observable.of('Hello')
  .merge(Rx.Observable.of('World'))
  .subscribe(value => console.log(value))

/* concat Observables */

const source1$ = Rx.Observable.range(0, 5).map(v => 'Source 1: ' + v)
const source2$ = Rx.Observable.range(6, 5).map(v => 'Source 2: ' + v)

Rx.Observable.concat(source1$, source2$)
  .subscribe(value => console.log(value))
