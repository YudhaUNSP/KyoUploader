const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const os      = require('os');
const checkDiskSpace = require('check-disk-space').default;

const app = express();
const port = process.env.PORT || 3000;

const fileDir = path.join(__dirname, 'file');
if (!fs.existsSync(fileDir)) {
  fs.mkdirSync(fileDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    const randomNum = ('000' + Math.floor(Math.random() * 1000)).slice(-3);
    const newName = `${baseName}-${randomNum}${ext}`;
    cb(null, newName);
  }
});

// Batasi ukuran file hingga 50 MB
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});

app.use(express.static('public'));
app.use('/file', express.static('file'));

app.post('/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.send(`
          <!DOCTYPE html>
          <html lang="id">
          <head>
            <meta charset="UTF-8">
            <title>Error Upload</title>
            <script>
              alert("Ukuran file melebihi batas 50MB.");
              window.location.href = "/";
            </script>
          </head>
          <body></body>
          </html>
        `);
      }
      return res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <title>Error Upload</title>
          <script>
            alert("Terjadi kesalahan saat mengupload file.");
            window.location.href = "/";
          </script>
        </head>
        <body></body>
        </html>
      `);
    } else if (err) {
      return res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <title>Error Upload</title>
          <script>
            alert("Terjadi kesalahan saat mengupload file.");
            window.location.href = "/";
          </script>
        </head>
        <body></body>
        </html>
      `);
    }
    
    if (!req.file) {
      return res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <title>Error Upload</title>
          <script>
            alert("File tidak ada.");
            window.location.href = "/";
          </script>
        </head>
        <body></body>
        </html>
      `);
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/file/${req.file.filename}`;
    res.send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Upload Sukses</title>
        <script type='text/javascript' src='//pl25941223.effectiveratecpm.com/10/27/80/1027803ebe16fdba035d90382ec85fc1.js'></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            background-color: #f5f7fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            background-color: #fff;
            max-width: 600px;
            width: 100%;
            margin: 20px;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #333;
          }
          p {
            margin-bottom: 20px;
            color: #555;
            line-height: 1.6;
          }
          a {
            color: #007BFF;
            text-decoration: none;
            font-weight: bold;
          }
          a:hover {
            text-decoration: underline;
          }
          .file-link {
            word-wrap: break-word;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Upload Sukses</h1>
          <p>File berhasil diupload.</p>
          <p class="file-link">
            Link: <a href="${fileUrl}" target="_blank">${fileUrl}</a>
          </p>
          <p><a href="/">Kembali ke Uploader</a></p>
        </div>
      </body>
      </html>
    `);
  });
});

function cpuAverage() {
  const cpus = os.cpus();
  let totalIdle = 0, totalTick = 0;
  cpus.forEach(cpu => {
    for (let type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });
  return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

function getCpuUsage() {
  return new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      const idleDiff = end.idle - start.idle;
      const totalDiff = end.total - start.total;
      const usage = 100 - Math.floor(100 * idleDiff / totalDiff);
      resolve(usage);
    }, 100);
  });
}

app.get('/status', async (req, res) => {
  if (req.accepts('html') && !req.headers['accept'].includes('application/json')) {
    return res.sendFile(path.join(__dirname, 'public', 'status.html'));
  }
  try {
    const files = await fs.promises.readdir(fileDir);
    const cpuUsage = await getCpuUsage();

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercent = ((usedMem / totalMem) * 100).toFixed(2);
    const diskInfo = await checkDiskSpace(fileDir);
    const usedDisk = diskInfo.size - diskInfo.free;
    const diskUsagePercent = diskInfo.size > 0 ? ((usedDisk / diskInfo.size) * 100).toFixed(2) : '0';

    res.json({
      status: 'ok',
      uptime: process.uptime(),
      fileCount: files.length,
      timestamp: Date.now(),
      cpuUsage,
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usagePercent: memUsagePercent
      },
      disk: {
        total: diskInfo.size,
        used: usedDisk,
        free: diskInfo.free,
        usagePercent: diskUsagePercent
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Gagal mendapatkan status', error: err.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

function cleanupFiles() {
  fs.readdir(fileDir, (err, files) => {
    if (err) {
      console.error('Error membaca folder file:', err);
      return;
    }
    files.forEach(file => {
      const filePath = path.join(fileDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error mendapatkan stats file:', err);
          return;
        }
        const fileAge = Date.now() - stats.birthtimeMs;
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 hari dalam milidetik
        if (fileAge > oneWeek) {
          fs.unlink(filePath, err => {
            if (err) {
              console.error('Gagal menghapus file:', filePath, err);
            } else {
              console.log('File dihapus:', filePath);
            }
          });
        }
      });
    });
  });
}

setInterval(cleanupFiles, 60 * 60 * 1000);