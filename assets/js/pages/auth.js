$(async function(){
  const form=$('#auth-form');if(!form.length)return;
  const page=form.data('page'),message=$('#auth-message');let role='student';
  function error(msg){message.css('color','var(--danger)').text(msg).removeClass('hidden');Toast.error(msg);}
  function showInstructor(show){$('#instructor-fields').toggleClass('hidden',!show).find('input,textarea').prop('disabled',!show).prop('required',show);}
  form.find('button[type=submit]').prop('disabled',true);
  try{await DB.ready;}catch(e){error(e.message);return;}
  if(page==='profile'||page==='change-password'){
    const user=Auth.requireLogin();if(!user)return;
    if(page==='profile'){role=user.role;$('#profile-meta').text('Vai trò: '+({student:'Học viên',instructor:'Giảng viên',admin:'Quản trị viên'}[role])+' · Tham gia: '+formatDate(user.createdAt));for(const key of ['name','email','specialty','bio'])$('#'+key).val(user[key]||'');showInstructor(role==='instructor');}
  }
  if(page==='register'){
    showInstructor(false);form.on('click','[data-role]',function(){role=this.dataset.role;form.find('[data-role]').removeClass('active').attr('aria-pressed','false');$(this).addClass('active').attr('aria-pressed','true');showInstructor(role==='instructor');});
  }
  form.find('button[type=submit]').prop('disabled',false);
  form.on('submit',function(e){e.preventDefault();message.addClass('hidden');form.find('.form-error').empty();const data=Object.fromEntries(new FormData(this));
    let valid=true;this.querySelectorAll('input,textarea').forEach(input=>{if(input.disabled)return;if(!input.checkValidity()){const msg=input.validity.valueMissing?'Vui lòng nhập trường này.':input.validity.typeMismatch?'Email không hợp lệ.':input.validity.tooShort?'Mật khẩu phải có ít nhất 6 ký tự.':'Giá trị không hợp lệ.';$('#error-'+input.id).text(msg);valid=false;}});
    if(data.confirmPassword!==undefined&&data.password!==data.confirmPassword){$('#error-confirmPassword').text('Mật khẩu xác nhận không khớp.');valid=false;}
    if(!valid){error('Vui lòng kiểm tra lại thông tin.');return;}
    try{
      if(page==='login'){const user=Auth.login(data.email,data.password);location.href=Auth.dashboard(user.role);}
      else if(page==='register'){Auth.register({...data,role});Toast.success(role==='instructor'?'Đăng ký thành công. Tài khoản đang chờ duyệt.':'Đăng ký thành công.');message.text(role==='instructor'?'Đăng ký thành công. Tài khoản đang chờ duyệt.':'Đăng ký thành công. Bạn có thể đăng nhập.').removeClass('hidden').css('color','var(--success)');this.reset();showInstructor(role==='instructor');}
      else if(page==='forgot-password'){if(!Auth.validEmail(data.email))throw Error('Email không hợp lệ.');Toast.success('Đã gửi yêu cầu khôi phục (giả lập). Không có email thật được gửi.');}
      else if(page==='profile'){Auth.updateProfile(data);Layout.renderMenu();Toast.success('Đã cập nhật hồ sơ.');}
      else if(page==='change-password'){Auth.changePassword(data.oldPassword,data.password,data.confirmPassword);this.reset();Toast.success('Đổi mật khẩu thành công.');}
    }catch(err){message.css('color','var(--danger)');error(err.message);}
  });
});