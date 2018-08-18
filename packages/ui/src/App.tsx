import './App.css'
import 'semantic-ui-css/semantic.min.css'
import * as common from 'common'
import * as React from 'react'
import { Bag as Logo } from './icon/Bag'
import { ProductSearch } from './ProductSearch'

class App extends React.Component {
  public render () {
    return (
      <div>
        <header className='deep-header'>
          <Logo className='deep-header__logo' />
          <h1 className='deep-header__title'>{common.constants.APP_NAME}</h1>
        </header>
        <ProductSearch />
      </div>
    )
  }
}

export default App
