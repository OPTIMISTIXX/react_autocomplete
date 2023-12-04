import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';

function debounce(callback: () => void,
  delay: number): (param: string) => void {
  const timerID = 0;

  return () => {
    window.clearTimeout(timerID);
    window.setTimeout(() => {
      callback();
    }, delay);
  };
}

export const App: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [name, setName] = useState<string | undefined>(' ');
  const [born, setBorn] = useState<number | undefined>();
  const [died, setDied] = useState<number | undefined>();
  const [valueApplied, setValueApplied] = useState('');
  const [focus, setFocus] = useState(false);
  const applyValue = useCallback(
    debounce(setValueApplied as () => void, 1000),
    [valueApplied],
  );

  const onFocus = () => {
    setFocus(true);
  };

  const handlerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    applyValue(e.target.value);
  };

  const handlerItemChange = (person: string) => {
    const findPerson = peopleFromServer.find((p) => p.name === person);

    setValue(person);
    setName(findPerson?.name);
    setBorn(findPerson?.born);
    setDied(findPerson?.died);
  };

  const filteredPosts = useMemo(() => {
    return peopleFromServer
      .filter((person) => person.name.toLowerCase()
        .includes(valueApplied.toLowerCase()))
      .map((person) => person);
  }, [valueApplied]);

  return (
    <main className="section">
      {name !== ' ' ? (
        <h1 className="title">
          {`${name} (${born} = ${died})`}
        </h1>
      ) : (
        <h1 className="title">No selected persons</h1>
      )}

      <div className={cn('dropdown', {
        'is-active': focus === true
          && value === valueApplied,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={value}
            onFocus={onFocus}
            onChange={handlerInputChange}

          />
        </div>
        {
          focus === true && (
            <div className="dropdown-menu" role="menu">
              <div className="dropdown-content">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((person) => (
                    <div
                      key={person.slug}
                      className="dropdown-item"
                    >
                      <button
                        type="button"
                        className="has-text-link"
                        onClick={() => handlerItemChange(person.name)}
                      >
                        {person.name}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item">
                    <p className="has-text-link">No matching suggestions</p>
                  </div>
                )}

              </div>
            </div>
          )
        }
      </div>
    </main>
  );
};
