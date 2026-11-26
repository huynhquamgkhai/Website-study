/* DB dùng trực tiếp tên key đã thống nhất. */
const DB = {
  get(key) { const raw = localStorage.getItem(key); return raw === null ? [] : JSON.parse(raw); },
  set(key,val) { localStorage.setItem(key,JSON.stringify(val)); return val; },
  add(key,item) { const rows=this.get(key); if(rows.some(x=>String(x.id)===String(item.id))) throw Error('ID đã tồn tại'); rows.push(item); this.set(key,rows); return item; },
  update(key,id,data) { const rows=this.get(key); const i=rows.findIndex(x=>String(x.id)===String(id)); if(i<0)return null; rows[i]={...rows[i],...data,id:rows[i].id}; this.set(key,rows); return rows[i]; },
  remove(key,id) { const rows=this.get(key); const next=rows.filter(x=>String(x.id)!==String(id)); this.set(key,next); return next.length!==rows.length; },
  async init() {
    await Promise.all(CONFIG.DATA_KEYS.map(async key=>{
      if(localStorage.getItem(key)!==null)return;
      const res=await fetch(CONFIG.BASE_URL+'assets/data/'+key+'.json');
      if(!res.ok)throw Error('Không tải được dữ liệu '+key);
      const data=await res.json();
      if(!Array.isArray(data))throw Error('Dữ liệu không hợp lệ: '+key);
      if(localStorage.getItem(key)===null)this.set(key,data);
    }));
  }
};
// Các trang cần chờ DB.ready trước khi đọc dữ liệu lần đầu.
DB.ready=DB.init();
DB.ready.catch(err=>console.error(err));
