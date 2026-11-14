import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'public');
const symbols={BTC:'BTC/USD',ETH:'ETH/USD',EUR:'EUR/USD',GBP:'GBP/USD',GOLD:'XAU/USD'};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml'};
const cache=new Map();
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 const send=(status,data,headers={})=>{res.writeHead(status,{'Cache-Control':'no-store',...headers});res.end(data)};
 if(url.pathname==='/api/candles'){
  const id=url.searchParams.get('asset');
  if(!Object.hasOwn(symbols,id))return send(400,JSON.stringify({error:'Ativo inválido'}),{'Content-Type':'application/json'});
  if(!process.env.TWELVE_DATA_API_KEY)return send(503,JSON.stringify({error:'Configure TWELVE_DATA_API_KEY no servidor'}),{'Content-Type':'application/json'});
  const cached=cache.get(id);if(cached&&Date.now()-cached.at<65000)return send(200,JSON.stringify(cached.data),{'Content-Type':'application/json'});
  try{
   const api=new URL('https://api.twelvedata.com/time_series');
   api.search=new URLSearchParams({symbol:symbols[id],interval:'1min',outputsize:'100',apikey:process.env.TWELVE_DATA_API_KEY,format:'JSON'}).toString();
   const response=await fetch(api,{signal:AbortSignal.timeout(12000)});
   const raw=await response.json();
   if(!response.ok||raw.status==='error'||!Array.isArray(raw.values))throw new Error(raw.message||'Dados indisponíveis no provedor');
   const candles=raw.values.map(v=>({time:v.datetime,open:Number(v.open),high:Number(v.high),low:Number(v.low),close:Number(v.close)})).filter(v=>Object.values(v).every(x=>typeof x==='string'||Number.isFinite(x))).reverse();
   if(candles.length<30)throw new Error('Histórico insuficiente para indicadores');
   const data={asset:id,symbol:symbols[id],candles,timezone:raw.meta?.exchange_timezone||'Exchange',fetchedAt:new Date().toISOString()};cache.set(id,{at:Date.now(),data});
   return send(200,JSON.stringify(data),{'Content-Type':'application/json'});
  }catch(e){return send(502,JSON.stringify({error:e.message}),{'Content-Type':'application/json'})}
 }
 let requested=url.pathname==='/'?'/index.html':url.pathname;
 try{const file=path.resolve(root,'.'+decodeURIComponent(requested));if(!file.startsWith(root+path.sep))return send(403,'Forbidden');const data=await fs.readFile(file);return send(200,data,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'public, max-age=300'});}catch{return send(404,'Not found')}
});
server.listen(process.env.PORT||3000,()=>console.log('CryptoBot demo running on port '+(process.env.PORT||3000)));
