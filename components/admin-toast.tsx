type AdminToastProps = {
  message?: string;
  tone?: string;
};

export function AdminToast({ message, tone = "success" }: AdminToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className={`admin-toast ${tone === "error" ? "admin-toast-error" : "admin-toast-success"}`}>
      {message}
    </div>
  );
}
