import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/notes');
      setNotes(response.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
      toast.error('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedNotes = {
    pending: filteredNotes.filter(note => note.status === 'pending'),
    current: filteredNotes.filter(note => note.status === 'current'),
    completed: filteredNotes.filter(note => note.status === 'completed'),
  };

  return {
    notes,
    setNotes,
    loading,
    searchTerm,
    setSearchTerm,
    groupedNotes,
    refetchNotes: fetchNotes, // ✅ FIXED: match what HomePage expects
  };
};
