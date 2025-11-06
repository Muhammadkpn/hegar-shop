import React from 'react'
import Head from 'next/head'
import GoTop from '../Common/GoTop'

const Layout = ({children}) =>{
    const [loader, setLoader] = React.useState(true)

    React.useEffect(() => {
        setTimeout(() => setLoader(false), 2000);
    }, [])
    return(
        <div>
            <Head>
                <title>Wisela Shop</title>  
                {/* metadata */}
                <meta name="muhammad kiky" content="wisela-shop"></meta>
                <meta charSet="utf-8" />
                <meta name="viewport" content="viewport-fit=cover" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                {/* logo */}
                <link rel="icon" href="/favicon.ico" />
                {/* bootstrap */}
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" 
                integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" 
                crossOrigin="anonymous"></link>
                <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossOrigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossOrigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js" integrity="sha384-+YQ4JLhjyBLPDQt//I+STsc9iw4uQqACwlvpslubQzn4u2UU2UFM80nGisd026JF" crossOrigin="anonymous"></script>
            </Head>
                {loader ? 
                    <div className="d-flex justify-content-center align-items-center" style={{height:'100vh'}}>
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                :
                    children
                }
            <GoTop scrollStepInPx="100" delayInMs="10.50" />
        </div>
    )
}

export default Layout