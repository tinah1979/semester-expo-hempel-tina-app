let addRecipeCallback: ((recipe: any) => void) | null = null;

export const setAddRecipeCallback = (fn: (recipe: any) => void) => {
  addRecipeCallback = fn;
};

export const getAddRecipeCallback = () => addRecipeCallback;