import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
import toast from 'react-hot-toast'
import axios from 'axios'

const CreatePage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter all fields')
      return
    }
    setLoading(true)
    try {
      await axios.post('http://localhost:5001/api/notes', {
        title,
        content,
      })
      toast.success('Note created successfully')
      navigate("/home")
    } catch (error) {
      console.error("Error creating note:", error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-base-200 py-10'>
      <div className='container mx-auto px-4'>
        <div className='max-w-2xl mx-auto'>
          <Link to="/home" className='btn btn-ghost mb-6'>
            <ArrowLeftIcon className='size-5 mr-2' />
            Back to notes
          </Link>

          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-3xl font-bold mb-4 text-primary">
                Create New Note
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered input-primary"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Content</span>
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered textarea-primary h-40"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="card-actions mt-6">
                  <button
                    type="submit"
                    className={`btn btn-primary w-full py-3 rounded-xl font-semibold text-white shadow-md transition duration-150 ${
                      loading && 'btn-disabled'
                    }`}
                  >
                    {loading ? 'Creating...' : 'Create Note'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CreatePage
