import { AccordionData, CelebrityInfo } from "../types";
import { fetchCelebFromLocalByID } from "./localStorage";

export const createAccordionData = (celebrityInfo: CelebrityInfo): AccordionData => {
  const getAge = (dobString: string): number => {
    const dob: Date = new Date(dobString);
    const currentDate: Date = new Date();

    let age: number = currentDate.getFullYear() - dob.getFullYear();

    if (currentDate.getMonth() < dob.getMonth() ||
      (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  };

  const age: number = getAge(celebrityInfo.dob);

  return {
    display: celebrityInfo.picture,
    name: `${celebrityInfo.first} ${celebrityInfo.last}`,
    age: age,
    gender: celebrityInfo.gender,
    country: celebrityInfo.country,
    description: celebrityInfo.description,
    isAdult: age > 18,
  };
};

export const createCelebrityData = (id: number, accordionInfo: AccordionData): CelebrityInfo | null => {
  const celebrityInfo: CelebrityInfo | null = fetchCelebFromLocalByID(id);
  if (!celebrityInfo) return null;

  const getDOB = (age: number) => {
  const currentDate: Date = new Date();
  const birthYear: number = currentDate.getFullYear() - age;

  const dob: Date = new Date(birthYear, currentDate.getMonth(), currentDate.getDate());
  const formattedDOB: string = dob.toISOString().split('T')[0];

  return formattedDOB;
  }

  celebrityInfo.first = accordionInfo.name.split(' ')[0];
  celebrityInfo.last = accordionInfo.name.split(' ').slice(1).join(' ');
  celebrityInfo.dob = getDOB(accordionInfo.age);
  celebrityInfo.gender = accordionInfo.gender;
  celebrityInfo.country = accordionInfo.country;
  celebrityInfo.description = accordionInfo.description;

  return celebrityInfo;
};
