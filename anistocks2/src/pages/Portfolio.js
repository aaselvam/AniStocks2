import React from "react";
import { Grid, Typography } from "@material-ui/core";
import MainGraph from "../components/MainGraph";
import { firestore, firstore } from "../firebase";
import fire, { provider } from "../firebase";
import "./Portfolio.scss";

export default class Portfolio extends React.Component {
  state = {
    mal_invesetments: [],
    marketValues: [],
    mal_graphs: [],
    user_id: "",
  };

  async componentDidMount() {
    fire.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.setState({ user_id: fire.auth().currentUser.uid });
        this.setState({ mal_invesetments: [] });
        this.setState({ market_investments: [] });

        const userRef = firestore
          .collection("users")
          .doc(String(this.state.user_id));
        const doc = await userRef.get();

        if (userRef === undefined || doc === undefined) {
          alert("Please login");
          return;
        }

        const userHoldings = doc.data().holdings;
        console.log(userHoldings);

        var userGraphs = [];

        // getting user stock information
        for (var key of Object.keys(userHoldings)) {
          var mal__tempArr = this.state.mal_invesetments;
          mal__tempArr.push(key);
          console.log(mal__tempArr);

          var old_tokensInvested = userHoldings[key].numShares;
          var aniRef = firestore.collection("anime").doc(String(key));
          var aniDoc = await aniRef.get();
          old_tokensInvested *= aniDoc.data().score[0] * 100;
          var market__tempArr = this.state.marketValues;
          market__tempArr.push(old_tokensInvested);
          console.log(market__tempArr);

          userGraphs.push(
            <MainGraph className="portfolioGraph" mal_id={String(key)} />
          );

          userHoldings[key] = {
            numShares: userHoldings[key].numShares,
            tokensInvested: old_tokensInvested,
          };

          this.setState({
            mal_invesetments: mal__tempArr,
            marketValues: market__tempArr,
            mal_graphs: userGraphs,
          });
        }

        userRef.update({
          holdings: userHoldings,
        });

        console.log(this.state.mal_invesetments);
        console.log(this.state.marketValues);
      } else {
        alert("Please login");
        return;
      }
    });
  }

  render() {
    return (
      <Grid container>
        <div className="portgraphs">
          {this.state.mal_graphs.map((item, index) => {
            return (
              <Grid className="graphContent" item>
                {item}
                <Typography variant="h5" className="marketValue">
                  Current Market Value:{" "}
                  {this.state.marketValues[index].toFixed(4)}
                </Typography>
              </Grid>
            );
          })}
        </div>
      </Grid>
    );
  }
}
