export interface categoryI {
  categoryName: string;
  gradeMin: string;
  gradeMax: string;
}

export interface championshipCategoryI {
  categoryName: string;
}

export interface responseCategoryI {
  status: number;
  data: categoryI[];
}
export interface responseChampionshipCategoryI {
  status: number;
  categoryName: string;
}
