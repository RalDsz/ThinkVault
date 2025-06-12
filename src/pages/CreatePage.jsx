import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'


const CreatePage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter all fields')
      return;
    }
    setLoading(true)
    try {
      await axios.post('https://thinkvault-backend-aqfg.onrender.com/api/notes', {
        title,
        content,
      })
      toast.success('Note created successfully')
      navigate("/")
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto '>
          <Link to={"/"} className='btn btn-ghost mb-6'>
          <ArrowLeftIcon className='size-5' />
          Back to notes
          </Link>
          
<div className="card bg-base-100">
  <div className="card-body">
    <h2 className="card-title text-2xl mb-4">Create New Note</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input 
          type="text"
          placeholder="Note Title"
          className="input input-bordered"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-control mb-4">
 <label className="label">
   <span className="label-text">Content</span>
 </label>
 <textarea
   placeholder="Write your note here..."
   className="textarea textarea-bordered h-32"
   value={content}
   onChange={(e) => setContent(e.target.value)}
 />
</div>
<div className="card-actions justify-end"></div>
<button type="submit" className="btn btn-primary w-full py-3 rounded-xl font-semibold text-white shadow-md transition" disabled={loading}>
  {loading ? 'Loading...' : 'Create Note'}
</button>
    </form>
  </div>
</div>

        </div>
      </div>
    </div>
  )
}

export default CreatePage
