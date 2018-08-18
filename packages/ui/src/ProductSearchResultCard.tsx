import './ProductSearchResultCard.css'
import * as React from 'react'
import { Button, Card, Image, Label, Icon } from 'semantic-ui-react'
import { Pocket } from 'typings/interfaces'

// const item = {
//   itemId: 12662817,
//   parentItemId: 12662817,
//   name: 'Oakland Living Rose Patio Bistro Set',
//   msrp: 9999,
//   salePrice: 98.99,
//   upc: '730050025318',
//   categoryPath: 'Patio & Garden/Patio Furniture/Outdoor Bistro Sets',
//   shortDescription:
//     'Bring style and functionality to your outdoor living space with the Rose 3-Piece Bistro Patio Set. It comes with a round table with two chairs in an elegant rose pattern. This attractive patio furniture bistro set has furniture legs made of sturdy cast iron. It offers a traditional style with an antique bronze finish and an aluminum table top. It is ideal for an intimate dinner for two or an afternoon cup of tea. This charming Rose 3-Piece Bistro Patio Set is suitable for placement in a garden, three-season room, on a patio or deck. A hole in the center of the table allows you to accessorize with an umbrella offering shade from the sun. It complements a wide range of outdoor decors. It is easy to assemble and each chair in this comfortable seating group has the capacity to support up to 200 lbs.',
//   longDescription:
//     "&lt;p&gt;&nbsp;&lt;/p&gt;Oakland Living Specializing in the creation of top-notch cast aluminum, iron, resin wicker, and stone outdoor furniture and accents, Oakland Living has been in the outdoor-furniture manufacturing business for over 15 years. From garden stones to complete furniture sets, they're renowned for their ability to provide their customers with high-quality pieces at a great price. A 72,000-square-foot distribution center, located in Rochester, MI, houses a supply of their best sellers, making it easy and convenient to ship items quickly to customers across the nation.",
//   brandName: 'Oakland Living',
//   thumbnailImage:
//     'https://i5.walmartimages.com/asr/b1b45982-8aea-4568-b6a3-e7790b362cb9_1.8ad247b6147ca02a8cce2a5b695b7407.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
//   mediumImage:
//     'https://i5.walmartimages.com/asr/b1b45982-8aea-4568-b6a3-e7790b362cb9_1.8ad247b6147ca02a8cce2a5b695b7407.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
//   largeImage:
//     'https://i5.walmartimages.com/asr/b1b45982-8aea-4568-b6a3-e7790b362cb9_1.8ad247b6147ca02a8cce2a5b695b7407.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
//   productTrackingUrl:
//     'http://linksynergy.walmart.com/fs-bin/click?id=|LSNID|&offerid=223073.7200&type=14&catid=8&subid=0&hid=7200&tmpid=1082&RD_PARM1=https%253A%252F%252Fwww.walmart.com%252Fip%252FOakland-Living-Rose-Patio-Bistro-Set%252F12662817%253Faffp1%253DoIWTPghFoDduvaSTXQQRlToaGCPjUzbt9tHVIxt9Ir4%2526affilsrc%253Dapi',
//   ninetySevenCentShipping: false,
//   standardShipRate: 0,
//   size: 'Table=23.5x23.5x275 x 23',
//   color: 'BronzeOther',
//   marketplace: true,
//   modelNumber: '3705-IA-AB',
//   sellerInfo: 'Hayneedle',
//   productUrl:
//     'http://c.affil.walmart.com/t/api01?l=https%3A%2F%2Fwww.walmart.com%2Fip%2FOakland-Living-Rose-Patio-Bistro-Set%2F12662817%3Faffp1%3DoIWTPghFoDduvaSTXQQRlToaGCPjUzbt9tHVIxt9Ir4%26affilsrc%3Dapi%26veh%3Daff%26wmlspartner%3Dreadonlyapi',
//   customerRating: '4.298',
//   numReviews: 876,
//   customerRatingImage: 'http://i2.walmartimages.com/i/CustRating/4_3.gif',
//   categoryNode: '5428_91416_1225083',
//   rhid: '30741',
//   bundle: false,
//   clearance: false,
//   preOrder: false,
//   stock: 'Available',
//   attributes: {
//     color: 'Other',
//     size: 'Table=23.5x23.5x27',
//     sportsTeam: 'Blank'
//   },
//   addToCartUrl:
//     'http://c.affil.walmart.com/t/api01?l=http%3A%2F%2Faffil.walmart.com%2Fcart%2FaddToCart%3Fitems%3D12662817%7C1%26affp1%3DoIWTPghFoDduvaSTXQQRlToaGCPjUzbt9tHVIxt9Ir4%26affilsrc%3Dapi%26veh%3Daff%26wmlspartner%3Dreadonlyapi',
//   affiliateAddToCartUrl:
//     'http://linksynergy.walmart.com/fs-bin/click?id=|LSNID|&offerid=223073.7200&type=14&catid=8&subid=0&hid=7200&tmpid=1082&RD_PARM1=http%253A%252F%252Faffil.walmart.com%252Fcart%252FaddToCart%253Fitems%253D12662817%257C1%2526affp1%253DoIWTPghFoDduvaSTXQQRlToaGCPjUzbt9tHVIxt9Ir4%2526affilsrc%253Dapi',
//   freeShippingOver35Dollars: false,
//   imageEntities: [
//     {
//       thumbnailImage:
//         'https://i5.walmartimages.com/asr/dfe5481b-9f1e-4c2c-92af-a08f194b7706_1.adcc90657a0fe93d3e6c875eac3ce636.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
//       mediumImage:
//         'https://i5.walmartimages.com/asr/dfe5481b-9f1e-4c2c-92af-a08f194b7706_1.adcc90657a0fe93d3e6c875eac3ce636.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
//       largeImage:
//         'https://i5.walmartimages.com/asr/dfe5481b-9f1e-4c2c-92af-a08f194b7706_1.adcc90657a0fe93d3e6c875eac3ce636.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
//       entityType: 'SECONDARY'
//     },
//     {
//       thumbnailImage:
//         'https://i5.walmartimages.com/asr/6c3c2ed1-9dad-48c5-8cd9-a71ab53a2c45_1.2d606954ef9aa52a8e78387e30f2b2a3.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
//       mediumImage:
//         'https://i5.walmartimages.com/asr/6c3c2ed1-9dad-48c5-8cd9-a71ab53a2c45_1.2d606954ef9aa52a8e78387e30f2b2a3.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
//       largeImage:
//         'https://i5.walmartimages.com/asr/6c3c2ed1-9dad-48c5-8cd9-a71ab53a2c45_1.2d606954ef9aa52a8e78387e30f2b2a3.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
//       entityType: 'SECONDARY'
//     },
//     {
//       thumbnailImage:
//         'https://i5.walmartimages.com/asr/4993951b-2f36-4723-b4dd-eb0cddcdca1f_1.45cd9b603c44d3bd90460d3b921a5f1b.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
//       mediumImage:
//         'https://i5.walmartimages.com/asr/4993951b-2f36-4723-b4dd-eb0cddcdca1f_1.45cd9b603c44d3bd90460d3b921a5f1b.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
//       largeImage:
//         'https://i5.walmartimages.com/asr/4993951b-2f36-4723-b4dd-eb0cddcdca1f_1.45cd9b603c44d3bd90460d3b921a5f1b.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
//       entityType: 'SECONDARY'
//     },
//     {
//       thumbnailImage:
//         'https://i5.walmartimages.com/asr/280815a2-3ba9-428d-98a6-34ed0eeed895_1.763f3c8f5fb8ce520a982b24a63a6ab6.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
//       mediumImage:
//         'https://i5.walmartimages.com/asr/280815a2-3ba9-428d-98a6-34ed0eeed895_1.763f3c8f5fb8ce520a982b24a63a6ab6.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
//       largeImage:
//         'https://i5.walmartimages.com/asr/280815a2-3ba9-428d-98a6-34ed0eeed895_1.763f3c8f5fb8ce520a982b24a63a6ab6.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
//       entityType: 'SECONDARY'
//     },
//     {
//       thumbnailImage:
//         'https://i5.walmartimages.com/asr/ab744d7d-e793-4af3-aaef-7f0c56012ce6_1.44863331ecf34da912d89792db04d207.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
//       mediumImage:
//         'https://i5.walmartimages.com/asr/ab744d7d-e793-4af3-aaef-7f0c56012ce6_1.44863331ecf34da912d89792db04d207.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
//       largeImage:
//         'https://i5.walmartimages.com/asr/ab744d7d-e793-4af3-aaef-7f0c56012ce6_1.44863331ecf34da912d89792db04d207.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
//       entityType: 'SECONDARY'
//     },
//     {
//       thumbnailImage:
//         'https://i5.walmartimages.com/asr/36ca481e-6509-4ee5-9c29-06e4a25a1907_1.df1e7cb24a12a6f566f5b4ac89389d7c.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
//       mediumImage:
//         'https://i5.walmartimages.com/asr/36ca481e-6509-4ee5-9c29-06e4a25a1907_1.df1e7cb24a12a6f566f5b4ac89389d7c.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
//       largeImage:
//         'https://i5.walmartimages.com/asr/36ca481e-6509-4ee5-9c29-06e4a25a1907_1.df1e7cb24a12a6f566f5b4ac89389d7c.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
//       entityType: 'SECONDARY'
//     },
//     {
//       thumbnailImage:
//         'https://i5.walmartimages.com/asr/5c913117-f428-4438-a5a0-6e199837e6ad_1.866bcd98f83aefab499768e726d4dde0.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
//       mediumImage:
//         'https://i5.walmartimages.com/asr/5c913117-f428-4438-a5a0-6e199837e6ad_1.866bcd98f83aefab499768e726d4dde0.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
//       largeImage:
//         'https://i5.walmartimages.com/asr/5c913117-f428-4438-a5a0-6e199837e6ad_1.866bcd98f83aefab499768e726d4dde0.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
//       entityType: 'SECONDARY'
//     },
//     {
//       thumbnailImage:
//         'https://i5.walmartimages.com/asr/e085d061-c134-43f7-a353-a5865ebcf4d5_1.d9cb76556a8225498aa50a09416daae1.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
//       mediumImage:
//         'https://i5.walmartimages.com/asr/e085d061-c134-43f7-a353-a5865ebcf4d5_1.d9cb76556a8225498aa50a09416daae1.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
//       largeImage:
//         'https://i5.walmartimages.com/asr/e085d061-c134-43f7-a353-a5865ebcf4d5_1.d9cb76556a8225498aa50a09416daae1.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
//       entityType: 'SECONDARY'
//     },
//     {
//       thumbnailImage:
//         'https://i5.walmartimages.com/asr/844d0b5b-fca5-499b-88f7-8c1b7c71abbf_1.32f9219720d3fbaa32b42a42017233ae.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
//       mediumImage:
//         'https://i5.walmartimages.com/asr/844d0b5b-fca5-499b-88f7-8c1b7c71abbf_1.32f9219720d3fbaa32b42a42017233ae.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
//       largeImage:
//         'https://i5.walmartimages.com/asr/844d0b5b-fca5-499b-88f7-8c1b7c71abbf_1.32f9219720d3fbaa32b42a42017233ae.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
//       entityType: 'SECONDARY'
//     },
//     {
//       thumbnailImage:
//         'https://i5.walmartimages.com/asr/3482331b-5032-424e-9992-5d521751d613_1.17df46a122e3d08447ad1787c5c5a265.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
//       mediumImage:
//         'https://i5.walmartimages.com/asr/3482331b-5032-424e-9992-5d521751d613_1.17df46a122e3d08447ad1787c5c5a265.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
//       largeImage:
//         'https://i5.walmartimages.com/asr/3482331b-5032-424e-9992-5d521751d613_1.17df46a122e3d08447ad1787c5c5a265.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
//       entityType: 'SECONDARY'
//     },
//     {
//       thumbnailImage:
//         'https://i5.walmartimages.com/asr/b1b45982-8aea-4568-b6a3-e7790b362cb9_1.8ad247b6147ca02a8cce2a5b695b7407.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
//       mediumImage:
//         'https://i5.walmartimages.com/asr/b1b45982-8aea-4568-b6a3-e7790b362cb9_1.8ad247b6147ca02a8cce2a5b695b7407.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
//       largeImage:
//         'https://i5.walmartimages.com/asr/b1b45982-8aea-4568-b6a3-e7790b362cb9_1.8ad247b6147ca02a8cce2a5b695b7407.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
//       entityType: 'PRIMARY'
//     }
//   ],
//   offerType: 'ONLINE_ONLY',
//   availableOnline: true
// }

