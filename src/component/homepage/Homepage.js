// HomePage.js
import React from 'react';
// import Header from './header/header';
import Carousels from './productsection/carousel';
import SelectByCateogry from './productsection/selectByCat'
// import FoodPreloader from './productsection/preloader'


const HomePage = () => {
  return (
    <>
    {/* <FoodPreloader/> */}
      <Carousels />
      <SelectByCateogry/>
    </>
  );
}

export default HomePage;
