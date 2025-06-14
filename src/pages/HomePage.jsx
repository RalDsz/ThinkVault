import React from 'react';
import Navbar from './components/Navbar.jsx';
import Notecard from './components/Notecard.jsx';
import NotesNotFound from './components/NotesNotFound.jsx';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNotes } from '../features/notes/useNotes.js';
import { useNetworkStatus } from '../lib/useNetworkStatus.js';

const HomePage = () => {
  const {
    notes,
    setNotes,
    loading,
    searchTerm,
    setSearchTerm,
    groupedNotes,
    refetchNotes,
  } = useNotes();

  useNetworkStatus(refetchNotes);

  const columns = [
    {
      id: 'pending',
      title: 'PENDING',
      icon: '🕒',
      color: 'bg-red-50 border-red-200',
      headerColor: 'bg-red-100 text-red-800',
      count: groupedNotes.pending.length,
    },
    {
      id: 'current',
      title: 'CURRENT TASK',
      icon: '⚙️',
      color: 'bg-yellow-50 border-yellow-200',
      headerColor: 'bg-yellow-100 text-yellow-800',
      count: groupedNotes.current.length,
    },
    {
      id: 'completed',
      title: 'COMPLETED',
      icon: '✅',
      color: 'bg-green-50 border-green-200',
      headerColor: 'bg-green-100 text-green-800',
      count: groupedNotes.completed.length,
    },
  ];

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    // Dropped into trash
    if (destination.droppableId === 'trash') {
      try {
        await axios.delete(`http://localhost:5001/api/notes/${draggableId}`);
        toast.success('Note deleted!');
        refetchNotes();
      } catch (error) {
        console.error('Delete failed', error);
        toast.error('Failed to delete note.');
      }
      return;
    }

    // Reordering within or across columns
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceNotes = [...groupedNotes[source.droppableId]];
    const destNotes = [...groupedNotes[destination.droppableId]];
    const movedNote = sourceNotes.find(note => note._id === draggableId);

    if (!movedNote) return;

    sourceNotes.splice(source.index, 1);
    movedNote.status = destination.droppableId;
    destNotes.splice(destination.index, 0, movedNote);

    const updatedNotes = [];
    ['pending', 'current', 'completed'].forEach(columnId => {
      const notesInColumn = columnId === source.droppableId
        ? sourceNotes
        : columnId === destination.droppableId
        ? destNotes
        : groupedNotes[columnId];

      notesInColumn.forEach((note, index) => {
        updatedNotes.push({ ...note, position: index, status: columnId });
      });
    });

    setNotes(updatedNotes);

    try {
      await axios.post('http://localhost:5001/api/notes/reorder', {
        notes: updatedNotes
      });
      toast.success('Note order updated!');
    } catch (error) {
      console.error('Failed to update note order:', error);
      toast.error('Failed to update note order. Please try again.');
      refetchNotes();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 pb-24">
      <Navbar
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        className="sticky top-0 z-50 shadow-md"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 overflow-hidden">
        {loading && (
          <div className="text-center text-gray-600 py-10 font-bold animate-pulse">
            Loading...
          </div>
        )}

        {!loading && notes.length === 0 && <NotesNotFound />}

        {!loading && notes.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            {/* Dustbin on Left */}
            <div className="flex flex-col lg:flex-row gap-6">
              <Droppable droppableId="trash">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`w-full lg:w-16 h-24 lg:h-[calc(100vh-6rem)] rounded-lg border-2 border-dashed flex items-center justify-center text-2xl text-gray-500 ${
                      snapshot.isDraggingOver ? 'bg-red-200 text-red-700' : 'bg-white'
                    }`}
                  >
                    🗑️
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Columns */}
              <div className="w-full space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className={`w-full rounded-lg border-2 ${column.color} min-h-[20rem] lg:min-h-[30rem]`}
                  >
                    <div
                      className={`px-4 py-3 sticky top-0 z-10 ${column.headerColor} border-b rounded-t-lg flex justify-between items-center`}
                    >
                      <h2 className="font-bold text-md flex items-center gap-2">
                        <span className="text-lg">{column.icon}</span>
                        {column.title}
                      </h2>
                      <span
                        title={`${column.count} notes`}
                        className="bg-white bg-opacity-60 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {column.count}
                      </span>
                    </div>

                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-3 space-y-3 min-h-80 transition duration-200 ${
                            snapshot.isDraggingOver ? 'bg-blue-100 border-blue-300' : ''
                          }`}
                        >
                          {groupedNotes[column.id].map((note, index) => (
                            <Draggable
                              key={note._id}
                              draggableId={note._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`transition duration-200 ${
                                    snapshot.isDragging ? 'rotate-3 scale-105 shadow-lg' : ''
                                  }`}
                                >
                                  <Notecard note={note} setNotes={setNotes} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {groupedNotes[column.id].length === 0 && (
                            <div className="text-center text-gray-400 py-8">
                              <div className="text-3xl mb-2">📂</div>
                              <p className="text-sm italic">
                                {column.id === 'pending' && 'Nothing pending yet'}
                                {column.id === 'current' && 'No ongoing tasks'}
                                {column.id === 'completed' && 'No completed tasks'}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </div>
          </DragDropContext>
        )}
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="/create"
          className="bg-blue-600 text-white px-4 py-3 rounded-full shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2 animate-pulse lg:hidden"
        >
          <span className="text-xl">✏️</span>
          <span>New Note</span>
        </a>
      </div>
    </div>
  );
};

export default HomePage;
