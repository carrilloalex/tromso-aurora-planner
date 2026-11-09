/* Aurora Planner v13.0 + v13.1: progressive enhancement. No forecast values are fabricated. */
(()=>{
'use strict';
const el=id=>document.getElementById(id);
const es=()=>typeof window.auroraLocale==='function' && window.auroraLocale().startsWith('es');
const tr=(a,b)=>es()?b:a;
let solar={mag:[],plasma:[],kp:[],updated:null,error:null},map=null,markers=[],mapPromise=null;
const number=(v)=>{const n=Number(v);return v==null||v===''||!Number.isFinite(n)?null:n};
const fmt=(n,d=0)=>n===null?'—':n.toFixed(d);
function records(json){if(!Array.isArray(json)||!Array.isArray(json[0]))return [];let keys=json[0];return json.slice(1).map(r=>Object.fromEntries(keys.map((k,i)=>[k,r[i]])));}
async function getJSON(url){const ctrl=new AbortController();const timeout=setTimeout(()=>ctrl.abort(),10000);try{const res=await fetch(url,{signal:ctrl.signal,cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);return await res.json()}finally{clearTimeout(timeout)}}
async function loadSolar(){
 el('v13-solar-status').textContent=tr('Loading NOAA…','Cargando NOAA…');
 const urls=['https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json','https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json','https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json'];
 const result=await Promise.allSettled(urls.map(getJSON));
 solar.mag=result[0].status==='fulfilled'?records(result[0].value):[];
 solar.plasma=result[1].status==='fulfilled'?records(result[1].value):[];
 solar.kp=result[2].status==='fulfilled'?records(result[2].value):[];
 solar.error=result.every(r=>r.status==='rejected')?'NOAA unavailable':null;
 updateSolar();
}
function latestValid(rows,fields){return [...rows].reverse().find(x=>fields.every(k=>number(x[k])!==null))||null}
function updateSolar(){
 const d=typeof selectedDate==='string'?selectedDate:null;
 const today=typeof osloToday==='function'?osloToday():null;
 const diff=d&&today?Math.round((Date.parse(d+'T12:00:00Z')-Date.parse(today+'T12:00:00Z'))/86400000):null;
 const m=latestValid(solar.mag,['bz_gsm','bt']);const p=latestValid(solar.plasma,['speed','density']);
 const times=[m?.time_tag,p?.time_tag].filter(Boolean).map(x=>Date.parse(x+'Z'.replace('ZZ','Z'))).filter(Number.isFinite);
 const age=times.length?(Date.now()-Math.min(...times))/60000:Infinity;
 const fresh=age>=-10&&age<=45;
 const near=diff===0;
 const status=el('v13-solar-status');
 status.textContent=near?(fresh?tr('Recent NOAA data','Datos NOAA recientes'):tr('Delayed / unavailable','Retrasados / no disponibles')):tr('Live context only','Solo contexto actual');
 el('v13-bz').textContent=fmt(m?number(m.bz_gsm):null,1);
 el('v13-bt').textContent=fmt(m?number(m.bt):null,1);
 el('v13-speed').textContent=fmt(p?number(p.speed):null);
 el('v13-density').textContent=fmt(p?number(p.density):null,1);
 const samples=solar.mag.filter(x=>number(x.bz_gsm)!==null&&m&&Date.parse(x.time_tag+'Z')>=Date.parse(m.time_tag+'Z')-60*60000);
 const south=samples.filter(x=>number(x.bz_gsm)<0).length;
 const ratio=samples.length?south/samples.length:0;
 const trend= samples.length>=6?(ratio>=.7?tr('Bz was southward for most of the last hour.','Bz se mantuvo hacia el sur durante gran parte de la última hora.'):ratio<=.3?tr('Bz was mostly northward over the last hour.','Bz fue mayormente positivo durante la última hora.'):tr('Bz direction varied over the last hour.','La orientación del Bz varió durante la última hora.')):tr('Not enough recent readings for a Bz trend.','No hay suficientes mediciones recientes para analizar Bz.');
 el('v13-solar-trend').textContent=(m?.time_tag?tr('Latest magnetic reading: ','Última medición magnética: ')+m.time_tag+' UTC · ':'')+trend;
 const kp=latestValid(solar.kp,['Kp']);
 el('v13-kp').textContent=kp?`Kp ${fmt(number(kp.Kp),1)} · ${kp.time_tag||kp.time||''} · ${kp.observed||kp.noaa_scale||tr('forecast/observation','previsión/observación')}`:tr('Kp forecast not available.','Previsión Kp no disponible.');
 let message;
 if(diff===null)message=tr('Select a night to compare forecast and solar activity.','Selecciona una noche para comparar meteorología y actividad solar.');
 else if(diff>3)message=tr('This date is beyond the reliable short-term solar forecast. The live values below describe NOW, not the selected night.','Esta fecha queda fuera de la previsión solar a corto plazo. Los valores de abajo describen AHORA, no la noche seleccionada.');
 else if(diff>0)message=tr('Solar-wind values below are live observations, not predictions for this future night. Check NOAA Kp forecasts closer to departure.','Los valores de viento solar son observaciones actuales, no predicciones para esta noche futura. Consulta Kp cuando se acerque.');
 else if(diff<0)message=tr('This night is in the past. The readings below are current, not historical values for that date.','Esta noche ya pasó. Las mediciones siguientes son actuales, no históricas de esa fecha.');
 else if(!fresh)message=tr('Current solar readings are delayed or unavailable. Do not infer low activity from missing data.','Las mediciones solares están retrasadas o no disponibles. La ausencia de datos no significa actividad baja.');
 else if(m&&number(m.bz_gsm)<-5&&ratio>=.7)message=tr('Sustained southward Bz is favorable for geomagnetic coupling, but aurora visibility is not guaranteed.','El Bz negativo sostenido favorece el acoplamiento geomagnético, pero no garantiza auroras visibles.');
 else message=tr('Live solar conditions can change quickly. In Tromsø, aurora can be visible even with modest Kp.','Las condiciones solares pueden cambiar rápidamente. En Tromsø puede haber auroras incluso con Kp moderado.');
 el('v13-solar-explain').textContent=message;
}
function cloudData(){if(typeof selectedDate!=='string'||typeof rank!=='function')return null;const best=rank(selectedDate,+state.drive);if(!best)return null;const hs=hours(selectedDate);return {best,hs,values:hs.map(h=>pointValue(best.index,h.key,'cloud_cover'))};}
function renderCloud(){const data=cloudData();const chart=el('v13-cloud-chart');if(!data){chart.innerHTML='';el('v13-cloud-window').textContent=tr('No hourly weather data for this date.','No hay previsión horaria para esta fecha.');return}
 el('v13-cloud-intro').textContent=tr('Best reachable forecast point: ','Mejor punto de previsión accesible: ')+data.best.name;
 chart.innerHTML=data.values.map((v,i)=>`<div class="v13-hour ${v===null?'':v<=30?'good':v<=60?'mid':'bad'}"><span>${String(data.hs[i].hour).padStart(2,'0')}</span><b>${v===null?'—':Math.round(v)+'%'}</b></div>`).join('');
 let longest={len:0,start:-1},run=0,start=0;data.values.forEach((v,i)=>{if(v!==null&&v<=35){if(!run)start=i;run++;if(run>longest.len)longest={len:run,start}}else run=0});
 el('v13-cloud-window').textContent=longest.len>=2?tr('Longest clearer interval: ','Intervalo más largo con menos nubes: ')+String(data.hs[longest.start].hour).padStart(2,'0')+':00–'+String((data.hs[longest.start+longest.len-1].hour+1)%24).padStart(2,'0')+':00 ('+longest.len+' h; ≤35% '+tr('forecast cloud cover','nubosidad prevista')+')':tr('No sustained low-cloud interval (≤35%) is forecast at this point. Check other locations.','No se prevé un intervalo prolongado con nubosidad ≤35 % en este punto. Consulta otras zonas.');
}
function loadLeaflet(){if(window.L)return Promise.resolve(true);if(mapPromise)return mapPromise;mapPromise=new Promise(resolve=>{const link=document.createElement('link');link.rel='stylesheet';link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(link);const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.onload=()=>resolve(!!window.L);script.onerror=()=>resolve(false);document.head.appendChild(script)});return mapPromise}
async function initMap(){if(map)return true;const ok=await loadLeaflet();if(!ok){el('v13-real-map').innerHTML='<p style="padding:20px">'+tr('Interactive map unavailable. Forecast locations remain listed below.','Mapa interactivo no disponible. Las ubicaciones siguen en la lista inferior.')+'</p>';return false}map=L.map('v13-real-map',{scrollWheelZoom:false}).setView([69.49,19.4],8);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:13,attribution:'© OpenStreetMap contributors'}).addTo(map);return true}
function mapTime(){const i=Number(el('v13-hour').value)||0;return hours(selectedDate)[i]}
function renderMapPoints(){if(typeof selectedDate!=='string')return;if(map)markers.forEach(x=>map.removeLayer(x));markers=[];const h=mapTime();el('v13-hour-label').textContent=String(h.hour).padStart(2,'0')+':00';const spots=Z.map((z,i)=>({z,i,cloud:pointValue(i,h.key,'cloud_cover'),wind:pointValue(i,h.key,'wind_speed_10m')})).filter(o=>o.z[3]<=+state.drive);const ranked=spots.filter(x=>x.cloud!==null).sort((a,b)=>a.cloud-b.cloud);el('v13-zone-list').innerHTML=(ranked.length?ranked:spots).slice(0,8).map(o=>`<div class="v13-zone"><b>${escapeHTML(o.z[0])}</b><small>${o.cloud===null?tr('No weather data','Sin datos meteorológicos'):Math.round(o.cloud)+'% '+tr('cloud cover','nubosidad')} · ${o.wind===null?'—':Math.round(o.wind)+' km/h '+tr('wind','viento')}</small></div>`).join('');if(!map)return;spots.forEach(o=>{const color=o.cloud===null?'#9eafbb':o.cloud<=35?'#39c695':o.cloud<=70?'#e8b760':'#d57c86';const marker=L.circleMarker([o.z[1],o.z[2]],{radius:o.i===0?9:7,color:'#fff',weight:1.5,fillColor:color,fillOpacity:.92}).addTo(map);marker.bindPopup(`<b>${escapeHTML(o.z[0])}</b><br>${o.cloud===null?tr('No forecast','Sin previsión'):Math.round(o.cloud)+'% '+tr('cloud cover','nubosidad')}<br>${String(h.hour).padStart(2,'0')}:00`);markers.push(marker)});
}
let busy=false;async function update(){if(busy)return;busy=true;try{updateSolar();renderCloud();const ok=await initMap();renderMapPoints();if(ok)setTimeout(()=>map.invalidateSize(),100)}finally{busy=false}}
const oldRenderExplore=window.renderExplore;
if(typeof oldRenderExplore==='function'){window.renderExplore=function(...args){const r=oldRenderExplore.apply(this,args);update();return r}}
el('v13-hour').addEventListener('input',()=>{renderMapPoints()});
const refresh=el('refresh');if(refresh)refresh.addEventListener('click',()=>loadSolar());
loadSolar();update();
})();
