import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'react-tippy'
import Icon from './Icon'
import Link from './Link'

import '../styles/components/ItemList.pcss'

import translate from './translate'
import withEmitter from './withEmitter'

const ItemList = ({ translate, moment, emitter, listItems }) => (
  <ul className="ItemList" >
    {listItems.map(listItem => (
      <li
        id={listItem.about['@id']}
        key={listItem.about['@id']}
        onMouseEnter={() => {
          emitter.emit('hoverPoint', { id: listItem.about["@id"] })
        }}
        onMouseLeave={() => {
          emitter.emit('hoverPoint', { id: '' })
        }}
      >
        {listItem.about['@type'] === 'Event' &&
        listItem.about.startDate
          ? (
            <Tooltip
              // options
              html={
                <div>
                  <b>{translate(listItem.about.name) || listItem.about['@id']}</b>
                  {listItem.about.description ?
                    (<p>{translate(listItem.about.description).length > 140
                      ? translate(listItem.about.description).substring(0,140)
                      : translate(listItem.about.description)}</p>)
                    : (<p>No description available</p>)
                  }
                </div>
              }
              position="top"
              followCursor="true"
              trigger="mouseenter"
            >
              <Link className="item" href={'/resource/' + listItem.about['@id']}>
                <div className="sheet">
                  <span>{moment(listItem.about.startDate).format('D')}</span>
                  <span>{moment(listItem.about.startDate).format('ddd')}</span>
                </div>
                <span>
                  {translate(listItem.about.name) || listItem.about['@id']}<br />
                  {moment(listItem.about.startDate).format('dddd, D. MMMM')} —&nbsp;
                  {listItem.about.location &&
                    listItem.about.location.address &&
                    (`${listItem.about.location.address.addressLocality}, ${listItem.about.location.address.addressCountry}`)
                  }
                </span>
              </Link>
            </Tooltip>
          ) : (
            <Tooltip
              // options
              html={
                <div>
                  <b>{translate(listItem.about.name) || listItem.about['@id']}</b>
                  {listItem.about.description ?
                    (<p>{translate(listItem.about.description).length > 140
                      ? translate(listItem.about.description).substring(0,140)
                      : translate(listItem.about.description)}</p>)
                    : (<p>No description available</p>)
                  }
                </div>
              }
              position="top"
              followCursor="true"
              trigger="mouseenter"
              animateFill="false"
              animation="fade"
            >
              <Link className="item" href={'/resource/' + listItem.about['@id']}>
                <Icon type={listItem.about['@type']} />
                <span>{translate(listItem.about.name) || listItem.about['@id']}</span>
              </Link>
            </Tooltip>
          )}
      </li>
    ))}
  </ul>
)


ItemList.propTypes = {
  translate: PropTypes.func.isRequired,
  moment: PropTypes.func.isRequired,
  emitter: PropTypes.objectOf(PropTypes.any).isRequired,
  listItems: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default withEmitter(translate(ItemList))
