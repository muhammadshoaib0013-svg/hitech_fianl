from pathlib import Path
from bs4 import BeautifulSoup
from base64 import b64encode
from playwright.sync_api import sync_playwright
root=Path(__file__).parent

def page_markup(file):
 soup=BeautifulSoup((root/file).read_text(),'html.parser')
 for e in soup.select('script[src],link[rel=stylesheet],link[href^="https://"]'):e.decompose()
 style=soup.new_tag('style');style.string=(root/'styles.css').read_text();soup.head.append(style)
 for im in soup.select('img[src^="assets/"]'):
  im['src']='data:image/webp;base64,'+b64encode((root/im['src']).read_bytes()).decode()
 for el in soup.select('[data-gallery-thumb]'):
  v=el.get('data-gallery-thumb','')
  if v.startswith('assets/'):
   el['data-gallery-thumb']='data:image/webp;base64,'+b64encode((root/v).read_bytes()).decode()
 return str(soup)

def mount(page,file):
 page.set_content(page_markup(file),wait_until='domcontentloaded')
 page.evaluate('''() => {let a={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>a[k]||null,setItem:(k,v)=>{a[k]=String(v)},removeItem:k=>delete a[k]}})}''')
 page.add_script_tag(content=(root/'site.config.js').read_text())
 js=(root/'site.js').read_text()
 for name in ['use-study','use-kitchen','use-business','use-memories']:
  src='assets/'+name+'.webp';js=js.replace(src,'data:image/webp;base64,'+b64encode((root/src).read_bytes()).decode())
 page.add_script_tag(content=js)

errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w,h,kind in [(1440,900,'desktop'),(390,844,'mobile')]:
  pg=b.new_page(viewport={'width':w,'height':h})
  pg.on('pageerror',lambda err: errors.append(str(err)))
  mount(pg,'index.html')
  print(kind,'title:',pg.title(),flush=True)
  assert pg.locator('h1').count()==1
  assert pg.locator('.hero-image-wrap img').evaluate('(e)=>e.complete&&e.naturalWidth>0')
  overflow=pg.evaluate('document.documentElement.scrollWidth>window.innerWidth')
  print(kind,'horizontal overflow:',overflow,flush=True)
  assert not overflow
  pg.screenshot(path=str(root/f'preview_{kind}_viewport.png'),animations='disabled')
  pg.locator('[data-use-tab="organize"]').evaluate('(e)=>e.click()')
  assert 'Everything in its place' in pg.locator('[data-use-title]').inner_text()
  if kind=='mobile':
   pg.locator('[data-menu-button]').evaluate('(e)=>e.click()')
   assert pg.locator('[data-mobile-menu]').evaluate('(e)=>e.classList.contains("is-open")')
  print(kind,'tabs/menu tests passed',flush=True)
  pg.close()
 pg=b.new_page(viewport={'width':1366,'height':860})
 pg.on('pageerror',lambda err: errors.append(str(err)))
 mount(pg,'product.html')
 pg.locator('[data-gallery-thumb]').nth(1).evaluate('(e)=>e.click()')
 assert 'Dark' in pg.locator('[data-gallery-main]').get_attribute('alt')
 pg.locator('[data-qty-inc]').evaluate('(e)=>e.click()')
 pg.locator('[data-add-cart]').evaluate('(e)=>e.click()')
 qty=pg.locator('[data-cart-qty-input]').first.input_value()
 assert qty=='2',qty
 assert pg.locator('[data-cart-drawer]').evaluate('(e)=>e.classList.contains("is-open")')
 print('product gallery and cart quantity:',qty,'PASS',flush=True)
 pg.screenshot(path=str(root/'preview_product_viewport.png'),animations='disabled')
 pg.close()
 pg=b.new_page()
 pg.on('pageerror',lambda err: errors.append(str(err)))
 mount(pg,'checkout.html')
 assert 'not been connected' in pg.locator('[data-commerce-state]').inner_text()
 pg.locator('[data-confirm-checkout]').evaluate('(e)=>e.click()')
 assert 'requires your verified product price' in pg.locator('[data-toast]').inner_text()
 print('Checkout guard: PASS',flush=True)
 pg.close()
 print('Uncaught browser JS errors:',errors,flush=True)
 b.close()
 assert not errors
print('FINAL QA PASS',flush=True)
