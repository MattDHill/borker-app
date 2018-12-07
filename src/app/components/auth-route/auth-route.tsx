import React from 'react'
import { Route, Redirect, RouteProps } from "react-router-dom"
import Sidebar, { SidebarProps } from "react-sidebar"
import SidebarContent from '../sidebar-content'

export interface AuthRouteProps extends RouteProps {
  address: string
  component: React.ComponentType<any>
  logout: () => void
}

export interface AuthRouteState {
  address: string
  sidebarOpen: boolean
  sidebarDocked: boolean
}

const styles = {
  contentHeaderMenuLink: {
    textDecoration: "none",
    color: "white",
    padding: 8
  },
  header: {
    backgroundColor: "gray",
    color: "white",
    padding: "16px",
    fontSize: "1.6em",
    fontWeight: "bold" as "bold"
  },
  sidebar: {
    sidebar: {
      overflowY: "hidden"
    }
  }
}

const mql = window.matchMedia(`(min-width: 800px)`)

class AuthRoute extends React.Component<AuthRouteProps, AuthRouteState> {

  constructor(props: AuthRouteProps) {
    super(props)
    this.state = {
      address: props.address,
      sidebarDocked: mql.matches,
      sidebarOpen: false,
    }
    this._mediaQueryChanged = this._mediaQueryChanged.bind(this)
    this._onSetSidebarOpen = this._onSetSidebarOpen.bind(this)
    this._toggleSidebar = this._toggleSidebar.bind(this)
  }

  componentWillMount() {
    mql.addListener(this._mediaQueryChanged)
  }

  componentWillUnmount() {
    mql.removeListener(this._mediaQueryChanged)
  }

  _mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false })
  }

  _onSetSidebarOpen(open: boolean) {
    this.setState({ sidebarOpen: open })
  }

  _toggleSidebar(ev) {
    ev.preventDefault()
    this._onSetSidebarOpen(!this.state.sidebarOpen)
  }

  render() {
    const { component: Component, address, ...rest } = this.props
    const contentHeader = (
      <div>
        {!this.state.sidebarDocked && (
          <a
            onClick={this._toggleSidebar}
            style={styles.contentHeaderMenuLink}
          >
            =
          </a>
        )}
        <button onClick={this.props.logout} className="logout-button">Logout</button>
      </div>
    )

    const sidebarProps: SidebarProps = {
      sidebar: <SidebarContent
        address={address}
        toggleSidebar={this._toggleSidebar}
      />,
      docked: this.state.sidebarDocked,
      open: this.state.sidebarOpen,
      onSetOpen: this._onSetSidebarOpen,
      styles: styles.sidebar
    }

    return address ? (
      <Sidebar {...sidebarProps}>
        <div style={styles.header}>
          {contentHeader}
        </div>
        <Route {...rest} render={props => <Component {...props} {...rest} />} />
      </Sidebar>
    ) : (
      <Redirect to="/"/>
    )
  }
}

export default AuthRoute