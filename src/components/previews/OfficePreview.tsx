import type { OdFileObject } from '../../types'
import { FC, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types';
import { useRouter } from 'next/router'

import DownloadButtonGroup from '../DownloadBtnGtoup'
import { DownloadBtnContainer } from './Containers'
import { getBaseUrl } from '../../utils/getBaseUrl'
import { getStoredToken } from '../../utils/protectedRouteHandler'

function Preview({ url, height, width }) {
  return (
    <div>
      {url && (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${url}`}
          width={'800px' && width}
          height={'400px' && height}
          frameBorder='0'
        >
          This is an embedded
          <a target='_blank' href='http://office.com'>
            Microsoft Office
          </a>
          document, powered by
          <a target='_blank' href='http://office.com/webapps'>
            Office Online
          </a>
        </iframe>
      )}
    </div>
  )
}
Preview.propTypes = {
  url: PropTypes.string.isRequired,
  height: PropTypes.string,
  width: PropTypes.string
}



const OfficePreview: FC<{ file: OdFileObject }> = ({ file }) => {
  const { asPath } = useRouter()
  const hashedToken = getStoredToken(asPath)

  const docContainer = useRef<HTMLDivElement>(null)
  const [docContainerWidth, setDocContainerWidth] = useState(600)

  const docUrl = encodeURIComponent(
    `${getBaseUrl()}/api/raw?path=${asPath}${hashedToken ? `&odpt=${hashedToken}` : ''}`
  )

  useEffect(() => {
    setDocContainerWidth(docContainer.current ? docContainer.current.offsetWidth : 600)
  }, [])

  return (
    <div>
      <div className="overflow-scroll" ref={docContainer} style={{ maxHeight: '90vh' }}>
        <Preview url={docUrl} width={docContainerWidth.toString()} height="600" />
      </div>
      <DownloadBtnContainer>
        <DownloadButtonGroup />
      </DownloadBtnContainer>
    </div>
  )
}

export default OfficePreview
