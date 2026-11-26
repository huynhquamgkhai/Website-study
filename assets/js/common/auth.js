/* Xác thực mô phỏng; không sử dụng cho hệ thống thật. */
const Auth = {
  validEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);},
  register(data){
    const role=data.role, name=String(data.name||'').trim(), email=String(data.email||'').trim().toLowerCase(), password=String(data.password||'');
    if(!['student','instructor'].includes(role))throw Error('Vai trò đăng ký không hợp lệ.');
    if(!name)throw Error('Vui lòng nhập họ tên.');
    if(!this.validEmail(email))throw Error('Email không hợp lệ.');
    if(password.length<6)throw Error('Mật khẩu phải có ít nhất 6 ký tự.');
    if(data.confirmPassword!==undefined && password!==data.confirmPassword)throw Error('Mật khẩu xác nhận không khớp.');
    if(DB.get('users').some(u=>u.email.toLowerCase()===email))throw Error('Email đã tồn tại.');
    const user={id:uid(),name,email,password,role,status:role==='instructor'?'pending':'active',createdAt:new Date().toISOString()};
    if(role==='instructor') {user.specialty=String(data.specialty||'').trim();user.bio=String(data.bio||'').trim();if(!user.specialty||!user.bio)throw Error('Vui lòng nhập chuyên môn và giới thiệu.');}
    DB.add('users',user);return this.publicUser(user);
  },
  publicUser(user){if(!user)return null;const {password,...safe}=user;return safe;},
  login(email,password){
    const user=DB.get('users').find(u=>u.email.toLowerCase()===String(email).trim().toLowerCase()&&u.password===password);
    if(!user)throw Error('Email hoặc mật khẩu không chính xác.');
    if(user.status==='locked')throw Error('Tài khoản đã bị khóa.');
    if(user.status==='pending')throw Error('Tài khoản đang chờ duyệt.');
    if(user.status!=='active'||!CONFIG.ROLES.includes(user.role))throw Error('Tài khoản không hợp lệ.');
    localStorage.setItem(CONFIG.SESSION_KEY,JSON.stringify(user.id));return this.publicUser(user);
  },
  logout(){localStorage.removeItem(CONFIG.SESSION_KEY);location.href=CONFIG.BASE_URL+'pages/auth/login.html';},
  currentUser(){let id;try{id=JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));}catch{return null;}const user=DB.get('users').find(u=>String(u.id)===String(id));return user?.status==='active'&&CONFIG.ROLES.includes(user.role)?this.publicUser(user):null;},
  requireRole(role){const user=this.currentUser();if(!user||user.role!==role){location.replace(CONFIG.BASE_URL+'pages/auth/login.html');return null;}return user;},
  requireLogin(){const user=this.currentUser();if(!user)location.replace(CONFIG.BASE_URL+'pages/auth/login.html');return user;},
  dashboard(role){return CONFIG.BASE_URL+CONFIG.DASHBOARDS[role];},
  updateProfile(data){const user=this.currentUser();if(!user)throw Error('Vui lòng đăng nhập.');const name=String(data.name||'').trim();const email=String(data.email||'').trim().toLowerCase();if(!name||!this.validEmail(email))throw Error('Họ tên hoặc email không hợp lệ.');if(DB.get('users').some(u=>String(u.id)!==String(user.id)&&u.email.toLowerCase()===email))throw Error('Email đã tồn tại.');const patch={name,email};if(user.role==='instructor'){patch.specialty=String(data.specialty||'').trim();patch.bio=String(data.bio||'').trim();if(!patch.specialty||!patch.bio)throw Error('Vui lòng nhập chuyên môn và giới thiệu.');}return this.publicUser(DB.update('users',user.id,patch));},
  changePassword(oldPassword,newPassword,confirmPassword){const user=this.currentUser();if(!user)throw Error('Vui lòng đăng nhập.');const stored=DB.get('users').find(u=>String(u.id)===String(user.id));if(stored.password!==oldPassword)throw Error('Mật khẩu hiện tại không đúng.');if(newPassword.length<6)throw Error('Mật khẩu phải có ít nhất 6 ký tự.');if(newPassword!==confirmPassword)throw Error('Mật khẩu xác nhận không khớp.');DB.update('users',user.id,{password:newPassword});return true;}
};
