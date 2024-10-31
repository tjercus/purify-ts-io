
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

Imagine you want to combine multiple effects: reading an input value, updating another element’s text, and logging the action.

```typescript
import React, { useRef } from "react";
import IO from "./io.ts";

const setText = (element: HTMLElement, text: string): IO<void> =>
  new IO(() => {
    element.textContent = text;
  });

const logToConsole = (text: string): IO<void> =>
  new IO(() => {
    console.log(text);
  });

const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    // Read the input value
    const readInputValue = new IO(() => inputRef.current?.value ?? "");

    // Create the effect to update displayRef's text
    const updateDisplayText = (text: string): IO<void> =>
      new IO(() => displayRef.current).chain((display) =>
        display ? setText(display, `You entered: ${text}`) : IO.of(undefined),
      );

    // Compose effects
    const action = readInputValue
      .chain((value) => updateDisplayText(value)) // Update display text
      .chain((value) => logToConsole(`Logged: ${value}`)); // Log the result

    // Execute the composed action
    action.run();
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Type something..." />
      <button onClick={handleClick}>Display and Log</button>
      <div ref={displayRef} style={{ marginTop: "10px" }}>
        Output here
      </div>
    </div>
  );
};

export default App;

```