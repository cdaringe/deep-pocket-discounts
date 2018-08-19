import './ProductSearchResultCard.css'
import * as React from 'react'
import { Button, Card, Image, Label, Icon } from 'semantic-ui-react'
import { Pocket } from 'typings/interfaces'

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
          <p style={{ height: 100 }}>
            {props.shortDescription.length < 200
              ? props.shortDescription
              : `${props.shortDescription.substr(0, 197).trim()}...`}
          </p>
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
