# KyoUploader

KyoUploader adalah aplikasi uploader file sederhana berbasis Node.js yang dilengkapi dengan UI modern, monitoring status server, dan pembersihan file otomatis. Aplikasi ini memungkinkan pengguna untuk mengupload file, melihat metrik server secara real-time (CPU, memory, dan disk usage), serta secara otomatis menghapus file yang berumur lebih dari satu minggu.

## Fitur

- **File Upload:** Pengguna dapat mengupload file melalui antarmuka web yang responsif.
- **Unique Filename Generation:** Setiap file yang diupload disimpan dengan nama acak untuk mencegah tabrakan nama.
- **Automatic File Cleanup:** File yang berumur lebih dari satu minggu akan dihapus secara otomatis.
- **Server Monitoring:** Endpoint `/status` menyediakan informasi seperti uptime, jumlah file, CPU usage, memory usage, dan disk usage.
- **Dynamic Port Configuration:** Menggunakan environment variable `PORT` sehingga mendukung deployment di platform seperti Railway.
- **Modern UI:** Tampilan halaman uploader dan status didesain agar bersih, modern, dan mudah dibaca.

## Struktur Proyek

```
KyoUploader/
├── file/                # Direktori untuk menyimpan file yang diupload (dibuat secara otomatis)
├── public/              # Folder aset publik (HTML, CSS, dll.)
│   ├── index.html       # Halaman uploader
│   ├── status.html      # Halaman dashboard monitoring status server
│   └── styles.css       # Styling untuk halaman-halaman
├── server.js            # File server utama (Express, Multer, dll.)
├── package.json         # Konfigurasi project dan dependencies
└── README.md            # File ini
```

## Instalasi Lokal

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/KyoUploader.git
   cd KyoUploader
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi (Opsional)**
   ```bash
   export PORT=5000   # Untuk Linux/Mac
   set PORT=5000      # Untuk Windows (CMD)
   ```

4. **Jalankan Aplikasi**
   ```bash
   npm start
   ```

5. **Akses Aplikasi**
   - [http://localhost:3000](http://localhost:3000)
   - [http://localhost:3000/status](http://localhost:3000/status)

## Deployment di Railway

1. **Buat Akun Railway** di [Railway](https://railway.app/).
2. **Hubungkan Repository ke Railway** melalui **New Project**.
3. **Konfigurasi Deployment** dengan `start` script dari `package.json`.
4. **Deploy dan Uji Aplikasi** melalui URL yang diberikan Railway.

## Dependencies

- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)
- [check-disk-space](https://www.npmjs.com/package/check-disk-space)
- Modul bawaan Node.js: `path`, `fs`, `crypto`, `os`

## License

Project ini dilisensikan di bawah [MIT License](LICENSE).

## Contributing

Silakan fork repository ini dan buat pull request untuk perbaikan atau penambahan fitur.

## Contact

- **Yudha Yudistira** – [yudayudistira727@gmail.com](mailto:yudayudistira727@gmail.com)

