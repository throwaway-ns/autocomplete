import React, { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";

// set up api mock that intercepts fetch calls to /api/suggest
import "./api-mock";

export default function App() {
  return (
    <Autocomplete />
  );
}

function Autocomplete() {
  const [term, setTerm] = useState("");
  const termJustChosen = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [results, setResults] = useState([]);
  const latestRequest = useRef();

  useEffect(() => {
    if (!term) {
      setResults([]);
    }
    if (term === "") {
      setResults([]);
    }
  }, [term]);

  useDebouncedEffect(() => {
    if (termJustChosen.current) {
      termJustChosen.current = false;
      return;
    }
    if (!term) {
      return;
    }
    if (term === "") {
      return;
    }

    setLoading(true);
    setError(null);

    const request = fetch(
      `/api/suggest?${new URLSearchParams({ term }).toString()}`
    );
    latestRequest.current = request;
    request
      .then(res => res.json())
      .then(suggestions => {
        if (latestRequest.current !== request) {
          console.debug(`Newer request in-flight. Skipping update.`);
          return;
        }
        setResults(suggestions);
      })
      .catch(e => {
        if (latestRequest.current !== request) {
          console.debug(`Newer request in-flight. Skipping update.`);
          return;
        }
        setError(e);
      })
      .finally(() => {
        if (latestRequest.current !== request) {
          console.debug(`Newer request in-flight. Skipping update.`);
          return;
        }
        setLoading(false);
      });
  }, 150, [term]);

  const setTermBySuggestionId = useCallback(
    id => {
      const matches = results.filter(r => r.id === id).map(r => r.name);

      if (matches.length === 0) {
        console.warn("Non-existent suggestion chosen");
        return;
      }

      termJustChosen.current = true;
      setTerm(matches[0]);
      setResults([]);
    },
    [results]
  );

  return (
    <div class="autocomplete-container">
      <div class={`autocomplete-input-wrapper ${loading ? 'loading' : ''}`}>
        <input class="autocomplete-input" value={term} autoFocus onChange={e => setTerm(e.target.value)} />
      </div>
      {error && <p>{error}</p>}
      <SuggestionList suggestions={results} onClick={setTermBySuggestionId} />
    </div>
  );
}

function SuggestionList({ suggestions, onClick }) {
  if (!suggestions) {
    return null;
  }
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <ul class="suggestion-list">
      {suggestions.map(({ id, name }) => (
        <li class="suggestion-list-item" key={id} onClick={() => onClick(id)}>
          {name}
        </li>
      ))}
    </ul>
  );
}

const useDebouncedEffect = (effect, delay, deps) => {
  const callback = useCallback(effect, deps);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
};
