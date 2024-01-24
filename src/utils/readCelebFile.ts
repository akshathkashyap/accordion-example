import { CelebrityInfo } from "../types";

export const readCelebFile = async (): Promise<CelebrityInfo[]> => {
  try {
    const response: Response = await fetch(`${process.env.PUBLIC_URL}/celebrities.json`);
    const celebritiesInfo: CelebrityInfo[] = await response.json();

    return celebritiesInfo;
  } catch (error) {
    console.error(error);
  }

  return [];
};
