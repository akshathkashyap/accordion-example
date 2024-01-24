import React, { createContext, useContext, ReactNode, useState } from 'react';

interface AccordionContextProps {
  expandedAccordionId: number | null;
  isBeingEdited: boolean;
  setExpandedAccordionId: React.Dispatch<React.SetStateAction<number | null>>;
  setIsBeingEdited: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccordionContext = createContext<AccordionContextProps | undefined>(undefined);

export const AccordionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expandedAccordionId, setExpandedAccordionId] = useState<number | null>(null);
  const [isBeingEdited, setIsBeingEdited] = useState<boolean>(false);

  return (
    <AccordionContext.Provider value={{ expandedAccordionId, isBeingEdited, setExpandedAccordionId, setIsBeingEdited }}>
      {children}
    </AccordionContext.Provider>
  );
};

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordionContext must be used within an AccordionProvider');
  }
  return context;
};
