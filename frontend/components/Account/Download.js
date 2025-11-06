import Link from 'next/link'
import React from 'react'
import { URL_IMG } from '../../store/helpers'

const Download = () => {
    return(
        <div className="download-container">
            <img src={`${URL_IMG}/image/logo/empty-download.png`} />
            <p>No downloads available yet.</p>
            <Link href="/shop">
                <a>
                    <button type="button" className="btn btn-primary">Go to shop</button>
                </a>
            </Link>
        </div>
    )
}

export default Download