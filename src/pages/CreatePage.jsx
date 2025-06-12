import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
import toast from 'react-hot-toast'
import axios from 'axios'

const PRIORITIES = [
  { label: 'Low', value: 'low', color: 'bg-green-200 text-green-800' },
  { label: 'Medium', value: 'medium', color: 'bg-yellow-200 text-yellow-800' },
  { label: 'High', value: 'high', color: 'bg-red-200 text-red-800' },
]

const DRAFT_KEY = 'thinkvault_note_draft'

const CreatePage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState('medium')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY)
    if (draft) {
      try {
        const { title, content, priority } = JSON.parse(draft)
        setTitle(title)
        setContent(content)
        setPriority(priority)
        toast('Loaded saved draft', { icon: '📄' })
      } catch {}
    }
  }, [])

  // Auto-save draft to localStorage on every change (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, priority }))
      toast('Draft auto-saved', { icon: '💾', duration: 1000 })
    }, 1500)

    return () => clearTimeout(timeout)
  }, [title, content, priority])

  const clearForm = () => {
    setTitle('')
    setContent('')
    setPriority('medium')
    localStorage.removeItem(DRAFT_KEY)
    toast('Form cleared', { icon: '🧹' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content')
      return
    }
    setLoading(true)
    try {
      await axios.post('https://thinkvault-backend-aqfg.onrender.com/api/notes', {
        title,
        content,
        priority,
      })
      toast.success('Note created successfully 🎉')
      localStorage.removeItem(DRAFT_KEY)
      navigate('/')
    } catch (err) {
      toast.error('Failed to create note')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-base-200 flex items-center justify-center px-4 py-8'>
      <div className='max-w-3xl w-full'>
        <Link to="/" className="btn btn-ghost mb-6 flex items-center gap-2 text-lg font-semibold">
          <ArrowLeftIcon className="size-5" />
          Back to notes
        </Link>

        <div className="card bg-base-100 shadow-lg rounded-xl p-8">
          <h2 className="card-title text-3xl mb-6 font-bold tracking-wide">Create New Note</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label font-semibold text-base-content mb-2">Title</label>
              <input
                type="text"
                placeholder="Note Title"
                className="input input-bordered w-full text-lg"
                value={title}
                maxLength={100}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
              <p className="text-sm text-gray-400 mt-1">{title.length} / 100 characters</p>
            </div>

            <div>
              <label className="label font-semibold text-base-content mb-2">Content</label>
              <textarea
                placeholder="Write your note here..."
                className="textarea textarea-bordered w-full h-40 resize-y text-lg"
                value={content}
                maxLength={1000}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
              />
              <p className="text-sm text-gray-400 mt-1">{content.length} / 1000 characters</p>
            </div>

            <div>
              <label className="label font-semibold text-base-content mb-2">Priority</label>
              <div className="flex gap-4">
                {PRIORITIES.map(({ label, value, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPriority(value)}
                    className={`px-4 py-2 rounded-full font-semibold transition ${color} ${priority === value ? 'ring-4 ring-offset-2 ring-primary' : 'opacity-60 hover:opacity-100'}`}
                    disabled={loading}
                    aria-pressed={priority === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={clearForm}
                className="btn btn-warning btn-outline"
                disabled={loading}
              >
                Clear
              </button>

              <button
                type="submit"
                className={`btn btn-primary px-8 flex items-center gap-2 font-semibold`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Create Note'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePage
