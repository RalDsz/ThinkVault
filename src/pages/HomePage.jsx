import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import axios from 'axios';
import Notecard from './components/Notecard.jsx';
import NotesNotFound from './components/NotesNotFound.jsx';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch notes function extracted so we can call it anytime
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://thinkvault-backend-aqfg.onrender.com/api/notes');
      setNotes(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes. Please try again.');
    }
  };

  useEffect(() => {
    fetchNotes();

    // Offline / online event handlers
    function handleOffline() {
      toast.error('You have lost connection', { id: 'network-status' });
    }

    function handleOnline() {
      toast.dismiss('network-status'); // remove offline toast
      toast.success('Connection restored, syncing...', { id: 'network-status' });
      fetchNotes(); // re-fetch data to sync
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Filter notes based on search term
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group filtered notes by status
  const groupedNotes = {
    pending: filteredNotes.filter(note => note.status === 'pending'),
    current: filteredNotes.filter(note => note.status === 'current'),
    completed: filteredNotes.filter(note => note.status === 'completed')
  };

  const columns = [
    {
      id: 'pending',
      title: 'PENDING',
      color: 'bg-red-50 border-red-200',
      headerColor: 'bg-red-100 text-red-800',
      count: groupedNotes.pending.length
    },
    {
      id: 'current',
      title: 'CURRENT TASK',
      color: 'bg-yellow-50 border-yellow-200',
      headerColor: 'bg-yellow-100 text-yellow-800',
      count: groupedNotes.current.length
    },
    {
      id: 'completed',
      title: 'COMPLETED',
      color: 'bg-green-50 border-green-200',
      headerColor: 'bg-green-100 text-green-800',
      count: groupedNotes.completed.length
    }
  ];

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const noteToMove = notes.find(note => note._id === draggableId);
    if (!noteToMove) return;

    const updatedNotes = notes.map(note =>
      note._id === draggableId
        ? { ...note, status: destination.droppableId }
        : note
    );

    setNotes(updatedNotes);

    try {
      await axios.put(`https://thinkvault-backend-aqfg.onrender.com/api/notes/${draggableId}`, {
        ...noteToMove,
        status: destination.droppableId
      });
      toast.success(`Moved note to ${destination.droppableId}`);
    } catch (error) {
      setNotes(notes); // revert on error
      console.error('Failed to update note status:', error);
      toast.error('Failed to update note status. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={setSearchTerm} searchTerm={searchTerm} />

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-gray-600 py-10 font-bold">Loading...</div>}

        {!loading && filteredNotes.length === 0 && <NotesNotFound />}

        {!loading && filteredNotes.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {columns.map((column) => (
                <div key={column.id} className={`rounded-lg border-2 ${column.color} min-h-96`}>
                  <div className={`px-4 py-3 rounded-t-lg ${column.headerColor} border-b`}>
                    <div className="flex justify-between items-center">
                      <h2 className="font-bold text-sm">{column.title}</h2>
                      <span className="bg-white bg-opacity-60 px-2 py-1 rounded-full text-xs font-medium">
                        {column.count}
                      </span>
                    </div>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-4 min-h-80 transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-opacity-70' : ''}`}
                      >
                        {groupedNotes[column.id].map((note, index) => (
                          <Draggable key={note._id} draggableId={note._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`transition-transform duration-200 ${snapshot.isDragging ? 'rotate-3 scale-105' : ''}`}
                              >
                                <Notecard note={note} setNotes={setNotes} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {groupedNotes[column.id].length === 0 && (
                          <div className="text-center text-gray-400 py-8">
                            <div className="text-4xl mb-2">📝</div>
                            <p className="text-sm">Drop notes here</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default HomePage;
