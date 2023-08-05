var modal;

window.onload = ()=>{
// Get the modal
    modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
    span = document.getElementsByClassName("close")[0];

    var ctx = document.getElementById("myChart").getContext('2d');

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var labels = [1,2,3,4,5,6,7,8,9,10,11,12]


new Chart("myChart", {
    type: "line",
    data: {
        labels: labels,
        datasets: [{
          label: 'My First Dataset',
          data: [4.67,4.55,3.21,3.49,3.12,3.90,3.67,4.1,4.21,4.9,4.1,3.5],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
    options: {
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Episode'
                }
              }]
        }
    }
  });

}

// When the user clicks on the button, open the modal
function openModal() {
    modal.style.display = "block";
}
