import React from 'react';
import {SearchContext} from '../context/search';
import {Typography, Link, Paper, GridListTile, Grid} from '@material-ui/core';
import './AnimeCard.scss';

const AnimeCard = (props) => {
    const onClickHandler = () => {
        
    }

    const title = props.anime.title.length > 15 ? `${props.anime.title.substring(0,15)}...`: props.anime.title;
    const imgUrl = props.anime.image_url;
    const rating = props.anime.score;
    const synopsis = props.anime.synopsis.length > 30 ? `${props.anime.title.substring(0,30)}...`: props.anime.synposis;

    return (
        <GridListTile className="animeCard__container">
            <Grid container item xs={12}>
                <Paper className="animeCard__paper">
                    <Typography variant="h5" component="h2">{title}</Typography>
                    <img src={imgUrl} alt={title} style={{maxHeight: 300}}/>
                    <Typography variant="h5" component="h2">{rating}</Typography>
                    <Typography variant="body2" component="h2" paragraph={true}>
                        {synopsis}
                    </Typography>
                    <Link component="button" variant="body1" style={{marginBottom: 0}} onClick={onClickHandler}>More</Link>
                </Paper>
            </Grid>
        </GridListTile>
    )
};

export default AnimeCard;