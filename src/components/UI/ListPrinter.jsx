const ListPrinter = function ({ children }) {
  return (
    <>
      <ul style={{ listStyle: "none" }}>{children}</ul>
    </>
  );
};

export default ListPrinter;
