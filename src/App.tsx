import React, { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";

// set up api mock that intercepts fetch calls to /api/suggest
import "./api-mock";

export default function App() {
  return <Autocomplete />;
}

type SuggestionResult = {
  id: number;
  name: string;
};

function Autocomplete() {
  const [term, setTerm] = useState("");
  const termJustChosen = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [results, setResults] = useState<SuggestionResult[]>([]);
  const latestRequest = useRef<Promise<Response> | null>();

  useEffect(() => {
    if (!term) {
      setResults([]);
    }
    if (term === "") {
      setResults([]);
    }
  }, [term]);

  useDebouncedEffect(
    () => {
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
    },
    150,
    [term]
  );

  const setTermBySuggestionId = useCallback(
    (id: number) => {
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
    <div className="autocomplete-container">
      <div className={`autocomplete-input-wrapper ${loading ? "loading" : ""}`}>
        <input
          className="autocomplete-input"
          value={term}
          autoFocus
          onChange={e => setTerm(e.target.value)}
        />
      </div>
      {error && <p>{error}</p>}
      <SuggestionList suggestions={results} onClick={setTermBySuggestionId} />
    </div>
  );
}

interface SuggestionListProps {
  suggestions: SuggestionResult[];
  onClick: (id: number) => void;
}
function SuggestionList({ suggestions, onClick }: SuggestionListProps) {
  if (!suggestions) {
    return null;
  }
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <ul className="suggestion-list">
      {suggestions.map(({ id, name }) => (
        <li
          className="suggestion-list-item"
          key={id}
          onClick={() => onClick(id)}
        >
          {name}
        </li>
      ))}
    </ul>
  );
}

const useDebouncedEffect = (effect: () => void, delay: number, deps: any[]) => {
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
