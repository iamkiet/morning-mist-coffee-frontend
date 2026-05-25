import Image from 'next/image';

export default function StoryPage() {
  return (
    <main className="pt-24 bg-background">
      {/* Hero Section */}
      <section className="relative h-[870px] w-full overflow-hidden flex items-center px-12 justify-center">
        <div className="absolute inset-0 z-0 scale-105">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8QEDeawhSGXwMhz1q7-gtPaK8KLK600UJi2vnA61OerMa6u953F1HjXxWZwbL5f2FU-ggKmHRCYNoio0m0JL5NVNnnkRF207BcSfUWaU4c2rulvMAoZHYJFgACmH4UvBrWW0fM4Z2sB0Ts1FG_uRmA5usQDYSlnH4-6ZKi-JP5snoOpYnPhIiqpfbipwRZU64DQqy4ZN5LLSnrnZ04C2QbkL27sOaSfIlO2mo4dM_2vQU3wKMU55o19cu67BnmiTCqhqsffKmpj0"
            alt="Misty coffee plantation at dawn"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        </div>
        <div className="relative z-10 text-center px-gutter max-w-4xl">
          <span className="text-xs uppercase tracking-[0.3em] text-primary mb-6 block">
            Khởi Nguồn
          </span>
          <h1 className="text-4xl font-light text-foreground mb-8">
            Nơi đất trời thở nhẹ <br className="hidden md:block" /> và thời gian
            trôi chậm lại.
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto italic">
            Todaywegrind được khai sinh từ sự tĩnh lặng và trong trẻo của sương sớm vùng cao,
            nơi mỗi hạt cà phê tự kể câu chuyện về mảnh đất đã ôm ấp và nuôi dưỡng nó.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-xl px-gutter bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-lg items-center">
          <div className="md:col-span-6 space-y-md">
            <span className="text-xs uppercase tracking-widest text-primary">
              Triết Lý
            </span>
            <h2 className="text-2xl font-light text-foreground leading-tight">
              Nghệ Thuật Từ <br className="hidden md:block" /> Sự Thưởng Thức Chậm Rãi
            </h2>
            <div className="w-12 h-px bg-accent" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[28rem]">
              Chúng tôi tin rằng cà phê không chỉ đơn thuần là thức uống, mà là nghi thức của sự hiện diện.
              Giữa một thế giới hối hả và đòi hỏi tốc độ, Todaywegrind mời gọi bạn dừng lại và sống trọn từng khoảnh khắc.
              Triết lý của chúng tôi được định nghĩa bằng &ldquo;Chủ nghĩa Tối giản Bản địa&rdquo; — cam kết gạt bỏ những tạp âm
              cuộc sống và tôn vinh vẻ đẹp nguyên bản, mộc mạc của nghệ thuật thủ công tinh xảo.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[28rem]">
              Mỗi mẻ rang là một cuộc đối thoại đầy suy tư giữa hạt cà phê và người nghệ nhân,
              diễn ra trong sự tĩnh lặng của làn sương sớm vùng cao.
            </p>
          </div>
          <div className="md:col-span-6 relative aspect-[4/5] bg-muted overflow-hidden">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWsTLsdoTDI_GDXjxR54VXkq5h_RompGiymV52_9aRS8Okmf1tqotSJET0IjRNFd3zN390f5hnqkjvFld1ZS6kitoJTxBppidk5_Y0kxkEtfce063cgbps1qSCIB856f8C_s9XisG2Z-n_IKZRyWl08M_RWPyZVk7XkCpsNFtN5Idk3aABLDHb224oGkSq0-UQxJycL7xBnOIyLNKy79h8yDijxRdVBCoFaG6naZ3WfsYUnSe_4ds8NqCMglLDeIz3s9F6E_A8kMk"
              alt="Quiet coffee moment"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale-[20%]"
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-xl px-gutter bg-card">
        <div className="max-w-7xl mx-auto text-center mb-xl">
          <span className="text-xs uppercase tracking-widest text-primary block mb-4">
            Nghệ Thuật Thủ Công
          </span>
          <h2 className="text-2xl font-light text-foreground">
            Sự Tỉ Mỉ Và Chính Xác Thủ Công
          </h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-md">
          {[
            {
              alt: 'Nguồn Cung Ứng Tử Tế',
              src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG07lb1YGXB-tjqfZdAveDZgc4RWZ3dM3mFo8BTs5LMC7273947PO5VdRS8TYs0QRTl-VXLxEEtKZKscs5Es3sDBxhYeQprq_lJUL3G__FH0NZbzskBM9V0nk32XVH1ljK5e4kdJms1AKy1q-pGhNPNe8Ji6Avp0lp3VH6k_4rFIimtmCs7aMwVx5j9Tbgp8YWiXsW4Kz_sAEUakvcCpjUdu2v-HsDNiYDHNGLEPJmId9yjpkM9Wvi24UXDR1xNqN9VLuJimFNWc8',
              title: '01. Nguồn Cung Ứng Tử Tế',
              body: 'Chúng tôi hợp tác độc quyền với các nông hộ quy mô nhỏ thực hành nông nghiệp tái sinh, đảm bảo mỗi hạt cà phê đều được thu hoạch trong sự tôn kính đất mẹ.',
            },
            {
              alt: 'Quy Trình Rang Chậm',
              src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAILILoSx2SeXS78uco3b96treOJnEtLeyigSYMkDBgMst6Xoz2OdAVhvGNP8kafR28xApDiB2RgiwU6S6GACKCEG2mDs8MR24p7_WvYEgtZprymO1hxYs9cEjWw1OIi6PqFiwEm2MGvAERTPjCsx2Li2gL9YmB_mnxAxT5nYhMBvgjUdQ6oIVKV6jYxqkIWI-zKuPuZJxHk1bZcL8BlAjbafDOkP7StHcDPQr5iSVIwoaqeh0bSlbC3VjYKKOEYExaiNEkgUJE9E',
              title: '02. Rang Chậm Tỉ Mỉ',
              body: 'Từng mẻ nhỏ được rang chậm bằng công nghệ lưu chuyển khí nóng (air-flow) nhằm giữ trọn vẹn những nốt hương hoa thanh tao và vị sương sớm đặc trưng của vùng thổ nhưỡng.',
            },
            {
              alt: 'Đóng Gói Chỉn Chu',
              src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTA30OBJ_4dfGpiSJGR5MbrAOaqLA3esSzJI_1doEfpjBaci-1p3-5ufEFiUnvDJSEp2pGVlQ-Jtp9ky-WNx0pP-pqyTqb-Im0IksoeRhPlBm_JZCB1nuuMv7OF8YarIqdhKKaoDQjZk06AiQhTW2MAMmvlTcKiq26dvRImkUkR4NyYsm0dvEUrmHusyAe4rfoRFScgRXrEQ3fM2nGEM3LiPgLZyDs9gIv1eqWewj2dWO85s_aIYRH4J3WHm-iqIM7UNhFAhFZuj0',
              title: '03. Đóng Gói Chỉn Chu',
              body: 'Mỗi túi cà phê đều được đóng dấu thủ công và đựng trong bao bì tự phân hủy sinh học, gửi kèm cẩm nang pha chế được thiết kế riêng dành cho lối sống chậm.',
            },
          ].map(({ alt, src, title, body }) => (
            <div key={title} className="group">
              <div className="relative aspect-square bg-muted overflow-hidden mb-6">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-base font-medium text-foreground mb-2">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-xl px-gutter bg-background">
        <div className="max-w-4xl mx-auto border border-accent/20 p-lg text-center">
          <span className="text-xs uppercase tracking-widest text-primary block mb-6">
            Cam Kết Của Chúng Tôi
          </span>
          <h2 className="text-4xl font-light text-foreground mb-8">
            Sự thuần khiết hơn tốc độ. <br className="hidden md:block" /> Giá trị thủ công
            hơn tính thương mại.
          </h2>
          <p className="text-base text-muted-foreground mb-lg italic">
            &ldquo;Chúng tôi không hướng tới việc trở thành nhà rang xay lớn nhất thế giới,
            mà là nơi trọn vẹn nhất trong từng ý niệm. Lời hứa của chúng tôi là luôn duy trì
            sự minh bạch của chuỗi cung ứng và sự bình yên trong từng trải nghiệm thưởng thức của bạn.&rdquo;
          </p>
          <div className="flex justify-center">
            <div className="h-16 w-px bg-accent/30" />
          </div>
          <p className="mt-8 text-xs uppercase tracking-wider text-muted-foreground">
            Những người sáng lập Todaywegrind
          </p>
        </div>
      </section>
    </main>
  );
}
