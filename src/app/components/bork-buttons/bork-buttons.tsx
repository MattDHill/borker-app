import React from 'react'
import { Link } from 'react-router-dom'
import { Bork, BorkType } from '../../../types/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments as commentsOutline } from '@fortawesome/free-regular-svg-icons'
import { faComments as commentsSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heartOutline } from '@fortawesome/free-regular-svg-icons'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons'
import { faRetweet } from '@fortawesome/free-solid-svg-icons'
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons'
import TipModal from '../modals/tip-modal/tip-modal'
import '../../App.scss'
import './bork-buttons.scss'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import { Parent } from '../../pages/auth-routes'
import { JsWallet } from 'borker-rs-browser'
import PinModal from '../modals/pin-modal/pin-modal'
import CheckoutModal from '../modals/checkout-modal/checkout-modal'

export interface BorkButtonsProps extends AuthProps {
  bork: Bork
  showCount: boolean
}

class BorkButtons extends React.PureComponent<BorkButtonsProps> {

  rebork = async () => {
    if (!this.props.wallet) {
      let wallet: JsWallet
      try {
        wallet = await this.props.decryptWallet('')
        await this.props.login(wallet)
      } catch (e) {
        this.props.toggleModal(<PinModal callback={this.rebork} />)
        return
      }
    }

    const modal = (
      <TipModal
        type={BorkType.Rebork}
        content={''}
        parent={{
          txid: this.props.bork.txid,
          senderAddress: this.props.bork.sender.address,
        }}
      />
    )
    this.props.toggleModal(modal)
  }

  like = async () => {
    if (!this.props.wallet) {
      let wallet: JsWallet
      try {
        wallet = await this.props.decryptWallet('')
        await this.props.login(wallet)
      } catch (e) {
        this.props.toggleModal(<PinModal callback={this.like} />)
        return
      }
    }

    const modal = (
      <TipModal
        type={BorkType.Like}
        content={''}
        parent={{
          txid: this.props.bork.txid,
          senderAddress: this.props.bork.sender.address,
        }}
      />
    )
    this.props.toggleModal(modal)
  }

  flag = async () => {
    if (!this.props.wallet) {
      let wallet: JsWallet
      try {
        wallet = await this.props.decryptWallet('')
        await this.props.login(wallet)
      } catch (e) {
        this.props.toggleModal(<PinModal callback={this.flag} />)
        return
      }
    }

    const modal = (
      <CheckoutModal
        type={BorkType.Flag}
        parent={{
          txid: this.props.bork.txid,
          senderAddress: this.props.bork.sender.address,
        }}
      />
    )
    this.props.toggleModal(modal)
  }

  delete = async (parent: Parent) => {
    if (!this.props.wallet) {
      let wallet: JsWallet
      try {
        wallet = await this.props.decryptWallet('')
        await this.props.login(wallet)
      } catch (e) {
        this.props.toggleModal(<PinModal callback={this.delete} />)
        return
      }
    }

    const modal = (
      <CheckoutModal
        type={BorkType.Delete}
        parent={parent}
      />
    )
    this.props.toggleModal(modal)
  }

  render () {
    const { bork, showCount } = this.props
    return (
      <table className="buttons-table">
        <tbody>
          <tr>
            <td>
              <Link to={`/borks/${bork.txid}/comment`}>
                <FontAwesomeIcon
                  icon={bork.iComment ? commentsSolid : commentsOutline}
                  style={bork.iComment ? {color: 'blue'} : {} }
                /> {showCount && (bork.commentsCount || 0)}
              </Link>
            </td>
            <td>
              <a onClick={bork.iRebork ? () => this.delete({
                  txid: this.props.bork.iRebork!,
                  senderAddress: this.props.address,
                }) : this.rebork}>
                <FontAwesomeIcon
                  icon={faRetweet}
                  style={bork.iRebork ? {color: 'green'} : {} }
                /> {showCount && (bork.reborksCount || 0)}
              </a>
            </td>
            <td>
              <a onClick={bork.iLike ? () => this.delete({
                  txid: this.props.bork.iLike!,
                  senderAddress: this.props.address,
                }) : this.like}>
                <FontAwesomeIcon
                  icon={bork.iLike ? heartSolid : heartOutline}
                  style={bork.iLike ? {color: 'red'} : {} }
                /> {showCount && (bork.likesCount || 0)}
              </a>
            </td>
            <td>
              <a onClick={bork.iFlag ? () => this.delete({
                  txid: this.props.bork.iFlag!,
                  senderAddress: this.props.address,
                }) : this.flag}>
                <FontAwesomeIcon
                  icon={faSkullCrossbones}
                  style={bork.iFlag ? {color: 'black'} : {} }
                /> {showCount && (bork.flagsCount || 0)}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default withAuthContext(BorkButtons)
