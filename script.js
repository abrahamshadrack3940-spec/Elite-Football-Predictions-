const API = "https://api.sportdb.dev/api/flashscore/";

async function getJSON(url){
  try{
    const r = await fetch(url,{cache:"no-store"});
    return await r.json();
  }catch(e){ return null; }
}

async function loadLive(){
  let box = document.getElementById("live-list");
  box.innerHTML="Loading...";
  let data = await getJSON(API);
  if(!data){box.innerHTML="Failed";return;}
  box.innerHTML="";
  let arr = Array.isArray(data)?data:data.data||[];
  arr.slice(0,40).forEach(m=>{
    let d=document.createElement("div");
    d.className="game";
    d.innerHTML=`<div class=name>${m.home?.name||m.home} vs ${m.away?.name||m.away}</div>
    <div class=meta>Status: ${m.status||m.time||""}</div>`;
    box.appendChild(d);
  });
}

async function loadPred(){
  let box=document.getElementById("pred-list");
  let data=await getJSON("predictions.json");
  if(!data){box.innerHTML="None";return;}
  box.innerHTML="";
  data.forEach(p=>{
    let d=document.createElement("div"); d.className="game";
    d.innerHTML=`<div class=name>${p.name}</div><div class=meta>${p.tip} | Odds: ${p.odds}</div>`;
    box.appendChild(d);
  });
}

async function loadAds(){
  let box=document.getElementById("ads-list");
  let data=await getJSON("ads.json");
  if(!data){box.innerHTML="None";return;}
  box.innerHTML="";
  data.forEach(p=>{
    let d=document.createElement("div"); d.className="game";
    d.innerHTML=`<div class=name>${p.title}</div><div class=meta>${p.description}</div>`;
    box.appendChild(d);
  });
}

async function loadJackpots(){
  let box=document.getElementById("jackpot-list");
  box.innerHTML="Loading...";
  let preds=await getJSON("predictions.json")||[];
  box.innerHTML="";
  let sp = preds.filter(p=>p.provider==="sportpesa");
  let bt = preds.filter(p=>p.provider==="betika");

  function draw(list,label){
    if(list.length===0) return;
    list.forEach(j=>{
      let d=document.createElement("div");
      d.className="jackpot";
      d.innerHTML=`<div>${label}: ${j.name}</div>
      <div class=prize>${j.prize}</div>`;
      box.appendChild(d);
    });
  }
  draw(sp,"SportPesa");
  draw(bt,"Betika");
}

function refreshAll(){
  loadLive(); loadPred(); loadAds(); loadJackpots();
}

refreshAll();
setInterval(refreshAll,300000); // 5 minutes
