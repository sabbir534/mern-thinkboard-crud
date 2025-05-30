import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log("Notes fetched", res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes", error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Error fetching notes");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);
  return (
    <div className="max-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto p-4 mt-6">
        {isLoading && (
          <div className="text-center text-primary py-10">Loading...</div>
        )}
        {notes.length === 0 && !isRateLimited && <NotesNotFound />}
        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
