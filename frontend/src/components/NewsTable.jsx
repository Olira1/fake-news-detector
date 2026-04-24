function NewsTable({ rows, onDelete }) {
  if (!rows.length) {
    return (
      <p className="mt-3 rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-600">
        No news items yet.
      </p>
    );
  }

  return (
    <div className="mt-3 overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-600">
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Title</th>
            <th className="px-3 py-2">Label</th>
            <th className="px-3 py-2">Created</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 align-top">
              <td className="px-3 py-2 text-slate-700">{row.id}</td>
              <td className="px-3 py-2 text-slate-800">
                <p className="font-medium">{row.title}</p>
                <p className="mt-1 max-w-md text-xs text-slate-500">{row.content}</p>
              </td>
              <td className="px-3 py-2 capitalize text-slate-700">{row.label}</td>
              <td className="px-3 py-2 text-slate-600">
                {new Date(row.created_at).toLocaleString()}
              </td>
              <td className="px-3 py-2">
                <button
                  type="button"
                  onClick={() => onDelete(row.id)}
                  className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NewsTable;
