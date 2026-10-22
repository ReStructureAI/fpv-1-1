import * as THREE from 'three';

// ---------- renderer / scene ----------
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled = false;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x5c94fc);
scene.fog = new THREE.Fog(0x5c94fc, 60, 190);
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, .1, 500);
scene.add(new THREE.HemisphereLight(0xdcecff, 0x9abb88, 1.0));
const sun = new THREE.DirectionalLight(0xfff3d6, 1.15); sun.position.set(40,80,30); scene.add(sun);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

// ---------- procedural pixel textures (original art) ----------
function pixTex(draw,size=16){const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d');draw(g,size);const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.colorSpace=THREE.SRGBColorSpace;return t;}
const R=(g,x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
const texGround = pixTex(g=>{R(g,0,0,16,16,'#c84c0c');R(g,0,0,16,4,'#e8791d');R(g,0,4,2,2,'#e8791d');R(g,7,4,2,2,'#e8791d');R(g,13,4,2,2,'#e8791d');R(g,3,9,2,2,'#e8791d');R(g,10,9,2,2,'#e8791d');R(g,0,13,2,2,'#e8791d');R(g,7,13,2,2,'#e8791d');R(g,13,13,2,2,'#e8791d');R(g,0,0,1,16,'#a03a08');});
const texBrick = pixTex(g=>{R(g,0,0,16,16,'#c84c0c');g.fillStyle='#8a3006';for(let y=0;y<16;y+=4)g.fillRect(0,y,16,1);for(let y=0;y<16;y+=4){const off=(y/4)%2?0:8;g.fillRect(off,y,1,4);g.fillRect((off+8)%16,y,1,4);}R(g,0,0,16,1,'#e8791d');});
const texQ = pixTex(g=>{R(g,0,0,16,16,'#f8b800');R(g,0,0,16,1,'#ffe9a0');R(g,0,15,16,1,'#9c5a00');R(g,0,0,1,16,'#ffe9a0');R(g,15,0,1,16,'#9c5a00');g.fillStyle='#9c5a00';g.font='bold 11px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText('?',8,9);[[2,2],[13,2],[2,13],[13,13]].forEach(([x,y])=>R(g,x,y,1,1,'#9c5a00'));});
const texUsed = pixTex(g=>{R(g,0,0,16,16,'#9c5a00');R(g,0,0,16,1,'#c88400');R(g,0,15,16,1,'#6e3d00');[[2,2],[13,2],[2,13],[13,13]].forEach(([x,y])=>R(g,x,y,2,2,'#6e3d00'));});
const texPipe = pixTex(g=>{R(g,0,0,16,16,'#00a800');R(g,0,0,4,16,'#80d010');R(g,12,0,4,16,'#005800');R(g,5,0,2,16,'#58c850');});
const texPipeTop = pixTex(g=>{R(g,0,0,16,16,'#00a800');R(g,0,0,16,2,'#80d010');R(g,0,14,16,2,'#005800');R(g,2,2,12,12,'#00a800');R(g,2,2,3,12,'#80d010');R(g,11,2,3,12,'#005800');R(g,7,4,2,8,'#000');});
const texHard = pixTex(g=>{R(g,0,0,16,16,'#c84c0c');g.fillStyle='#8a3006';g.fillRect(0,7,16,2);g.fillRect(7,0,2,7);g.fillRect(3,9,2,7);g.fillRect(11,9,2,7);R(g,0,0,16,1,'#e8791d');});
const texCastle = pixTex(g=>{R(g,0,0,16,16,'#e8e8e8');g.fillStyle='#b0b0b0';for(let y=0;y<16;y+=4)g.fillRect(0,y,16,1);for(let y=0;y<16;y+=4){const off=(y/4)%2?0:8;g.fillRect(off,y,1,4);}});
const texCastleDark = pixTex(g=>{R(g,0,0,16,16,'#181818');});
const texCoin = pixTex(g=>{R(g,0,0,16,16,'#f8b800');R(g,1,1,14,14,'#f8b800');R(g,2,2,5,12,'#ffe9a0');R(g,12,2,2,12,'#c88400');R(g,0,0,16,1,'#ffe9a0');R(g,0,15,16,1,'#9c5a00');});
const M = t=>new THREE.MeshLambertMaterial({map:t});
const mats = {
  ground:[M(texGround),M(texGround),M(texGround),M(texGround),M(texGround),M(texGround)],
  brick:M(texBrick), q:M(texQ), used:M(texUsed),
  pipe:M(texPipe), pipeTop:M(texPipeTop),
  hard:M(texHard), castle:M(texCastle), castleDark:M(texCastleDark),
  pole:new THREE.MeshLambertMaterial({color:0x00a800}),
  coin:new THREE.MeshBasicMaterial({color:0xffd34d}),
  flag:new THREE.MeshLambertMaterial({color:0xf0d7ff,side:THREE.DoubleSide}),
  cloud:new THREE.MeshLambertMaterial({color:0xffffff}),
  bush:new THREE.MeshLambertMaterial({color:0x00a800}),
  hill:M(pixTex(g=>{R(g,0,0,16,16,'#00b820');R(g,0,0,16,3,'#58e070');R(g,2,5,3,3,'#009810');R(g,9,8,3,3,'#009810');R(g,5,12,3,3,'#009810');})),
  trunk:new THREE.MeshLambertMaterial({color:0x8a4a1a}),
};
const box = new THREE.BoxGeometry(1,1,1);

// ---------- level data ----------
// y=0,1 = ground. Player runs along +X. Ground height top = 2.
const W=214, H=16, D=9, Z0=-4; // z in [-4..4]
const solids=new Map();      // "x,y,z" -> type
const blocksByType={};       // type -> [ [x,y,z], ... ]
const qBlocks=new Map();     // key -> {mesh instance idx, state}
function put(type,x,y,z=0){
  const k=x+','+y+','+z;
  solids.set(k,type);
  (blocksByType[type]??=[]).push([x,y,z]);
}
function fillX(type,x1,x2,y1,y2){for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)put(type,x,y);}
function ground(x1,x2){for(let x=x1;x<=x2;x++)for(const z of [-1,0,1]){put('ground',x,0,z);put('ground',x,1,z);}}
function pipe(x,h){for(let y=2;y<2+h;y++){put(y===1+h?'pipeTop':'pipe',x,y);put(y===1+h?'pipeTop':'pipe',x+1,y);}}
function stair(x,h,dir){for(let i=0;i<h;i++)for(let y=2;y<=2+i;y++)put('hard',x+dir*i,y);}

// ground + gaps (approx 1-1: gaps at 69-70, 86-88, 153-154)
ground(0,68); ground(71,85); ground(89,152); ground(155,W-1);
// first block cluster
put('q',16,5);
put('brick',20,5); put('q',21,5); put('brick',22,5); put('q',23,5); put('brick',24,5);
put('q',22,9);
// pipes
pipe(28,2); pipe(36,3); pipe(46,4); pipe(57,4);
// mid block rows
put('brick',77,5); put('q',78,5); put('brick',79,5);
fillX('brick',80,87,8,8); put('q',82,8); put('q',85,8);
// after second gap
pipe(91,4); pipe(100,4); pipe(109,4);
fillX('brick',110,113,8,8); put('q',111,8); put('q',112,8);
put('brick',118,8); put('q',119,8); put('brick',120,8); put('brick',119,11);
put('q',124,5); put('brick',127,5); put('brick',128,5);
// twin staircases
stair(134,4,1); stair(140,4,-1);
// end staircase + flag + castle
stair(155,8,1);
for(let y=2;y<=10;y++)put('pole',198,y);
put('hard',197,2);
// castle (original voxel castle, x 202-209)
(function castle(){
  fillX('castle',202,209,2,3);
  fillX('castle',203,208,4,5);
  fillX('castle',204,207,6,6);
  put('castle',204,7);put('castle',207,7);
  put('castleDark',205,2);put('castleDark',206,2);put('castleDark',205,3);put('castleDark',206,3); // door
  put('castleDark',204,5);put('castleDark',207,5); // windows
})();
const CASTLE_DOOR_X=205.5, POLE_X=198.5;

// instanced meshes for static blocks
const dummy=new THREE.Object3D();
function buildInstanced(type,mat){
  const list=blocksByType[type]||[]; if(!list.length)return null;
  const im=new THREE.InstancedMesh(box,mat,list.length);
  list.forEach(([x,y,z],i)=>{dummy.position.set(x+.5,y+.5,Z0+z+.5);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix);});
  im.instanceMatrix.needsUpdate=true; scene.add(im); return im;
}
for(const t of ['ground','brick','pipe','pipeTop','hard','castle','castleDark','pole']) buildInstanced(t,mats[t]===undefined?mats.hard:(Array.isArray(mats[t])?mats[t][0]:mats[t]));
// question blocks as individual meshes (they animate/convert)
const qMeshes=new Map();
for(const [x,y,z] of (blocksByType.q||[])){
  const m=new THREE.Mesh(box,mats.q); m.position.set(x+.5,y+.5,Z0+z+.5); scene.add(m);
  qMeshes.set(x+','+y+','+z,{mesh:m,state:'q',baseY:y+.5,anim:0});
}
// decoration: voxel clouds, bushes, hills
function blob(mat,cx,cy,cz,cells){const g=new THREE.Group();cells.forEach(([x,y,z,s=1])=>{const m=new THREE.Mesh(box,mat);m.scale.set(s,s,s);m.position.set(x,y,z);g.add(m);});g.position.set(cx,cy,cz);scene.add(g);}
for(let i=0;i<14;i++){const cx=8+i*15.3%200, cy=11+(i*7)%4, cz=-9+((i*13)%3);
  blob(mats.cloud,cx,cy,cz,[[0,0,0,1],[1,0,0,1],[2,0,0,1],[.5,.8,0,1],[1.5,.8,0,1]]);}
for(let i=0;i<12;i++){const bx=6+i*17.7%205; blob(mats.bush,bx,2.1,-4.9,[[0,0,0,1],[1,0,0,1],[.5,.7,0,1]]);}
for(const [hx,hr,hh] of [[20,14,16],[70,18,22],[120,14,17],[170,16,20]]){
  const cone=new THREE.Mesh(new THREE.ConeGeometry(hr,hh,4),new THREE.MeshLambertMaterial({color:0x0a9a2a}));
  cone.position.set(hx,hh/2,-46);cone.rotation.y=Math.PI/4;scene.add(cone);
}
// flag
const flagGeo=new THREE.PlaneGeometry(1.6,1); const flagMesh=new THREE.Mesh(flagGeo,mats.flag);
flagMesh.position.set(POLE_X-.8+.5-0.5,9.5,0.5+Z0); flagMesh.position.set(POLE_X-1.3,9.5,Z0+.5); scene.add(flagMesh);
const finial=new THREE.Mesh(box,new THREE.MeshLambertMaterial({color:0xf8b800}));finial.scale.set(.5,.5,.5);finial.position.set(POLE_X+.5-1,10.6,Z0+.5);finial.position.set(POLE_X-.5,10.6,Z0+.5);scene.add(finial);
// coins
const coinSpots=[];
for(let x=66;x<=73;x++)coinSpots.push([x,5+Math.sin((x-66)/7*Math.PI)*2]);       // arc over first gap
for(let x=84;x<=91;x++)coinSpots.push([x,5+Math.sin((x-84)/7*Math.PI)*2]);       // arc over second gap
for(let x=151;x<=157;x++)coinSpots.push([x,6+Math.sin((x-151)/6*Math.PI)*2]);    // arc over last gap
coinSpots.push([21.5,6.5],[22.5,10.5],[78.5,6.5],[111.5,9.5],[119.5,9.5],[125.5,6.5],[48.5,7],[59.5,7],[31,5],[40,4],[52,4],[63,4]);
const coinIM=new THREE.InstancedMesh(new THREE.CylinderGeometry(.42,.42,.12,12),mats.coin,coinSpots.length);
scene.add(coinIM);
const coinTaken=new Array(coinSpots.length).fill(false);
// hidden coin block
const hiddenBlock={x:26,y:5,z:0,used:false};

// ---------- grumblers (original baddies) ----------
const grumblerBody=new THREE.MeshLambertMaterial({color:0x8a4a1a});
const grumblerFoot=new THREE.MeshLambertMaterial({color:0x3a1d06});
const grumblerEye=new THREE.MeshLambertMaterial({color:0xffffff});
const grumblerPupil=new THREE.MeshLambertMaterial({color:0x1a1a1a});
function makeGrumbler(x){
  const g=new THREE.Group();
  const body=new THREE.Mesh(box,grumblerBody); body.scale.set(.8,.62,.8); body.position.y=.5; g.add(body);
  const head=new THREE.Mesh(box,grumblerBody); head.scale.set(.95,.5,.95); head.position.y=.95; g.add(head);
  const f1=new THREE.Mesh(box,grumblerFoot); f1.scale.set(.3,.18,.5); f1.position.set(-.22,.09,.1); g.add(f1);
  const f2=f1.clone(); f2.position.x=.22; g.add(f2);
  for(const s of [-1,1]){const e=new THREE.Mesh(box,grumblerEye);e.scale.set(.16,.2,.06);e.position.set(s*.2,1.02,.49);g.add(e);
    const p=new THREE.Mesh(box,grumblerPupil);p.scale.set(.07,.1,.03);p.position.set(s*.2,1.02,.53);g.add(p);}
  g.position.set(x+.5,2,Z0+.5); scene.add(g);
  return {g,x:x+.5,y:2,vx:-1.4,alive:true,squash:0,feet:[f1,f2],phase:Math.random()*6};
}
const grumblers=[40,52,53,64,82,83,97,107,108,114,122,129,130,160].map(makeGrumbler);
function solidAt(x,y){return solids.has(Math.floor(x)+','+Math.floor(y)+',0');}

// ---------- audio (tiny synth) ----------
let AC=null;
function ac(){return AC??=new (window.AudioContext||window.webkitAudioContext)();}
function tone(f0,f1,dur,type='square',vol=.12,delay=0){
  try{const a=ac(),o=a.createOscillator(),g=a.createGain(),t=a.currentTime+delay;
  o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(f1,1),t+dur);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g).connect(a.destination);o.start(t);o.stop(t+dur+.02);}catch(e){}
}
const sfx={
  jump:()=>tone(280,640,.18,'square',.09),
  coin:()=>{tone(988,988,.09,'square',.1);tone(1319,1319,.28,'square',.1,.09);},
  stomp:()=>tone(400,80,.15,'triangle',.18),
  bump:()=>tone(140,90,.1,'square',.14),
  die:()=>{tone(500,120,.5,'square',.12);tone(300,60,.6,'square',.1,.15);},
  clear:()=>{[392,523,659,784,1047,1319].forEach((f,i)=>tone(f,f,.16,'square',.11,i*.11));},
  oneUp:()=>{[659,784,1319].forEach((f,i)=>tone(f,f,.12,'square',.1,i*.09));},
};

