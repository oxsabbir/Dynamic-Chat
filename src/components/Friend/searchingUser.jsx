const searchingUser = function (listOfUser, inputValue) {
  const mainUser = listOfUser.filter((item) => {
    if (item?.admin) return;
    const names = item?.name.toLowerCase();
    const input = inputValue.toLowerCase();
    return names.startsWith(input);
  });

  return mainUser;
};
export default searchingUser;
