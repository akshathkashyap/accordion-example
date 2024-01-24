import React, { useEffect, useState } from 'react';
import { readCelebFile } from './utils/readCelebFile';
import { fetchCelebFromLocal, saveCelebToLocal } from './utils/localStorage';
import { CelebrityInfo } from './types';
import { AccordionProvider } from './context/accordionContext';
import Search from './components/Search';
import Accordion from './components/Accordion';
import './App.css';

const App: React.FC = () => {
  const [celebritiesInfo, setCelebritiesInfo] = useState<CelebrityInfo[] | null>(null);
  const [filteredCelebrities, setFilteredCelebrities] = useState<CelebrityInfo[] | null>(null);

  const getCelebritiesInfo = async () => {
    const localInfo: CelebrityInfo[] | null = fetchCelebFromLocal();
    if (localInfo) {
      setCelebritiesInfo(localInfo);
      setFilteredCelebrities(localInfo);
      return;
    }
    
    const celebritiesInfo_: CelebrityInfo[] = await readCelebFile();
    setCelebritiesInfo(celebritiesInfo_);
    setFilteredCelebrities(celebritiesInfo_);
    saveCelebToLocal(celebritiesInfo_);
  };

  useEffect(() => {
    getCelebritiesInfo();
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (celebritiesInfo) {
      const filtered = celebritiesInfo.filter((celeb) => {
          return celeb.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
          celeb.last.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredCelebrities(filtered);
    }
  };

  if (celebritiesInfo === null || celebritiesInfo.length === 0) return null;

  return (
    <>
      <Search onSearch={handleSearch} />
      <AccordionProvider>
        <section className='container'>
          {
            filteredCelebrities && filteredCelebrities.map((celebrityInfo: CelebrityInfo) => (
              <Accordion celebrityInfo={celebrityInfo} reloadLocal={getCelebritiesInfo}></Accordion>
            ))
          }
        </section>
      </AccordionProvider>
    </>
  );
};

export default App;
