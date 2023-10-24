import { forwardRef } from "react";
const ListPrinter = forwardRef(function ({ children }, ref) {
  return (
    <>
      <ul ref={ref} style={{ listStyle: "none" }}>
        {children}
      </ul>
    </>
  );
});

export default ListPrinter;
