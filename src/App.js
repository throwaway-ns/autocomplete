import React, { useRef, useState } from "react";
import "./styles.css";

// set up api mock that intercepts fetch calls to /api/suggest
import "./api-mock";

// please read README.md
export default function App() {
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [results, setResults] = useState([]);
  const latestRequest = useRef();

  React.useEffect(() => {
    if (!term) {
      return;
    }
    if (term === "") {
      return;
    }

    setLoading(true);
    setError(null);

    const request = fetch(`/api/suggest?${new URLSearchParams({ term }).toString()}`);
    latestRequest.current = request;
    request
      .then(res => res.json())
      .then(suggestions => {
        if (latestRequest.current !== request) {
          console.warn(`Newer request in-flight. Skipping update.`);
          return;
        }
        setResults(suggestions)
      })
      .catch(e => {
        if (latestRequest.current !== request) {
          console.warn(`Newer request in-flight. Skipping update.`);
          return;
        }
        setError(e)
      })
      .finally(() => {
        if (latestRequest.current !== request) {
          console.warn(`Newer request in-flight. Skipping update.`);
          return;
        }
        setLoading(false)
      });
  }, [term]);

  return (
    <div>
      <input value={term} autoFocus onChange={e => setTerm(e.target.value)}/>
      { loading && <p>Loading...</p> }
      { error && <p>{error}</p> }
      <SuggestionList suggestions={results} />
    </div>
  );
}

function SuggestionList({ suggestions }) {
  if (!suggestions) {
    return null;
  }
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div>
      { suggestions.map(({id, name}) => <span key={id}>{name}</span>) }
    </div>
  )
}
