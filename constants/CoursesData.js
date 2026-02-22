export const COURSES = [
  {
    id: '1',
    title: 'Pemrograman Arduino Dasar',
    category: 'ROBOTIK',
    price: 'GRATIS', // Perbaiki properti image
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
    description: 'Belajar dasar-dasar microcontroller dengan Arduino Uno. Kursus ini dirancang khusus untuk pemula yang belum pernah menyentuh koding atau merakit sirkuit elektronik sebelumnya. Di akhir kelas, kamu akan bisa membuat sistem lampu otomatis.',
    level: 'Pemula',
    duration: '4 Minggu',
    curriculum: ['Pengenalan Mikrokontroler', 'Instalasi & Navigasi Arduino IDE', 'Sirkuit Dasar & LED Blink', 'Membaca Input Tombol & Sensor Digital']
  },
  {
    id: '2',
    title: 'IoT: Smart Home System',
    category: 'IOT',
    price: 'Rp 150.000',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400',
    description: 'Koneksikan peralatan rumahmu ke internet dan kontrol melalui smartphone. Kita akan menggunakan board NodeMCU ESP8266 dan platform Blynk untuk membangun ekosistem Smart Home kamu sendiri.',
    level: 'Menengah',
    duration: '6 Minggu',
    curriculum: ['Konsep Dasar Internet of Things (IoT)', 'Setup NodeMCU ESP8266 & Library', 'Koneksi ke Jaringan WiFi', 'Kontrol Relay Jarak Jauh via Smartphone']
  },
  {
    id: '3',
    title: 'Python for AI Dasar',
    category: 'AI',
    price: 'Rp 200.000',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
    description: 'Mengenal dunia kecerdasan buatan (AI) menggunakan bahasa pemrograman Python. Kamu akan belajar mengolah data dan membuat model machine learning sederhana yang bisa memprediksi pola.',
    level: 'Lanjutan',
    duration: '8 Minggu',
    curriculum: ['Sintaks Dasar Bahasa Python', 'Manipulasi Data dengan Pandas & Numpy', 'Pengenalan Machine Learning', 'Membangun Model Prediksi Klasik']
  }
];