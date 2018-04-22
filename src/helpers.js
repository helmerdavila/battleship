export const randomItem = (theArray = []) => {
  const item = theArray[Math.floor(Math.random()*theArray.length)];

  return item;
}; 

export const randomNumber = (from, to) => {
  return Math.floor((Math.random() * to) + from);
};