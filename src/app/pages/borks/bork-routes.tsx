import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import BorksPage from './borks/borks'
import BorkViewPage from './bork-view/bork-view'
import BorkNewPage from './bork-new/bork-new'
import UserListPage from '../user-list/user-list'
import BorkTagsPage from './bork-tags/bork-tags'
import '../../App.scss'
import { BorkType } from '../../../types/types'

class BorksRoutes extends React.Component<{}, {}> {
  render () {
    return (
      <Switch>
        <Route exact path="/borks" component={BorksPage} />
        <Route
          exact
          path="/borks/new"
          render={props => <BorkNewPage {...props} type={BorkType.Bork} />}
        />
        <Route
          exact
          path="/borks/hashtags/:tag"
          render={props => <BorkTagsPage {...props} />}
        />
        <Route exact path="/borks/:txid" component={BorkViewPage} />
        <Route
          exact
          path="/borks/:txid/comment"
          render={props => <BorkNewPage {...props} type={BorkType.Comment} />}
        />
        <Route
          exact
          path="/borks/:ref/reborks"
          render={props => <UserListPage {...props} filter={BorkType.Rebork} />}
        />
        <Route
          exact
          path="/borks/:ref/likes"
          render={props => <UserListPage {...props} filter={BorkType.Like} />}
        />
        <Route
          exact
          path="/borks/:ref/flags"
          render={props => <UserListPage {...props} filter={BorkType.Flag} />}
        />
        <Redirect to="/borks" />
      </Switch>
    )
  }
}

export default BorksRoutes
