export function Footer({ page, totalPages }) {
  return (
    <footer>
      <p>{`Page ${page} of ${totalPages}`}</p>
    </footer>
  );
}
