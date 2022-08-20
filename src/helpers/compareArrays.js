export const isSameId = (a, b) => a._id === b._id

export const onlyInFirstArray = (firstArray, secondArray, compareFunction) => 
  firstArray.filter(firstArrayValue =>
    !secondArray.some(secondArrayValue => 
      compareFunction(firstArrayValue, secondArrayValue)));

