import FeedbackCard from "../components/FeedbackCard";

// AdminPage — all feedback including unapproved, with approve/delete controls.
//
// Props:
//   items      {Array}    all feedback entries
//   onApprove  {function} receives item id
//   onDelete   {function} receives item id

export default function AdminPage({ items, onApprove, onDelete }) {
  const pending = items.filter((i) => !i.approved);
  const approved = items.filter((i) => i.approved);

  return (
    <main className="page-enter max-w-5xl mx-auto px-3 xs:px-2 py-8 xs:py-6">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-widest text-accent font-semibold mb-1.5">
          Admin
        </p>
        <h1 className="font-display text-4xl text-ink">Moderation</h1>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-2xl text-ink mb-4">
            Pending ({pending.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pending.map((item, index) => (
              <div key={item.id} className="flex flex-col gap-2">
                <FeedbackCard item={item} index={index} />
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(item.id)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-0"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors focus:outline-none focus:ring-0"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {pending.length === 0 && (
        <div className="text-center py-10 text-muted mb-10">
          <p className="text-3xl mb-3">✓</p>
          <p className="font-medium text-ink">No pending reviews</p>
        </div>
      )}

      {/* Approved */}
      <section>
        <h2 className="font-display text-2xl text-ink mb-4">
          Approved ({approved.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {approved.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-2">
              <FeedbackCard item={item} index={index} />
              <button
                onClick={() => onDelete(item.id)}
                className="w-full py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors focus:outline-none focus:ring-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
