import '../../css/style.css';
import { Button, Form, Modal } from "react-bootstrap";
import { useEffect,useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const AnimeModal = (data)=>{
    
    //console.log(data.showChart)
    return(
        <Modal
        show={data.show}
        onHide={data.handleClose} 
        className="mymodal"
        >
            <Modal.Header className="mymodal-header">
                <Modal.Title><h2>{(data.anime == undefined? "" :data.anime.title)}</h2></Modal.Title>
                
            </Modal.Header>
            <Modal.Body className="mymodal-content">
            <div class="mymodal-left-panel">
                        <div class="anime-img">
                            <img src={(data.anime == undefined? "" : data.anime.img)}/>
                            <textarea value={(data.anime == undefined? "" :data.anime.synopis)}>
                            </textarea>
                        </div>
            </div>
            <div class="mymodal-right-panel">
                        <p id="mymodal-info">MyAnimeList Rating: {(data.anime == undefined? "" :data.anime.totalScore)} | Popularity:{(data.anime == undefined? "" :data.anime.members)} | No. of episode: {(data.anime == undefined? "" :data.anime.episodes)}</p>
                        <p>Rating by episode on Reddit:</p>
                        <div id = "chart-wrapper">
                            { data.showChart? <Line data = {data.chartData}
                            options={
                                {
                                    legend: {
                                        display: false
                                    },
                                    scales: {
                                        x: {
                                            display: true,
                                            scaleLabel: {
                                              display: true,
                                              labelString: 'Episode'
                                            }
                                          },
                                          y: {
                                            min: 0, // minimum value
                                            max: 5 // maximum value
                                        }
                                    }
                                }
                            }/> : <p>Reddit data not available</p>}
                        </div>
                        
            </div>
            </Modal.Body>
            
          
          </Modal>
    )
}

export default AnimeModal;