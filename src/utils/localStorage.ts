import { CelebrityInfo } from "../types";

export const saveCelebToLocal = (celebritiesInfo: CelebrityInfo[]) => {
  localStorage.setItem('celebritiesInfo', JSON.stringify(celebritiesInfo));
};

export const fetchCelebFromLocal = (): CelebrityInfo[] | null => {
  const celebritiesInfo: string | null = localStorage.getItem('celebritiesInfo');
  if (!celebritiesInfo) return null;

  return JSON.parse(celebritiesInfo);
};

export const fetchCelebFromLocalByID = (id: number): CelebrityInfo | null => {
  const celebritiesInfo: CelebrityInfo[] | null = fetchCelebFromLocal();
  if (!celebritiesInfo) return null;

  for (let i: number = 0; i < celebritiesInfo.length; i++) {
    if (celebritiesInfo[i].id === id) return celebritiesInfo[i];
  }

  return null;
};

export const updateCelebLocal = (id: number, celebrityInfo: CelebrityInfo) => {
  const celebritiesInfo: CelebrityInfo[] | null = fetchCelebFromLocal();
  if (!celebritiesInfo) return;

  for (let i: number = 0; i < celebritiesInfo.length; i++) {
    if (celebritiesInfo[i].id !== id) continue;

    celebritiesInfo[i] = celebrityInfo;
    break;
  }

  saveCelebToLocal(celebritiesInfo);
};

export const deleteCelebFromLocal = (id: number) => {
  const celebritiesInfo: CelebrityInfo[] | null = fetchCelebFromLocal();
  if (!celebritiesInfo) return;

  const fileteredCelebritiesInfo: CelebrityInfo[] = celebritiesInfo.filter((celebrityInfo: CelebrityInfo) => {
    return celebrityInfo.id !== id;
  });

  saveCelebToLocal(fileteredCelebritiesInfo);
};
