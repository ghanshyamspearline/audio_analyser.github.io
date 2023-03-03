var _config = null;
var s3;
var bucketName = "audio-analyzer";
var bucketRegion = "ap-south-1";
document.addEventListener("DOMContentLoaded", function () {
  console.log("document is ready. I can sleep now");
  AWS.config.update({
    region: bucketRegion,
    accessKeyId: "AKIA3UTKUY3PC4FSCTIL",
    secretAccessKey: "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",
  });

  s3 = new AWS.S3({
    params: { Bucket: bucketName },
  });
});

const analyzeAudio = () => {
  uploadAudio();
};

const makeid = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const uploadAudio = () => {
  var files = document.getElementById("_audioFile").files;
  if (files) {
    var file = files[0];
    var _timestamp = Number(new Date());
    var _fileId = makeid(10);

    var fileName =
      _timestamp + "_" + _fileId + "." + file.name.split(".").pop();

    var fileUrl = "https://" + bucketName + ".s3." + bucketRegion + ".amazonaws.com/" + fileName;
    $(".btn").hide();
    $("progress").show();
    console.log("File will be available at location " + fileUrl);
    s3.upload(
      {
        Key: fileName,
        Body: file,
        ACL: "public-read",
      },
      function (err, data) {
        if (err) {
          console.error("Error uploading :", err, data);
        } else {
          $(".status").html(
            "<span class='text-success'>Successfully Uploaded!</span><br><h5>Keep tracking number "+_fileId+" for your refrences.</h5>"
          );
          $("progress").hide();
          $(".btn").show();
          $("#_audioFile").val("");
        }
      }
    ).on("httpUploadProgress", function (progress) {
      var uploaded = parseInt((progress.loaded * 100) / progress.total);
      $("progress").attr("value", uploaded);
    });
  }
};

const viewReports = () => {
  $("#_config").hide();
  $("#_reports").show();
};
const backToTool = () => {
  $("#_reports").hide();
  $("#_config").show();
};
