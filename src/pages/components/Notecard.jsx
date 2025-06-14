import { PenSquareIcon, Trash2Icon } from "lucide-react"
import { Link } from "react-router-dom"
import { formatDate } from "../../lib/utils"
import toast from "react-hot-toast"
import { useState } from "react"

const Notecard = ({ note, setNotes }) => {
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(` http://localhost:5001/api/notes/${note._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) throw new Error("Failed to delete")

      setNotes((prev) => prev.filter((n) => n._id !== note._id))
      toast.success("Note deleted")
      setShowModal(false)
    } catch (err) {
      toast.error("Delete failed")
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="card bg-base-100 hover:shadow-lg transition-transform duration-300 border-t-4 border-[#00FF9D] scale-100 hover:scale-[1.01]">
        <div className="card-body">
          <Link to={`/note/${note._id}`} className="no-underline">
            <h3 className="card-title text-base-content">{note.title}</h3>
            <p className="text-base-content/450 line-clamp-3">{note.content}</p>
          </Link>

          <div className="card-actions justify-between items-center mt-4">
            <span className="text-sm text-base-content/60">
              {formatDate(new Date(note.createdAt))}
            </span>
            <div className="flex items-center gap-2">
              <Link
                to={`/note/${note._id}`}
                className=" hover:text-blue-700 transition"
              >
                <PenSquareIcon className="size-5" />
              </Link>
              <button
                onClick={() => setShowModal(true)}
                className="text-error hover:text-red-700 transition"
                aria-label="Delete note"
              >
                <Trash2Icon className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <dialog className="modal-box max-w-sm p-6 rounded-lg shadow-lg bg-base-100" open>
            <h3 className="font-bold text-lg text-error">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="modal-action justify-end">
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </dialog>
        </div>
      )}
    </>
  )
}

export default Notecard
