"use client"
import { useState } from "react";

function TextExpander({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayText = isExpanded ? children : children.split(" ").slice(0, 40).join(" ") + "...    ";

  return (
    <span>
      {displayText}
      <button
        className="text-accent-600 border-b border-accent-700 leading-3 pb-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? " Show less" : " Show more"}
      </button>
    </span>
  );
}

export default TextExpander;
