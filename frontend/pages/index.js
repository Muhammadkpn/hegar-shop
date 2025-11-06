import React from 'react'
import Navbar from "../components/Layout/Navbar"
import MainBanner from "../components/Home/MainBanner"
import SpecialPromo from '../components/Home/SpecialPromo'
import NewProducts from '../components/Home/NewProducts'
import Features from '../components/Home/Features'
import RecentBlog from '../components/Home/RecentBlog'
import Subscribe from '../components/Common/Subscribe'
import Footer from '../components/Layout/Footer'
import BestStore from '../components/Home/BestStore'

export default function Home() {
  return (
    <React.Fragment>
      <Navbar />
      <MainBanner />
      <SpecialPromo />
      <NewProducts />
      <BestStore />
      <Features />
      <RecentBlog />
      <Subscribe />
      <Footer />
    </React.Fragment>
  )
}

