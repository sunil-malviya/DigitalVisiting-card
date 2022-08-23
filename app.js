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
       const PORT = 4000 ;
    
       
     
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
              res.render('userReg');
             })
        
           app.post('/pdf',upload.single('logo'),async(req,res) =>{
              let user = req.body;
              user.address = user.address.toString().trim() || "";
              console.log("user",user);
              console.log("user>>>>>",user.address.length);
              let image  = req.file.filename;
              let logo   =   await imageToBase64(`public/iamges/${image}`);// Path to the image
              let insta  =   await imageToBase64("public/iamges/insta.png");// Path to the image
              let twitter=   await imageToBase64("public/iamges/twitter.png");// Path to the image
              let map    =   await imageToBase64("public/iamges/google-maps.png");// Path to the image
              let call   =   await imageToBase64("public/iamges/telephone-call.png");// Path to the image
              let mail   =   await imageToBase64("public/iamges/gmail.png");// Path to the image
              let weblogo=   await imageToBase64("public/iamges/world-wide-web.png");// Path to the image
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
                  
                 
              const options = { "width":"216mm", "height":"425mm"}

               pdf.create( pdfTemplate,options).toFile(path.join(__dirname, 'html.pdf'), (err, result) => {
                    if (!err) {
                     console.log(result.filename)
                     }
                            res.sendFile( path.join(__dirname, 'html.pdf'))
                            //     res.render('index',{user,
                            //     logo,
                            //     insta,
                            //     twitter,
                            //     map,
                            //     call,
                            //     mail,
                            //     weblogo
                            // });
                        })
                       })

       app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));