import { Checkbox } from 'semantic-ui-react'
import * as React from 'react'

export interface IProductSearchControlsProps {
  checked: boolean
  onLiveModeChange: () => void
}

export function ProductSearchControls (props: IProductSearchControlsProps) {
  return (
    <div className='deep-content__search-options'>
      <span id='search_options_title'>Search options</span>
      <label
        id='live_mode_toggle_label'
        htmlFor='live_mode_toggle'
        title='All searches occur against the live /items API, vs the default cached version'
      >
        Live mode
      </label>
      <Checkbox
        id='live_mode_toggle_control'
        name='live_mode'
        checked={props.checked}
        onChange={(evt, checked) => props.onLiveModeChange()}
        toggle
      />
    </div>
  )
}