// ---------- input ----------
const keys={};
addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();
  if(e.code==='KeyF'&&playing)toggleMode();});
addEventListener('keyup',e=>keys[e.code]=false);
let yaw=-Math.PI/2, pitch=0; // yaw -PI/2 faces +X (down the level)
let lookDX=0,lookDY=0;
document.addEventListener('mousemove',e=>{if(document.pointerLockElement){lookDX+=e.movementX;lookDY+=e.movementY;}});
function lockPointer(){renderer.domElement.requestPointerLock?.();}
// touch controls
const touch={active:false,jx:0,jy:0,jump:false};
const isTouch='ontouchstart' in window;
const stick=document.getElementById('stick'),nub=document.getElementById('nub');
let stickId=null,lookId=null,lookLast=null;
addEventListener('touchstart',e=>{
  for(const t of e.changedTouches){
    const r=stick.getBoundingClientRect();
    if(t.clientX>=r.left-20&&t.clientX<=r.right+20&&t.clientY>=r.top-20&&t.clientY<=r.bottom+20&&stickId===null){stickId=t.identifier;}
    else if(t.clientX>innerWidth*.4&&lookId===null){lookId=t.identifier;lookLast=[t.clientX,t.clientY];}
  }},{passive:true});
addEventListener('touchmove',e=>{
  for(const t of e.changedTouches){
    if(t.identifier===stickId){const r=stick.getBoundingClientRect();let dx=t.clientX-(r.left+r.width/2),dy=t.clientY-(r.top+r.height/2);
      const m=Math.hypot(dx,dy)||1,c=Math.min(m,44);dx=dx/m*c;dy=dy/m*c;
      touch.jx=dx/44;touch.jy=dy/44;nub.style.left=(38+dx)+'px';nub.style.top=(38+dy)+'px';}
    if(t.identifier===lookId){lookDX+=(t.clientX-lookLast[0])*2.2;lookDY+=(t.clientY-lookLast[1])*2.2;lookLast=[t.clientX,t.clientY];}
  }},{passive:true});
