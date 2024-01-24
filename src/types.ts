export interface CelebrityInfo {
  id: number;
  first: string;
  last: string;
  dob: string;
  gender: 'male' | 'female' | 'transgender' | 'rather not say' | 'other';
  email: string;
  picture: string;
  country: string;
  description: string;
};

export interface AccordionData {
  display: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'transgender' | 'rather not say' | 'other';
  country: string;
  description: string;
  isAdult: boolean;
};
