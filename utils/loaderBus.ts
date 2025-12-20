let showFn: () => void;
let hideFn: () => void;

export const registerLoader = (show: () => void, hide: () => void) => {
  showFn = show;
  hideFn = hide;
};

export const showGlobalLoader = () => {
  showFn?.();
};

export const hideGlobalLoader = () => {
  hideFn?.();
};
