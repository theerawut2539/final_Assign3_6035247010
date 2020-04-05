


const upload = document.getElementById('upload');
const img = document.getElementById('img');
const profileSubmit = document.getElementById('UpDatabaseSubmit');


upload.addEventListener('change',(e)=> {
    console.log('change');
    readURL(upload);
});

profileSubmit.addEventListener('click',(e)=> {
    console.log('click');
    saveProfile();
});


const readURL = (input) => {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = async (e) => {
            console.log(e.target.result);
            img.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}


const saveProfile = async () => {

    const options = new faceapi.SsdMobilenetv1Options({ minConfidence });
      
    const detection = await faceapi.detectSingleFace(img, options)
    .withFaceLandmarks()
    .withFaceDescriptor()

    if (detection) 
    {
        console.log(detection.descriptor);
        let doc = {};

        doc._id = document.getElementById('_id').value;
        doc.degree = document.getElementById('degree').value;
        doc.sector = document.getElementById('sector').value;
        doc.Subject = document.getElementById('Subject').value;
        doc.work = document.getElementById('work').value;
        
        doc.Title = document.getElementById('Title').value;
        doc.name = document.getElementById('name').value;
        doc.lastname = document.getElementById('lastname').value;
        doc.day = document.getElementById('day').value;
        doc.Age = document.getElementById('Age').value;

        doc.BEducational = document.getElementById('BEducational').value;
        doc.Year = document.getElementById('Year').value;
        doc.School = document.getElementById('School').value;
        doc.District1 = document.getElementById('District1').value;
        doc.Province1 = document.getElementById('Province1').value;
        doc.Gpa = document.getElementById('Gpa').value;
        doc.Special = document.getElementById('Special').value;

        doc.HouseNo = document.getElementById('HouseNo').value;
        doc.Village = document.getElementById('Village').value;
        doc.Street = document.getElementById('Street').value;
        doc.SubDistrict = document.getElementById('SubDistrict').value;
        doc.District2 =document.getElementById('District2').value;
 
        doc.province2 = document.getElementById('province2').value;
        doc.Postcode = document.getElementById('Postcode').value;
        doc.Htel = document.getElementById('Htel').value;
        doc.Ptel = document.getElementById('Ptel').value;

        
        doc.descriptor = new Float32Array(Object.values(detection.descriptor)) ;
        console.log(doc);

        db.put(doc);


    }
}