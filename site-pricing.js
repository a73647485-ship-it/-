(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.FormaNestPricing=api;
})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  // Display estimate only. Telegram invoices continue to use the stored XTR sum.
  const reference=Object.freeze({stars:100,cadCents:299,checkedOn:'2026-10-24',source:'https://apps.apple.com/ca/app/telegram-messenger/id686449807'});
  const services=Object.freeze({
    single:Object.freeze({title:'Одна карточка',stars:80}),
    triple:Object.freeze({title:'Три оформления',stars:210}),
    five:Object.freeze({title:'Пять оформлений',stars:320}),
    banner:Object.freeze({title:'Баннер',stars:120}),
    premium:Object.freeze({title:'Premium',stars:200})
  });
  function cents(stars){
    if(!Number.isSafeInteger(stars)||stars<0||stars>1000000)throw new RangeError('Invalid Stars amount');
    return Math.round(stars*reference.cadCents/reference.stars);
  }
  function amount(stars){return (cents(stars)/100).toFixed(2).replace('.',',');}
  function label(key){
    const item=services[key];
    if(!item)throw new RangeError('Unknown service');
    return item.title+' · ≈ '+amount(item.stars)+' CAD ('+item.stars+' Stars)';
  }
  return Object.freeze({reference,services,cents,amount,label});
});
