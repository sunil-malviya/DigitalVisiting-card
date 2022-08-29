      const express = require('express');
      const ejs  =  require('ejs');
      const  fs = require('fs');
      const path  =  require('path');
      const pdf = require('html-pdf');
      const bodyParser = require('body-parser')
      const imageToBase64 = require('image-to-base64');
      const multer  = require('multer')  
      const app = express();
       app.use(express.urlencoded({ extended: true }));   
       app.use(express.json());
       app.use(bodyParser.urlencoded({ extended: false }))
       app.use(bodyParser.json())
       app.use(express.static(path.join(__dirname, 'public')))
       app.use(express.static("public"))
       app.set('view engine', 'ejs');
       const PORT = process.env.PORT || 4000 ;
    
       
     
          let storage = multer.diskStorage({
                    destination: (req, file, callBack) => {
                          callBack(null, 'public/iamges/')     // './public/images/' directory name where save the file
                          },
                          filename: (req, file, callBack) => {
                            
                              callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
                           }
                            
                      })
                  
              
                      let upload = multer({
                          storage: storage
                      });
            

           app.get('/',(req,res) =>{
              res.render('homePage');
             })
        
           app.post('/pdf-view',upload.single('logo'),async(req,res) =>{
              let user = req.body;
               // user.address = user.address.toString().trim() || "";
               // console.log("user",user);
          
            //   console.log("user>>>>>",user.address.length);                   
              let image  = req.file.filename;
              let logo   =   await imageToBase64(`public/iamges/${image}`);// Path to the image
              let insta  =   await imageToBase64("public/iamges/insta.png");// Path to the image
              let twitter=   await imageToBase64("public/iamges/twitter.png");// Path to the image
              let map    =   await imageToBase64("public/iamges/google-maps.png");// Path to the image
              let call   =   await imageToBase64("public/iamges/telephone-call.png");// Path to the image
              let mail   =   await imageToBase64("public/iamges/gmail.png");// Path to the image
              let weblogo=   await imageToBase64("public/iamges/world-wide-web.png");// Path to the image
             
                 res.render('downloadPdf',{user,
                                logo,
                                insta,
                                twitter,
                                map,
                                call,
                                mail,
                                weblogo
                            });
                    fs.unlinkSync(`public/iamges/${image}`);
       })

             app.post('/pdf',upload.single('logo'),async(req,res) =>{
              let user = req.body;
            //   user.address = user.address.toString().trim() || "";
               // console.log("user",user);
          
              let addLine = user.lineHeight;
              let cline = user.clineHeight;             
            //   let image  = req.file.filename;
            //   let logo   =   await imageToBase64(`public/iamges/${image}`);
              let insta  =   await imageToBase64("public/iamges/insta.png");// Path to the image
              let twitter=   await imageToBase64("public/iamges/twitter.png");// Path to the image
              let map    =   await imageToBase64("public/iamges/google-maps.png");// Path to the image
              let call   =   await imageToBase64("public/iamges/telephone-call.png");// Path to the image
              let mail   =   await imageToBase64("public/iamges/gmail.png");// Path to the image
              let weblogo=   await imageToBase64("public/iamges/world-wide-web.png");// Path to the image
              let logo  =   user.logo;
              const  pdfTemplate = await ejs.renderFile(
                path.join(__dirname, './views/index.ejs'),
                 {
                      user,
                      logo,
                      insta,
                      twitter,
                      map,
                      call,
                      mail,
                      weblogo
                 })   

                 let height =  370+((addLine-1)*12);
                 if(cline>1){
                     if(cline>2){ 
                     height = (height + 35);}
                     height = (height + 22)
                  }
               const options = { "width":"217mm", "height":`${height}mm`,}
              
               pdf.create( pdfTemplate,options).toFile(path.join(__dirname, 'businesscard.pdf'), (err, result) => {
                    if (!err) {
                     // console.log(result)
                     }
                           
                        //  console.log(pdfTemplate);
               
                            res.sendFile( path.join(__dirname, 'businesscard.pdf'))
                           //      res.render('index',{user,
                           //      logo,
                           //      insta,
                           //      twitter,
                           //      map,
                           //      call,
                           //      mail,
                           //      weblogo
                           //  });
                         })
                           
                       })
          
       app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));