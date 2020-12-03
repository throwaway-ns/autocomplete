import React from "react";
import "./styles.css";

// set up api mock that intercepts fetch calls to /api/suggest
import "./api-mock";

// please read README.md
export default function App() {
  React.useEffect(() => {
    // these are examples of possible API calls

    // fetching suggestions without term returns an empty array
    fetch("/api/suggest")
      .then((res) => res.json())
      .then(console.log);

    // fetching suggestionss with term witl try to match the names, see ./api-mock file
    // for reference
    fetch(`/api/suggest?${new URLSearchParams({ term: "B" }).toString()}`)
      .then((res) => res.json())
      .then(console.log);
  }, []);

  return <div></div>;
}
