import React from 'react'
import { Chart } from 'react-charts'
import {firestore} from '../firebase';
import {Line} from 'react-chartjs-2';

export default class MainGraph extends React.Component  {

    constructor(props) {
      super(props);
      // Don't call this.setState() here!
    }

    state = {
        labels: [],
        datasets: [],
        title: '',
        min: 1000,
        max: 0
    };

    async componentDidMount() {
        const aniRef = firestore.collection('anime').doc(this.props.mal_id);
        const doc = await aniRef.get();
        var scores = doc.data().score.reverse();
        for(var j = 0; j < scores.length; j++){
          scores[j] *= 100;
          if(scores[j] > this.state.max){
            this.setState({max: scores[j]})
          }
          if(scores[j] < this.state.min){
            this.setState({min: scores[j]})
          }
        }
        var color = '#1ce852';
        if(scores[0] < scores[scores.length-1]){
          color = '#1ce852';
        } else {
          color = '#b80d35';
        }
        
        var animeLines = [{
          label: doc.data().title + ' Rating',
          fill: false,
          lineTension: 0.5,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 2,
          data: scores
        }];
        var dates = [];
        for(var i = 0; i < doc.data().date.length; i++){
          dates[i] = (doc.data().date[doc.data().date.length-i-1]).toDate().toDateString();
        }
        this.setState({labels: dates});
        this.setState({datasets: animeLines});
        this.setState({title: doc.data().title});
    }    

    render() {
        return (
            <Line
              data={this.state}
              options={{
                title:{
                  display:true,
                  text: this.state.title +' Stock',
                  fontSize:20
                },
                scales: {
                  yAxes: [{
                      ticks: {
                          suggestedMin: this.state.min-25,
                          suggestedMax: this.state.max+25
                      }
                  }]
                }
              }}
            />
        );
    }
    
};