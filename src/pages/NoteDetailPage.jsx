import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from 'lucide-react';
import { formatDate } from "../lib/utils";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`https://thinkvault-backend-aqfg.onrender.com/api/notes/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch note");
        }
        const data = await res.json();
        setNote(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`https://thinkvault-backend-aqfg.onrender.com/api/notes/${note._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      toast.success("Note deleted successfully");
      setShowDeleteModal(false);
      navigate("/");
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`https://thinkvault-backend-aqfg.onrender.com/api/notes/${note._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: note.title,
          content: note.content
        })
      });

      if (!res.ok) {
        throw new Error("Failed to save");
      }

      const updatedNote = await res.json();
      setNote(updatedNote);
      setHasUnsavedChanges(false);
      toast.success("Note saved successfully");
      navigate("/"); // Navigate to homepage after successful save
    } catch (err) {
      toast.error("Save failed");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (field, value) => {
    setNote(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges || !note) return;
    
    const timeoutId = setTimeout(() => {
      handleSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [note?.content, note?.title, hasUnsavedChanges]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-error">Note not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="w-6 h-6" />
              Back to Home
            </Link>
            
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <span className="text-sm text-warning">Unsaved changes</span>
              )}
              
              <button 
                onClick={handleSave} 
                className="btn btn-primary"
                disabled={saving || !hasUnsavedChanges}
              >
                {saving ? (
                  <>
                    <LoaderIcon className="animate-spin w-4 h-4" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
              
              <button 
                onClick={() => setShowDeleteModal(true)} 
                className="btn btn-error btn-outline"
                disabled={deleting}
              >
                <Trash2Icon className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
          
          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter note title..."
                  className="input input-bordered"
                  value={note.title || ""}
                  onChange={(e) => handleContentChange("title", e.target.value)}
                />
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-32"
                  value={note.content || ""}
                  onChange={(e) => handleContentChange("content", e.target.value)}
                />
              </div>
              
              <div className="text-sm text-gray-500">
                {note.createdAt && (
                  <>Created: {formatDate(new Date(note.createdAt))}</>
                )}
                {note.updatedAt && (
                  <> • Updated: {formatDate(new Date(note.updatedAt))}</>
                )}
                {!note.createdAt && !note.updatedAt && (
                  <>Last modified: {formatDate(new Date())}</>
                )}
              </div>
            </div>
          </div>
          
          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <dialog className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Delete Note</h3>
                <p className="py-4">
                  Are you sure you want to delete this note? This action cannot be undone.
                </p>
                <div className="modal-action">
                  <button 
                    className="btn btn-ghost" 
                    onClick={() => setShowDeleteModal(false)}
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
                      <>
                        <LoaderIcon className="animate-spin w-4 h-4" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
              <div className="modal-backdrop" onClick={() => setShowDeleteModal(false)}></div>
            </dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;