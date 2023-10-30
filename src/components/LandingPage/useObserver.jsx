const useObserver = function (observerFunction, option, element) {
  const observer = new IntersectionObserver(observerFunction, option);
  observer.observe(element);
};

export default useObserver;
