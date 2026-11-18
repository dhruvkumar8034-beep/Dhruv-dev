const filterBar = document.querySelector('.filter-bar');
const filters = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('[data-category]')];
const status = document.querySelector('.filter-status');
const grid = document.querySelector('#project-grid');
const reduced = ({ matches: false, addEventListener: () => {} });
const easeOut = 'cubic-bezier(.16,1,.3,1)';
let generation = 0;
let selected = 'all';
const transitions = new Set();
const entrances = new Map();
const seen = new WeakSet();
const parts = project => [project.querySelector('.project-visual'), project.querySelector('.project-copy')];
function track(node, frames, options) {
  const animation = node.animate(frames, options);
  transitions.add(animation);
  animation.finished.catch(() => {}).finally(() => { transitions.delete(animation); animation.cancel(); });
  return animation;
}
function showContent(project, markSeen = true) {
  if (markSeen) seen.add(project);
  for (const animation of entrances.get(project) || []) animation.cancel();
  entrances.delete(project);
  for (const node of parts(project)) { node.style.removeProperty('opacity'); node.style.removeProperty('transform'); }
}
function reveal(project) {
  if (seen.has(project) || project.hidden) return;
  seen.add(project);
  if (reduced.matches) return showContent(project);
  const animations = parts(project).map((node, index) => {
    node.style.removeProperty('opacity'); node.style.removeProperty('transform');
    const animation = node.animate([
      { opacity:0, transform:`translateY(${index ? 24 : 40}px)`,filter:'blur(4px)' },
      { opacity:1,transform:'translateY(0)',filter:'blur(0px)' }
    ], {duration:620,delay:index*85,easing:easeOut,fill:'both'});
    animation.finished.catch(() => {}).finally(() => animation.cancel());
    return animation;
  });
  entrances.set(project, animations);
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
}, {rootMargin:'0px 0px -8% 0px',threshold:0});
for (const project of projects) {
  if (!reduced.matches) for (const node of parts(project)) {node.style.opacity='0';node.style.transform='translateY(32px)';}
  observer.observe(project);
  project.addEventListener('focusin', () => showContent(project));
}
function applyFilter(value, button) {
  let count=0;
  for (const project of projects) {
    project.hidden = value !== 'all' && project.dataset.category !== value;
    if (!project.hidden) count++;
    else project.querySelector('details')?.removeAttribute('open');
  }
  grid.toggleAttribute('data-filtered', value !== 'all');
  grid.dataset.count=String(count);
  status.textContent=value === 'all' ? 'Showing all projects' : `${count} ${count === 1 ? 'project' : 'projects'} in ${button.textContent.trim()}`;
}
async function changeFilter(button) {
  if (selected === button.dataset.filter) return;
  selected=button.dataset.filter;
  const current=++generation;
  for (const animation of transitions) animation.cancel();
  transitions.clear();
  filters.forEach(filter => filter.setAttribute('aria-pressed',String(filter===button)));
  projects.forEach(project => showContent(project, false));
  grid.dataset.transitioning='true';
  const before=new Map(projects.filter(p=>!p.hidden).map(p=>[p,p.getBoundingClientRect()]));
  const outgoing=[...before.keys()].filter(p=>selected!=='all' && p.dataset.category!==selected);
  if (!reduced.matches) {
    await Promise.all(outgoing.map(project=>track(project,[
      {opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0px)'},
      {opacity:0,transform:'translateY(-14px) scale(.98)',filter:'blur(4px)'}
    ],{duration:160,easing:'ease-in',fill:'both'}).finished.catch(()=>{})));
  }
  if (current!==generation) return;
  applyFilter(selected,button);
  if (reduced.matches) {delete grid.dataset.transitioning;return;}
  // Read the new layout once, then animate from the previous geometry (FLIP).
  const visible=projects.filter(p=>!p.hidden);
  const after=new Map(visible.map(p=>[p,p.getBoundingClientRect()]));
  const arrivals=visible.map((project,index)=>{
    const last=after.get(project), first=before.get(project);
    const transform=first ? `translate(${first.left-last.left}px,${first.top-last.top}px) scale(${first.width/last.width},${first.height/last.height})` : 'translateY(28px) scale(.98)';
    return track(project,[
      {transform,opacity:first ? .65:0,filter:first?'blur(0px)':'blur(4px)'},
      {transform:'translate(0,0) scale(1)',opacity:1,filter:'blur(0px)'}
    ],{duration:460,delay:Math.min(index*45,135),easing:easeOut,fill:'both'}).finished.catch(()=>{});
  });
  await Promise.all(arrivals);
  if(current===generation) delete grid.dataset.transitioning;
}
if (filterBar && filters.length && projects.length && status && grid) {
  filterBar.hidden=false;
  filters.forEach(button=>button.addEventListener('click',()=>changeFilter(button)));
}
reduced.addEventListener('change',()=>{
  projects.forEach(project => showContent(project));
  if(reduced.matches){
    generation++;
    for(const animation of transitions) animation.cancel();
    transitions.clear();
    const button=filters.find(button=>button.dataset.filter===selected);
    if(button && grid) {applyFilter(selected,button);delete grid.dataset.transitioning;}
  }
});
