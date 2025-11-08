import Link from 'next/link'
import React from 'react'
import { getFullImageUrl } from '../../store/helpers'

const Download = () => {
    return(
        <div className="download-container">
            <img src={getFullImageUrl('image/logo/empty-download.png')} />
            <p>No downloads available yet.</p>
            <Link href="/shop">
                <button type="button" className="btn btn-primary">Go to shop</button>
            </Link>
        </div>
    )
}

export default Download