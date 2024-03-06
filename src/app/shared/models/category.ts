export interface categoryI {
  categoryId: number;
  categoryName: string;
  gradeMin: string;
  gradeMax: string;
  numberOfCompetitors: number;
}

export interface categoryWithNumericValueI {
  categoryId: number;
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
