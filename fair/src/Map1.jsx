import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { auth, provider, db } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, updateDoc, doc, getDoc } from 'firebase/firestore';

// Fix for default icon not displaying
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map1 = () => {
  const location = useLocation();
  const { from } = location.state || {};

  const [locationData, setLocationData] = useState(null);
  const [innovations, setInnovations] = useState([]);
  const [newInnovation, setNewInnovation] = useState({ title: '', description: '' });
  const [user, setUser] = useState(null); // Track logged-in user

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${from}&format=json&limit=1`);
        const data = await response.json();
        if (data && data.length > 0) {
          setLocationData({
            name: from,
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          });
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    const fetchInnovations = () => {
      const q = query(collection(db, 'innovations'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const innovations = [];
        querySnapshot.forEach((doc) => {
          innovations.push({ id: doc.id, ...doc.data() });
        });
        setInnovations(innovations);
      });
      return unsubscribe;
    };

    if (from) {
      fetchLocationData();
      const unsubscribe = fetchInnovations();
      return () => unsubscribe(); // Cleanup listener on component unmount
    }
  }, [from]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); // Set the user state after successful sign-in
      console.log('User signed in with Google');
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInnovation((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddInnovation = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in with Google to add an innovation');
      return;
    }
    try {
      await addDoc(collection(db, 'innovations'), {
        ...newInnovation,
        location: from,
        votes: 0,
        votedBy: [],
        userId: user.uid,
        userName: user.displayName,
        timestamp: new Date().toISOString(), // Add a timestamp for the innovation
      });
      setNewInnovation({ title: '', description: '' }); // Clear form
      console.log('Innovation added to Firestore');
    } catch (error) {
      console.error('Error adding innovation: ', error);
    }
  };

  const handleUpvote = async (id) => {
    if (!user) {
      alert('You must be logged in with Google to vote');
      return;
    }

    const docRef = doc(db, 'innovations', id);
    const docSnapshot = await getDoc(docRef); // Fetch the document snapshot

    if (docSnapshot.exists()) {
      const docData = docSnapshot.data();
      if (docData.votedBy.includes(user.uid)) {
        alert('You have already voted');
        return;
      }

      try {
        await updateDoc(docRef, {
          votes: docData.votes + 1,
          votedBy: [...docData.votedBy, user.uid],
        });
        console.log('Vote added');
      } catch (error) {
        console.error('Error adding vote: ', error);
      }
    }
  };

  // Filter and sort innovations based on location and votes
  const filteredAndSortedInnovations = [...innovations]
    .filter((innovation) => innovation.location === from)
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100"
    style={{backgroundImage:'url(B2.png)'}}>
      <div className="p-6 bg-white rounded shadow-md mb-4">
        {!user ? (
          <button onClick={handleGoogleSignIn} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            Sign In with Google
          </button>
        ) : (
          <p>Welcome, {user.displayName}</p>
        )}

        {locationData && (
          <>
            <h2 className="text-lg font-bold">Location: {locationData.name}</h2>
            <MapContainer
              center={[locationData.lat, locationData.lng]}
              zoom={10}
              scrollWheelZoom={true}
              className="h-96 w-full mt-4"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[locationData.lat, locationData.lng]}>
                <Tooltip>{locationData.name}</Tooltip>
              </Marker>
            </MapContainer>
          </>
        )}

        <div className="mt-6 w-full">
          <h3 className="text-lg font-semibold">Our Ideas for {from}</h3>
          {filteredAndSortedInnovations.length === 0 ? (
            <p>No innovations found for this location.</p>
          ) : (
            <ul className="list-disc pl-5 mt-4">
              {filteredAndSortedInnovations.map((innovation) => (
                <li key={innovation.id} className="mb-2 flex items-center justify-between">
                  <div>
                    <strong>{innovation.title}</strong>: {innovation.description} (Votes: {innovation.votes})
                  </div>
                  <button
                    onClick={() => handleUpvote(innovation.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                  >
                    Upvote
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 w-full">
          <h3 className="text-lg font-semibold">Add New Innovation</h3>
          <form onSubmit={handleAddInnovation} className="flex flex-col space-y-4">
            <input
              type="text"
              name="title"
              value={newInnovation.title}
              onChange={handleInputChange}
              placeholder="Innovation Title"
              className="p-2 border border-gray-300 text-rose-100 rounded"
              required
            />
            <textarea
              name="description"
              value={newInnovation.description}
              onChange={handleInputChange}
              placeholder="Innovation Description"
              className="p-2 border border-gray-300 text-rose-100 rounded"
              rows="4"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Add Innovation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Map1;
