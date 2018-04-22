export const randomItem = (theArray = []) => {
  const item = theArray[Math.floor(Math.random()*theArray.length)];

  return item;
}; 