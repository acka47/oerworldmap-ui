import React from 'react'
import PropTypes from 'prop-types'
import withEmitter from './withEmitter'
import translate from './translate'
import Link from './Link'

import '../styles/Header.pcss'

const Header = ({ user, emitter, translate }) => (
  <header className="Header">
    <nav className="mainNav">
      <Link to="/">
        <h1>OER W<i className="fa fa-globe" />RLD MAP</h1>
      </Link>
      <a
        href="/FAQ"
        title={translate('Header.faq')}
      >
        {translate('Header.faq')}
      </a>
      <a
        href="/about"
        title={translate('Header.about')}
      >
        {translate('Header.about')}
      </a>
      <a
        href="/contribute"
        title={translate('Header.contribute')}
      >
        {translate('Header.contribute')}
      </a>
      <a
        href="https://oerworldmap.wordpress.com/"
        title={translate('Header.blog')}
        target="_blank"
        rel="noopener noreferrer"
      >
        {translate('Header.blog')}
      </a>
      <a
        href="https://www.facebook.com/oerworldmap"
        title="Facebook"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fa fa-facebook-official" />
      </a>
      <a
        href="https://twitter.com/oerworldmap"
        title="Twitter"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fa fa-twitter" />
      </a>
    </nav>

    <nav className="userNav">
      <a href="/contribute">
        <h2>Join us in mapping the world of OER!</h2>
      </a>
      {user ? (
        <a href="/.logout" onClick={(e) => {e.preventDefault(); emitter.emit('logout')}}>
          Log out user {user}
        </a>
      ) : (
        <a href="/.login" onClick={(e) => {e.preventDefault(); emitter.emit('login')}}>
          Log in
        </a>
      )}
    </nav>

  </header>
)


Header.propTypes = {
  emitter: PropTypes.objectOf(PropTypes.any).isRequired,
  translate: PropTypes.func.isRequired,
  user: PropTypes.string
}

Header.defaultProps = {
  user: null,
}

export default withEmitter(translate(Header))
