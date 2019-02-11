import React from 'react'
import { User, BorkType } from '../../../types/types'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import CheckoutModal from '../modals/checkout-modal/checkout-modal'
import './follow-button.scss'

export interface FollowButtonProps extends AuthProps {
  user: User
}

class FollowButton extends React.PureComponent<FollowButtonProps> {

  render () {

    return this.props.address === this.props.user.address ? (
      null
    ) : this.props.user.iFollow ? (
      <button
        onClick={() => this.props.toggleModal(<CheckoutModal type={BorkType.unfollow} txCount={1} />)}
        className="unfollow-button"
      >
        Following
      </button> 
    ) : (
      <button onClick={() => this.props.toggleModal(<CheckoutModal type={BorkType.follow} txCount={1} />)}>Follow</button> 
    )
  }
}

export default withAuthContext(FollowButton)