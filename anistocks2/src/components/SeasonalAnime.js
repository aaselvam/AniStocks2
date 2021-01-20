import React from "react";
import AnimeList from "./AnimeList";
import { firestore } from "../firebase";

export default class SeasonalAnime extends React.Component {
  state = {
    loading: true,
    data: [],
  };

  async updateAnime() {
    //console.log("updating anime!");
    for (var i = 0; i < this.state.data.length; i++) {
      var scoreArray = [];
      var dateArray = [];
      const aniRef = firestore
        .collection("anime")
        .doc(String(this.state.data[i].mal_id));
      const doc = await aniRef.get();

      // console.log(this.state.data[i].r18);
      // if (this.state.data[i].r18) {
      //   continue;
      // }

      if (!doc.data()) {
        scoreArray.push(this.state.data[i].score);
        dateArray.push(new Date());
        firestore
          .collection("anime")
          .doc(String(this.state.data[i].mal_id))
          .set({
            mal_id: this.state.data[i].mal_id,
            title: this.state.data[i].title,
            date: dateArray,
            score: scoreArray,
          })
          .then(function () {
            //console.log("First Stage written!");
          })
          .catch(function (error) {
            //console.error("Error writing document: ", error);
          });
      } else {
        // if (this.state.data[i].r18) {
        //   continue;
        // }

        scoreArray.push(this.state.data[i].score);
        dateArray.push(new Date());
        scoreArray = scoreArray.concat(doc.data().score);
        dateArray = dateArray.concat(doc.data().date);
        firestore
          .collection("anime")
          .doc(String(this.state.data[i].mal_id))
          .set({
            mal_id: this.state.data[i].mal_id,
            title: this.state.data[i].title,
            date: dateArray,
            score: scoreArray,
          })
          .then(function () {
            //console.log("Scores updated!");
          })
          .catch(function (error) {
            //console.error("Error writing document: ", error);
          });
      }
    }
  }

  async componentDidMount() {
    const url = "https://api.jikan.moe/v3/season";
    const response = await fetch(url);
    const anime = await response.json();
    this.setState({ data: anime.anime });

    // check for time
    var currentTime = new Date();
    var prevTime = await firestore.collection("time").doc("lastUpdate").get();
    if (prevTime.exists) {
      if (
        (currentTime.getTime() - prevTime.data().time.toMillis()) / 60000 >
        59
      ) {
        this.updateAnime();
        firestore.collection("time").doc("lastUpdate").set({
          time: currentTime,
        });
      } else {
        //console.log("it's not time");
      }
    } else {
      this.updateAnime();
      firestore.collection("time").doc("lastUpdate").set({
        time: currentTime,
      });
    }
  }

  render() {
    return (
      <div>
        <AnimeList data={this.state.data} />
      </div>
    );
  }
}
