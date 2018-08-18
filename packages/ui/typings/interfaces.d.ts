export namespace Pocket {
  export interface Product {
    itemId: number
    parentItemId: number
    name: string
    shortDescription: string
    longDescription: string
    msrp: number
    salePrice: number
    upc: string
    categoryPath: string
    brandName: string
    ninetySevenCentShipping: boolean
    standardShipRate: boolean
    size: string
    color: string
    marketplace: boolean
    customerRating: string
    numReviews: number
    clearance: boolean
    freeShippingOver35Dollars: boolean
    imageEntities: ImageEntity[]
  }
  export interface ImageEntity {
    thumbnailImage: string
    mediumImage: string
    largeImage: string
    entityType: string
  }
}
