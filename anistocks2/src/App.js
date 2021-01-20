import React from "react";
//import useState from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { SearchContext } from "./context/search";
import Home from "./pages/Home";
import Ratings from "./pages/Ratings";
import Results from "./pages/Results";
import SingleView from "./pages/SingleView";
import { Typography, Grid, Button, Box } from "@material-ui/core";
import fire, { firestore, provider } from "./firebase";
import "./App.scss";
import Portfolio from "./pages/Portfolio";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animeData: [],
      singleData: [],
      pfp_url: "",
      user: false,
    };
    this.setData = this.setData.bind(this);
    this.setSingle = this.setSingle.bind(this);
    this.search = this.search.bind(this);
    this.initFireBaseAuth();
  }

  setData = (data) => {
    this.setState({ animeData: data });
  };

  setSingle = (data) => {
    this.setState({ singleData: data });
  };

  search = (searchRequest) => {
    return fetch(
      `https://api.jikan.moe/v3/search/anime?q=${searchRequest}&limit=20`
    ).then((response) => response.json());
  };

  signIn = () => {
    fire.auth().signInWithRedirect(provider);
  };

  signOut = () => {
    fire.auth().signOut();
  };

  authObserver = (user) => {
    var userPicElement = document.getElementById("profilePicture");
    var userNameElement = document.getElementById("userName");
    var logoutButtonElement = document.getElementById("logoutBox");
    var loginButtonElement = document.getElementById("loginBox");
    var wallet = document.getElementById("userWalletBalance");

    if (user) {
      this.setState({ user: true });
      var pfp = this.getProfilePic();
      var userName = this.getUserName();
      pfp = fire.auth().currentUser.photoURL;
      this.setState({ pfp_url: pfp });
      userPicElement.style.backgroundImage = "url(" + pfp + ")";
      userNameElement.textContent = userName;

      userPicElement.removeAttribute("hidden");
      userNameElement.removeAttribute("hidden");
      // logoutButtonElement.setAttribute("visibility", "visible");
      // loginButtonElement.setAttribute("visibility", "hidden");
      wallet.removeAttribute("hidden");

      firestore
        .collection("users")
        .doc(String(fire.auth().currentUser.uid))
        .get()
        .then((doc) => {
          if (!doc.exists) {
            firestore
              .collection("users")
              .doc(String(fire.auth().currentUser.uid))
              .set({
                name: fire.auth().currentUser.displayName,
                balance: +500,
                holdings: {},
              });
          }
        });

      firestore
        .collection("users")
        .doc(String(fire.auth().currentUser.uid))
        .get()
        .then((doc) => {
          // console.log(doc);
          // console.log(doc.data());
          // console.log(doc.data().balance);
          wallet.textContent = doc.data().balance;
        });
    } else {
      this.setState({ user: false });
      userPicElement.setAttribute("hidden", "true");
      userNameElement.setAttribute("hidden", "true");
      // logoutButtonElement.setAttribute("visibility", "hidden");
      // loginButtonElement.setAttribute("visibility", "visible");
      wallet.setAttribute("hidden", "true");
    }
  };

  initFireBaseAuth = () => {
    fire.auth().onAuthStateChanged(this.authObserver);
  };

  getProfilePic = () => {
    return fire.auth().currentUser.photoUrl;
  };

  getUserName = () => {
    var user = fire.auth().currentUser;
    return user.displayName;
  };

  isUserSignedIn = () => {
    return !!fire.auth().currentUser;
  };

  render() {
    var value = {
      animeData: this.state.animeData,
      singleData: this.state.singleData,
      search: this.search,
      setData: this.setData,
      setSingle: this.setSingle,
    };
    return (
      <div className="App">
        <SearchContext.Provider value={value}>
          <Router>
            <Grid className="topRow">
              <img
                hidden
                id="profilePicture"
                src={this.state.pfp_url}
                alt="userPFP"
              />
              <Typography variant="h5" hidden id="userName" />
              <Typography variant="h5" hidden id="userWalletBalance" />
              <div className="multi-button">
                <Button
                  id="homePage"
                  className="pageButton"
                  variant="contained"
                  href="/">
                  Home
                </Button>
                <Button
                  id="portPage"
                  className="pageButton"
                  variant="contained"
                  href="/portfolio">
                  Portfolio
                </Button>
              </div>
              {this.state.user == false && (
                <Button
                  variant="contained"
                  onClick={this.signIn}
                  className="toprow__rightbutton"
                  id="loginButton"
                  data-sm-link-text="Login">
                  Login
                </Button>
              )}
              {this.state.user == true && (
                <Button
                  variant="contained"
                  onClick={this.signOut}
                  className="toprow__rightbutton"
                  hidden
                  id="logoutButton"
                  data-sm-link-text="Logout">
                  Logout
                </Button>
              )}
            </Grid>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/ratings" exact>
                <Ratings />
              </Route>
              <Route path="/single-view" exact>
                <SingleView />
              </Route>
              <Route path="/results" exact>
                <Results />
              </Route>
              <Route path="/portfolio" exact>
                <Portfolio />
              </Route>
              <Redirect to="/" />
            </Switch>
          </Router>
        </SearchContext.Provider>
      </div>
    );
  }
}

export default App;
