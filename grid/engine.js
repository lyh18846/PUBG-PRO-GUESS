/* 纯逻辑引擎：浏览器与 Node 均可使用。 */
(function(root){
'use strict';
const MAX_ATTEMPTS=11;
const REGIONS=['EMEA','ASIA','AMERICAS','APAC'];
const clone=value=>JSON.parse(JSON.stringify(value));
const shuffle=(items,rng=Math.random)=>{const a=[...items];for(let i=a.length-1;i>0;i--){let j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function validate(raw){
 if(!raw||!Array.isArray(raw.teams)||!Array.isArray(raw.players)||!Array.isArray(raw.countries))throw Error('数据库必须包含 countries、teams、players 三个数组。');
 if(raw.players.length>10000||raw.teams.length>500||raw.countries.length>250)throw Error('超过上限：10,000 位选手 / 500 支战队 / 250 个国籍。');
 const db=clone(raw);db.version=1;
 const str=(v,max=100)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
 const unique=(list,label)=>{const seen=new Set();for(const x of list){if(!x||!str(x.id,80)||!str(x.name))throw Error(label+' 的 id / name 必须为非空字符串。');const key=x.id.toLowerCase();if(seen.has(key))throw Error(label+' ID 重复：'+x.id);seen.add(key);}};
 unique(db.countries,'国籍');unique(db.teams,'战队');unique(db.players,'选手');
 for(const c of db.countries)if(!REGIONS.includes(c.region))throw Error('国籍 '+c.name+' 的赛区无效。');
 const tids=new Set(db.teams.map(t=>t.id)),cids=new Set(db.countries.map(c=>c.id));
 for(const t of db.teams){if(!REGIONS.includes(t.region))throw Error('战队 '+t.name+' 的赛区无效。');if(t.color&&!/^#[0-9a-f]{6}$/i.test(t.color))throw Error('战队颜色必须为 #RRGGBB。');if(t.short&&!str(t.short,24))throw Error('战队简称最长 24 字符。');if(t.logo!=null&&t.logo!==''&&(typeof t.logo!=='string'||t.logo.includes('..')||/^(?:[a-z]+:|[\\/])/i.test(t.logo)||!/^[-\p{L}\p{N}_ .\/()]+\.(png|webp|jpg|jpeg|svg)$/iu.test(t.logo)))throw Error('战队图标必须是项目内的相对图片路径。');}
 for(const p of db.players){if(!cids.has(p.country))throw Error(p.name+' 引用了不存在的国籍。');if(!Array.isArray(p.teams)||!p.teams.length||p.teams.some(t=>!tids.has(t)))throw Error(p.name+' 的历任战队不能为空，且必须引用有效战队。');p.teams=[...new Set(p.teams)];p.aliases=p.aliases||[];if(!Array.isArray(p.aliases)||p.aliases.some(a=>!str(a,100)))throw Error(p.name+' 的 aliases 必须是字符串数组。');if(p.note!=null&&typeof p.note!=='string')throw Error('选手备注必须是字符串。');if(p.source!=null&&(typeof p.source!=='string'||(p.source&&!/^https?:\/\//i.test(p.source))))throw Error('资料来源必须为 http / https 链接。');}
 return db;
}
function matches(p,c){return c.type==='team'?p.teams.includes(c.id):p.country===c.id;}
function candidates(db,rows,cols){return rows.flatMap(r=>cols.map(c=>db.players.filter(p=>matches(p,r)&&matches(p,c)).map(p=>p.id)));}
function solve(options,fixed={}){
 const result=Array(options.length).fill(null),used=new Set();
 for(const [key,id] of Object.entries(fixed)){const i=Number(key);if(!Number.isInteger(i)||i<0||i>=options.length||!options[i].includes(id)||used.has(id))return null;result[i]=id;used.add(id);}
 function visit(){let index=-1,available=null;for(let i=0;i<options.length;i++){if(result[i])continue;const a=options[i].filter(x=>!used.has(x));if(!a.length)return false;if(!available||a.length<available.length){index=i;available=a;}}if(index<0)return true;for(const id of available){result[index]=id;used.add(id);if(visit())return true;used.delete(id);result[index]=null;}return false;}
 return visit()?result:null;
}
function combinations(a,k){const out=[];function go(start,part){if(part.length===k){out.push(part);return;}for(let i=start;i<=a.length-k+part.length;i++)go(i+1,[...part,a[i]]);}go(0,[]);return out;}
const boardCache=new WeakMap();
function makeBoard(db,mode='global',rng=Math.random){
 let cached=boardCache.get(db);if(!cached){
  const sets=new Map();for(const t of db.teams)sets.set('team:'+t.id,new Set());for(const c of db.countries)sets.set('country:'+c.id,new Set());
  for(const p of db.players){sets.get('country:'+p.country)?.add(p.id);for(const t of p.teams)sets.get('team:'+t)?.add(p.id);}
  const conditions=[...db.teams.map(t=>({type:'team',id:t.id})),...db.countries.map(c=>({type:'country',id:c.id}))];
  const conditionMap=new Map(conditions.map(c=>[c.type+':'+c.id,c]));
  const intersections=new Map();
  const overlap=(a,b)=>{const ka=a.type+':'+a.id,kb=b.type+':'+b.id,key=ka<kb?ka+'|'+kb:kb+'|'+ka;if(!intersections.has(key)){const sa=sets.get(ka),sb=sets.get(kb);intersections.set(key,[...sa].filter(id=>sb.has(id)));}return intersections.get(key);};
  cached={sets,conditionMap,overlap,pools:{}};boardCache.set(db,cached);
 }
 if(cached.pools[mode]?.length){const base=cached.pools[mode][Math.floor(rng()*cached.pools[mode].length)];return {...clone(base),rows:shuffle(base.rows,rng),cols:shuffle(base.cols,rng)};}
 const eligibleTeams=shuffle(db.teams.map(t=>({type:'team',id:t.id})).filter(c=>cached.sets.get('team:'+c.id).size>=3),rng);
 const eligibleCountries=shuffle(db.countries.map(c=>({type:'country',id:c.id})).filter(c=>cached.sets.get('country:'+c.id).size>=3),rng);
 const overlap=cached.overlap,pool=[];
 const add=(rows,cols,axisStyle)=>{const options=rows.flatMap(r=>cols.map(c=>overlap(r,c)));if(options.every(a=>a.length)&&solve(options)){pool.push({mode,rows,cols,axisStyle});return true;}return false;};
 // 三种独立国籍只有在每行都有三名不同选手时才可能组成完整题。
 if(mode==='global'){
  for(const rows of combinations(eligibleCountries,3)){
   const columns=eligibleTeams.filter(c=>rows.every(r=>overlap(r,c).length));
   for(const cols of combinations(columns,3)){add(rows,cols,'countries');if(pool.length>=18)break;}if(pool.length>=18)break;
  }
  // 小型/单国籍俱乐部题库使用一个国籍与两个历史战队作为行条件。
  if(pool.length<6){
   for(const country of eligibleCountries){
    const columns=eligibleTeams.filter(c=>overlap(country,c).length);
    let countryMatches=0;
    for(const cols of combinations(columns,3)){
     const rowTeams=eligibleTeams.filter(r=>!cols.some(c=>c.id===r.id)&&cols.every(c=>overlap(r,c).length));
     for(const pair of combinations(rowTeams,2)){if(add([country,...pair],cols,'mixed'))countryMatches++;if(countryMatches>=3||pool.length>=24)break;}
     if(countryMatches>=3||pool.length>=24)break;
    }
    if(pool.length>=24)break;
   }
  }
 }else{
  // 优先生成六支不同战队的转会题，再兼容允许同队交叉的小型题库。
  for(const distinct of [true,false]){
   for(const cols of combinations(eligibleTeams,3)){
    const rowTeams=eligibleTeams.filter(r=>(!distinct||!cols.some(c=>c.id===r.id))&&cols.every(c=>overlap(r,c).length));
    for(const rows of combinations(rowTeams,3)){add(rows,cols,distinct?'six-teams':'team-overlap');if(pool.length>=24)break;}
    if(pool.length>=24)break;
   }
   if(pool.length)break;
  }
 }
 // 当三国籍、混合条件都不可用时，不生成无解的题目。
 cached.pools[mode]=pool;if(!pool.length)return null;
 const base=pool[Math.floor(rng()*pool.length)];return {...clone(base),rows:shuffle(base.rows,rng),cols:shuffle(base.cols,rng)};
}
function checkBoard(db,rows,cols){if(rows.length!==3||cols.length!==3)throw Error('请选择三行、三列。');for(const axis of [rows,cols])if(new Set(axis.map(c=>c.type+':'+c.id)).size!==3)throw Error('同一行轴或列轴的条件不能重复。');for(const c of [...rows,...cols])if(!(c.type==='team'?db.teams:db.countries).some(x=>x.id===c.id))throw Error('条件不存在。');if(!solve(candidates(db,rows,cols)))throw Error('该组合没有九名互不重复的有效答案，请更换条件或补充选手。');return true;}
function newGame(db,board){checkBoard(db,board.rows,board.cols);return {...clone(board),id:Date.now().toString(36).toUpperCase().slice(-6),answers:Array(9).fill(null),revisions:Array(9).fill(0),points:Array(9).fill(0),attempts:0,attemptLimit:MAX_ATTEMPTS,correct:0,score:0,status:'playing',created:new Date().toISOString(),recorded:false,practice:false};}
function guess(db,game,index,playerId){
 if(game.status!=='playing')return {ok:false,message:'本局已结束。'};
 if(!Number.isInteger(index)||index<0||index>8||game.answers[index])return {ok:false,message:'请先选择一个空格。'};
 const p=db.players.find(x=>x.id===playerId);if(!p)return {ok:false,message:'找不到该选手。'};
 if(game.answers.includes(playerId))return {ok:false,message:'这名选手已经上场，本局不能重复使用。'};
 game.attempts++;
 const valid=matches(p,game.rows[Math.floor(index/3)])&&matches(p,game.cols[index%3]);
 if(valid){game.answers[index]=p.id;const points=Math.max(0,60-15*game.revisions[index]);game.points[index]=points;game.score+=points;game.correct++;}
 if(game.correct===9)game.status='won';else if(game.attempts>=MAX_ATTEMPTS)game.status='lost';
 const blocked=valid&&!solve(candidates(db,game.rows,game.cols),Object.fromEntries(game.answers.map((v,i)=>[i,v]).filter(x=>x[1])));
 return {ok:valid,points:game.points[index],blocked,message:valid?'答案正确，+'+game.points[index]+' 分。':'这位选手不满足该格的两个条件，消耗一次机会。'};
}
function undo(game,index){if(game.status!=='playing'||!game.answers[index])return false;game.score-=game.points[index];game.points[index]=0;game.answers[index]=null;game.correct--;game.revisions[index]++;return true;}
const api={MAX_ATTEMPTS,REGIONS,clone,shuffle,validate,matches,candidates,solve,makeBoard,checkBoard,newGame,guess,undo};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GridEngine=api;
})(typeof window!=='undefined'?window:globalThis);

