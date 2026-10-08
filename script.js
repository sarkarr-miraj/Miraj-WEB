const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];

// typing effect
const roles=['creative content strategist','dynamic event manager','digital marketer','passionate leader'];
let ri=0,ci=0,del=false;const typed=$('#typed');
(function type(){
  const w=roles[ri];ci+=del?-1:1;typed.textContent=w.slice(0,ci);
  let t=del?35:70;
  if(!del&&ci===w.length){del=true;t=1400}
  else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;t=300}
  setTimeout(type,t);
})();

// reveal, skill bars, counters
const counted=new WeakSet();
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('in');
  $$('.bar i',e.target).forEach(b=>b.style.width=b.dataset.w+'%');
  io.unobserve(e.target);
}),{threshold:.15});
$$('.reveal').forEach(el=>io.observe(el));

const countIO=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting||counted.has(e.target))return;
  counted.add(e.target);
  const el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||'',t0=performance.now();
  (function step(t){
    const p=Math.min((t-t0)/1500,1);
    el.textContent=Math.round(end*(1-Math.pow(1-p,3)))+(p===1?suf:'');
    if(p<1)requestAnimationFrame(step);
  })(t0);
}),{threshold:.6});
$$('[data-count]').forEach(el=>countIO.observe(el));

// nav: scroll state, progress, active link, glow
const nav=$('#nav'),links=$$('#menu a[href^="#"]'),secs=links.map(a=>$(a.getAttribute('href')));
addEventListener('scroll',()=>{
  const h=document.documentElement;
  $('#progress').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
  nav.classList.toggle('scrolled',scrollY>40);
  const y=scrollY+200;
  secs.forEach((s,i)=>links[i].classList.toggle('active',s.offsetTop<=y&&s.offsetTop+s.offsetHeight>y));
},{passive:true});
addEventListener('pointermove',e=>{const g=$('#glow');g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'});

// mobile menu
$('#burger').onclick=()=>$('#menu').classList.toggle('open');
links.forEach(a=>a.addEventListener('click',()=>$('#menu').classList.remove('open')));

// 3D tilt on hero photo
const tilt=$('.tilt');
tilt.addEventListener('pointermove',e=>{
  const r=tilt.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  tilt.style.transform=`perspective(800px) rotateY(${x*14}deg) rotateX(${-y*14}deg)`;
});
tilt.addEventListener('pointerleave',()=>tilt.style.transform='');

// flip cards for touch
$$('.flip').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('on')));

// lightbox
const lb=$('#lightbox'),lbi=$('img',lb);
$$('.grid img').forEach(i=>i.addEventListener('click',()=>{lbi.src=i.src;lbi.alt=i.alt;lb.classList.add('open')}));
lb.addEventListener('click',()=>lb.classList.remove('open'));
addEventListener('keydown',e=>e.key==='Escape'&&lb.classList.remove('open'));

// copy email
$('#copyBtn').onclick=async function(){
  try{await navigator.clipboard.writeText('contact.mirajpoudel@gmail.com');this.textContent='Copied ✓'}
  catch{this.textContent='Press Ctrl+C on the email above'}
  setTimeout(()=>this.textContent='Copy email',2200);
};
$('#yr').textContent=new Date().getFullYear();
