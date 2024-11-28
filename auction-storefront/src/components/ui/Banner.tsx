import Carousel from 'react-multi-carousel'

function Banner() {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  }
  return (
    <div className="container-lg mx-auto w-full flex md:gap-8">
      <div className="w-full">
        <Carousel
          autoPlay={true}
          infinite={true}
          arrows={true}
          showDots={true}
          responsive={responsive}
          removeArrowOnDeviceType={['tablet', 'mobile']}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02)), url(./banners/banner-${i}.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <img
                src={`./banners/banner-${i}.png`}
                alt={`Banner ${i}`}
                style={{ opacity: 0 }}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  )
}
export default Banner
