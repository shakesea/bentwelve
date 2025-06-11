export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* What We Do */}
      <section className="text-center py-12 px-4">
        <h2 className="romanesco text-[64px] font-bold mb-4">What We Do?</h2>
        {/* <p className="max-w-2xl mx-auto bg-pink-100 p-4 rounded-md shadow"> */}
        <p className="max-w-4xl mx-auto bg-pink-100 p-6 text-lg rounded-md shadow-md">
          Kami fokus pada distribusi, aroma serta fungsi si Bunga. Produk kami selalu wangi dan bikin senang. Customer kami di seluruh dunia telah mengalami manfaat dari bunga-bunga kami yang eatable dan happy.
        </p>
      </section>
      {/* About Us */}
      <section className="flex justify-center py-12 px-4">
        <div className="w-full max-w-5xl bg-orange-100 p-8 rounded-md shadow-md flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Text kiri */}
          <div className="flex-1 text-left">
            <h3 className="text-3xl font-semibold mb-4">About Us</h3>
            <p className="text-lg">
              Kami adalah sekelompok pecinta bunga & monyet. Kami percaya bunga bukan sekadar wangi, tapi juga bisa dimakan dan membuat hidup lebih bahagia. Didirikan oleh tim absurd yang cinta keindahan dan kejenakaan.
            </p>
          </div>

          {/* Gambar dan nama kanan */}
          <div className="flex flex-col items-center">
            <img
              src="/customers/monyet.jpg"
              alt="Papale"
              className="w-40 h-40 object-cover rounded-full"
            />
            <div className="mt-3 text-center font-bold">
              <p>Papale</p>
              <p className="text-sm">Universe</p>
              <p className="text-xs">Sistem Informasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Review */}
      <section className="text-center py-12 px-4">
        <h2 className="text-3xl font-bold mb-8">Our Client Review</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="bg-pink-100 p-6 rounded-lg shadow-md text-left flex flex-col justify-between">
              <div>
                <div className="text-yellow-400 text-lg mb-2">⭐⭐⭐⭐⭐</div>
                <p className="text-sm mb-4">
                  Flower so good wangi wangi, eatable, dan i happy
                </p>
              </div>

              {/* Nama + Foto di bawah */}
              <div className="flex items-center gap-2 mt-auto">
                <img
                  src="/customers/nicholas.jpg"
                  alt="Nicholas"
                  className="w-8 h-8 object-cover rounded-full border-2 border-pink-400"
                />
                <p className="text-xs text-gray-600 font-semibold">Nicholas Olas olas</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Monkey */}
      <section className="text-center py-12 px-4">
        <h2 className="text-3xl font-bold mb-8">
          Team <span className="text-pink-500">Flowerscotch</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              name: 'Daniel Christantio',
              role: 'Owner Flowerscotch',
              image: '/daniel.jpg',
            },
            {
              name: 'Giovanni Wahyu Pratama',
              role: 'Florist',
              image: '/jopan.jpg',
            },
            {
              name: 'Kalvin Ardian Chi',
              role: 'Customer Service',
              image: '/kalvin.jpg',
            },
            {
              name: 'Nicholas Prakoswa',
              role: 'Pemasaran dan Media Sosial',
              image: '/ayau.jpg',
            },
          ].map((member, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <p className="text-pink-600 font-semibold text-lg">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
