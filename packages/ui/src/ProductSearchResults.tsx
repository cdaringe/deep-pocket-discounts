import './ProductSearchResults.css'
import { Loader } from 'semantic-ui-react'
import { ProductSearchResultsCard } from './ProductSearchResultCard'
import * as classnames from 'classnames'
import * as React from 'react'

interface IProductSearchResultsProps {
  default: boolean
  items: any[]
  loading: boolean
}

export class ProductSearchResults extends React.PureComponent<
  IProductSearchResultsProps
  > {
  render () {
    const { default: defaultView, loading, items } = this.props
    let body
    if (loading) {
      body = <Loader size='massive' active content='Loading' />
    } else if (defaultView) {
      body = <p>Eagerly awaiting your search 🔍</p>
    } else if (!items.length) {
      body = <p>No results found. :/</p>
    } else {
      body = items.map((item, i) => (
        <ProductSearchResultsCard key={i} {...item} />
      ))
    }
    return (
      <div
        className={classnames(
          'search__results',
          defaultView && 'search__results--default'
        )}
      >
        {body}
      </div>
    )
  }
}
