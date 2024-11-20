import Carousel from 'react-multi-carousel'

type PreviewImagesProps = {
  images: string[]
  setShowImage: (img: string) => void
}

function PreviewImages({ images, setShowImage }: PreviewImagesProps) {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
    },
    mdtablet: {
      breakpoint: { max: 991, min: 464 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
    smmobile: {
      breakpoint: { max: 640, min: 0 },
      items: 2,
    },
    xsmobile: {
      breakpoint: { max: 440, min: 0 },
      items: 1,
    },
  }
  return (
    <Carousel
      autoPlay={true}
      infinite={true}
      responsive={responsive}
      transitionDuration={500}
      itemClass="mr-4"
    >
      {images.map((img, index) => {
        return (
          <div
            key={index}
            onClick={() => setShowImage(img)}
            className="border cursor-pointer p-1 flex justify-center items-center"
          >
            <img
              className="w-32 h-20 object-contain "
              src={img}
              alt="Image Preview"
            />
          </div>
        )
      })}
    </Carousel>
  )
}
export default PreviewImages
