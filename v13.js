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
function parseTime(value){
 if(!value)return NaN;
 const s=String(value).trim().replace(' ','T');
 return Date.parse(/[zZ]$|[+-]\d\d:\d\d$/.test(s)?s:s+'Z');
}
function dateOf(value){const t=parseTime(value);return Number.isFinite(t)?new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Oslo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(t)):null}
function latestValid(rows,fields){return rows.filter(x=>fields.every(k=>number(x[k])!==null)&&Number.isFinite(parseTime(x.time_tag||x.time))).sort((a,b)=>parseTime(b.time_tag||b.time)-parseTime(a.time_tag||a.time))[0]||null}
function solarButton(){return el('v13-solar-retry')}
async function loadSolar(){
 const btn=solarButton();if(btn)btn.disabled=true;
 el('v13-solar-status').textContent=tr('Connecting to NOAA…','Conectando con NOAA…');
 const urls=['https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json','https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json','https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json'];
 const result=await Promise.allSettled(urls.map(getJSON));
 solar.mag=result[0].status==='fulfilled'?records(result[0].value):[];
 solar.plasma=result[1].status==='fulfilled'?records(result[1].value):[];
 solar.kp=result[2].status==='fulfilled'?records(result[2].value):[];
 solar.error=result.map((r,i)=>r.status==='rejected'?['mag','plasma','kp'][i]:null).filter(Boolean);
 solar.updated=Date.now();
 if(btn)btn.disabled=false;
 updateSolar();
}
function updateSolar(){
 const d=typeof selectedDate==='string'?selectedDate:null;
 const today=typeof osloToday==='function'?osloToday():null;
 const diff=d&&today?Math.round((Date.parse(d+'T12:00:00Z')-Date.parse(today+'T12:00:00Z'))/86400000):null;
 const m=latestValid(solar.mag,['bz_gsm','bt']);const p=latestValid(solar.plasma,['speed','density']);
 const ages=[m,p].filter(Boolean).map(x=>(Date.now()-parseTime(x.time_tag))/60000);
 const fresh=ages.length===2&&ages.every(x=>x>=-10&&x<=45);
 const status=el('v13-solar-status');
 if(!m&&!p)status.textContent=tr('NOAA data unavailable','Sin datos de NOAA');
 else if(!fresh)status.textContent=tr('Delayed or partial data','Datos retrasados o parciales');
 else status.textContent=tr('Live readings · now','Mediciones en directo · ahora');
 el('v13-bz').textContent=fmt(m?number(m.bz_gsm):null,1);
 el('v13-bt').textContent=fmt(m?number(m.bt):null,1);
 el('v13-speed').textContent=fmt(p?number(p.speed):null);
 el('v13-density').textContent=fmt(p?number(p.density):null,1);
 const samples=solar.mag.filter(x=>number(x.bz_gsm)!==null&&m&&parseTime(x.time_tag)>=parseTime(m.time_tag)-3600000&&parseTime(x.time_tag)<=parseTime(m.time_tag));
 const ratio=samples.length?samples.filter(x=>number(x.bz_gsm)<0).length/samples.length:0;
 const trend=samples.length>=6?(ratio>=.7?tr('Bz was southward for most of the last hour.','Bz se mantuvo hacia el sur durante gran parte de la última hora.'):ratio<=.3?tr('Bz was mostly northward over the last hour.','Bz fue mayormente positivo durante la última hora.'):tr('Bz direction varied over the last hour.','La orientación del Bz varió durante la última hora.')):tr('Not enough recent readings for a Bz trend.','No hay suficientes mediciones recientes para analizar Bz.');
 el('v13-solar-trend').textContent=m?tr('Last measurement: ','Última medición: ')+m.time_tag+' UTC · '+trend:tr('No magnetic-field readings received.','No se han recibido mediciones del campo magnético.');
 const kpRows=solar.kp.filter(x=>number(x.Kp)!==null&&Number.isFinite(parseTime(x.time_tag||x.time)));
 const forecast=kpRows.filter(x=>{const t=x.time_tag||x.time;return dateOf(t)===d});
 const kp=forecast.find(x=>String(x.observed||'').toLowerCase()==='predicted')||forecast[0]||null;
 const kpText=el('v13-kp');
 if(diff!==null&&diff>=0&&diff<=3&&kp){
  const type=String(kp.observed||'').toLowerCase();
  const typeText=type==='observed'?tr('observed','observado'):type==='estimated'?tr('estimated','estimado'):tr('forecast','previsión');
  kpText.textContent=`Kp ${fmt(number(kp.Kp),1)} · ${typeText} · ${kp.time_tag||kp.time} UTC`;
 }else kpText.textContent=diff>3?tr('Kp forecast not available this far ahead.','No hay previsión Kp para una fecha tan lejana.'):tr('No Kp data available for the selected date.','No hay datos Kp para la fecha seleccionada.');
 let message;
 if(!m&&!p&&solar.updated)message=tr('NOAA did not return solar-wind readings. Check your connection or try again. This does not mean solar activity is low.','NOAA no ha devuelto mediciones del viento solar. Comprueba la conexión o vuelve a intentarlo. Esto no significa que la actividad solar sea baja.');
 else if(diff===null)message=tr('Select a night to compare forecast and solar activity.','Selecciona una noche para comparar meteorología y actividad solar.');
 else if(diff>3)message=tr('No reliable Bz or solar-wind forecast exists for this date. The values shown below describe NOW, not the selected night.','No existe una previsión fiable de Bz o viento solar para esta fecha. Los valores siguientes describen AHORA, no la noche seleccionada.');
 else if(diff>0)message=tr('The readings below are current observations, NOT a prediction for this future night. Kp forecasts, when available, are shown separately.','Las mediciones siguientes son observaciones actuales, NO una predicción para esta noche futura. La previsión Kp se muestra por separado cuando está disponible.');
 else if(diff<0)message=tr('The readings below are current, not historical values for that date.','Las mediciones siguientes son actuales, no históricas de esa fecha.');
 else if(!fresh)message=tr('Solar readings are delayed or incomplete. Missing data must not be interpreted as low activity.','Las mediciones solares están retrasadas o incompletas. La ausencia de datos no significa actividad baja.');
 else if(m&&number(m.bz_gsm)<-5&&ratio>=.7)message=tr('Sustained southward Bz favors geomagnetic coupling, but aurora visibility is not guaranteed.','El Bz negativo sostenido favorece el acoplamiento geomagnético, pero no garantiza auroras visibles.');
 else message=tr('These are live solar conditions. Aurora can be visible in Tromsø even with modest Kp.','Estas son las condiciones solares actuales. En Tromsø puede haber auroras incluso con Kp moderado.');
 el('v13-solar-explain').textContent=message;
 const error=el('v13-solar-error');
 if(error){error.hidden=!(solar.error&&solar.error.length);error.textContent=solar.error&&solar.error.length?tr('NOAA connection failed for: ','Falló la conexión con NOAA para: ')+solar.error.join(', ')+'. '+tr('Other forecasts remain available.','El resto de previsiones sigue disponible.'):'';}
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
const retry=solarButton();if(retry)retry.addEventListener('click',loadSolar);
const refresh=el('refresh');if(refresh)refresh.addEventListener('click',()=>loadSolar());
loadSolar();update();
})();
