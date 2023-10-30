const useSearching = function (listOfUser, searchKey, inputValue) {
  const mainUser = listOfUser.filter((item) => {
    const names = item[`${searchKey}`].toLowerCase();
    const input = inputValue.toLowerCase();
    return names.startsWith(input);
  });

  return mainUser;
};
export default useSearching;