export function ProductSearchResultsCard (props: Pocket.Product) {
  const msrp = props.msrp || props.salePrice || 0
  const isOnSale = props.salePrice && props.salePrice < msrp
  const customerRatingText = props.customerRating
    ? ` ${parseFloat(props.customerRating).toFixed(1)}`
    : 'No customer reviews'
  return (
    <div className='search__results-card'>
      <Card
        image={
          <Image
            style={{ background: 'white', padding: '1em' }}
            centered
            fluid
            src={
              props.imageEntities.filter((entity: any) =>
                entity.entityType.match(/primary/i)
              )[0].mediumImage
            }
            label={
              props.salePrice < msrp ? (
                <Label {...{ color: 'green', ribbon: 'right' }}>On Sale!</Label>
              ) : null
            }
          />
        }
        title={props.shortDescription}
        header={props.name}
        meta={
          <span style={{ float: 'right' }}>
            <Icon fitted name='users' />
            <Icon
              fitted
              name='star'
              onClick={(evt: any) => evt.preventDefault()}
            />
            {customerRatingText}
          </span>
        }
        description={
          props.shortDescription.length < 200
            ? props.shortDescription
            : `${props.shortDescription.substr(0, 197).trim()}...`
        }
        extra={
          <p>
            <span
              style={{
                textDecoration: isOnSale ? 'line-through' : undefined
              }}
            >
              MSRP: ${msrp.toFixed(2)}
            </span>
            {isOnSale ? (
              <span style={{ float: 'right' }}>
                Sale: ${props.salePrice.toFixed(2)}
              </span>
            ) : null}
            <Button type='button' fluid primary style={{ marginTop: '4px' }}>
              Add to Cart
              <Icon name='cart' style={{ marginLeft: 4 }} />
            </Button>
          </p>
        }
      />
    </div>
  )
}
