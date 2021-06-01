import React, { useState, useEffect, useRef } from 'react';
import useSearch from '../../utils/useSearch';
import './autocomplete.css';


export default function AutoComplete() {
  const [currentActive, setCurrentActive] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { isLoading, response } = useSearch(inputValue);
  const resultList = useRef(null);

  const showResults = isSearching && !isLoading && response.length > 0;

  useEffect(() => {
    function clickedOutside(e) {
      if (resultList.current && !resultList.current.contains(e.target)) {
        setIsSearching(false);
      }
    }
    document.addEventListener('click', clickedOutside, false);
    return () => document.removeEventListener('click', clickedOutside);
  }, []);

  const handleSelection = selected => {
    setIsSearching(false);
    setInputValue(selected)
  }

  const handleChange = e => {
      if (e.target.value === '') {
        setIsSearching(false);
      } else {
        setIsSearching(true);
      }
      setInputValue(e.target.value);
  }

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      setCurrentActive(0);
      setIsSearching(false);
      const user = response[currentActive];
      setInputValue(user.name);
    } else if (e.keyCode === 38) {
      //handle up
      if (currentActive === 0) {
        setIsSearching(false);
        return;
      }
      setCurrentActive(current => current - 1);
    } else if (e.keyCode === 40) {
      //handle down
      if (currentActive + 1 === response.length) {
        setCurrentActive(0);
      } else {
        setCurrentActive(current => current + 1);
      }
    } else if (e.keyCode === 27) {
      setCurrentActive(0);
      setIsSearching(false);
    }
  }

  const handleMouseOver = index => {
    setCurrentActive(index);
  }

  return (
      <div className="autocomplete-container">
        <span className="search-box-container">
          <input className="search-box-input" value={inputValue} onChange={handleChange} type="text" onKeyDown={handleKeyDown} />
          {showResults && <ul className="dropdown" ref={resultList}>
              {response.map((user, i) => (
                <li className={`dropdown-item ${i === currentActive ? 'active' : ''}`} onClick={() => handleSelection(user.name)} key={user.id} onMouseOver={() => handleMouseOver(i)}>
                  {user.name}
                </li>
              ))}
          </ul>}
        </span>
      </div>
	)
}