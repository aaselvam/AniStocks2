import React from "react";
import { Grid, Typography, Paper, Link } from "@material-ui/core";
import MainGraph from "./MainGraph";
import "./SingleAnime.scss";
import BuyAndSell from "./BuyAndSell";

const SingleAnime = (props) => {
  const {
    mal_id,
    title,
    image_url,
    episodes,
    rating,
    airing,
    broadcast,
    url,
    score,
  } = props.info;

  //   useEffect(() => {
  //     console.log(title, image_url);
  //   }, [props.info]);

  return (
    <Grid
      container
      spacing={7}
      direction="row"
      justify="center"
      alignContent="center"
      alignItems="center">
      <Grid item>
        <img src={image_url} alt={title} className="singleAnime__image" />
      </Grid>
      <Grid item>
        <Paper elevation="3">
          <Typography variant="h4" component="h2">
            {title}
          </Typography>
          <Typography variant="h5" component="h2">
            Airing: {String(airing)}
          </Typography>
          <Typography variant="h5" component="h2">
            Score: {score}
          </Typography>
          <Typography variant="h5" component="h2">
            Broadcast: {broadcast}
          </Typography>
          <Typography variant="h5" component="h2">
            Rating: {rating}
          </Typography>
          <Typography variant="h5" component="h2">
            Episodes: {episodes}
          </Typography>
          <Link variant="body1" href={url}>
            See on MAL
          </Link>
        </Paper>
      </Grid>
      <Grid item className="singleGraph">
        <MainGraph mal_id={String(mal_id)} />
      </Grid>
      <Grid item>
        <BuyAndSell mal_id={String(mal_id)} />
      </Grid>
    </Grid>
  );
};

export default SingleAnime;
