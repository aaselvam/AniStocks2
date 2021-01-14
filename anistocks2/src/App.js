import React from 'react';
import useState from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import {SearchContext} from './context/search';
import Home from './pages/Home';
import Ratings from './pages/Ratings';
import Results from './pages/Results';
import SingleView from './pages/SingleView';
import MainNavigation from './components/MainNavigation'


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      animeData: [],
      singleData: []
    };
    this.setData = this.setData.bind(this);
    this.setSingle = this.setSingle.bind(this);
    this.search = this.search.bind(this);
  }

  setData = (data) => {
    this.setState({animeData: data});
  }

  setSingle = (data) => {
    this.setState({singleData: data})
  }

  search = (searchRequest) => {
    console.log(searchRequest);
    return fetch (
      `https://api.jikan.moe/v3/search/anime?q=${searchRequest}&limit=20`
    ).then((response) => response.json());
  }
  
    render() {
      var value = {thing1: this.search, thing2: this.state.animeData, thing3: this.setData, t4: this.state.singleData, t5: this.setSingle};
      console.log(value);
    return (
        <div className='App'>
          <SearchContext.Provider value={this.search, this.state.animeData, this.setData, this.state.singleData, this.setSingle}>
            <Router>
              <MainNavigation/>
                <Switch>
                  <Route path="/" exact>
                    <Home/>
                  </Route>
                  <Route path="/ratings" exact>
                    <Ratings/>
                  </Route>
                  <Route path="/SingleView" exact>
                    <SingleView/>
                  </Route>
                  <Route path="/results" exact>
                    <Results/>
                  </Route>
                  <Redirect to="/"/>
                </Switch>
            </Router>
          </SearchContext.Provider>
        </div>
    )
  }
}

export default App;