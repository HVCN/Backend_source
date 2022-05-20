export type WeeklyMenuUserType = {
  _id: string;
  weekDay: number;
};

export type WeeklyMenuRecipeType = {
  _id: string;
  title: string;
  ingredients: string[];
  tags: string[];
  category: number;
  uri: string;
  steps: string[];
};

export type ResultWeeklyMenu = {
  weekday: number;
  _id: string;
  title?: string;
  ingredients?: string[];
  tags?: string[];
  category?: number;
  uri?: string;
  steps?: string[];
};