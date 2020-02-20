const Queue = require("bull");
const config = require(__dirname + "/../config/config.js")[env];
const uuidv1 = require('uuid/v1');
const ytdl = require('ytdl-core');
const createVideoQueue = () => {
  const videoQueue = new Queue("Video Transcoding", {
    redis: {
      host: config.host,
      port: config.port
    }
  });

  videoQueue.process(async (job, done) => {
    const data = job.data;
    try {
      job.progress(0);
      global.io.emit('progress', {progress: 0, jobId: data.id});
      const uuid = uuidv1();
      const fileLocation = `./files/${uuid}.mp4`;
      await new Promise((resolve) => {
          ytdl(data.url).on('progress', (length, downloaded, totalLength) => {
              const progress = (downloaded/totalLength) * 100;
              if(progress >= 100) {
                  global.io.emit('videoDone', {fileLocation: `${uuid}.mp4`, jobId: data.id});
                  global.io.emit('progress', {progress: 100, jobId: data.id});
              }
          }).pipe(fs.createWriteStream(fileLocation))
          .on('finish', () => {
              resolve();
          })
      });

      await
    } catch (ex) {
      console.log(ex);
      job.moveToFailed();
    }
  });

  return videoQueue;
};

module.exports = {createVideoQueue};
