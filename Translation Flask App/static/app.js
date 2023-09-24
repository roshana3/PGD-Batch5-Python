// app.js
document.addEventListener("DOMContentLoaded", function () {
  // Handle audio source selection
  const taskDropdown = document.getElementById("task");
  const fileSource = document.getElementById("file-source");
  const micSource = document.getElementById("mic-source");
  const fileUpload = document.getElementById("file-upload");
  const micOptions = document.getElementById("microphone-options");
  const rcAudio = document.getElementById("rc-audio");
  const comboDiv = document.getElementById("combo-div");
  const txtDiv = document.getElementById("txt-div");
  const translatedText = document.getElementById("txt-trans");

  console.log("taskDropdown.value", taskDropdown.value);
  fileSource.addEventListener("change", function () {
    if (fileSource.checked) {
      fileUpload.classList.remove("hidden");
      micOptions.classList.add("hidden");
      deleteUploadFiles()
    }
  });

  micSource.addEventListener("change", function () {
    if (micSource.checked) {
      fileUpload.classList.add("hidden");
      micOptions.classList.remove("hidden");
      deleteUploadFiles()
    }
  });

  taskDropdown.addEventListener("change", function () {

    if (taskDropdown.value === "1") {
      console.log("1");
      rcAudio.classList.remove("hidden");
      comboDiv.classList.remove("hidden");
      txtDiv.classList.add("hidden");
  
    } else if (taskDropdown.value === "2") {
      console.log("2"); //remove tadui trans
      rcAudio.classList.add("hidden");
      translatedText.classList.remove("hidden");
      comboDiv.classList.remove("hidden");
      txtDiv.classList.add("hidden");
    } else if (taskDropdown.value === "3") {
      console.log("3");
      rcAudio.classList.remove("hidden");
      comboDiv.classList.add("hidden");
      txtDiv.classList.remove("hidden");
     
    } else if (taskDropdown.value === "4") {
      console.log("4");
      translatedText.classList.remove("hidden");
      rcAudio.classList.add("hidden");
      comboDiv.classList.add("hidden");
      txtDiv.classList.remove("hidden");
 
    } //else
      else if (taskDropdown.value === "5") {
      console.log("else");
      translatedText.classList.remove("hidden");
      rcAudio.classList.add("hidden");
      comboDiv.classList.remove("hidden");
      txtDiv.classList.add("hidden");
    }
    reload()
  });


  // Handle record and stop buttons 
  const fileInput = document.getElementById("fileInput");
  const selectedFileName = document.getElementById("selectedFileName");
  const uploadButton = document.getElementById("uploadButton");
  const closeButton = document.getElementById("closeButton");
  const closeRecord = document.getElementById("closeRecord");

  const translateBtn = document.getElementById("translate-btn");
  const uploadDiv = document.getElementById("u-a-div");
  const recordDiv = document.getElementById("r-a-div");

  const inputText = document.getElementById("input-text");
  const recordBtn = document.getElementById("record-btn");

  closeRecord.addEventListener("click", function () {
    selectedFileName.textContent = "";
    translateBtn.style.opacity = "0.5"; // Enable the Upload button
    recordDiv.classList.add("hidden");
    translateBtn.setAttribute("disabled", "disabled");
  });

  closeButton.addEventListener("click", function () {
    selectedFileName.textContent = "";
    recordBtn.classList.remove("hidden");
    translateBtn.style.opacity = "0.5"; // Enable the Upload button
    translateBtn.setAttribute("disabled", "disabled");

    uploadDiv.classList.add("hidden");
  });

  //txt
  inputText.addEventListener("input", function () {
    if (inputText.value.length > 0) {
      translateBtn.style.opacity = "1"; // Enable the Translate button
      translateBtn.removeAttribute("disabled");
    } else {
      translateBtn.style.opacity = "0.5"; // Disable the Translate button
      translateBtn.setAttribute("disabled", "disabled");
    }
  });

  fileInput.addEventListener("change", function () {
    console.log("fileInput")
    if (fileInput.files.length > 0) {
      console.log("fileInput 1")
      selectedFileName.textContent = fileInput.files[0].name;
      uploadButton.classList.remove("hidden"); // Show the Upload button
      document.getElementById("u-a-div").classList.add("hidden");
    } else {
      console.log("fileInput 2")

      selectedFileName.textContent = "";
      uploadButton.classList.add("hidden"); // Hide the Upload button
    }
  });
  //upload file
  document
    .getElementById("uploadButton")
    .addEventListener("click", function () {
      var fileInput = document.getElementById("fileInput");
      var file = fileInput.files[0];

      if (file) {
        uploadFile(file);
      } else {
        alert("Please select a file to upload.");
      }
    });

  function uploadFile(file) {
    var formData = new FormData();
    formData.append("file", file);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        // alert("File uploaded successfully.");
        translateBtn.style.opacity = "1"; // Enable the Upload button
        translateBtn.removeAttribute("disabled");
        uploadButton.classList.add("hidden");
        console.log("result:", xhr.response);

        try {
          const data = JSON.parse(xhr.response);
          const filePath = data.file_path;
          console.log("File Path:", filePath);

          document.getElementById("u-a-div").classList.remove("hidden");
          updateAudioSrc(filePath, "audioControl");
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
        console.log("File uploaded successfully.");
      } else {
        alert("File upload failed. Please try again.");
      }
    };

    xhr.onerror = function () {
      alert("File upload failed. Please try again.");
    };

    xhr.send(formData);
  }

  function autoExpandTextarea() {
    const textarea = document.getElementById("input-text");
    textarea.style.height = "20px"; // Set a minimum height

    const scrollHeight = Math.max(textarea.scrollHeight, 40); // Set a minimum height of 60px
    textarea.style.height = scrollHeight + "px"; // Adjust height based on content
  }

  // Add an input event listener to the textarea
  $("#input-text").on("input", function () {
    autoExpandTextarea();
  });

  // Call the function initially to set the height based on placeholder text
  autoExpandTextarea();

  // Check if the JavaScript file is loaded
  console.log("JavaScript file loaded.");
});

