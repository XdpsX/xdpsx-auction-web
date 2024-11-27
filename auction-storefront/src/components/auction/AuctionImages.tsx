import { useState } from 'react'
import { AuctionDetails } from '../../models/auction.type'
import PreviewImages from '../ui/PreviewImages'

function AuctionImages({ auction }: { auction: AuctionDetails }) {
  const [showImage, setShowImage] = useState('')

  const previewImages = [auction.mainImage, ...auction.images]

  return (
    <div className="space-y-5">
      <div className="p-5 border">
        <img
          className="w-full h-60 mx-auto object-contain"
          src={showImage ? showImage : previewImages[0]}
          alt="Product image"
        />
      </div>
      {auction.images && (
        <PreviewImages images={previewImages} setShowImage={setShowImage} />
      )}
    </div>
  )
}
export default AuctionImages
