function formatPrice(value){return new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(Number(value)||0);}
function formatDate(value){const d=new Date(value);return Number.isNaN(d.getTime())?'':d.toLocaleDateString('vi-VN');}
function getQueryParam(name){return new URLSearchParams(location.search).get(name);}
function uid(){return globalThis.crypto?.randomUUID?.() || 'id-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}
