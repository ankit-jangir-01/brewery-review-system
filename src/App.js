import './App.css';
import Home from './components/Home';
import SearchBrewery from './components/SearchBrewery'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Auth from './components/Auth';
import Brewery from './components/Brewery';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route exact path="/auth">
            <Auth/>
          </Route>
          <Route exact path="/searchBrewery">
            <SearchBrewery/>
          </Route>
          <Route exact path="/brewery/:id">
            <Brewery/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;