'use strict';
const $=id=>document.getElementById(id);
const packages={single:'Одна карточка · 100 Stars',triple:'Три оформления одного товара · 270 Stars',five:'Пять оформлений одного товара · 400 Stars',banner:'Рекламный баннер · 150 Stars'};
for(const button of document.querySelectorAll('.select-package'))button.addEventListener('click',()=>{
  $('package').value=button.dataset.package;
  $('brief-result').hidden=true;
  $('form-status').textContent='Выбран формат: '+packages[button.dataset.package];
  $('brief').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  $('product').focus({preventScroll:true});
});
const names={'1':'Графит & лайм','2':'Тёплый минимализм','3':'Глубокий синий'};
let lastTrigger=null;
for(const button of document.querySelectorAll('.work-card'))button.addEventListener('click',()=>{
  lastTrigger=button;
  const id=button.dataset.image;
  $('dialog-title').textContent=names[id]+' · демопример';
  $('dialog-image').src='assets/card-'+id+'.png';
  $('dialog-image').alt='Демонстрационная карточка: '+names[id];
  $('work-dialog').showModal();
});
$('close-dialog').addEventListener('click',()=>$('work-dialog').close());
$('work-dialog').addEventListener('click',e=>{if(e.target===$('work-dialog')){const rect=$('work-dialog').getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)$('work-dialog').close();}});
$('work-dialog').addEventListener('close',()=>lastTrigger?.focus());
function clearBrief(){if(!$('brief-result').hidden){$('brief-result').hidden=true;$('brief-text').value='';$('form-status').textContent='Бриф изменён. Нажмите «Подготовить бриф» ещё раз.';}}
for(const id of ['package','product','product-price','details'])$(id).addEventListener('input',clearBrief);
$('brief-form').addEventListener('submit',e=>{
  e.preventDefault();
  const product=$('product').value.trim(),details=$('details').value.trim();
  if(!product||details.length<10){$('form-status').textContent='Укажите название и минимум 10 символов характеристик.';return;}
  const text=['Здравствуйте! Хочу заказать оформление в FormaNest Studio.','Формат: '+packages[$('package').value],'Название: '+product,'Цена для надписи: '+($('product-price').value.trim()||'Без цены'),'Характеристики и пожелания: '+details,'Фото товара приложу отдельным сообщением.','Прошу показать превью и подтвердить актуальные условия перед оплатой.'].join('\n');
  $('brief-text').value=text;$('brief-result').hidden=false;
  $('form-status').textContent='Бриф готов. Заявка ещё не отправлена: скопируйте текст и отправьте его в Telegram вместе с фото.';
});
$('copy-brief').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText($('brief-text').value);$('form-status').textContent='Бриф скопирован. Откройте бот и отправьте текст вместе с фото.';}
  catch{$('brief-text').focus();$('brief-text').select();$('form-status').textContent='Автокопирование недоступно. Текст выделен — скопируйте его вручную.';}
});

