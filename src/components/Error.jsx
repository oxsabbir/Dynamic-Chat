import { useRouteError } from "react-router-dom";
const Error = function () {
  const error = useRouteError();

  console.log(error);
  return (
    <>
      <h1>Something went wrong</h1>
      <p>Define your errors</p>
    </>
  );
};

export default Error;
