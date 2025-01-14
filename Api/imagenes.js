import { Router } from "express";
import { upload } from "./upload.js";

export const ImagenesRouter = Router();

ImagenesRouter.get('/', (req, res) => {
 try{
  return res.sendFile(__dirname + '/index.html');

 }catch(error){
  res.status(404).send({mensaje : 'No hay imagenes'})
 }
});

ImagenesRouter.post("/upload", upload.single('file') ,(req, res) => {
  return res.json({ message: 'Upload success' });
});
