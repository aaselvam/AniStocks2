import React from "react";
import { Button } from "@material-ui/core";
import { firestore } from "../firebase";
import fire from "../firebase";
import { FormControl, Input, Typography } from "@material-ui/core";

export default class BuyAndSell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mal_id: String(props.mal_id),
      user_id: String(fire.auth().currentUser.uid),
    };
    this.buyStock = this.buyStock.bind(this);
    this.sellStock = this.sellStock.bind(this);
  }

  async buyStock() {
    // const aniRef = firestore.collection("transactions").doc(String({ mal_id }));
    var inputValue = Number(document.getElementById("buynsell__form").value);
    var stockPrice = 0;
    var priceRef = await firestore
      .collection("anime")
      .doc(String(this.state.mal_id))
      .get();

    stockPrice = priceRef.data().score[0] * 100;
    console.log(stockPrice);

    if (stockPrice === 0) {
      alert("Please try again, sorry!");
      return;
    }

    if (inputValue <= 0) {
      alert("Please enter a value greater than 0");
      return;
    }

    var userRef = firestore.collection("users").doc(this.state.user_id);
    return firestore
      .runTransaction((transaction) => {
        return transaction.get(userRef).then((doc) => {
          const shareNumber = inputValue / stockPrice;
          var newBalance = doc.data().balance - inputValue;
          var prevHoldings = doc.data().holdings;

          if (newBalance < 0) {
            alert("Not enough money");
            throw "Not enough money";
          }

          if (String(this.state.mal_id) in prevHoldings) {
            var old_numShares = prevHoldings[this.state.mal_id].numShares;
            var old_tokensInvested = old_numShares * stockPrice;
            prevHoldings[this.state.mal_id] = {
              numShares: old_numShares + shareNumber,
              tokensInvested: old_tokensInvested + inputValue,
            };
          } else {
            prevHoldings[this.state.mal_id] = {
              numShares: shareNumber,
              tokensInvested: inputValue,
            };
          }
          transaction.update(userRef, {
            balance: newBalance,
            holdings: prevHoldings,
          });
          return newBalance;
        });
      })
      .then(function (newBalance) {
        console.log("transaction success!");
        document.getElementById("userWalletBalance").textContent = newBalance;
      });
  }

  async sellStock() {
    var inputValue = Number(document.getElementById("buynsell__form").value);
    var stockPrice = 0;
    var priceRef = await firestore
      .collection("anime")
      .doc(String(this.state.mal_id))
      .get();

    stockPrice = priceRef.data().score[0] * 100;
    console.log(stockPrice);

    if (stockPrice === 0) {
      alert("Please try again, sorry!");
      return;
    }

    if (inputValue <= 0) {
      alert("Please enter a value greater than 0");
      return;
    }

    var userRef = firestore.collection("users").doc(this.state.user_id);
    return firestore
      .runTransaction((transaction) => {
        return transaction.get(userRef).then((doc) => {
          var shareNumber = inputValue / stockPrice;
          var newBalance = doc.data().balance + inputValue;
          var prevHoldings = doc.data().holdings;

          if (prevHoldings[this.state.mal_id].tokensInvested - inputValue < 0) {
            alert("Not enough invested");
            throw "Not enough invested";
          }

          if (String(this.state.mal_id) in prevHoldings) {
            var old_numShares = prevHoldings[this.state.mal_id].numShares;
            var old_tokensInvested = old_numShares * stockPrice;

            prevHoldings[this.state.mal_id] = {
              numShares: old_numShares - shareNumber,
              tokensInvested: old_tokensInvested - inputValue,
            };
          } else {
            prevHoldings[this.state.mal_id] = {
              numShares: shareNumber,
              tokensInvested: inputValue,
            };
          }
          transaction.update(userRef, {
            balance: newBalance,
            holdings: prevHoldings,
          });
          return newBalance;
        });
      })
      .then(function (newBalance) {
        console.log("transaction success!");
        document.getElementById("userWalletBalance").textContent = newBalance;
      });
  }

  render() {
    return (
      <div>
        <form className="home__form">
          <FormControl className="home__formControl" type="submit" />
          <Input id="buynsell__form" placeholder="Tokens Input" />
          <Button onClick={this.buyStock}>Buy</Button>
          <Button onClick={this.sellStock}>Sell</Button>
          <Typography>Amount Invested</Typography>
        </form>
      </div>
    );
  }
}
