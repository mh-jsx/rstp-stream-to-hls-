const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require("path");
const app = express();
const cors = require('cors');
const clearDirectory = require('./utils/clearDirectory');

// Load environment variables
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));

app.get('/', async (req, res) => {
    res.send('HLS Stream Server is running');
});

app.get('/start-stream', async (req, res) => {
    const { rtspUrl } = req.query;
    if (!rtspUrl) {
        return res.status(400).send('RTSP URL is required');
    }

    const directory = path.join(__dirname, 'public', 'streams');
    await clearDirectory(directory);
    
    const outName = `stream-${Date.now()}.m3u8`;
    const outputFile = path.join(directory, outName);

    startStreaming(rtspUrl, outputFile);


    res.send({
        hlsUrl: `streams/${outName}`
    })
});

// const ffmpegPath = 'C:\\FFmpeg\\bin\\ffmpeg.exe'; // Adjust path as necessary

// Set up your RTSP to HLS conversion
const startStreaming = (rtspUrl, outputFile) => {
    const ffmpeg = spawn(process.env.FFMPEG_PATH, [
        '-i', rtspUrl, // input RTSP URL
        '-c:v', 'libx264', // libx264 codec
        '-c:a', 'aac', // AAC codec
        '-ac', '1', // 1 audio channel
        '-strict', '-2', // allow experimental codecs
        '-crf', '23', // Constant Rate Factor (crf) - lower is better quality, but larger file
        '-profile:v', 'high', // H.264 profile
        '-maxrate', '800k', // max bitrate
        '-bufsize', '1600k', // buffer size
        '-pix_fmt', 'yuv420p', // pixel format
        '-flags', '+global_header', // global header for TS files
        '-hls_time', '10', // 10 second segment duration
        '-hls_list_size', '6', // Maxmimum number of playlist entries
        '-start_number', '1', // start the first segment at index 1
        outputFile // output HLS file
    ]);

    // Log output from FFmpeg
    ffmpeg.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // Log when FFmpeg closes
    ffmpeg.on('close', (code) => {
        console.log(`FFmpeg exited with code ${code}`);
    });
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


