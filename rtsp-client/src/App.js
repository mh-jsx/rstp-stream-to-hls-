import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './App.css';
import axios from 'axios';



function App() {
  const [streamUrl, setStreamUrl] = useState('');
  const [url, setUrl] = useState('');
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const rtspUrl = queryParams.get('rtspUrl');

    const fetchStream = async () => {
      if (!rtspUrl) {
        console.error('RTSP URL not provided in the query string.');
        setLoadError(true);
        return;
      }

      axios.get(`${process.env.REACT_APP_API_URL}/start-stream?rtspUrl=${encodeURIComponent(rtspUrl)}`).then((res) => {
        setLoadError(false);
          setUrl(res.data.hlsUrl);
      }).catch((error) => {
        console.error('Failed to start stream:', error);
        setLoadError(true);
      });
    };

    fetchStream();
  }, []);


  useEffect(() => {
    const checkStreamAvailable = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/${url}`, { method: 'HEAD' });
        if (response.ok) {
          setStreamUrl(url);
          setLoadError(false);
        } else {
          throw new Error('Stream not ready');
        }
      } catch (error) {
        console.error('Stream load error:', error);
        setLoadError(true);
        setTimeout(checkStreamAvailable, 2000); // Retry after 5 seconds
      }
    };

    if (url) {
      checkStreamAvailable();
    }
  }, [streamUrl, url]);

  return (
    <div>
      <h1>Live Stream</h1>
      {streamUrl ? (
        <ReactPlayer
          url={`${process.env.REACT_APP_API_URL}/${streamUrl}`}
          playing
          controls
          muted
          onError={() => {
            console.log('Player encountered an error with the stream');
            setStreamUrl('');
            setLoadError(true);
          }}
        />
      ) : loadError ? (
        <p>Stream loading... Please wait.</p>
      ) : (
        <p>Initializing stream...</p>
      )}
    </div>
  );
}

export default App;
