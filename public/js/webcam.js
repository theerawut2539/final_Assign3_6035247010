const webcam = document.getElementById("output");
const canvas = document.getElementById("webcamOverlay");

var labelsFaceDescriptors = [];

var countFace = 0;





var labels = [];
let tobodyAttendance = $('#tbodyAttendance');

var loadFile = function(event) 
{
  webcam.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function() 
  {
    URL.revokeObjectURL(output.src)
  }
  labels = [];
  tobodyAttendance.empty();
  countFace = 0;
  onPlay();
};



var run = async ()=>{
    console.log('Model Loading');
    await loadModels();
    console.log('Model Loaded');

    const facesDb = await db.allDocs({include_docs:true,attachments:true})

    facesDb.rows.forEach(async i =>{
        let obj = {};

        obj._id = i.doc._id;
        obj.tname = i.doc.Title +" "+ i.doc.name;//
        
        obj.degree = i.doc.degree;
        obj.sector = i.doc.sector;
        obj.Subject = i.doc.Subject;//
        obj.work = i.doc.work;//
    
        obj.Title = i.doc.Title;
        obj.name = i.doc.name;
        obj.lastname = i.doc.lastname;//
        obj.day = i.doc.day;
        obj.Age = i.doc.Age;//
    
        obj.BEducational = i.doc.BEducational;//
        obj.Year = i.doc.Year;
        obj.School = i.doc.School;
        obj.District1 = i.doc.District1;
        obj.Province1 = i.doc.Province1;
        obj.Gpa = i.doc.Gpa;
        obj.Special = i.doc.Special;
    
        obj.HouseNo = i.doc.HouseNo;
        obj.Village = i.doc.Village;
        obj.Street = i.doc.Street;
        obj.SubDistrict = i.doc.SubDistrict;
        obj.District2 = i.doc.District2;
        obj.province2 = i.doc.province2;
        obj.Postcode = i.doc.Postcode;
        obj.Htel = i.doc.Htel;
        obj.Ptel = i.doc.Ptel;






        obj.descriptor = i.doc.descriptor;
        console.log(obj);
        labelsFaceDescriptors.push(obj);
    })
}

async function onPlay()
{

    const options = new faceapi.SsdMobilenetv1Options({ minConfidence });
        
    const detections = await faceapi.detectAllFaces(webcam, options)
    .withFaceLandmarks()
    .withFaceDescriptors()

    
    if (detections) 
    
    {
        //    console.log(detections)
        webcamOverlay.style.display = 'block';
        webcamOverlay.style.position = "absolute";
        webcamOverlay.style.left = webcam.offsetLeft + "px";
        webcamOverlay.style.top = webcam.offsetTop + "px";
        webcamOverlay.getContext('2d').clearRect(0, 0, webcamOverlay.width, webcamOverlay.height);
        const dims = await faceapi.matchDimensions(webcamOverlay, webcam, true);
        var resizedDetections = await faceapi.resizeResults(detections, dims);
        await faceapi.draw.drawDetections(webcamOverlay, resizedDetections);
   

        detections.forEach(async faceDetect => 
            {
                labelsFaceDescriptors.forEach(faceDB =>
                {

                var distance = faceapi.round(faceapi.euclideanDistance(faceDetect.descriptor,faceDB.descriptor))

                if(distance <= 0.60)
                {
                    let name = faceDB.name;
                    //console.log(name);
    
                    if(labels.indexOf(name) == -1)
                    {
                        labels.push(name);
                        // let percentScore = Math.ceil(Math.abs((distance*100)-100))+'%';


                        webcamOverlay.width = webcamOverlay.width;
                        webcamOverlay.height = webcamOverlay.height;
                        webcamOverlay.getContext('2d').drawImage(webcam,0,0);

                        //console.log(faceDetect.detection.box)
                        //console.log(webcamOverlay);

                        var ctx = webcamOverlay.getContext("2d");
                        ctx.font = "500 30px Arial";


                        let ptw = (((faceDetect.detection.box.width)/2) + (faceDetect.detection.box.x))
                        let pth = (((faceDetect.detection.box.height)/2) + (faceDetect.detection.box.y))


                        webcamOverlay.getContext('2d').drawImage(webcamOverlay,0,0);
                        ctx.fillText(name, ptw,pth,faceDetect.detection.box.width);
                

                        ++countFace;
                        var date = new Date();
                        var obj = new Object();

                        obj.imgsrc = webcamOverlay.toDataURL('image/webp');
                        
                        obj.Subject = faceDB.Subject;
                        obj.work = faceDB.work;
                        obj.tname = faceDB.tname;
                        obj.lastname = faceDB.lastname;
                        obj.Age = faceDB.Age;
                        obj.BEducational = faceDB.BEducational;
                        

                        AttendanceTable(obj);
                        
                    }
                }

                if(labels.length >= 10)
                {
                    labels = [];
                }
            })
        })
      }
      else
      {
        webcamOverlay.getContext('2d').clearRect(0, 0, webcamOverlay.width, webcamOverlay.height);
      }

  }

  const AttendanceTable = (obj) =>
  {
      
      let $tr = $("<tr>");

      $tr.append('<th>'+obj.Subject+'</th>');
      $tr.append('<th>'+obj.work+'</th>');
      $tr.append('<th><img src ='+obj.imgsrc+' height = "120"></th>');
      $tr.append('<th>'+obj.tname+'</th>');
      $tr.append('<th>'+obj.lastname+'</th>');
      $tr.append('<th>'+obj.Age+'</th>');
      $tr.append('<th>'+obj.BEducational+'</th>');

      tobodyAttendance.append($tr);
      countFace++;
      if(countFace >= 10)
      {
        tobodyAttendance.empty();
        countFace = 0;
      }
  }

run();