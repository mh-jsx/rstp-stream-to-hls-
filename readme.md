## Guide

### Local setup


#### server

Install ffmpeg on your machine [ffmpeg](https://ffmpeg.org/download.html)

Windows zip [ffmpeg.zip](https://github.com/BtbN/FFmpeg-Builds/releases)
For windows make sure to update environment variables after installation

Navigate to server folder and run "npm run dev"



#### client

Navigate to client folder and run "npm start"

For updating the server URL simply update "REACT_APP_API_URL" in .env file




#### Test

Simply goto [rtsp.stream](https://rtsp.stream/admin/dashboard), copy any stream url and your client url in browser along with param named "rtspUrl". 

For instance if the client is running on http:localhost:3000, then URL will looks something like this. 

http://localhost:3000/?rtspUrl=rtsp://rtspstream:37d235fb8dfe6532956626844cefa892@zephyr.rtsp.stream/movie
