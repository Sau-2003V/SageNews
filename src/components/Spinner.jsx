const Spinner = () => (
  <div className="flex justify-center py-8" role="status">
    <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand/25 border-t-brand" />
    <span className="sr-only">Loading…</span>
  </div>
);

export default Spinner;
