(function(root){
  'use strict';
  const categories=['Homestead','Business','School','Church','Cemetery','Community','Transportation','Military history','Notable event','Industry'];
  function safeURL(value){
    if(typeof value!=='string'||!value.trim())return null;
    if(/^https?:\/\//i.test(value)){try{return new URL(value).href}catch{return null}}
    return /^(assets\/)[\w./% -]+$/.test(value)&&!value.includes('..')?value:null;
  }
  function validate(a){
    const errors=[],ids=new Set();
    if(a?.version!==1||!Array.isArray(a.records))return ['Expected version 1 and a records array.'];
    for(const p of a.records){
      const bad=m=>errors.push(`${p?.id||'(no ID)'}: ${m}`);
      if(!p||typeof p!=='object'){bad('Invalid record');continue}
      if(typeof p.id!=='string'||!/^[-a-z0-9]+$/.test(p.id)||ids.has(p.id))bad('ID must be unique lowercase letters, numbers or hyphens');ids.add(p.id);
      for(const k of ['name','description','summary','period','legalDescription','contributor','rights'])if(typeof p[k]!=='string')bad(`${k} must be text`);
      if(!p.name?.trim())bad('Name is required');
      if(!Array.isArray(p.categories)||!p.categories.length||p.categories.some(c=>!categories.includes(c)))bad('Choose supported categories');
      for(const k of ['people','families','alternateNames','relatedIds'])if(!Array.isArray(p[k])||p[k].some(v=>typeof v!=='string'))bad(`${k} must be a text list`);
      if(!['exact','approximate','uncertain','unknown'].includes(p.locationAccuracy))bad('Invalid accuracy');
      const located=Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=90&&Math.abs(p.lng)<=180;
      if(!located&&!(p.lat===null&&p.lng===null))bad('Coordinates must be a valid pair or both null');
      if(!['draft','verified','disputed','illustrative'].includes(p.status))bad('Invalid status');
      if(typeof p.demo!=='boolean'||(p.demo&&p.status!=='illustrative'))bad('Examples must be illustrative');
      if(!['documented','oral tradition','disputed','unidentified'].includes(p.claimType))bad('Invalid claim type');
      for(const k of ['startYear','endYear'])if(p[k]!==null&&(!Number.isInteger(p[k])||p[k]<1||p[k]>9999))bad('Years must be integers 1–9999 or null');
      if(p.startYear!==null&&p.endYear!==null&&p.startYear>p.endYear)bad('Years reversed');
      if(!Array.isArray(p.sources))bad('Sources must be a list');else for(const s of p.sources)if(!s||typeof s.title!=='string'||!s.title.trim()||(s.url&&!safeURL(s.url)))bad('Source needs title and safe optional URL');
      if(p.status==='verified'&&!p.sources?.length)bad('Verified records need citations');
      if(!Array.isArray(p.media))bad('Media must be a list');else for(const m of p.media)if(!m||!['image','document','audio'].includes(m.type)||!safeURL(m.url)||['caption','credit','rights','alt'].some(k=>typeof m[k]!=='string'||!m[k].trim()))bad('Media needs type, safe URL, caption, credit, rights and alternative text');
    }
    for(const p of a.records)for(const id of p?.relatedIds||[])if(!ids.has(id))errors.push(`${p.id}: missing related ID ${id}`);
    return errors;
  }
  function matches(p,f){
    const text=[p.name,p.description,p.summary,p.period,...p.alternateNames,...p.people,...p.families].join(' ').toLowerCase();
    const dated=p.startYear!==null||p.endYear!==null;
    return (!p.demo||f.demos)&&(!f.verified||p.status==='verified')&&(!f.q||text.includes(f.q.toLowerCase().trim()))&&(!f.categories.length||p.categories.some(c=>f.categories.includes(c)))&&
      ((!f.from&&!f.to)||(!dated?f.unknown:(p.endYear??p.startYear)>=(f.from||1)&&(p.startYear??p.endYear)<=(f.to||9999)));
  }
  const api={categories,safeURL,validate,matches};if(typeof module!=='undefined')module.exports=api;else root.Atlas=api;
})(globalThis);
