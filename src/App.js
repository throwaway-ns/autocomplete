import React, { useState } from "react";
import "./styles.css";

// set up api mock that intercepts fetch calls to /api/suggest
import "./api-mock";

// please read README.md
export default function App() {
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [results, setResults] = useState([]);

  React.useEffect(() => {
    if (!term) {
      return;
    }
    if (term === "") {
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/suggest?${new URLSearchParams({ term }).toString()}`)
      .then(res => res.json())
      .then(suggestions => setResults(suggestions))
      .catch(e => setError(e))
      .finally(() => setLoading(false));
  }, [term, setResults, setError, setLoading]);

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
