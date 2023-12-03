import React, { useState } from 'react'
import Auth from './Auth';
import SearchBrewery from './SearchBrewery';

const Home = () => {

  // const {isLoggedIn} = useAuth();
  const isLoggedIn = true

  return (
    <div>
      <h2>Brewery Review System</h2>
      {isLoggedIn ? (
        <div>
          <SearchBrewery/>
        </div>
      ) : (
        <Auth />
      )}
    </div>
  )
}

export default Home