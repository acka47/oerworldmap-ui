import React from 'react'
import PropTypes from 'prop-types'

import Input from './Input'
import Textarea from './Textarea'
import DropdownSelect from './DropdownSelect'
import withFormData from './withFormData'

const LocalizedString = ({schema, translate, value, setValue, shouldFormComponentFocus}) => {
  const TextInput = schema.properties['@value']._display
    && schema.properties['@value']._display.rows > 1 ? Textarea : Input
  return (
    <div className="LocalizedString">
      <TextInput
        property="@value"
        translate={translate}
        shouldFormComponentFocus={shouldFormComponentFocus}
        setValue={string => setValue({
          '@value': string,
          '@language': string ? value && value['@language'] || 'en' : undefined
        })}
      />
      <DropdownSelect
        property="@language"
        options={schema.properties['@language'].enum}
        translate={translate}
      />
    </div>
  )
}

LocalizedString.propTypes = {
  schema: PropTypes.objectOf(PropTypes.any).isRequired,
  translate: PropTypes.func.isRequired,
  value: PropTypes.objectOf(PropTypes.any),
  setValue: PropTypes.func.isRequired,
  shouldFormComponentFocus: PropTypes.bool.isRequired
}

LocalizedString.defaultProps = {
  value: undefined
}

export default withFormData(LocalizedString)
