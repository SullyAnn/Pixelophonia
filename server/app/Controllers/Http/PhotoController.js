'use strict'

const Helpers = use('Helpers')
const Drive = use('Drive')

class PhotoController {
    async upload( {request,response} ) {
        const data = request.all()
        // save the image of choice n°1
        const folderName = `Question_${data.idQuestion}`
        if(request.file('img1') != null){
            const photo1 = request.file('img1')
        
            console.log(photo1.clientName)
            //if(photo1.extname == "jpeg")photo1.extname = "jpg"
            const fileName1 = `q${data.idQuestion}_c${data.idChoice1}.${photo1.extname}`;
            console.log(fileName1)              
            //await photo1.move(`../assets/uploads/${folderName}`, 
            await photo1.move(`../assets/images/${folderName}`, 
            {
                name : fileName1,
                overwrite:true
            })
        }
        if(request.file('img2') != null){
            const photo2 = request.file('img2')
            //if(photo2.extname == "jpeg")photo2.extname = "jpg"
            const fileName2 = `q${data.idQuestion}_c${data.idChoice2}.${photo2.extname}`;
            console.log(fileName2)
            await photo2.move(`../assets/images/${folderName}`, 
            {
                name : fileName2,
                overwrite:true
            })
        }

    }
}

module.exports = PhotoController
