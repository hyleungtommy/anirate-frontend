import React, { useContext,useRef, useEffect, useState } from "react";
import {
  Col,
  Container,
  DropdownButton,
  Form,
  Row,
  Modal,
  Dropdown,
} from "react-bootstrap";
import "../css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link } from "react-router-dom";
import url from '../awsurl'
import AnimePanel from './components/animePanel'
import AnimeModal from './components/animeModal'


const getCurrentSeason = ()=>{
    const now = new Date();
    const month = now.getMonth();
    if(month >= 3 && month < 6) return 1;
    else if(month >= 6 && month < 9) return 2;
    else if(month >= 9 ) return 3;
    else return 0;
}

const getCurrentYear = ()=>{
    const now = new Date();
    return now.getFullYear();
}

const getPreviouSeason = ()=>{
    const now = new Date();
    const month = now.getMonth();
    if(month >= 3 && month < 6) return 0;
    else if(month >= 6 && month < 9) return 1;
    else if(month >= 9 ) return 2;
    else return 3;
}

const seasonList = ['winter','spring','summer','fall']

const Anime = (item)=>{

    const[animeList,setAnimeList] = useState([]);
    const[modalShow, setModalShow] = useState(false);
    const[season,setSeason] = useState(getCurrentSeason());
    const[year,setYear] = useState(getCurrentYear());
    const[animePanelList,setAnimePanelList] = useState([]);
    const [show, setShow] = useState(false);
    const[selectedAnime,setSelectedAnime] = useState({});
    const [chartData, setChartData] = useState({ })
    const [showChart,setShowChart] = useState(true);
    const [updateView,setUpdateView] = useState(0);
    const [updateSortView,setUpdateSortView] = useState(0);
    const [seasonListFromDB,setSeasonListFromDB] = useState([]);
    const [showPrevSeasons,setShowPrevSeasons] = useState(false);
    const [prevSeasonsHTML,setPrevSeasonsHTML]= useState([]);
    const [searchText,setSearchText] = useState("");
    
    useEffect(()=>{
        setChartData(
            {
                labels: [1,2,3,4,5,6,7,8,9,10,11,12],
                datasets: [{
                  label: 'My First Dataset',
                  data: [4.67,4.55,3.21,3.49,3.12,3.90,3.67,4.1,4.21,4.9,4.1,3.5],
                  fill: false,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                }]
              }
        )
    },[])

    const getAnimeList = async function (yearCache,seasonCache) {
        const headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };
        return axios
          .get(url + "/season/" + yearCache + "/" + seasonList[seasonCache],  {
            headers: headers,
          })
          .then((resp) => {
            if (resp.data) {
              var animes = [];
              var animePanelListCache = [];
              resp.data.map((anime) => {
                animes.push(anime);
                animePanelListCache.push(
                <AnimePanel 
                    anime={anime}
                    handleShow={handleShow}
                >
                </AnimePanel>)
              });
              setAnimeList(animes)
              setAnimePanelList(animePanelListCache)
            }
          });
      };

      const getSeasonListFromDB = async function(){
        const headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };
        return axios
          .get(url + "/season/list",  {
            headers: headers,
          })
          .then((resp) => {
            let tempList = resp.data;
            tempList.sort((a,b)=>parseInt(b.year) - parseInt(a.year) || parseInt(b.season_id) - parseInt(a.season_id))
            setSeasonListFromDB(tempList);
            getPrevSeasonsList(tempList);
          })
      }

      const searchAnimeByName = async function(){
        const headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };
        return axios
          .get(url + "/anime/search/" + searchText,  {
            headers: headers,
          })
          .then((resp) => {
            console.log(resp.data);
            if (resp.data) {
              var animes = [];
              var animePanelListCache = [];
              resp.data.map((anime) => {
                animes.push(anime);
                animePanelListCache.push(
                <AnimePanel 
                    anime={anime}
                    handleShow={handleShow}
                >
                </AnimePanel>)
              });
              setAnimeList(animes)
              setAnimePanelList(animePanelListCache)
            }
          })
      }

      const handleShow = (anime)=>{
        setShow(true);
        setSelectedAnime(anime);
        if(anime.episodeRating.L.length > 0){
          setShowChart(true);
          let episodes = [];
          let rating = [];
          for(let e of anime.episodeRating.L){
            if(e.M !=undefined && e.M.episode != undefined && e.M.score != undefined){
              episodes.push(e.M.episode.S);
              rating.push(parseFloat(e.M.score.N));
            }
          }
          setChartData({
            labels: episodes,
            datasets: [{
              label: 'Episode Rating',
              data: rating,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          })
        }else{
          setShowChart(false);
        }
        
      }

      const handleClose = () => {
        setShow(false);
      };

    
      useEffect(() => {
        getAnimeList(getCurrentYear(),getCurrentSeason());
        getSeasonListFromDB();
      }, []);

      useEffect(() => {
        getAnimeList(year,season);
      }, [updateView]);

      useEffect(() => {
        updateSortedList();
      }, [updateSortView]);





      const getCurrentSeasonAnime = async function(){
        setShowPrevSeasons(false);
        var yearCache = getCurrentYear();
        var seasonCache = getCurrentSeason()
        setYear(yearCache);
        setSeason(seasonCache);
        setUpdateView(updateView + 1);
      }

      const getPreviousSeasonAnime = async function(){
        setShowPrevSeasons(false);
        var yearCache = getCurrentYear();
        var seasonCache = getPreviouSeason()
        setYear(yearCache);
        setSeason(seasonCache);
        if(getPreviouSeason() == 3){
          yearCache--;
          setYear(year-1)
        }
        setUpdateView(updateView + 1);
      }

      const getPastSeasonAnime = async function(year,season_id){
        setShowPrevSeasons(false);
        setYear(year);
        setSeason(season_id);
        getAnimeList(year,season_id);// add in because getAnimeList() from useEffect doesn't always called for some reason
        setUpdateView(updateView + 1);
      }

      

      const sortAnimeByPopularity = function(){
        var animes = animeList;
        animes.sort((a,b) =>{
          return b.members - a.members
        })
        setAnimeList(animes)
        setUpdateSortView(updateSortView + 1)
      }

      const sortAnimeByRating = function(){
        var animes = animeList;
        animes.sort((a,b) =>{
          return b.totalScore - a.totalScore
        })
        setAnimeList(animes)
        setUpdateSortView(updateSortView + 1)
      }

      const updateSortedList = function(){
          var animes = animeList;
          var animePanelListCache = [];
          animes.forEach((anime) => {
                animePanelListCache.push(
                <AnimePanel 
                    anime={anime}
                    handleShow={handleShow}
                >
                </AnimePanel>)
              });
          setAnimePanelList(animePanelListCache)
      }

      const getPrevSeasonsList = function(tempList){
          let list = [];
          for(let s of tempList){
            list.push(<>| <a onClick={()=>getPastSeasonAnime(s.year,s.season_id)}>{s.year + " " + seasonList[s.season_id]}</a> </>);
          }
          setPrevSeasonsHTML(list)
      }

      const onKeyDownSearchBar = function(e){
        if (e.key === 'Enter') {
          searchAnimeByName();
        }
      }
    
      

    return(
        <>
            <Container fluid>
            <header>
            <p>
                <span id="head">Anirate II</span>
                <span id="header-link"><a onClick={getCurrentSeasonAnime}>Current Season</a> |<a onClick={getPreviousSeasonAnime}>Last Season</a>|<a onClick={()=>{setShowPrevSeasons(true)}}>Previous Seasons</a></span>
                <div class="input-group w-25" id="search-box">
                    <span class="input-group-text" id="basic-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                          </svg>
                    </span>
                    <input type="text" class="form-control" placeholder="Type anime name..." aria-label="Input group example" aria-describedby="basic-addon1" value={searchText} onKeyDown={onKeyDownSearchBar} onChange={(e)=>setSearchText(e.target.value)}/>
                  </div>
            </p>
            
        </header>
        <hr/>
          {showPrevSeasons? 
            <Container className="prev-season">{prevSeasonsHTML}</Container> :
            <>
            <p id="season-title">{year} {seasonList[season]}
            <Dropdown className="right" id="mydropdown">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Sort By:
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={sortAnimeByPopularity}>Popularity</Dropdown.Item>
              <Dropdown.Item onClick={sortAnimeByRating}>Rating</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            </p>

            <main>{animePanelList}</main>
            </>
        }
            

        
        </Container>
        <AnimeModal
            show={show}
            handleClose={handleClose}
            anime={selectedAnime}
            showChart={showChart}
            chartData={chartData}
        ></AnimeModal>

        </>
    )
}

export default Anime;