'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Welcome from '@/app/ui/customers/welcome';
import styles from './index.module.css';

const carouselItems = [
  {
    image: '/married.png',
    alt: 'Deskripsi',
    heading: 'Musim Pernikahan',
    subheading: 'Biarkan hari spesial Anda mekar',
    subheadingColor: 'text-pink-400',
    description: 'Temukan kami, di mana impian Anda menjadi nyata',
  },
  {
    image: '/decor2.png',
    alt: 'Dekorasi',
    heading: 'Dekorasi',
    subheading: '🎀 Dekorasi Elegan untuk Berbagai Acara',
    subheadingColor: 'text-red-400',
    description:
      'Buat momen spesial lebih berkesan dengan dekorasi bunga untuk pernikahan, acara formal, dan perayaan intim.',
  },
  {
    image: '/workshop.png',
    alt: 'Workshop',
    heading: 'Acara & Workshop',
    subheading: '🌿 Belajar Merangkai Bunga',
    subheadingColor: 'text-green-400',
    description:
      'Ikuti workshop eksklusif dari Flowerscotchs dan pelajari cara membuat buket indah dengan teknik profesional.',
  },
  {
    image: '/bucket.png',
    alt: 'Buket',
    heading: 'Buket & Bunga Segar',
    subheading: '💐 Koleksi Buket & Bunga Segar',
    subheadingColor: 'text-blue-400',
    description:
      'Dari mawar hingga bunga eksotis, kami menghadirkan buket indah yang dibuat dengan cinta untuk setiap acara.',
  },
];

export default function FlowersPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles.container}>
      {/* Header Section dengan Carousel */}
      <header className={styles.header}>
        <section className={styles.carouselSection}>
          <button onClick={handlePrev} className={styles.carouselButtonLeft}>
            ←
          </button>

          <div className={styles.carouselContent}>
            {carouselItems.map((item, index) => (
              <div
                key={index}
                className={`${styles.carouselItem} ${index === currentIndex ? 'block' : 'hidden'}`}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={1200}
                  height={400}
                  className={styles.carouselImage}
                />

                {/* Dot indikator di bawah gambar */}
                <div className={styles.carouselIndicators}>
                  {carouselItems.map((_, i) => (
                    <span
                      key={i}
                      className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''}`}
                      onClick={() => setCurrentIndex(i)}
                    />
                  ))}
                </div>

                <div className={styles.carouselText}>
                  <h1 className={styles.carouselHeading}>{item.heading}</h1>
                  <p className={styles.carouselSubheading}>{item.subheading}</p>
                  <a href="#kontak" className={styles.carouselLink}>
                    {item.description}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleNext} className={styles.carouselButtonRight}>
            →
          </button>
        </section>
      </header>

      {/* Bagian lain tidak berubah */}
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeText}>
          <Welcome />
        </h1>
      </div>

      <section className={styles.specialtySection}>
        <h2 className={styles.sectionHeading}>Spesialisasi Kami</h2>
        <div className={styles.specialtyImages}>
          <Image src="/f1.png" alt="Spesialisasi 1" width={200} height={200} className={styles.specialtyImage} />
          <Image src="/f2.png" alt="Spesialisasi 2" width={200} height={200} className={styles.specialtyImage} />
          <Image src="/f3.png" alt="Spesialisasi 3" width={200} height={200} className={styles.specialtyImage} />
        </div>
      </section>

      <section className={styles.servicesSection}>
        <h2 className={styles.sectionHeading}>Layanan Flowerscotch</h2>
        <div className={styles.serviceItems}>
          <div className={styles.serviceItem}>
            <Image src="/chatgpt1.png" alt="Sentuhan Pribadi" width={200} height={200} className={styles.serviceImage} />
            <h3 className={styles.serviceHeading}>Terhubung Secara Pribadi</h3>
            <p className={styles.serviceDescription}>Layanan yang dapat disesuaikan...</p>
            <a href="#pelajari-lebih-lanjut" className={styles.serviceLink}>Pelajari Lebih Lanjut</a>
          </div>
          <div className={styles.serviceItem}>
            <Image src="/chatgpt3.png" alt="Butuh Bunga Sekarang?" width={200} height={200} className={styles.serviceImage} />
            <h3 className={styles.serviceHeading}>Butuh Bunga Sekarang?</h3>
            <p className={styles.serviceDescription}>Pesan di hari yang sama...</p>
            <a href="#pelajari-lebih-lanjut" className={styles.serviceLink}>Pelajari Lebih Lanjut</a>
          </div>
          <div className={styles.serviceItem}>
            <Image src="/chatgpt2.png" alt="Jaminan Kepuasan" width={200} height={200} className={styles.serviceImage} />
            <h3 className={styles.serviceHeading}>Jaminan Kepuasan</h3>
            <p className={styles.serviceDescription}>Kepuasan terjamin...</p>
            <a href="#pelajari-lebih-lanjut" className={styles.serviceLink}>Pelajari Lebih Lanjut</a>
          </div>
        </div>
      </section>

      <section className={styles.locationSection}>
        <div className={styles.locationContent}>
          <h2 className={styles.sectionHeading}>Lokasi Kami</h2>
          <p className={styles.locationText}>
            Jl. Melati Indah No. 27, Kel. Sakura, Kec. Bloomville, Kota Florencia 12345 🌸
          </p>
          <button className={styles.locationButton}>Peta</button>
        </div>
        <Image src="/place.png" alt="Lokasi Toko" width={300} height={200} className={styles.locationImage} />
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <h3 className={styles.footerHeading}>Mekar Bersama Kami</h3>
          <p className={styles.footerSubheading}>Gabung dengan Tim Kami</p>
          <div className={styles.corporateGifting}>
            <h4 className={styles.corporateHeading}>Hadiah Perusahaan</h4>
            <p className={styles.corporateText}>Isi formulir di bawah ini...</p>
            <a href="#kontak" className={styles.corporateLink}>
              Mari berkolaborasi dengan Flowerscotch
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
