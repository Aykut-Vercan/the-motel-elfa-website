"use client"

import { useState } from "react";

const Counter = ({ users }) => {
    const [counter, setCounter] = useState(0);
    
    return (
        <div>
            <p>users length {users.length}</p>
            <button onClick={() => setCounter(c => c + 1)}> {counter}</button>
        </div>
    )
}

export default Counter