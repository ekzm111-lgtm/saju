type AdminFilterBarProps = {
  action: string;
  queryPlaceholder: string;
  query?: string;
  statusName?: string;
  statusValue?: string;
  options?: Array<{ value: string; label: string }>;
};

export function AdminFilterBar({
  action,
  queryPlaceholder,
  query,
  statusName = "status",
  statusValue = "all",
  options = [
    { value: "all", label: "전체" },
    { value: "active", label: "활성" },
    { value: "inactive", label: "비활성" }
  ]
}: AdminFilterBarProps) {
  return (
    <form action={action} className="admin-filter-bar">
      <input type="search" name="q" defaultValue={query} placeholder={queryPlaceholder} />
      <select name={statusName} defaultValue={statusValue}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button type="submit" className="secondary-button compact-button">
        필터 적용
      </button>
    </form>
  );
}
