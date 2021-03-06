import React from 'react'
import { Switch, Route, RouteComponentProps } from 'react-router'
import ProfileShowPage from './profile-show/profile-show'
import ProfileEditPage from './profile-edit/profile-edit'
import UserListPage, { FollowsType } from '../user-list/user-list'
import { User } from '../../../types/types'
import WebService from '../../web-service'
import '../../App.scss'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import Loader from '../../components/loader/loader'

export interface ProfileRoutesParams {
  address: string
}

export interface ProfileRoutesProps
  extends RouteComponentProps<ProfileRoutesParams>,
    AuthProps {}

export interface ProfileRoutesState {
  user: User | null
  loading: boolean
}

class ProfileRoutes extends React.Component<
  ProfileRoutesProps,
  ProfileRoutesState
> {
  public webService: WebService

  constructor (props: ProfileRoutesProps) {
    super(props)
    this.state = {
      user: null,
      loading: true,
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.setState({
      user: await this.webService.getUser(this.props.match.params.address),
      loading: false,
    })
  }

  async componentWillReceiveProps (nextProps: ProfileRoutesProps) {
    const oldAddress = this.props.match.params.address
    const newAddress = nextProps.match.params.address

    if (oldAddress !== newAddress) {
      this.setState({ loading: true })
      this.setState({
        user: await this.webService.getUser(newAddress),
      })
    }
  }

  render () {
    const { user, loading } = this.state

    if (loading) {
      return (
        <Loader key={0} />
      )
    }

    return !user ? (
      <p>User not found.</p>
    ) : (
      <Switch>
        <Route
          exact
          path="/profile/:address"
          render={props => <ProfileShowPage {...props} user={user} />}
        />
        <Route
          exact
          path="/profile/:ref/following"
          render={props => (
            <UserListPage {...props} filter={FollowsType.following} />
          )}
        />
        <Route
          exact
          path="/profile/:ref/followers"
          render={props => (
            <UserListPage {...props} filter={FollowsType.followers} />
          )}
        />
        <Route
          exact
          path="/profile/:address/:type"
          render={props => <ProfileEditPage {...props} user={user} />}
        />
      </Switch>
    )
  }
}

export default withAuthContext(ProfileRoutes)