//out
function closeAction() {
  selectedFileName.textContent = "";
  recordBtn.classList.remove("hidden");
  translateBtn.style.opacity = "0.5"; 
  translateBtn.setAttribute("disabled", "disabled");
  if (micSource.checked) {
    recordDiv.classList.add("hidden");
  } else {
    uploadDiv.classList.add("hidden");
  }
}

function startRecording() {
  console.log("startRecording");
  document.getElementById("r-a-div").classList.add("hidden");

  const recordBtn = document.getElementById("record-btn");
  const stopBtn = document.getElementById("stop-btn");

  stopBtn.classList.remove("hidden");
  recordBtn.classList.add("hidden");

  const sourceType = document.getElementsByName("audio-source").value;

  if (sourceType === "file") {
  }
  var functionUrl = "/start_record";
  server_data = {};
  $.ajax({
    type: "POST",
    url: functionUrl,
    data: JSON.stringify(server_data),
    contentType: "application/json",
    dataType: "json",
    success: function (result) {
      console.log("start recording js:");
      console.log(result);
    },
  });
}

function stopRecording() {
  console.log("stopRecording");
  updateProgressBar(0, "loading-bar");
  document.getElementById("loading-div").classList.remove("hidden");
  const recordBtn = document.getElementById("record-btn");
  const stopBtn = document.getElementById("stop-btn");
  const recordDiv = document.getElementById("r-a-div");

  recordBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");

  const sourceType = document.getElementsByName("audio-source").value;

  if (sourceType === "file") {
  }
  var functionUrl = "/stop_record";
  server_data = {};

  $.ajax({
    type: "POST",
    url: functionUrl,
    data: JSON.stringify(server_data),
    contentType: "application/json",
    dataType: "json",
    success: function (result) {
      console.log("stop js:");
      console.log(result);
      recordDiv.classList.remove("hidden");
      document.getElementById("translate-btn").style.opacity = "1"; // Enable the Upload button
      document.getElementById("translate-btn").removeAttribute("disabled");

      try {
        filePath = result["file_path"];
        console.log("File Path:", result["file_path"]);
        document.getElementById("loading-div").classList.add("hidden");
        document.getElementById("r-a-div").classList.remove("hidden");
        updateAudioSrc(filePath, "recordControl");
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    },
  });
}

// app.js

function executeTranslation() {
  const taskDropdown = document.getElementById("task").value;
  var result_txt = document.getElementById("translated-text");

  var server_data = {};
  //set url
  var functionUrl;

  if (["3", "4"].includes(taskDropdown)) {
    var sourceLanguage = document.getElementById("source-language").value;
    var inputText = document.getElementById("input-text").value;
    var targetLanguage = document.getElementById("target-language").value;

    server_data = {
      source_language: sourceLanguage,
      target_language: targetLanguage,
      input_text: inputText,
      selected_task: taskDropdown,
    };
    functionUrl = "/txtInput";
  } else if (["1", "2", "5"].includes(taskDropdown)) {
    var targetLang = document.getElementById("target-lang").value;
    server_data = {
      target_language: targetLang,
      selected_task: taskDropdown,
    };

    functionUrl = "/voiceInput";
  }

  if (["1", "3"].includes(taskDropdown)) {
    document.getElementById("loading-div-t").classList.remove("hidden");
    updateProgressBar(0, "loading-bar-t");
  }
  console.log("prams:", functionUrl, "data:", server_data);

  if (functionUrl) {
    $.ajax({
      type: "POST",
      url: functionUrl,
      data: JSON.stringify(server_data),
      contentType: "application/json",
      dataType: "json",
      success: function (result) {
      
        if (["1", "2","3", "4", "5"].includes(taskDropdown)) {
          // result_txt.classList.remove('hidden')
          console.log("Result js opt 1:", result);
          result_txt.innerHTML = result["output"];
        }
        if (["1", "3"].includes(taskDropdown)) {
          console.log("Result js opt 2:", result);
          document.getElementById("loading-div-t").classList.add("hidden");
          document.getElementById("loading-bar-t").classList.remove("hidden");
          document.getElementById("translatedAudio").classList.remove("hidden");
          updateAudioSrc(result["file_path"], "translatedAudio");
        }
      },
    });
  }
}

function updateProgressBar(progress, loadingid) {
  let loadingProgress = progress;

  const loadingBar = document.getElementById(loadingid);
  function executeProgressBar() {
    console.log(progress);
    if (loadingProgress < 100) {
      loadingProgress += 10; // Increase progress by 10% (adjust as needed)
      loadingBar.style.width = loadingProgress + "%";
      setTimeout(executeProgressBar, 1000); // Update every second (adjust as needed)
    } else {
      // When progress reaches 100%, return true
      return true;
    }
  }
  return executeProgressBar();
}

function updateAudioSrc(audioSrc, idaudioId) {
  var audioControl = document.getElementById(idaudioId);
  audioControl.src = audioSrc;
  audioControl.pause();
  audioControl.currentTime = 0;
  audioControl.load();
}

function deleteUploadFiles(){
  $.ajax({
    type: "POST",
    url: '/remove_upload',
    data: JSON.stringify({data:'delete'}),
    contentType: "application/json",
    dataType: "json",
    success: function (result) {
      console.log("Deleted:",result);
     // updateAudioSrc(filePath, "audioControl");
   
      document.getElementById("u-a-div").classList.add("hidden");
      document.getElementById("r-a-div").classList.add("hidden"); 
      document.getElementById("translate-btn").style.opacity = "0.5"; 
      document.getElementById("translate-btn").setAttribute("disabled", "disabled");
      document.getElementById("selectedFileName").textContent = ""

    },
  });

}

function reload(){
  document.getElementById("translated-text").innerHTML = "";
  updateAudioSrc("", "translatedAudio");
  document.getElementById("translatedAudio").classList.add("hidden");
}

