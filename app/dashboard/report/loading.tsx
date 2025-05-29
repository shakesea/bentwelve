export default function LoadingReport() {
  const skeletonRows = Array.from({ length: 5 }, (_, i) => (
    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-pink-50"}>
      <td className="border-t border-b border-l border-gray-200 px-4 py-3 text-center animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
      </td>
      <td className="border-t border-b border-gray-200 px-4 py-3 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="border-t border-b border-gray-200 px-4 py-3 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="border-t border-b border-gray-200 px-4 py-3 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="border-t border-b border-gray-200 px-4 py-3 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-28"></div>
      </td>
      <td className="border-t border-b border-r border-gray-200 px-4 py-3 text-center animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
      </td>
    </tr>
  ));

  return (
    <div className="p-6 md:p-8 mt-6 min-h-screen space-y-6">
      {/* Header Title */}
      <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>

      {/* Profile Card */}
      <div className="w-64 h-16 bg-gray-200 rounded-xl ml-auto animate-pulse" />

      {/* Filter Button Placeholder */}
      <div className="flex justify-end mb-6">
        <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm text-left border-separate border-spacing-0">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="border-t border-b border-l border-gray-200 px-4 py-3 first:rounded-tl-lg"></th>
              <th className="border-t border-b border-gray-200 px-4 py-3"></th>
              <th className="border-t border-b border-gray-200 px-4 py-3"></th>
              <th className="border-t border-b border-gray-200 px-4 py-3"></th>
              <th className="border-t border-b border-gray-200 px-4 py-3"></th>
              <th className="border-t border-b border-r border-gray-200 px-4 py-3 last:rounded-tr-lg"></th>
            </tr>
          </thead>
          <tbody>
            {skeletonRows}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="border-b border-x border-gray-200 first:rounded-bl-lg last:rounded-br-lg"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
