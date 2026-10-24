'use strict';
const $=id=>document.getElementById(id);
const packages={single:'Одна карточка · 100 Stars',triple:'Три оформления одного товара · 270 Stars',five:'Пять оформлений одного товара · 400 Stars',banner:'Рекламный баннер · 150 Stars'};
for(const button of document.querySelectorAll('.select-package'))button.addEventListener('click',()=>{
  $('package').value=button.dataset.package;
  clearBrief();
  $('form-status').textContent='Выбран формат: '+packages[button.dataset.package];
  $('brief').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  $('product').focus({preventScroll:true});
});
const portfolio={"coffee": {"title": "Графит & лайм", "image": "assets/card-1.png", "note": "Макет из демоархива бота. Не клиентский заказ."}, "candle": {"title": "Тёплый свет", "image": "assets/portfolio-candle.webp", "note": "Фото сгенерировано ИИ для портфолио. Бот оформляет исходные фото; это не клиентский заказ."}, "serum": {"title": "Чистая эстетика", "image": "assets/portfolio-serum.webp", "note": "Фото сгенерировано ИИ для портфолио. Бот оформляет исходные фото; это не клиентский заказ."}, "headphones": {"title": "В своём ритме", "image": "assets/portfolio-headphones.webp", "note": "Фото сгенерировано ИИ для портфолио. Бот оформляет исходные фото; это не клиентский заказ."}, "ceramic": {"title": "Медленное утро", "image": "assets/portfolio-ceramic.webp", "note": "Фото сгенерировано ИИ для портфолио. Бот оформляет исходные фото; это не клиентский заказ."}, "sneakers": {"title": "Новый маршрут", "image": "assets/portfolio-sneakers.webp", "note": "Фото сгенерировано ИИ для портфолио. Бот оформляет исходные фото; это не клиентский заказ."}};
Object.assign(portfolio, {
  mug: {title:'Тихое утро',image:'assets/demo-mug.webp',note:'Demo / Concept. Вымышленный товар, изображение создано ИИ; не клиентский заказ и не результат автоматической выдачи бота.'},
  audio: {title:'Чистый ритм',image:'assets/demo-headphones.webp',note:'Demo / Concept. Вымышленные наушники, изображение создано ИИ; свойства реального товара не утверждаются.'},
  warmth: {title:'Тёплый акцент',image:'assets/demo-candle.webp',note:'Demo / Concept. Вымышленная свеча, изображение создано ИИ; не подтверждение состава или длительности горения.'},
  coffee2: {title:'Второй макет бота',image:'assets/card-2.png',note:'Сохранённый демонстрационный макет бота, не клиентский заказ. Цена на изображении относится к условному товару, не услуге.'}
});
let lastTrigger=null;
for(const button of document.querySelectorAll('.work-card'))button.addEventListener('click',()=>{
  lastTrigger=button;
  const id=button.dataset.image;
  const item=portfolio[id];
  if(!item)return;
  $('dialog-title').textContent=item.title+' · демопример';
  $('dialog-image').src=item.image;
  $('dialog-image').alt='Демонстрационный пример: '+item.title;
  $('dialog-provenance').textContent=item.note;
  $('work-dialog').showModal();
});
$('close-dialog').addEventListener('click',()=>$('work-dialog').close());
$('work-dialog').addEventListener('click',e=>{if(e.target===$('work-dialog')){const rect=$('work-dialog').getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)$('work-dialog').close();}});
$('work-dialog').addEventListener('close',()=>lastTrigger?.focus());
const packageService={single:'single',triple:'three',five:'five',banner:'banner'};
const packageLabel={single:'Одна карточка',triple:'Три оформления',five:'Пять оформлений',banner:'Баннер'};
let preparedPayload=null;
const webApp=window.Telegram?.WebApp;
const keyboardLaunch=new URLSearchParams(location.search).get('from')==='bot_keyboard' && webApp && webApp.platform && webApp.platform!=='unknown' && !webApp.initDataUnsafe?.query_id;
if(keyboardLaunch){webApp.ready();webApp.expand();}
function clearBrief(){
  preparedPayload=null;
  if(!$('brief-result').hidden){$('brief-result').hidden=true;$('brief-text').value='';$('form-status').textContent='Бриф изменён. Нажмите «Проверить бриф» ещё раз.';}
}
for(const id of ['package','product','product-price','details'])$(id).addEventListener('input',clearBrief);
$('brief-form').addEventListener('submit',e=>{
  e.preventDefault();
  const product=$('product').value.trim().replace(/\s+/g,' '),details=$('details').value.trim();
  const price=$('product-price').value.trim().replace(/\s+/g,' ')||'Без цены';
  const selected=$('package').value;
  if(!product||product.length>100||price.length>60||details.length<10||details.length>1500||!packageService[selected]){$('form-status').textContent='Проверьте название, цену для надписи и описание (10–1500 символов).';return;}
  const payload={type:'formanest_brief',v:1,request_id:preparedPayload&&preparedPayload.service===packageService[selected]&&preparedPayload.title===product&&preparedPayload.product_price===price&&preparedPayload.description===details?preparedPayload.request_id:crypto.randomUUID(),service:packageService[selected],title:product,product_price:price,description:details};
  const json=JSON.stringify(payload);
  if(new TextEncoder().encode(json).length>4096){$('form-status').textContent='Бриф слишком длинный для Telegram. Сократите описание и попробуйте ещё раз.';return;}
  preparedPayload=payload;
  const text=['Заявка с сайта FormaNest','Код заявки: '+payload.request_id,'Формат: '+packageLabel[selected],'Название: '+product,'Цена для надписи: '+price,'Характеристики и пожелания:',details].join('\n');
  $('brief-text').value=text;$('brief-result').hidden=false;
  const draftURL='https://t.me/FormaNestStudio_bot?text='+encodeURIComponent(text);
  $('telegram-draft-link').href=draftURL;
  $('telegram-draft-link').hidden=Boolean(keyboardLaunch)||draftURL.length>8000;
  $('send-brief').hidden=!keyboardLaunch;
  $('send-brief').disabled=false;
  $('form-status').textContent=keyboardLaunch?'Бриф готов. Нажмите «Отправить заявку в бот». Подтверждение приёма появится в чате.':draftURL.length>8000?'Бриф готов, но ссылка получилась слишком длинной. Скопируйте текст и отправьте его в бот.':'Бриф готов. «Передать в Telegram» откроет черновик в чате. Нажмите там «Отправить» и дождитесь ответа бота.';
});
$('send-brief').addEventListener('click',()=>{
  if(!preparedPayload||!keyboardLaunch){$('form-status').textContent='Сначала проверьте бриф. Для прямой отправки откройте форму кнопкой «Заявка с сайта» в боте.';return;}
  $('send-brief').disabled=true;
  try{webApp.sendData(JSON.stringify(preparedPayload));$('form-status').textContent='Данные переданы в Telegram. Приём заявки подтверждает сообщение бота в чате.';}
  catch{$('send-brief').disabled=false;$('telegram-draft-link').hidden=false;$('form-status').textContent='Прямая передача не удалась. Скопируйте бриф или откройте черновик в Telegram.';}
});
$('copy-brief').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText($('brief-text').value);$('form-status').textContent='Бриф скопирован. Отправьте его в @FormaNestStudio_bot и дождитесь подтверждения.';}
  catch{$('brief-text').focus();$('brief-text').select();$('form-status').textContent='Автокопирование недоступно. Текст выделен — скопируйте его вручную.';}
});