addEventListener('touchend',e=>{for(const t of e.changedTouches){
  if(t.identifier===stickId){stickId=null;touch.jx=touch.jy=0;nub.style.left='38px';nub.style.top='38px';}
  if(t.identifier===lookId)lookId=null;}},{passive:true});
document.getElementById('btnJump').addEventListener('touchstart',e=>{e.preventDefault();touch.jump=true;},{passive:false});
document.getElementById('btnMode').addEventListener('touchstart',e=>{e.preventDefault();if(playing)toggleMode();},{passive:false});

// ---------- player & state ----------
const ZC=Z0+.5, SPAWN={x:3.5,y:2.05}, MID={x:105.5,y:2.05};
const P={x:SPAWN.x,y:SPAWN.y,z:ZC,vx:0,vy:0,vz:0,hw:.32,h:1.7,onGround:false,roll:0,fov:75};
let playing=false, mode='run', state='title'; // title | play | dying | won | over
let score=0, coinCount=0, lives=3, timeLeft=400, timeAcc=0, dieT=0, winT=0, coyote=0, jumpBuf=0;
const coinPops=[];
const GRUM_XS=[40,52,53,64,82,83,97,107,108,114,122,129,130,160];

function boxHits(x,y,z,hw,h){
  const x0=Math.floor(x-hw),x1=Math.floor(x+hw-1e-6);
  const y0=Math.floor(y),y1=Math.floor(y+h-1e-6);
  const z0=Math.floor(z-hw)-Z0,z1=Math.floor(z+hw-1e-6)-Z0;
  for(let bx=x0;bx<=x1;bx++)for(let by=y0;by<=y1;by++)for(let bz=z0;bz<=z1;bz++)
    if(solids.has(bx+','+by+','+bz))return{bx,by,bz};
  return null;
}
function bumpBlock(bx,by,bz){
  const k=bx+','+by+','+bz, type=solids.get(k);
  if(type==='q'){
    const e=qMeshes.get(k);
    if(e&&e.state==='q'){e.state='used';e.mesh.material=mats.used;e.anim=1;coinPop(bx,by+1,bz);coinCount++;score+=200;sfx.coin();}
  } else if(type==='brick'){sfx.bump();}
  else if(!type&&!hiddenBlock.used&&bx===hiddenBlock.x&&by===hiddenBlock.y&&bz===hiddenBlock.z){
    hiddenBlock.used=true;put('used',bx,by,bz);
    const m=new THREE.Mesh(box,mats.used);m.position.set(bx+.5,by+.5,Z0+bz+.5);scene.add(m);hiddenBlock.mesh=m;
    coinPop(bx,by+1,bz);coinCount++;score+=200;sfx.coin();
  } else if(type) sfx.bump();
}
function coinPop(bx,by,bz){
  const m=new THREE.Mesh(new THREE.BoxGeometry(.7,.7,.14),mats.coin);
  m.position.set(bx+.5,by+.5,Z0+bz+.5);scene.add(m);coinPops.push({m,t:0});
}
function moveAxis(dx,dy,dz){
  if(dx){P.x+=dx;const h=boxHits(P.x,P.y,P.z,P.hw,P.h);
    if(h){P.x=dx>0?h.bx-P.hw-.001:h.bx+1+P.hw+.001;}}
  if(dz){P.z+=dz;const h=boxHits(P.x,P.y,P.z,P.hw,P.h);
    if(h){P.z=dz>0?(h.bz+Z0)-P.hw-.001:(h.bz+Z0+1)+P.hw+.001;}}
  if(dy){P.y+=dy;const h=boxHits(P.x,P.y,P.z,P.hw,P.h);
    if(h){if(dy<0){P.y=h.by+1;P.vy=0;P.onGround=true;coyote=.12;}else{P.y=h.by-P.h-.001;P.vy=0;bumpBlock(h.bx,h.by,h.bz);}}}
}
function killPlayer(){
  if(state!=='play'||mode==='drone')return;
  state='dying';dieT=0;P.vy=8;sfx.die();
}
function respawn(){
  lives--;
  if(lives<0){state='over';showEnd(false);return;}
  const cp=P.x>100?MID:SPAWN;
  P.x=cp.x;P.y=cp.y;P.z=ZC;P.vx=P.vy=P.vz=0;timeLeft=400;timeAcc=0;state='play';
}
function win(){
  if(state!=='play')return;
  state='won';winT=0;score+=Math.max(0,timeLeft)*10;sfx.clear();
}
function showEnd(wonFlag){
  playing=false;document.exitPointerLock?.();
  document.getElementById('hud').style.display='none';
  document.getElementById('modeChip').style.display='none';
  document.getElementById('touchUI').style.display='none';
  document.getElementById('endKicker').textContent=wonFlag?'Course clear':'Game over';
  document.getElementById('endTitle').textContent=wonFlag?'You did it!':'So long, runner';
  document.getElementById('endStats').innerHTML=
    'SCORE '+String(score).padStart(6,'0')+'<br>COINS x'+String(coinCount).padStart(2,'0')+'<br>TIME '+Math.max(0,timeLeft);
  document.getElementById('endOv').classList.remove('hide');
}
function resetWorld(){
  score=0;coinCount=0;lives=3;timeLeft=400;timeAcc=0;
  coinTaken.fill(false);updateCoinMatrices(0);
  for(const e of qMeshes.values()){e.state='q';e.mesh.material=mats.q;e.anim=0;e.mesh.position.y=e.baseY;}
  if(hiddenBlock.used){hiddenBlock.used=false;solids.delete(hiddenBlock.x+','+hiddenBlock.y+','+hiddenBlock.z);if(hiddenBlock.mesh){scene.remove(hiddenBlock.mesh);hiddenBlock.mesh=null;}}
  for(const g of grumblers)scene.remove(g.g);
  grumblers.length=0;GRUM_XS.forEach(x=>grumblers.push(makeGrumbler(x)));
  P.x=SPAWN.x;P.y=SPAWN.y;P.z=ZC;P.vx=P.vy=P.vz=0;yaw=-Math.PI/2;pitch=0;
}
function startGame(m){
  ac().resume?.();
  mode=m;state='play';playing=true;
  document.getElementById('titleOv').classList.add('hide');
  document.getElementById('endOv').classList.add('hide');
  document.getElementById('hud').style.display='flex';
  const chip=document.getElementById('modeChip');chip.style.display='block';
  chip.textContent=m==='run'?'RUN MODE':'DRONE MODE';
  if(isTouch)document.getElementById('touchUI').style.display='block';
  else lockPointer();
}
function toggleMode(){
  mode=mode==='run'?'drone':'run';
  document.getElementById('modeChip').textContent=mode==='run'?'RUN MODE':'DRONE MODE';
  if(mode==='drone')P.vy=0;
  sfx.oneUp();
}
document.getElementById('playRun').onclick=()=>startGame('run');
document.getElementById('playFly').onclick=()=>startGame('drone');
document.getElementById('againBtn').onclick=()=>{resetWorld();startGame(mode);};
document.getElementById('badge').onclick=()=>{location.search='?v='+Date.now();};
renderer.domElement.addEventListener('click',()=>{if(playing&&!isTouch&&!document.pointerLockElement)lockPointer();});

