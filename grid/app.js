(function(){
'use strict';
const M=window.GridTeamRenames;
const E=window.GridEngine,$=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const library=read('pubg-grid.library.v1')==='global'?'global':'pcl';
const DEFAULT_DB=library==='pcl'?window.PCL_DATABASE:window.DEFAULT_DATABASE;
const KEYS={db:'pubg-grid.database.v1',game:'pubg-grid.game.v1',stats:'pubg-grid.stats.v1',backup:'pubg-grid.backup.v1'};
if(library==='pcl')for(const key of Object.keys(KEYS))KEYS[key]=KEYS[key].replace('pubg-grid.','pubg-grid.pcl.');
let storageOkay=true,canSaveGame=true,db,game,stats=[],selectedCell=null,toastTimer;
function read(key){try{return JSON.parse(localStorage.getItem(key));}catch{return null;}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{storageOkay=false;toast('浏览器存储不可用或空间不足，本次进度可能无法保存。');return false;}}
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),4000);}
function getCountry(id){return db.countries.find(c=>c.id===id);}
function getTeam(id){return db.teams.find(t=>t.id===id);}
function getPlayer(id){return db.players.find(p=>p.id===id);}
function playerRegion(p){return getCountry(p.country)?.region||'';}
function teamName(t){return t?.short||t?.name||'';}
function teamLogo(t){const text=esc(teamName(t));return '<span class="team-mark '+(t?.logo?'has-logo':'')+'" style="--team-color:'+esc(t?.color||'#c3c9b5')+'" title="'+esc(t?.fullName||t?.name||'')+'">'+(t?.logo?'<img class="team-logo" src="'+esc(t.logo)+'" alt="'+text+' 队徽" decoding="async"><span class="logo-fallback">'+text+'</span>':text)+'</span>';}
function historyBadge(id){const t=getTeam(id);return '<span class="badge history-badge" title="'+esc(t?.fullName||id)+'">'+(t?.logo?'<img src="'+esc(t.logo)+'" alt="" class="badge-logo" loading="lazy">':'')+esc(teamName(t)||id)+'</span>';}
function sourceLinks(p){const links=[...new Set([p.source,...(Array.isArray(p.verification?.sources)?p.verification.sources:[])].filter(v=>typeof v==='string'&&/^https?:\/\//i.test(v)))];return links.map((url,i)=>'<a class="text-button" target="_blank" rel="noopener noreferrer" href="'+esc(url)+'">资料来源 '+(i+1)+' ↗</a>').join(' · ');}
function verificationLabel(p){return p.verification?.status==='roster_verified'?'阵容页交叉核对':p.verification?.status==='personal_history'?'个人历史页核对':p.verification?.status?.startsWith('user_')?'用户维护':'历史资料';}
function fingerprint(value){let h=2166136261;const text=JSON.stringify(value);for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);}
function updateLocalAssets(database){
 if(database.assetRevision==='logos-2026-10-17')return null;
 const next=E.clone(database);let changed=false;
 for(const team of next.teams){
  const builtin=DEFAULT_DB.teams.find(t=>t.id===team.id);if(!builtin)continue;
  if(team.id==='TC'&&(team.short==='TC'||team.name==='TC'||team.short==='TKL')){if(team.name!== 'TKL'||team.short!=='TKL'){team.name=team.short='TKL';team.aliases=[...new Set([...(team.aliases||[]),'TC','TKL'])];changed=true;}}
  if(builtin.logo&&(!team.logo||team.logo===builtin.logo)){if(team.logo!==builtin.logo){team.logo=builtin.logo;changed=true;}}
 }
 for(const builtin of DEFAULT_DB.teams){if(builtin.logo&&!next.teams.some(t=>t.id===builtin.id)){next.teams.push(E.clone(builtin));changed=true;}}
 if(JSON.stringify(next.logoAssets)!==JSON.stringify(DEFAULT_DB.logoAssets)){next.logoAssets=E.clone(DEFAULT_DB.logoAssets);changed=true;}
 if(next.revision===(library==='pcl'?'pcl-liquipedia-2026-10-16-r1':'liquipedia-2026-10-16-r3')){next.revision=DEFAULT_DB.revision;changed=true;}
 next.assetRevision='logos-2026-10-17';return next;
}
function label(c){const item=c.type==='team'?getTeam(c.id):getCountry(c.id);return item?.name||c.id;}
function scrollToBoard(){window.scrollTo({top:0,behavior:'smooth'});}
function persistGame(){if(canSaveGame)write(KEYS.game,game);}
function closeModal(){$('modal').close();selectedCell=null;}
function modal(title,content,kicker='PLAYER SEARCH',wide=false){$('modal-title').textContent=title;$('modal-content').innerHTML=content;$('modal-kicker').textContent=kicker;$('modal').classList.toggle('wide',wide);if(!$('modal').open)$('modal').showModal();}
function confirmAction(title,description,action,labelText='确认'){modal(title,`<p class="modal-body-copy">${esc(description)}</p><div class="form-actions"><button class="button" id="cancel-action">取消</button><button class="button primary" id="confirm-action">${esc(labelText)}</button></div>`,'CONFIRM ACTION');$('cancel-action').onclick=closeModal;$('confirm-action').onclick=()=>{closeModal();action();};}
function conditionHTML(c){const item=c.type==='team'?getTeam(c.id):getCountry(c.id);return '<div class="condition" title="'+esc(item?.fullName||item?.name||c.id)+'">'+(c.type==='team'?teamLogo(item):'<span class="country-mark">'+esc(c.id)+'</span>')+'<b>'+esc(c.type==='team'?teamName(item):(item?.name||c.id))+'</b><small>'+(c.type==='team'?'曾效力战队':'选手国籍')+'</small></div>';}
function render(){
 renderStats();
 const isCustom=game?.mode==='custom';
 $('transfer-mode').classList.toggle('active',!isCustom);
 $('transfer-mode').setAttribute('aria-pressed',String(!isCustom));
 $('challenge-label').textContent=isCustom?'自定义挑战':'转会挑战';
 if(!game){$('score').textContent='000';$('lives').textContent=String(E.MAX_ATTEMPTS);$('progress').textContent='0 / 9 已完成';$('progress-bar').style.width='0%';$('challenge-number').textContent='';$('board-hint').textContent='题库暂无可用转会题目';$('board').innerHTML='<div class="empty-state" style="grid-column:1/-1;grid-row:1/-1">当前题库无法生成转会九宫格。可以切换题库，或试试自定义题目。</div>';$('give-up').disabled=true;return;}
 $('give-up').disabled=game.status!=='playing';
 $('challenge-number').textContent='#'+game.id;$('lives').textContent=Math.max(0,(game.attemptLimit||E.MAX_ATTEMPTS)-game.attempts);$('score').textContent=String(game.score).padStart(3,'0');$('progress').textContent=`${game.correct} / 9 已完成`;$('progress-bar').style.width=game.correct/9*100+'%';
 const options=E.candidates(db,game.rows,game.cols);let solution=null;
 if(game.status!=='playing'){const fixed=Object.fromEntries(game.answers.map((v,i)=>[i,v]).filter(x=>x[1]));solution=E.solve(options,fixed);}
 let html='<div class="corner"><span>⌖</span>GRID / 09</div>'+game.cols.map(conditionHTML).join('');
 for(let r=0;r<3;r++){html+=conditionHTML(game.rows[r]);for(let c=0;c<3;c++){const i=r*3+c,p=getPlayer(game.answers[i]),revealed=game.status!=='playing'&&!p;const answerId=solution?.[i];const answer=getPlayer(answerId);const coord=String.fromCharCode(65+r)+(c+1);html+=`<button class="cell ${p?'correct':revealed?'revealed':''}" data-cell="${i}" aria-label="${esc(coord+' '+label(game.rows[r])+' × '+label(game.cols[c])+(p?'，已填 '+p.name:revealed?'，查看答案':'，点击作答'))}" ${game.status!=='playing'?'disabled':''}><span class="cell-coord">${coord}</span>${p?`<span class="undo">↶</span><b>${esc(p.name)}</b><small>+${game.points[i]} PTS ✓</small>`:revealed?`<b>${esc(answer?.name||'查看候选')}</b><small>${solution?'参考答案':'需调整已填答案'}</small>`:'<span class="cross">＋</span><span class="cell-caption">点击作答</span>'}</button>`;}}
 $('board').innerHTML=html;$('board-hint').textContent=game.status==='playing'?'点击空格，部署你的答案':game.status==='won'?'WINNER WINNER CHICKEN DINNER!':'本局结束，参考答案已显示';
 $('mode-description').textContent=game.mode==='transfer'?'填入同时效力过行、列两支战队的选手。同队交叉表示曾效力该队；只计算已收录的经历。':'每格答案必须同时满足行、列条件。战队条件包含历史效力经历。';
 $('board').querySelectorAll('[data-cell]').forEach(b=>{b.onclick=()=>cellClick(Number(b.dataset.cell));b.oncontextmenu=e=>{e.preventDefault();if(game.answers[Number(b.dataset.cell)])undoCell(Number(b.dataset.cell));};});
}
function renderStats(){const count=stats.length;$('stat-games').textContent=count;$('stat-average').textContent=count?Math.round(stats.reduce((a,b)=>a+b.score,0)/count):0;$('stat-wins').textContent=count?Math.round(stats.filter(s=>s.status==='won').length/count*100)+'%':'0%';}
function finish(show=true){if(game.status==='playing')return;if(!game.recorded){game.recorded=true;if(!game.practice){stats.push({id:game.id,score:game.score,status:game.status,correct:game.correct,date:new Date().toISOString()});stats=stats.slice(-1000);write(KEYS.stats,stats);}persistGame();}render();if(show){modal(game.status==='won'?'大吉大利，今晚吃鸡！':'本局任务结束',`<div class="result-summary"><div class="big-score">${game.score}</div><h3>${game.correct} / 9 格完成</h3><p>${game.practice?'图鉴辅助练习 · 不计入生涯战绩':'已计入本机生涯战绩'} · 本局共使用 ${game.attempts} 次猜测</p></div><div class="form-actions"><button class="button" id="review-answers">查看参考答案</button><button class="button primary" id="next-round">再来一局</button></div>`,'MATCH REPORT');$('review-answers').onclick=()=>{closeModal();showAnswers();};$('next-round').onclick=()=>{closeModal();startNew(true);};}}
function startNew(force=false){const action=()=>{const board=E.makeBoard(db,'transfer');if(!board){toast('当前题库不足以生成可解的转会九宫格。可以切换题库，或试试自定义题目。');return;}game=E.newGame(db,board);$('game-message').textContent='';persistGame();render();scrollToBoard();};if(!force&&game?.status==='playing'&&game.attempts>0)confirmAction('更换本局挑战？','当前未完成的对局将被替换，不计入生涯战绩。',action,'换一局');else action();}
function undoCell(index){confirmAction('撤回这名选手？','本次猜测机会不会返还。下次答对这个格子会降低 15 分，最低为 0 分。',()=>{E.undo(game,index);persistGame();render();},'撤回答案');}
function cellClick(index){if(game.status!=='playing')return;if(game.answers[index]){undoCell(index);return;}selectedCell=index;const row=game.rows[Math.floor(index/3)],col=game.cols[index%3];modal('寻找交集选手',`<p class="modal-help"><span class="badge">${esc(label(row))}</span> × <span class="badge">${esc(label(col))}</span> · 同时满足两个条件</p><input class="modal-search" id="guess-input" placeholder="输入选手 ID 或别名…" aria-label="搜索作答选手" autocomplete="off"><div class="modal-feedback" id="guess-feedback" role="status"></div><div class="player-results" id="guess-results"></div>`);renderGuessResults('');$('guess-input').oninput=e=>{$('guess-feedback').textContent='';renderGuessResults(e.target.value);};$('guess-input').focus();}
function searchPlayers(query){const q=query.trim().toLowerCase();return db.players.filter(p=>[p.name,p.id,...p.aliases].some(v=>v.toLowerCase().includes(q)));}
function resultHTML(p,action='guess'){const used=game?.answers.includes(p.id);return `<button class="player-result" data-${action}="${esc(p.id)}" ${action==='guess'&&used?'disabled':''}><span class="player-avatar">${esc(p.name.slice(0,2).toUpperCase())}</span><span class="player-info"><b>${esc(p.name)}</b><small>${esc(getCountry(p.country)?.name)}${action==='guess'?'':` · ${esc(p.teams.map(t=>getTeam(t)?.short||t).join(' / '))}`}${action==='guess'&&used?' · 本局已使用':''}</small></span><span>↗</span></button>`;}
function renderGuessResults(query){const results=query.trim()?searchPlayers(query).slice(0,60):[];$('guess-results').innerHTML=results.length?results.map(p=>resultHTML(p)).join(''):`<div class="empty-state">${query.trim()?'当前题库没有匹配的选手。':'输入 ID 搜索选手，按 Enter 选择首个可用结果。'}</div>`;$('guess-results').querySelectorAll('[data-guess]').forEach(b=>b.onclick=()=>submitGuess(b.dataset.guess));$('guess-input').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();const first=$('guess-results').querySelector('[data-guess]:not(:disabled)');if(first)first.click();}};}
function submitGuess(id){const i=selectedCell,res=E.guess(db,game,i,id);persistGame();render();if(res.ok){closeModal();$('game-message').textContent=res.blocked?'答案有效，但此选手占用了其他格的唯一答案；可撤回调整。':res.message;toast(res.message);}else{$('guess-feedback').textContent=res.message;$('guess-input').select();}if(game.status!=='playing'){closeModal();finish();}}
function showAnswers(){
 if(!game)return;
 const {rows,cols,answers}=game;
 const options=E.candidates(db,rows,cols);
 const fixed=Object.fromEntries(answers.map((id,i)=>[i,id]).filter(([,id])=>id));
 const fixedSolution=E.solve(options,fixed);
 const solution=fixedSolution||E.solve(options);
 const description=fixedSolution?'每格展示一位符合行列条件的选手，九格答案互不重复。':solution?'已重新分配选手，以下九格答案互不重复。':'当前题库无法为本题生成完整解，可展开查看各格候选。';
 const coordinate=(r,c)=>String.fromCharCode(65+r)+(c+1);
 const columns=cols.map(condition=>`<th scope="col">${conditionHTML(condition)}</th>`).join('');
 const body=rows.map((condition,r)=>`<tr><th scope="row">${conditionHTML(condition)}</th>${cols.map((_,c)=>{
  const player=getPlayer(solution?.[r*3+c]);
  return `<td><small>${coordinate(r,c)}</small><strong>${esc(player?.name||'—')}</strong></td>`;
 }).join('')}</tr>`).join('');
 const candidates=options.map((ids,i)=>{
  const r=Math.floor(i/3),c=i%3;
  return `<li><b>${coordinate(r,c)} · ${esc(label(rows[r]))} × ${esc(label(cols[c]))}</b><span>${ids.map(id=>esc(getPlayer(id)?.name)).join('、')||'无候选'}</span></li>`;
 }).join('');
 modal('本题参考答案',`<p class="modal-help">${description}</p>
 <table class="answer-board" aria-label="九宫格参考答案"><thead><tr><td>行 × 列</td>${columns}</tr></thead><tbody>${body}</tbody></table>
 <details class="answer-candidates"><summary>查看每格候选选手</summary><ul>${candidates}</ul></details>`,'');
}
function giveUp(){if(game?.status!=='playing')return;confirmAction('结束本局并查看答案？','本局将以当前分数结算。系统会展示互不重复的参考答案和每格候选名单。',()=>{game.status='gaveup';finish(false);showAnswers();},'结束并揭晓');}
function download(name,text,type='application/json'){const blob=new Blob([text],{type:type+';charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function lookup(){const open=()=>{if(game?.status==='playing'){game.practice=true;persistGame();}modal('选手图鉴',`<p class="modal-help">查询已收录的国籍和历史效力战队。本局如未结束，将标记为辅助练习，不计入生涯战绩。</p><input id="lookup-input" class="modal-search" aria-label="查询图鉴" placeholder="输入选手 ID 或别名…"><div id="lookup-results" class="player-results"></div><div id="lookup-detail"></div>`,'PLAYER INTELLIGENCE');$('lookup-input').oninput=e=>{const q=e.target.value;$('lookup-detail').innerHTML='';const results=q.trim()?searchPlayers(q).slice(0,30):[];$('lookup-results').innerHTML=results.map(p=>resultHTML(p,'lookup')).join('')||'<div class="empty-state">输入选手 ID 查看履历</div>';$('lookup-results').querySelectorAll('[data-lookup]').forEach(b=>b.onclick=()=>{const p=getPlayer(b.dataset.lookup);$('lookup-results').innerHTML='';$('lookup-detail').innerHTML=`<div class="lookup-card"><h3>${esc(p.name)}</h3><p>${esc(getCountry(p.country)?.name)} · ${esc(playerRegion(p))}</p><div class="history-tags">${p.teams.map(historyBadge).join('')}</div><p>${esc(p.note||'仅展示已收录的历史记录，不表示现役阵容。')}</p><p class="verification-label">${esc(verificationLabel(p))} · ${esc(p.verification?.checkedAt||'历史记录')}</p><div class="source-links">${sourceLinks(p)}</div></div>`;});};$('lookup-input').dispatchEvent(new Event('input'));$('lookup-input').focus();};if(game?.status==='playing'&&!game.practice)confirmAction('进入选手图鉴？','图鉴会显示答案相关履历。本局将标记为辅助练习，不计入生涯战绩。',open,'开始查询');else open();}
function customBoard(){const choices=[...db.teams.map(t=>({type:'team',id:t.id,text:'战队 · '+t.name})),...db.countries.map(c=>({type:'country',id:c.id,text:'国籍 · '+c.name}))];const defaults=game?[...game.rows,...game.cols]:choices.slice(0,6);const value=c=>c.type+':'+c.id;modal('配置自己的九宫格',`<p class="modal-help">可自由组合「战队 × 战队」或「国籍 × 战队」。每轴内条件不能重复；同队交叉表示曾效力该队。系统会检查九名不同选手的完整解。开始后替换当前对局。</p><form id="board-form"><div class="form-grid">${Array.from({length:6},(_,i)=>`<label class="field">${i<3?'行':'列'} ${i%3+1}<select id="condition-${i}">${choices.map(c=>`<option value="${esc(value(c))}" ${defaults[i]&&value(defaults[i])===value(c)?'selected':''}>${esc(c.text)}</option>`).join('')}</select></label>`).join('')}</div><div class="modal-feedback" id="board-error" role="alert"></div><div class="form-actions"><button class="button" type="button" id="cancel-board">取消</button><button class="button primary" type="submit">检查并开始挑战</button></div></form>`,'CUSTOM GRID',true);$('cancel-board').onclick=closeModal;$('board-form').onsubmit=e=>{e.preventDefault();try{const cs=Array.from({length:6},(_,i)=>{const v=$('condition-'+i).value,k=v.indexOf(':');return {type:v.slice(0,k),id:v.slice(k+1)};});E.checkBoard(db,cs.slice(0,3),cs.slice(3));game=E.newGame(db,{mode:'custom',rows:cs.slice(0,3),cols:cs.slice(3)});persistGame();closeModal();$('game-message').textContent='自定义组合已验证存在完整解。';render();scrollToBoard();}catch(err){$('board-error').textContent=err.message;}};}
function help(){modal('作战指南',`<div class="modal-body-copy"><p><b>转会挑战</b>使用「历史战队 × 历史战队」。同队交叉格只需曾效力该队。自定义题目也可使用选手国籍作为条件。</p><p>点击格子搜索选手。每次选择未使用的选手并提交消耗 1 次机会，共 11 次；答对 +60 分，9 格全部填对就是 540 分。重复选手会被拦截，不消耗机会。</p><p>已填格可点击或右键撤回，次数不返还，重填该格降 15 分。有效答案有时会占用其他格的唯一选手，页面会提示调整。</p><p>题目生成时检查九名不同选手的完整解。转会关系不足时，可以切换题库，或在「自定义题目」中验证组合。</p><p>进度和战绩保存在当前浏览器。不同浏览器、端口或网址的存档各自独立。</p></div>`,'HOW TO PLAY');}
function init(){
 $('library-select').value=library;
 $('library-select').onchange=e=>{if(write('pubg-grid.library.v1',e.target.value))location.reload();else e.target.value=library;};
 let savedDatabase=read(KEYS.db);
 const release=window.DATABASE_RELEASE;
 const previousDefaults=library==='pcl'?release?.pclLegacyFingerprints:release?.legacyFingerprints;
 if(savedDatabase&&previousDefaults?.includes(fingerprint(savedDatabase))){
  const backupKey=library==='pcl'?KEYS.backup+'.player-history-20261104':KEYS.backup;
  if(write(backupKey,savedDatabase)&&write(KEYS.db,DEFAULT_DB)){
   savedDatabase=DEFAULT_DB;
   toast(library==='pcl'?'已更新 PCL 选手履历，旧库已备份。':'已更新全球题库与队徽，旧库已备份。');
  }
 }
 const teamUpgrade=M.database(savedDatabase||DEFAULT_DB),teamMapping=teamUpgrade.mapping;
 if(teamUpgrade.changed){
  try{
   E.validate(teamUpgrade.database);
   teamUpgrade.database.revision=DEFAULT_DB.revision;
   if(savedDatabase){const key=KEYS.backup+'.team-names-20261103';if(read(key)||write(key,{database:savedDatabase,game:read(KEYS.game)}))write(KEYS.db,teamUpgrade.database);}
   savedDatabase=teamUpgrade.database;
  }catch{ /* Keep the original input for the existing validation/recovery path. */ }
 }
 try{db=E.validate(savedDatabase||DEFAULT_DB);}catch{db=E.validate(DEFAULT_DB);toast('本机数据库格式异常，已载入内置题库；原记录未删除。');}
 const assetUpgrade=updateLocalAssets(db);if(assetUpgrade){const assetBackup=KEYS.backup+'.assets-20261017';if(!savedDatabase||read(assetBackup)||write(assetBackup,db)){if(write(KEYS.db,assetUpgrade))db=assetUpgrade;}}
 const savedStats=read(KEYS.stats);stats=Array.isArray(savedStats)?savedStats.filter(s=>s&&Number.isFinite(s.score)&&s.score>=0&&s.score<=540&&['won','lost','gaveup'].includes(s.status)).slice(-1000):[];
 const previousGame=read(KEYS.game),saved=M.game(previousGame,teamMapping,db.players);
 if(previousGame?.mode==='global')canSaveGame=write(KEYS.game+'.retired-challenge',previousGame);
 if(previousGame&&JSON.stringify(previousGame)!==JSON.stringify(saved)){const key=KEYS.game+'.team-names-20261103';if(!read(key))write(key,previousGame);}
 try{if(!saved||!['transfer','custom'].includes(saved.mode))throw Error();E.checkBoard(db,saved.rows,saved.cols);if(!Array.isArray(saved.answers)||saved.answers.length!==9||!Array.isArray(saved.revisions)||saved.revisions.length!==9||!Array.isArray(saved.points)||saved.points.length!==9||!['playing','won','lost','gaveup'].includes(saved.status)||!Number.isInteger(saved.attempts)||saved.attempts<0||saved.attempts>E.MAX_ATTEMPTS||!Number.isFinite(saved.score))throw Error();const ids=saved.answers.filter(Boolean);if(new Set(ids).size!==ids.length||ids.some(id=>!getPlayer(id)))throw Error();const opts=E.candidates(db,saved.rows,saved.cols);if(saved.answers.some((id,i)=>id&&!opts[i].includes(id)))throw Error();game=saved;game.attemptLimit=game.status==='playing'?E.MAX_ATTEMPTS:(game.attemptLimit||9);persistGame();}catch{const board=E.makeBoard(db,'transfer');game=board?E.newGame(db,board):null;persistGame();}
 document.querySelector('.rail-link[data-view=game]').onclick=scrollToBoard;$('close-modal').onclick=closeModal;$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});$('modal').addEventListener('close',()=>selectedCell=null);
 $('new-game').onclick=()=>startNew();$('transfer-mode').onclick=()=>{if(game?.mode!=='transfer')startNew();};$('custom-board').onclick=customBoard;$('give-up').onclick=giveUp;$('lookup').onclick=lookup;$('help-button').onclick=help;
 $('reset-stats').onclick=()=>confirmAction('重置生涯战绩？','当前战绩会下载为 JSON 备份，然后清空本机统计。数据库与当前对局保留。',()=>{download('pubg-stats-backup.json',JSON.stringify(stats,null,2));stats=[];write(KEYS.stats,stats);renderStats();toast('战绩已重置，备份已下载。');},'备份并重置');
 document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement){if(e.target.classList.contains('team-logo'))e.target.parentElement.classList.add('logo-failed');else e.target.hidden=true;}},true);
 render();if(!storageOkay)$('game-message').textContent='浏览器存储不可用，刷新或关闭页面后可能丢失进度。';
}
init();
})();


