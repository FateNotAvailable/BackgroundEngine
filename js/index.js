const grid_container = document.getElementsByClassName("grid-container")[0];

if (!window.bgEngine.getValorantPath()) {
    location = "settings.html";
}

window.bgEngine.getBackgrounds()
    .then((backgrounds) => {
        if (!backgrounds) {
            backgrounds = [];
        }
        filtered_backgrounds = backgrounds.filter(item => item.endsWith("mp4"));
        window.bgEngine.getVideosFolder().then(videos_path => {
            filtered_backgrounds.forEach(background => {
                // Create a div element with the class "grid-item"
                var divElement = document.createElement("div");
                divElement.classList.add("grid-item");

                divElement.addEventListener("click", (event) => {
                    window.selectedPath = `${videos_path.replace(/\\/g, '/')}/${background}`;
                    document.getElementById("selectGame").style.display = "block";
                })

                // Create a video element with the "loop" attribute
                var videoElement = document.createElement("video");
                videoElement.setAttribute("loop", "");

                videoElement.addEventListener("mouseover", (event) => {
                    event.target.play();
                    event.target.muted = true;
                })
            
                videoElement.addEventListener("mouseout", (event) => {
                    event.target.pause()
                    event.target.muted = true;
                })

                // Create a source element with the "src" and "type" attributes
                var sourceElement = document.createElement("source");
                sourceElement.setAttribute("src", `file:///${videos_path.replace(/\\/g, '/')}/${background}`);

                sourceElement.setAttribute("type", "video/mp4");

                // Set the text content for browsers that do not support the video tag
                videoElement.textContent = "Your browser does not support the video tag.";

                // Append the source element to the video element
                videoElement.appendChild(sourceElement);

                // Append the video element to the div element
                divElement.appendChild(videoElement);


                // Append to grid
                grid_container.appendChild(divElement);
            });
        })
    })


const addInto = (game, path) => {
    window.bgEngine.setGameBackground(game.toString().toLowerCase(), path)
}

if (window.location.pathname.endsWith("index.html") && !window.bgEngine.getDatabase("valorant_path")) {
    window.location = "settings.html";
}

const download_file = () => {
    const video_url = document.getElementById("video_url").value;
    const download_btn = document.getElementById("download_btn");
    
    download_btn.innerText = "Downloading ...";
    window.bgEngine.downloadFile(video_url)
        .then(result => {
            addOwnDialog.style.display='none'
            download_btn.innerText = "Downloaded";
            window.location.reload();
        })
}