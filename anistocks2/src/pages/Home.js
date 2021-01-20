import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { SearchContext } from "../context/search";
import { FormControl, Input, IconButton, Grid } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import "./Home.scss";
//import AnimeList from '../components/AnimeList';
import SeasonalAnime from "../components/SeasonalAnime";
import MainGraph from "../components/MainGraph";

const Home = () => {
  const history = useHistory();
  const search = useContext(SearchContext);
  const [input, setInput] = useState("");

  // useEffect(() => {
  //     search.search('naruto').then((data) => {
  //         console.log(data)
  //     });
  // }, [search]);
  const handleSearch = (event) => {
    event.preventDefault();
    search.search(input).then((data) => {
      search.setData(data.results);
      localStorage.setItem("resData", JSON.stringify(data.results));
      history.push("/results");
    });
  };

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignContent="center"
      alignItems="center">
      <Grid item>
        <Grid item>
          <img
            className="kazumaImg"
            alt="kazuma"
            src={`${process.env.PUBLIC_URL}/kazuma.png`}
            height={420}
            width={405}
          />
        </Grid>
        <Grid item>
          <form className="home__form">
            <FormControl className="home__formControl" type="submit">
              <Input
                className="home__input"
                placeholder="Search for stonks on any anime"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <IconButton
                className="home__iconButton"
                variant="contained"
                color="primary"
                type="submit"
                disabled={!input}
                onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </FormControl>
          </form>
        </Grid>
        <div className="graphs">
          <Grid className="leftGraph" item>
            <MainGraph mal_id="40028" />
          </Grid>
          <Grid className="centerGraph" item>
            <MainGraph mal_id="36458" />
          </Grid>
          <Grid className="rightGraph" item>
            <MainGraph mal_id="39551" />
          </Grid>
        </div>
        <Grid item>
          <SeasonalAnime />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
