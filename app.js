const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/downloadVideo', async (req, res) => {
  const url = req.query.url;
  try {
    console.log('Request received'); // Log statement
    const videoInfo = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest' });
    // Validate the YouTube URL
    if (!ytdl.validateURL(url)) {
      console.error('Invalid YouTube URL:', url);
      return res.send('Invalid YouTube URL');
  }
  // Log a message to check if the validation is successful
        console.log('YouTube URL is valid');
         // Get video info
         const info = await ytdl.getInfo(url);
        // Log video information for debugging
        console.log('Video Information:', info);

    res.header('Content-Disposition', `attachment; filename="${videoInfo.title}.mp4"`);
    // res.header('Content-Disposition', `attachment; filename="${videoInfo.title}.mp4"`);
    ytdl(url, { format }).pipe(res);
    console.log('Video download completed.');
  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).send('Error downloading video.');
  }
});

app.get('/downloadAudio', async (req, res) => {
  const url = req.query.url;
  try {
    const videoInfo = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' });

    res.header('Content-Disposition', `attachment; filename="${videoInfo.title}.mp3"`);
    ytdl(url, { format })
      .pipe(res)
      .on('finish', () => {
        console.log('Audio download completed.');
      });
  } catch (error) {
    console.error('Error downloading audio:', error);
    res.status(500).send('Error downloading audio.');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
