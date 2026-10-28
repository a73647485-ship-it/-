'use strict';
const $=id=>document.getElementById(id);
for(const sample of document.querySelectorAll('[data-sample]')){
  for(const button of sample.querySelectorAll('[data-preview]'))button.addEventListener('click',()=>{
    const choice=Number(button.dataset.preview),kind=sample.dataset.sample;
    if(!['card','banner'].includes(kind)||![1,2,3].includes(choice))return;
    const path=`assets/actual-${kind}-preview${choice===1?'':'-'+choice}.png`;
    sample.querySelector('img').src=path;
    sample.querySelector('a').href=path;
    for(const item of sample.querySelectorAll('[data-preview]'))item.setAttribute('aria-pressed',String(item===button));
  });
}
const packages=Object.freeze({single:'Одна карточка · 140 Stars',banner:'Рекламный баннер · 200 Stars'});
for(const button of document.querySelectorAll('.select-package'))button.addEventListener('click',()=>{
  if(!Object.hasOwn(packages,button.dataset.package))return;
  $('package').value=button.dataset.package;
  syncPackageButtons();
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
const packageService=Object.freeze({single:'single',banner:'banner'});
const packageLabel=Object.freeze({single:'Одна карточка',banner:'Баннер'});
let preparedPayload=null;
let submittedRequestId=null;
function syncPackageButtons(){for(const button of document.querySelectorAll('[data-brief-package]'))button.setAttribute('aria-pressed',String(button.dataset.briefPackage===$('package').value));}
for(const button of document.querySelectorAll('[data-brief-package]'))button.addEventListener('click',()=>{if(!Object.hasOwn(packages,button.dataset.briefPackage))return;$('package').value=button.dataset.briefPackage;clearBrief();syncPackageButtons();$('form-status').textContent='Выбран формат: '+packages[button.dataset.briefPackage];});
$('package').addEventListener('change',syncPackageButtons);
$('details').addEventListener('input',()=>{$('details-counter').textContent=$('details').value.length+' / 1500 символов';});
$('without-price').addEventListener('click',()=>{$('product-price').value='Без цены';clearBrief();$('form-status').textContent='На изображении не будет цены товара. Стоимость услуги указана отдельно.';});
$('brief-example').addEventListener('click',()=>{$('product').value='Кружка · DEMO';$('product-price').value='Без цены';$('details').value='Демонстрационный макет. Не клиентский заказ. Текст: «Моя любимая кружка». Без выдуманных характеристик.';clearBrief();$('details-counter').textContent=$('details').value.length+' / 1500 символов';$('form-status').textContent='Это пример. Замените название и факты на данные своего товара перед отправкой.';});
$('brief-reset').addEventListener('click',()=>{$('brief-form').reset();clearBrief();syncPackageButtons();$('details-counter').textContent='0 / 1500 символов';$('form-status').textContent='Форма очищена. Можно начать новое задание.';});
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
  if(!product||product.length>100||price.length>60||details.length<10||details.length>1500||!Object.hasOwn(packageService,selected)){$('form-status').textContent='Проверьте название, цену для надписи и описание (10–1500 символов).';return;}
  const payload={type:'formanest_brief',v:1,request_id:preparedPayload&&preparedPayload.service===packageService[selected]&&preparedPayload.title===product&&preparedPayload.product_price===price&&preparedPayload.description===details?preparedPayload.request_id:crypto.randomUUID(),service:packageService[selected],title:product,product_price:price,description:details};
  const json=JSON.stringify(payload);
  if(new TextEncoder().encode(json).length>4096){$('form-status').textContent='Бриф слишком длинный для Telegram. Сократите описание и попробуйте ещё раз.';return;}
  preparedPayload=payload;
  const text=['Заявка с сайта FormaNest','Код заявки: '+payload.request_id,'Формат: '+packageLabel[selected],'Название: '+product,'Цена для надписи: '+price,'Характеристики и пожелания:',details].join('\n');
  if(new TextEncoder().encode(text).length>4096){preparedPayload=null;$('form-status').textContent='Текстовый бриф превышает лимит Telegram. Сократите описание и проверьте ещё раз.';return;}
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
  if(submittedRequestId===preparedPayload.request_id){$('form-status').textContent='Этот бриф уже передавался. Проверьте ответ бота в чате; повторная отправка отключена.';return;}
  submittedRequestId=preparedPayload.request_id;
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



