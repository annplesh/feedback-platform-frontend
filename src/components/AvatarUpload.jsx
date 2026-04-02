// AvatarUpload — avatar display with upload on click and delete on hover.
//
// Props:
//   avatarUrl  {string}   current avatar URL or null
//   initials   {string}   fallback initials
//   uploading  {boolean}  whether upload is in progress
//   onUpload   {function} receives File object
//   onDelete   {function} called when user removes avatar
//   error      {string}   error message or null
//   size       {string}   'sm' | 'md' — controls dimensions

export default function AvatarUpload({
  avatarUrl,
  initials,
  uploading,
  onUpload,
  onDelete,
  error,
  size = "md",
}) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-16 h-16 text-lg";

  function handleChange(e) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  }

  return (
    <div className="relative group">
      <label
        className={`${sizeClass} rounded-full ${avatarUrl ? "bg-transparent" : "bg-ink"} flex items-center justify-center cursor-pointer relative overflow-hidden shrink-0`}
      >
        {avatarUrl ? (
          <>
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
            {/* Hover overlay with camera icon */}
            <div className="absolute inset-0 bg-black rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-150 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          </>
        ) : (
          <span className="text-paper font-semibold">
            {uploading ? "…" : initials}
          </span>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer outline-none"
        />
      </label>

      {/* Delete button — appears on hover when avatar exists */}
      {avatarUrl && onDelete && (
        <button
          onClick={(e) => { e.preventDefault(); onDelete(); }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-white border border-cream rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 focus:outline-none"
          aria-label="Remove avatar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}

      {/* Error message — only shown in md size */}
      {error && size === "md" && (
        <p className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
