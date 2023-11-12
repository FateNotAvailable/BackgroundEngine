window.bgEngine.getDatabase("valorant_path")
    .then(path => {
        const valorant_folder = document.getElementById("valorant_folder");
        valorant_folder.value = path;
    })

document.getElementById("valorant_folder_save").addEventListener("click", (event) => {
    const valorant_folder = document.getElementById("valorant_folder");
    window.bgEngine.setDatabase("valorant_path", valorant_folder.value)
})