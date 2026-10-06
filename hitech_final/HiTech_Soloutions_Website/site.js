(() => {
'use strict';
const config = window.HITECH_STORE || {};
const product = config.product || {id:'hitech-mini-printer',name:'HiTech Pocket Mini Thermal Printer',price:null,available:true};
const storeKey = 'hitech.soloutions.cart.v1';
let memoryCart = { quantity: 0 }; // Fallback for browsers that restrict file:// localStorage.
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const money = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0
  ? new Intl.NumberFormat('en-PK',{style:'currency',currency:'PKR',maximumFractionDigits:0}).format(value)
  : 'Price on request';
const saneInt = (value) => Math.max(1, Math.min(25, Math.floor(Number(value)||1)));
function cartRead(){ try { const raw=JSON.parse(localStorage.getItem(storeKey)||'{}'); return {quantity:Math.max(0,Math.min(25,Math.floor(Number(raw.quantity)||0))) }; } catch { return {...memoryCart}; } }
function cartWrite(cart){memoryCart={...cart};try{localStorage.setItem(storeKey,JSON.stringify(cart));}catch{} updateCartViews();}
function updateCartViews(){
 const cart=cartRead();
 $$('[data-cart-count]').forEach(el=>{el.textContent=String(cart.quantity);el.hidden=!cart.quantity;});
 $$('[data-cart-qty]').forEach(el=>el.textContent=String(cart.quantity));
 $$('[data-cart-subtotal]').forEach(el=>el.textContent=product.price==null?'To be confirmed':money(product.price*cart.quantity));
 $$('[data-cart-empty]').forEach(el=>el.hidden=cart.quantity>0);
 $$('[data-cart-filled]').forEach(el=>el.hidden=cart.quantity===0);
 $$('[data-cart-qty-input]').forEach(el=>{el.value=String(Math.max(1,cart.quantity));});
 $$('[data-purchase-price]').forEach(el=>el.textContent=money(product.price));
 $$('[data-priced-hint]').forEach(el=>el.textContent=product.price==null?'Final price will be confirmed before ordering.':'Taxes and shipping calculated by your configured commerce provider.');
 const state=$('[data-commerce-state]'); if(state) state.textContent=(config.commerce?.checkoutEnabled && config.commerce?.checkoutUrl && product.price!=null)?'Checkout is configured.':'Live checkout has not been connected yet. You cannot place or pay for an order in this preview.';
}
function toast(message){
 const el=$('[data-toast]'); if(!el)return;
 el.textContent=message; el.classList.add('show');clearTimeout(window.__hitechToast);window.__hitechToast=setTimeout(()=>el.classList.remove('show'),3300);
}
function addCart(qty=1){const cart=cartRead();cart.quantity=Math.min(25,cart.quantity+saneInt(qty));cartWrite(cart);toast('Added to your cart.');}
function openDrawer(){const d=$('[data-cart-drawer]');const o=$('[data-drawer-overlay]');if(!d||!o)return;d.classList.add('is-open');o.classList.add('is-open');d.setAttribute('aria-hidden','false');document.body.classList.add('drawer-open');$('[data-close-cart]')?.focus();}
function closeDrawer(){const d=$('[data-cart-drawer]');const o=$('[data-drawer-overlay]');d?.classList.remove('is-open');o?.classList.remove('is-open');d?.setAttribute('aria-hidden','true');document.body.classList.remove('drawer-open');}
function initCart(){
 $$('[data-add-cart]').forEach(button=>button.addEventListener('click',()=>{const input=$('[data-product-qty]');addCart(input?saneInt(input.value):1);openDrawer();}));
 $$('[data-open-cart]').forEach(button=>button.addEventListener('click',openDrawer));
 $$('[data-close-cart]').forEach(button=>button.addEventListener('click',closeDrawer));
 $('[data-drawer-overlay]')?.addEventListener('click',closeDrawer);
 $$('[data-cart-increase]').forEach(button=>button.addEventListener('click',()=>{const c=cartRead(); c.quantity=Math.min(25,c.quantity+1);cartWrite(c);}));
 $$('[data-cart-decrease]').forEach(button=>button.addEventListener('click',()=>{const c=cartRead(); c.quantity=Math.max(0,c.quantity-1);cartWrite(c);}));
 $$('[data-cart-remove]').forEach(button=>button.addEventListener('click',()=>{cartWrite({quantity:0});toast('Removed from cart.');}));
 $$('[data-qty-inc]').forEach(button=>button.addEventListener('click',()=>{const x=$('[data-product-qty]'); if(x)x.value=String(Math.min(25,saneInt(x.value)+1));}));
 $$('[data-qty-dec]').forEach(button=>button.addEventListener('click',()=>{const x=$('[data-product-qty]'); if(x)x.value=String(Math.max(1,saneInt(x.value)-1));}));
 $$('[data-checkout-link]').forEach(a=>a.addEventListener('click',e=>{if(cartRead().quantity===0){e.preventDefault();toast('Add your printer to the cart first.');}}));
 const checkout=$('[data-confirm-checkout]');if(checkout)checkout.addEventListener('click',()=>{
  const ready=product.price!=null && config.commerce?.checkoutEnabled && config.commerce?.checkoutUrl;
  if(!ready){toast('Live checkout requires your verified product price and payment provider.');return;}
  // Never create a payment; redirect only to an owner-configured provider URL.
  window.location.assign(config.commerce.checkoutUrl);
 });
 updateCartViews();
 window.addEventListener('storage',updateCartViews);
}
function initNav(){
 const menu=$('[data-mobile-menu]');const button=$('[data-menu-button]');
 const close=()=>{menu?.classList.remove('is-open');button?.setAttribute('aria-expanded','false');};
 button?.addEventListener('click',()=>{const open=menu.classList.toggle('is-open');button.setAttribute('aria-expanded',String(open));});
 $$('[data-mobile-menu] a').forEach(a=>a.addEventListener('click',close));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();closeDrawer();}});
 const header=$('[data-header]');let last=false;
 const onscroll=()=>{const yes=window.scrollY>10;if(yes!==last){header?.classList.toggle('scrolled',yes);last=yes;}};
 window.addEventListener('scroll',onscroll,{passive:true});onscroll();
}
function initSolutionTabs(){
 const tabs=$$('[data-use-tab]');const title=$('[data-use-title]');const body=$('[data-use-copy]');const visual=$('[data-use-image]');const action=$('[data-use-link]');
 if(!tabs.length||!title||!body||!visual)return;
 const data={
  study:{title:'Less cramming. More clarity.',copy:'Turn revision notes, checklists, and ideas into handy monochrome prints you can keep close.',image:'assets/use-study.webp',link:'solutions.html#students'},
  organize:{title:'Everything in its place.',copy:'From pantry jars to storage boxes, simple labels make your everyday spaces easier to navigate.',image:'assets/use-kitchen.webp',link:'solutions.html#home'},
  work:{title:'Little details, big difference.',copy:'Add personal thank-you notes and organize small-business supplies without a bulky setup.',image:'assets/use-business.webp',link:'solutions.html#business'},
  remember:{title:'Keep moments off-screen.',copy:'Make little monochrome keepsakes for journals, scrapbooks, and memorable gifts.',image:'assets/use-memories.webp',link:'solutions.html#creative'}
 };
 tabs.forEach(tab=>tab.addEventListener('click',()=>{
  const entry=data[tab.dataset.useTab];if(!entry)return;
  tabs.forEach(t=>{const chosen=t===tab;t.classList.toggle('active',chosen);t.setAttribute('aria-selected',String(chosen));t.tabIndex=chosen?0:-1;});
  title.textContent=entry.title;body.textContent=entry.copy;visual.src=entry.image;visual.alt=entry.title+' — illustrative HiTech printer use case'; if(action)action.href=entry.link;
 }));
}
function initGallery(){const main=$('[data-gallery-main]');if(!main)return;
 $$('[data-gallery-thumb]').forEach(b=>b.addEventListener('click',()=>{$$('[data-gallery-thumb]').forEach(x=>x.classList.toggle('active',x===b));main.src=b.dataset.galleryThumb;main.alt=b.dataset.alt||'HiTech mini thermal printer lifestyle illustration';}));
}
function initCopyForm(){const form=$('[data-inquiry-form]');if(!form)return;
 form.addEventListener('submit',async(e)=>{
  e.preventDefault();if(!form.reportValidity())return;
  const name=String(form.elements.namedItem('name')?.value||'').trim();
  const topic=String(form.elements.namedItem('topic')?.value||'').trim();
  const message=String(form.elements.namedItem('message')?.value||'').trim();
  const value=`HiTech Soloutions inquiry\nName: ${name}\nTopic: ${topic}\nMessage: ${message}`;
  const out=$('[data-inquiry-output]');if(out){out.hidden=false;out.textContent=value;}
  try {await navigator.clipboard.writeText(value);toast('Inquiry copied. Send it through your preferred contact channel.');}
  catch {toast('Inquiry prepared below. Copy it to your preferred contact app.');}
 });
}
function initContact(){const ct=config.contact||{};const hasWhatsapp=/^\d{10,16}$/.test(ct.whatsapp||'');
 $$('[data-whatsapp]').forEach(a=>{if(hasWhatsapp){a.href=`https://wa.me/${ct.whatsapp}?text=${encodeURIComponent('Hello HiTech Soloutions, I would like to know more about the mini printer.')}`;a.hidden=false;}else{a.hidden=true;}});
 $$('[data-email]').forEach(el=>{if(ct.email){el.textContent=ct.email;if(el.tagName==='A')el.href='mailto:'+ct.email;}else{el.textContent='Email will be added before launch.';if(el.tagName==='A')el.removeAttribute('href');}});
 $$('[data-phone]').forEach(el=>{if(ct.phone){el.textContent=ct.phone;if(el.tagName==='A')el.href='tel:'+ct.phone;}else{el.textContent='Phone will be added before launch.';if(el.tagName==='A')el.removeAttribute('href');}});
}
function initReveal(){if(!('IntersectionObserver' in window))return;
 const obs=new IntersectionObserver((entries,o)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target);}}),{threshold:.08});
 $$('.reveal').forEach(el=>obs.observe(el));
}
function initProgress(){const bar=$('[data-progress]');if(!bar)return;window.addEventListener('scroll',()=>{const range=document.documentElement.scrollHeight-window.innerHeight;bar.style.width=range>0?String(Math.min(100,window.scrollY/range*100))+'%':'0%';},{passive:true});}
function initYear(){$$('[data-year]').forEach(el=>el.textContent=String(new Date().getFullYear()));}
initNav();initCart();initSolutionTabs();initGallery();initCopyForm();initContact();initReveal();initProgress();initYear();
})();