// ---------- per-frame updates ----------
function updateCoinMatrices(t){
  for(let i=0;i<coinSpots.length;i++){
    const [x,y]=coinSpots[i];
    dummy.position.set(x,y,ZC);
    dummy.rotation.set(Math.PI/2,t*2+i,0);
    const s=coinTaken[i]?0:1;dummy.scale.set(s,s,s);
    dummy.updateMatrix();coinIM.setMatrixAt(i,dummy.matrix);
  }
  coinIM.instanceMatrix.needsUpdate=true;
}
const hScore=document.getElementById('hScore'),hCoins=document.getElementById('hCoins'),
      hTime=document.getElementById('hTime'),hLives=document.getElementById('hLives');
function updateHUD(){
  hScore.textContent=String(score).padStart(6,'0');
  hCoins.textContent='x'+String(coinCount).padStart(2,'0');
  hTime.textContent=Math.max(0,Math.ceil(timeLeft));
  hLives.textContent='x'+lives;
}
function stepPlayer(dt){
  const sprint=(keys.ShiftLeft||keys.ShiftRight)?1.55:1;
  // look
  yaw-=lookDX*.0024;pitch-=lookDY*.0024;
  pitch=Math.max(-1.45,Math.min(1.45,pitch));lookDX=lookDY=0;
  const fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);
  let ix=0,iz=0;
  if(keys.KeyW||keys.ArrowUp)ix+=1; if(keys.KeyS||keys.ArrowDown)ix-=1;
  if(keys.KeyA||keys.ArrowLeft)iz-=1; if(keys.KeyD||keys.ArrowRight)iz+=1;
  ix+=-touch.jy; iz+=touch.jx;
  const il=Math.hypot(ix,iz); if(il>1){ix/=il;iz/=il;}
  if(mode==='run'){
    const sp=5.6*sprint;
    P.vx=(fx*ix+rx*iz)*sp; P.vz=(fz*ix+rz*iz)*sp;
    P.vy-=26*dt; if(P.vy<-30)P.vy=-30;
    coyote-=dt; jumpBuf-=dt;
    if(keys.Space||touch.jump){jumpBuf=.12;touch.jump=false;}
    if(jumpBuf>0&&(P.onGround||coyote>0)){P.vy=9.6;P.onGround=false;coyote=0;jumpBuf=0;sfx.jump();}
    P.onGround=false;
    moveAxis(P.vx*dt,0,0); moveAxis(0,P.vy*dt,0); moveAxis(0,0,P.vz*dt);
    P.z=Math.max(ZC-2.4,Math.min(ZC+2.4,P.z));
    if(P.y<-10)killPlayer();
    // target fov & roll
    const wantFov=75+(sprint>1&&(ix||iz)?9:0);
    P.fov+=(wantFov-P.fov)*Math.min(1,dt*6);
    const lat=(rx*P.vx+rz*P.vz)/9;
    P.roll+=(-lat*.06-P.roll)*Math.min(1,dt*8);
  } else {
    // drone: fly free, no collision damage; soft block collision off
    const sp=(keys.ShiftLeft||keys.ShiftRight)?16:8;
    let vy=0; if(keys.Space)vy+=1; if(keys.KeyC||keys.ControlLeft)vy-=1;
    const wx=(fx*ix+rx*iz)*sp, wz=(fz*ix+rz*iz)*sp, wy=vy*sp*.9+ -pitch*ix*sp*.6;
    P.vx+=(wx-P.vx)*Math.min(1,dt*5); P.vy+=(wy-P.vy)*Math.min(1,dt*5); P.vz+=(wz-P.vz)*Math.min(1,dt*5);
    P.x+=P.vx*dt; P.y+=P.vy*dt; P.z+=P.vz*dt;
    P.x=Math.max(1,Math.min(W-2,P.x)); P.y=Math.max(2.2,Math.min(26,P.y)); P.z=Math.max(ZC-14,Math.min(ZC+14,P.z));
    const wantFov=75+(sp>8?16:0); P.fov+=(wantFov-P.fov)*Math.min(1,dt*6);
    const lat=(rx*P.vx+rz*P.vz)/16;
    P.roll+=(-lat*.3-P.roll)*Math.min(1,dt*5);
  }
  // flag
  if(P.x>POLE_X-.4&&P.x<POLE_X+1.5&&P.y<10.6)win();
  // timer
  timeAcc+=dt;
  while(timeAcc>=1){timeAcc-=1;timeLeft--;if(timeLeft<=0){timeLeft=0;killPlayer();break;}}
}
function stepGrumblers(dt){
  for(const g of grumblers){
    if(!g.alive){g.squash+=dt;g.g.scale.y=Math.max(.06,1-g.squash*4);continue;}
    const nx=g.x+g.vx*dt;
    const wall=solidAt(nx+(g.vx>0?.45:-.45),g.y+.5);
    const ledge=!solidAt(nx+(g.vx>0?.45:-.45),g.y-1);
    if(wall||ledge)g.vx*=-1; else g.x=nx;
    g.phase+=dt*8;
    g.g.position.set(g.x,g.y+Math.abs(Math.sin(g.phase))*.06,ZC);
    g.g.rotation.y=g.vx>0?.15:-.15;
    g.feet[0].position.z=.1+Math.sin(g.phase)*.12; g.feet[1].position.z=.1-Math.sin(g.phase)*.12;
    // player collision
    if(state==='play'&&mode==='run'){
      const dx=Math.abs(g.x-P.x), dy=P.y-g.y;
      if(dx<.65&&dy>-.9&&dy<1.3){
        if(P.vy<0&&dy>.45){g.alive=false;score+=100;P.vy=8;sfx.stomp();}
        else killPlayer();
      }
    }
  }
  for(let i=grumblers.length-1;i>=0;i--)if(!grumblers[i].alive&&grumblers[i].squash>.45){scene.remove(grumblers[i].g);grumblers.splice(i,1);}
}
function stepCoins(t){
  updateCoinMatrices(t);
  if(state!=='play')return;
  for(let i=0;i<coinSpots.length;i++){
    if(coinTaken[i])continue;
    const [x,y]=coinSpots[i];
    if(Math.abs(P.x-x)<.75&&Math.abs((P.y+.9)-y)<1.05&&Math.abs(P.z-ZC)<1.2){
      coinTaken[i]=true;coinCount++;score+=200;sfx.coin();
    }
  }
}
function stepQBlocks(dt){
  for(const e of qMeshes.values()){
    if(e.anim>0){e.anim=Math.max(0,e.anim-dt*4);e.mesh.position.y=e.baseY+Math.sin(e.anim*Math.PI)*.25;}
  }
  for(let i=coinPops.length-1;i>=0;i--){
    const p=coinPops[i];p.t+=dt;p.m.position.y+=dt*4;p.m.rotation.y+=dt*8;
    if(p.t>.5){scene.remove(p.m);coinPops.splice(i,1);}
  }
}
const clock=new THREE.Clock();
function loop(){
  requestAnimationFrame(loop);
  const dt=Math.min(clock.getDelta(),.05), t=clock.elapsedTime;
  if(state==='play'){stepPlayer(dt);stepGrumblers(dt);}
  else if(state==='dying'){dieT+=dt;P.vy-=26*dt;P.y+=P.vy*dt;if(dieT>1.3)respawn();}
  else if(state==='won'){
    winT+=dt;
    if(winT<1.1&&P.y>2.05){P.y=Math.max(2.05,P.y-dt*5);}
    else if(winT<2.2){P.x=Math.min(CASTLE_DOOR_X,P.x+dt*3);}
    else {showEnd(true);state='done';}
  }
  stepCoins(t);stepQBlocks(dt);
  if(playing||state==='dying'||state==='won')updateHUD();
  camera.position.set(P.x,P.y+(mode==='run'?1.55:0),P.z);
  camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;camera.rotation.z=P.roll;
  if(Math.abs(camera.fov-P.fov)>.1){camera.fov=P.fov;camera.updateProjectionMatrix();}
  // idle attract mode on title: slow drift
  if(state==='title'){const a=t*.05;camera.position.set(30+Math.sin(a)*24,7+Math.sin(t*.3)*1.5,ZC+Math.cos(a)*10);camera.lookAt(50,4,ZC);}
  renderer.render(scene,camera);
}
loop();
