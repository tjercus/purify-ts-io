
# IO Monad compatible with purify-ts

## Example usage:

```typescript
const readLine = IO.from(() => prompt("What's your name?"))
const greet = (name: string) => `Hello, ${name}!`
const program = readLine.map(greet)
console.log(program.run()) // Deferred execution until run() is called
```

## More advanced usage

change the background color of an element when a button is clicked

```typescript

import React, { useRef } from 'react'

const changeBackgroundColor = (element: HTMLElement, color: string): IO<void> =>
  new IO(() => {
    element.style.backgroundColor = color
  })

const App: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    // Create an IO action to change the background color of divRef
    const changeColorAction = new IO(() => divRef.current)
      .chain(div => (div ? changeBackgroundColor(div, 'lightblue') : IO.of(undefined)))

    changeColorAction.run() // Execute when the button is clicked
  }

  return (
    <div>
      <div ref={divRef} style={{ width: '200px', height: '100px', backgroundColor: 'lightgray' }}>
        Color me!
      </div>
      <button onClick={handleClick}>Change Color</button>
    </div>
  )
}

export default App
```