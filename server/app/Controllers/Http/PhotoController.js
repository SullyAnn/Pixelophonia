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
            const fileName1 = `${data.idChoice1}_${photo1.clientName}`;
            console.log(fileName1)
            //await photo1.move(`../assets/uploads/${folderName}`, 
            await photo1.move(`../assets/images/${folderName}`, 
            {
                //name : fileName1,
                overwrite:true
            })
        }
        if(request.file('img2') != null){
            const photo2 = request.file('img2')
            const fileName2 = `${data.idChoice2}_${photo2.clientName}`;
            console.log(fileName2)
            await photo2.move(`../assets/images/${folderName}`, 
            {
                //name : fileName2,
                overwrite:true
            })
        }
        // await photo.moveToDisk('../../../../../assets/uploads', {
        //     name: `${photo.extname}`
        // }, 'local')

        // Get the name of the saved file; to store it in your database, for example.
        

        // const driver = request.drive.use()
         //console.log(request)
        // const coverImage = request.file('img1', {
        // size: '2mb',
        // extnames: ['jpg', 'png', 'gif', 'jpeg'],
        // })
        // const fileName = coverImage.fileName;
        // await coverImage.move(driver.makePath('./../../../../assets/uploads'), {
        //     name: `${coverImage.fileName}`,
        //     overwrite:true,
        // })
          

        // // Get the name of the saved file; to store it in your database, for example.
        
        // console.log(fileName)

    }
}

module.exports = PhotoController
