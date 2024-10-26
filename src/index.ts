
class IO<A> {
  constructor(private readonly effect: () => A) {}

  // Run the deferred effect
  run(): A {
    return this.effect()
  }

  // Functor map: applies a function to the result of the IO effect
  map<B>(fn: (a: A) => B): IO<B> {
    return new IO(() => fn(this.run()))
  }

  // Apply (ap): applies a function within an IO context to another IO value
  ap<B>(fab: IO<(a: A) => B>): IO<B> {
    return fab.chain(fn => this.map(fn))
  }

  // Chain (flatMap): applies a function that returns an IO, creating a new IO
  chain<B>(fn: (a: A) => IO<B>): IO<B> {
    return new IO(() => fn(this.run()).run())
  }

  // Lift a pure value into an IO context
  static of<A>(a: A): IO<A> {
    return new IO(() => a)
  }

  // Lift a function into an IO effect
  static from<A>(fn: () => A): IO<A> {
    return new IO(fn)
  }
}

export default IO;

