import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import './index.css';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
};

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const searchbarRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSearchBarFocus = (event: KeyboardEvent) => {
    const searchbar = searchbarRef.current;
    if (!searchbar) return;

    if (event.key === '/') {
      searchbar.focus();
    } else if (event.key === 'Escape') {
      searchbar.blur();
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', handleSearchBarFocus);
    return () => {
      document.removeEventListener('keyup', handleSearchBarFocus);
    };
  }, []);

  return (
    <input
      id='searchbar'
      ref={searchbarRef}
      className='borderize'
      type='text'
      placeholder='Search user'
      value={searchTerm}
      onChange={handleInputChange}
    />
  );
};

export default Search;
