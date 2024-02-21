export interface categoryI {
  categoryName: string;
  gradeMin: string;
  gradeMax: string;
  numberOfCompetitors: number;
}

export interface categoryWithNumericValueI {
  categoryName: string;
  gradeMin: number;
  gradeMax: number;
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
