/* Bài tập bổ ngữ · Tiếng Trung Dolin — làm online, chấm tự động */
(function(){
const D=window.BT_DATA,G=window.DOLIN;if(!D||!G)return;
const {$,esc}=G;
const SK=G.KEY+'_bt';let ST={};try{ST=JSON.parse(localStorage.getItem(SK)||'{}')||{}}catch(e){}
const save=()=>{try{localStorage.setItem(SK,JSON.stringify(ST))}catch(e){}};
document.head.appendChild($(`<style>
.bt-hero{background:linear-gradient(135deg,var(--brand),#7A2A13);color:#FFF6EE;border-radius:18px;padding:18px 22px;margin-bottom:16px}
.bt-hero h2{color:#FFF6EE;margin:0 0 4px}.bt-hero p{margin:0;color:#FCE3C2}
.bt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.bt-card{display:flex;flex-direction:column;gap:4px;padding:16px;border-radius:14px;background:var(--card);border:1px solid var(--line);text-decoration:none;color:var(--ink)}
.bt-card:hover{border-color:var(--brand)}.bt-card b{font-size:17px}.bt-card small{color:var(--mute)}
.bt-badge{align-self:flex-start;font-size:12px;font-weight:700;border-radius:999px;padding:2px 9px;background:var(--line)}
.bt-badge.g{background:var(--okbg);color:var(--ok)}
.bt-part{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;margin:14px 0}
.bt-part h3{margin:0 0 10px;color:var(--brand);font-size:18px}
.bt-note{font-size:13px;color:var(--mute);margin:-4px 0 10px}
.bt-it{padding:10px 0;border-top:1px dashed var(--line)}.bt-it:first-of-type{border-top:0}
.bt-q{font-family:var(--han);font-size:19px;line-height:1.7}.bt-q .n{font-family:var(--ui);font-weight:700;color:var(--brand);margin-right:6px}
.bt-vi{font-size:16px;line-height:1.5}
.bt-opts{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.bt-opts button,.bt-chips button{font-family:var(--han);font-size:17px;padding:6px 14px;background:var(--card);color:var(--ink);border:1px solid var(--line)}
.bt-opts button.sel{background:var(--brand);color:#fff;border-color:var(--brand)}
.bt-opts button.y{background:var(--okbg);color:var(--ok);border-color:var(--ok)}.bt-opts button.n{background:var(--badbg);color:var(--bad);border-color:var(--bad)}
.bt-in{font-family:var(--han);font-size:17px;width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);margin-top:6px}
.bt-sel,.bt-blank{font-family:var(--han);font-size:17px;padding:2px 6px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink)}
.bt-blank{width:4.2em;text-align:center;margin:0 2px}
.bt-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.bt-chips button.used{opacity:.3}
.bt-build{min-height:40px;border:1px dashed var(--line);border-radius:10px;padding:6px 10px;font-family:var(--han);font-size:18px;margin-top:6px;background:var(--bg)}
.bt-res{margin-top:6px;font-size:14px}.bt-res .ok{color:var(--ok);font-weight:700}.bt-res .no{color:var(--bad);font-weight:700}
.bt-ans{font-family:var(--han);color:var(--ok);font-size:17px}
.bt-self{font-size:13px;padding:2px 10px;margin-left:6px}
.bt-pass{font-family:var(--han);font-size:19px;line-height:2.2}
.bt-bar{position:sticky;bottom:0;background:var(--bg);padding:10px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--line);z-index:5}
.bt-score{font-size:22px;font-weight:800;color:var(--brand)}
.bt-box{border:2px solid var(--gold);border-radius:12px;padding:8px 12px;font-family:var(--han);font-size:17px;color:var(--brand);display:flex;flex-wrap:wrap;gap:6px 18px;margin-bottom:6px}
</style>`));
const norm=s=>String(s||'').replace(/[\s，。！？、；：,.!?;:“”"'‘’（）()…—\-·]/g,'').replace(/兒/g,'儿');
const alts=a=>String(a).split('|').map(x=>x.trim()).filter(Boolean);
const match=(v,a)=>!!norm(v)&&alts(a).some(x=>norm(x)===norm(v));
const PNAME={mc:'',bank:'',fix:'Máy so với đáp án tham khảo – nếu em viết cách khác mà đúng, bấm “Em làm đúng”.',tr:'Máy so với đáp án tham khảo – nếu em dịch cách khác mà đúng, bấm “Em làm đúng”.',rw:'Máy so với đáp án tham khảo – có cách viết khác đúng thì bấm “Em làm đúng”.',order:'Bấm lần lượt các cụm từ để sắp xếp. Bấm “Xoá” để làm lại.',tf:'',passage:''};
function hub(){
  const v=$(`<div><div class="bt-hero"><h2>Bài tập bổ ngữ · 补语练习</h2><p>${esc(window.BT_INTRO||'6 loại bổ ngữ, mỗi loại 6–7 dạng bài: trắc nghiệm, điền từ, sửa sai, sắp xếp câu, đúng/sai, đoạn văn, dịch. Làm xong bấm “Nộp bài” để chấm.')}</p></div><div class="bt-grid" id="g"></div></div>`);
  const g=v.querySelector('#g');
  D.forEach(sh=>{const b=ST[sh.id];const n=sh.parts.reduce((s,p)=>s+count(p),0);
    g.append($(`<a class="bt-card" href="#bo-ngu/${sh.id}"><b>${esc(sh.title)}</b>${sh.sub?`<small class="han">${esc(sh.sub)}</small>`:''}<small>${sh.parts.length} dạng bài · ${n} câu</small>${b?`<span class="bt-badge g">Cao nhất ${b}%</span>`:'<span class="bt-badge">Chưa làm</span>'}</a>`))});
  return v}
const count=([k,t,p])=>k==='bank'?p[1].length:k==='passage'?p[1].length:p.length;
function sheet(id){const sh=D.find(x=>x.id===id);if(!sh)return hub();
  const v=$(`<div><div class="kn-top" style="display:flex;gap:10px;align-items:center"><a class="btn" href="#bo-ngu">← Bài tập bổ ngữ</a></div><h2>${esc(sh.title)}</h2>${sh.sub?`<p class="sub">${esc(sh.sub)}</p>`:''}<div id="ps"></div>
    <div class="bt-bar"><button class="btn" id="sub" style="background:var(--brand);color:#fff;font-size:17px;padding:10px 22px">Nộp bài</button><button class="btn" id="re">Làm lại</button><span class="bt-score" id="sc"></span></div></div>`);
  const ps=v.querySelector('#ps');const checks=[];
  sh.parts.forEach(([k,title,pay],pi)=>{const box=$(`<div class="bt-part"><h3>Bài ${pi+1}: ${esc(title)}</h3>${PNAME[k]?`<p class="bt-note">${esc(PNAME[k])}</p>`:''}</div>`);ps.append(box);
    if(k==='mc')pay.forEach(([q,opts,a],i)=>{const it=$(`<div class="bt-it"><div class="bt-q"><span class="n">${i+1}.</span>${esc(q)}</div><div class="bt-opts"></div><div class="bt-res"></div></div>`);let sel=-1;
      const os=it.querySelector('.bt-opts');opts.forEach((o,j)=>{const b=$(`<button class="btn">${'ABCD'[j]}. ${esc(o)}</button>`);b.onclick=()=>{if(it.dataset.done)return;sel=j;os.querySelectorAll('button').forEach(x=>x.classList.remove('sel'));b.classList.add('sel')};os.append(b)});
      checks.push(()=>{it.dataset.done=1;const bs=os.querySelectorAll('button');bs[a].classList.add('y');const ok=sel===a;if(!ok&&sel>=0)bs[sel].classList.add('n');it.querySelector('.bt-res').innerHTML=ok?'<span class="ok">✓ Đúng</span>':'<span class="no">✗ Chưa đúng</span>';return ok});box.append(it)});
    if(k==='bank'){const [words,items]=pay;box.append($(`<div class="bt-box">${words.map(w=>`<span>${esc(w)}</span>`).join('')}</div>`));
      items.forEach(([q,a],i)=>{const sel=`<select class="bt-sel"><option value="">— chọn —</option>${words.map(w=>`<option>${esc(w)}</option>`).join('')}</select>`;
        const it=$(`<div class="bt-it"><div class="bt-q"><span class="n">${i+1}.</span>${esc(q).replace('____',sel)}</div><div class="bt-res"></div></div>`);
        checks.push(()=>{const s=it.querySelector('select');const ok=match(s.value,a);s.disabled=true;it.querySelector('.bt-res').innerHTML=ok?'<span class="ok">✓ Đúng</span>':`<span class="no">✗</span> Đáp án: <span class="bt-ans">${esc(alts(a).join(' / '))}</span>`;return ok});box.append(it)})}
    if(k==='passage'){const [text,anss]=pay;const it=$(`<div class="bt-it"><div class="bt-pass">${esc(text).replace(/（(\d+)）____/g,(m,n)=>`（${n}）<input class="bt-blank" data-n="${n}">`)}</div><div class="bt-res"></div></div>`);box.append(it);
      anss.forEach((a,j)=>checks.push(()=>{const inp=it.querySelector(`[data-n="${j+1}"]`);const ok=match(inp.value,a);inp.disabled=true;inp.style.borderColor=ok?'var(--ok)':'var(--bad)';if(!ok)inp.insertAdjacentHTML('afterend',`<span class="bt-ans">(${esc(a)})</span>`);return ok}))}
    if(k==='tf')pay.forEach(([s,ok,fix],i)=>{const it=$(`<div class="bt-it"><div class="bt-q"><span class="n">${i+1}.</span>${esc(s)}</div><div class="bt-opts"><button class="btn">Đúng</button><button class="btn">Sai</button></div><input class="bt-in" placeholder="Nếu sai, viết câu đúng vào đây" hidden><div class="bt-res"></div></div>`);let sel=null;
      const [bY,bN]=it.querySelectorAll('.bt-opts button');const inp=it.querySelector('input');bY.onclick=()=>{sel=true;bY.classList.add('sel');bN.classList.remove('sel');inp.hidden=true};bN.onclick=()=>{sel=false;bN.classList.add('sel');bY.classList.remove('sel');inp.hidden=false};
      checks.push(()=>{const r=sel===ok;(ok?bY:bN).classList.add('y');if(!r&&sel!==null)(sel?bY:bN).classList.add('n');it.querySelector('.bt-res').innerHTML=(r?'<span class="ok">✓ Đúng</span>':'<span class="no">✗ Chưa đúng</span>')+(ok?'':` · Câu đúng: <span class="bt-ans">${esc(alts(fix).join(' / '))}</span>`);return r});box.append(it)});
    if(k==='order')pay.forEach(([chunks,a],i)=>{const sh2=[...chunks].sort(()=>Math.random()-.5);const it=$(`<div class="bt-it"><div class="bt-q"><span class="n">${i+1}.</span></div><div class="bt-chips"></div><div class="bt-build"></div><button class="btn bt-self">Xoá</button><div class="bt-res"></div></div>`);
      const ch=it.querySelector('.bt-chips'),bd=it.querySelector('.bt-build');let built=[];
      const draw=()=>{bd.textContent=built.map(j=>sh2[j]).join('')};
      sh2.forEach((c,j)=>{const b=$(`<button class="btn">${esc(c)}</button>`);b.onclick=()=>{if(it.dataset.done||built.includes(j))return;built.push(j);b.classList.add('used');draw()};ch.append(b)});
      it.querySelector('.bt-self').onclick=()=>{if(it.dataset.done)return;built=[];ch.querySelectorAll('button').forEach(b=>b.classList.remove('used'));draw()};
      checks.push(()=>{it.dataset.done=1;const ok=match(bd.textContent,a);it.querySelector('.bt-res').innerHTML=ok?'<span class="ok">✓ Đúng</span>':`<span class="no">✗</span> Đáp án: <span class="bt-ans">${esc(alts(a).join(' / '))}</span>`;return ok});box.append(it)});
    if(k==='fix'||k==='tr'||k==='rw')pay.forEach(([q,a,note],i)=>{const it=$(`<div class="bt-it"><div class="${k==='tr'?'bt-vi':'bt-q'}"><span class="n">${i+1}.</span>${esc(q)}</div><input class="bt-in" placeholder="${k==='fix'?'Viết lại câu đúng':k==='tr'?'Viết câu tiếng Trung':'Viết câu hoàn chỉnh'}"><div class="bt-res"></div></div>`);
      const st={ok:false};checks.push(()=>{const inp=it.querySelector('input');inp.disabled=true;st.ok=match(inp.value,a);const r=it.querySelector('.bt-res');
        r.innerHTML=(st.ok?'<span class="ok">✓ Khớp đáp án</span>':'<span class="no">✗ Chưa khớp</span>')+` · Đáp án tham khảo: <span class="bt-ans">${esc(alts(a).join(' / '))}</span>`+(note?`<div style="color:var(--mute);margin-top:2px">💡 ${esc(note)}</div>`:'');
        if(!st.ok&&inp.value.trim()){const b=$(`<button class="btn bt-self">✓ Em làm đúng</button>`);b.onclick=()=>{st.ok=true;b.remove();r.querySelector('.no').outerHTML='<span class="ok">✓ Tự chấm đúng</span>';rescore()};r.append(b)}return st});box.append(it)});
  });
  let res=[];const sc=v.querySelector('#sc');
  const rescore=()=>{const n=res.length,ok=res.filter(r=>r===true||(r&&r.ok)).length;const p=n?Math.round(ok/n*100):0;sc.textContent=`${ok}/${n} câu · ${p}%`;if(!ST[sh.id]||p>ST[sh.id]){ST[sh.id]=p;save()}};
  v.querySelector('#sub').onclick=()=>{if(res.length)return;res=checks.map(f=>f());rescore();v.querySelector('#sub').disabled=true;window.scrollTo({top:0,behavior:'smooth'})};
  v.querySelector('#re').onclick=()=>{location.hash='#bo-ngu';setTimeout(()=>location.hash='#bo-ngu/'+sh.id,20)};
  return v}
function view(h){const p=h.split('/');return p[1]?sheet(p[1]):hub()}
window.BT={view};
if(location.hash.startsWith('#bo-ngu'))window.dispatchEvent(new HashChangeEvent('hashchange'));
})();