// Fade carousel respects reduced motion, focus, hover and background tabs.
const gallery=$('hero-gallery');
if(gallery){
  const slides=Array.from(document.querySelectorAll('.hero-slide'));
  const dots=Array.from(document.querySelectorAll('.hero-dot'));
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let index=0,paused=motion.matches,hovered=false,focused=false;
  function pause(value){paused=value;if(!value){hovered=false;focused=false;}$('hero-pause').textContent=paused?'Продолжить':'Пауза';$('hero-pause').setAttribute('aria-pressed',String(paused));}
  function show(next){index=(next+slides.length)%slides.length;slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===index);slide.setAttribute('aria-hidden',String(i!==index));});dots.forEach((dot,i)=>{dot.classList.toggle('is-active',i===index);dot.setAttribute('aria-pressed',String(i===index));});$('hero-count').textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');}
  $('hero-next').addEventListener('click',()=>{pause(true);show(index+1);});
  $('hero-prev').addEventListener('click',()=>{pause(true);show(index-1);});
  $('hero-pause').addEventListener('click',()=>pause(!paused));
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{pause(true);show(i);}));
  gallery.addEventListener('mouseenter',()=>hovered=true);gallery.addEventListener('mouseleave',()=>hovered=false);
  gallery.addEventListener('focusin',()=>focused=true);gallery.addEventListener('focusout',e=>{if(!gallery.contains(e.relatedTarget))focused=false;});
  gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();pause(true);show(index+(e.key==='ArrowRight'?1:-1));}});
  motion.addEventListener?.('change',e=>{if(e.matches)pause(true);});
  pause(paused);show(0);
  setInterval(()=>{if(!paused&&!hovered&&!focused&&!document.hidden)show(index+1);},5500);
}
