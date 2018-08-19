import { ajax } from 'rxjs/ajax'
import { debounceTime, tap, mergeMap, filter, map } from 'rxjs/operators'
import { Input } from 'semantic-ui-react'
import { ProductSearchControls } from './ProductSearchControls'
import { ProductSearchResults } from './ProductSearchResults'
import { Subject } from 'rxjs'
import * as React from 'react'

export interface IProductSearch {
  search: {
    dirty: boolean
    text: string
    liveMode: boolean
  }
  loading: boolean
  results: any[]
}

export type InputEvent = React.ChangeEvent<HTMLInputElement>

export class ProductSearch extends React.Component<any, IProductSearch> {
  private searchTextChange$: Subject<InputEvent>
  constructor (props: any) {
    super(props)
    this.state = {
      search: { dirty: false, text: '', liveMode: false },
      loading: false,
      results: []
    }
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onToggleLiveMode = this.onToggleLiveMode.bind(this)
    this.searchTextChange$ = new Subject()
    this.subscribeToSearchChange()
  }
  async onSearchChange (evt: InputEvent) {
    this.searchTextChange$.next(evt)
  }
  onToggleLiveMode () {
    this.setState({
      search: {
        ...this.state.search,
        liveMode: !this.state.search.liveMode
      }
    })
  }
  subscribeToSearchChange () {
    this.searchTextChange$
      .pipe(
        tap((evt: InputEvent) => {
          const willEmitAjax = !!evt.target!.value.trim()
          this.setState({
            search: {
              ...this.state.search,
              ...{ dirty: true, text: evt.target!.value }
            },
            results: willEmitAjax ? [] : this.state.results,
            loading: willEmitAjax
          })
        }),
        map(evt => evt.target!.value.trim()),
        filter(keyword => !!keyword),
        debounceTime(500),
        mergeMap(keyword => {
          const queryString = [
            this.state.search.liveMode ? 'live=1' : null,
            `keyword=${keyword}`,
            'doc=1'
          ]
            .filter(i => i)
            .join('&')
          return ajax(`/api/search?${queryString}`).pipe(
            map(res => res.response)
          )
        })
      )
      .subscribe({
        next: results => this.setState({ loading: false, results })
      })
  }
  render () {
    const { loading, results, search } = this.state
    return (
      <div className='deep-content'>
        <Input
          className='deep-content__search'
          onChange={this.onSearchChange}
          size='big'
          icon='search'
          placeholder='Search...'
          fluid
        />
        <ProductSearchResults
          {...{ default: !search.dirty, loading, items: results }}
        />
        <ProductSearchControls
          checked={this.state.search.liveMode}
          onLiveModeChange={this.onToggleLiveMode}
        />
      </div>
    )
  }
}
