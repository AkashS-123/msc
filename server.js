import jsonServer from 'json-server';import path from 'path';import {fileURLToPath} from 'url';
const dir=path.dirname(fileURLToPath(import.meta.url));const dist=path.join(dir,'dist');
const app=jsonServer.create();
app.use(jsonServer.defaults({static:dist,noGzip:false}));
app.use('/api',jsonServer.router(path.join(dir,'db.json')));
app.use((req,res)=>res.sendFile(path.join(dist,'index.html')));
const port=process.env.PORT||3001;app.listen(port,()=>console.log('Bench running on '+port));
