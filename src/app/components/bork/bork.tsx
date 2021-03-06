import React from 'react'
import { Link } from "react-router-dom"
import { Bork, BorkType } from '../../../types/types'
import BorkButtons from '../bork-buttons/bork-buttons'
import { calendar } from '../../../util/timestamps'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons'
import '../../App.scss'
import './bork.scss'
import { getDefaultAvatar } from '../../../util/functions'

export interface BorkComponentProps {
  bork: Bork
  showButtons?: boolean
}

class BorkComponent extends React.PureComponent<BorkComponentProps> {

  render () {
    let { bork, showButtons } = this.props

    const avatar = (
      <Link to={`/profile/${bork.sender.address}`}>
        <img src={bork.sender.avatarLink || getDefaultAvatar(bork.sender.address)} className="list-avatar" alt='avatar' />
      </Link>
    )

    const userName = (
      <Link to={`/profile/${bork.sender.address}`} className="bork-username">
        {bork.sender.name}
      </Link>
    )

    const userAddress = (
      <Link to={`/profile/${bork.sender.address}`} className="bork-useraddress">
        @{bork.sender.address.substring(0, 9)}
      </Link>
    )

    const buildContent = (content: string) => {
      const isImage = require('is-image')
      const linkRegex = /(?:(?:https?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)|(?:#[a-zA-Z0-9_]+)/gi
      const contentArr = content.split(linkRegex)
      const links = content.match(linkRegex) || []
      let res = [<span key={0}>{contentArr[0]}</span>]
      for (let linkIdx = 0; linkIdx < links.length; linkIdx++) {
        let link = links[linkIdx]
        if (link[0] === '#') {
          res.push(<Link key={contentArr[linkIdx]} to={`hashtags/${link.slice(1).toLowerCase()}`} className='bork-link'>{link}</Link>)
        } else if (isImage(link)) {
          res.push(<img key={contentArr[linkIdx]} src={link}></img>)
        } else {
          res.push(<a key={contentArr[linkIdx]} href={link} className='bork-link'>{link}</a>)
        }
        res.push(<span key={linkIdx + 1}>{contentArr[linkIdx + 1]}</span>)
      }
      return res
    }

    const BorkBody = () => {
      const content = buildContent(bork.content)

      return (
        <div className="bork-body-link">
          <h2>{content}</h2>
        </div>
      )
    }

    return (
      <div className="bork-border">
        <div className="bork-header">
          {avatar}
          <p>
            {userName}<br />
            {userAddress}
          </p>
          {bork.type === BorkType.Comment &&
            <p className="bork-ref">
              <FontAwesomeIcon
                icon={faComments}
              />
              Replying To {bork.parent.sender.name}
            </p>
          }
        </div>
        <div className="bork-content">
          <div className="bork-border">
            <BorkBody />
            <p><a href={`https://chain.so/tx/DOGE/${bork.txid}`} target="_blank" rel="noopener noreferrer">{bork.txid.substr(0, 20)}</a></p>
            <p style={{ color: 'gray' }}>{calendar(bork.createdAt)}</p>
          </div>
          <div className="bork-border">
            <p className="bork-stats">
              <Link
                to={`/borks/${bork.txid}/reborks`}
                className="bork-body-link"
              >
                {bork.reborksCount || 0}<span> Reborks</span>
              </Link>
              <Link
                to={`/borks/${bork.txid}/likes`}
                className="bork-body-link"
              >
                {bork.likesCount || 0}<span> Likes</span>
              </Link>
              <Link
                to={`/borks/${bork.txid}/flags`}
                className="bork-body-link"
              >
                {bork.flagsCount || 0}<span> Flags</span>
              </Link>
            </p>
          </div>
        </div>
        {showButtons &&
          <div className="bork-footer">
            <BorkButtons bork={bork} showCount={false} />
          </div>
        }
      </div>
    )
  }
}

export default BorkComponent
