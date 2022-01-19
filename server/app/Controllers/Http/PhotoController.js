'use strict'

const Helpers = use('Helpers')
const Drive = use('Drive')

class PhotoController {
    async upload( {request,response} ) {
        const data = request.all()
        // save the image of choice n°1
        const photo1 = request.file('img1')
        const photo2 = request.file('img2')
        //console.log(photo)
        const fileName1 = photo1.filename;
        const fileName2 = photo2.filename;
        const folderName = `Question_${data.idQuestion}`
        console.log(folderName)
        await photo1.move(`../assets/uploads/${folderName}`, 
        {
            name : fileName1,
            overwrite:true
        })
        await photo2.move(`../assets/uploads/${folderName}`, 
        {
            name : fileName2,
            overwrite:true
        })
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
