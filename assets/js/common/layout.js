/* Nạp component và tạo menu theo phiên đăng nhập. */
const Layout={
  links(root){$(root).find('[data-link]').each(function(){this.href=CONFIG.BASE_URL+this.dataset.link;if(this.href===location.href.split('?')[0])this.setAttribute('aria-current','page');});},
  renderMenu(){const menu=$('#role-menu').empty();const user=Auth.currentUser();const add=(label,path)=>$('<a>').text(label).attr('href',CONFIG.BASE_URL+path).appendTo(menu);
    if(!user){add('Trang chủ','index.html');add('Khóa học','pages/student/courses.html');add('Đăng nhập','pages/auth/login.html');add('Đăng ký','pages/auth/register.html');return;}
    add('Tổng quan',CONFIG.DASHBOARDS[user.role]);
    const links={student:[['Khóa học','courses'],['Khóa học của tôi','my-courses'],['Kết quả','grades']],instructor:[['Khóa học','courses'],['Bài kiểm tra','quizzes'],['Học viên','students']],admin:[['Người dùng','users'],['Khóa học','courses'],['Danh mục','categories']]};
    links[user.role].forEach(([label,path])=>add(label,'pages/'+user.role+'/'+path+'.html'));add(user.name,'pages/auth/profile.html');$('<button class="btn btn-outline btn-sm" data-logout>').text('Đăng xuất').appendTo(menu);
  },
  load(){const user=Auth.currentUser();$('#header').load(CONFIG.BASE_URL+'components/header.html',function(){Layout.links(this);Layout.renderMenu();});$('#footer').load(CONFIG.BASE_URL+'components/footer.html');if(user&&['admin','instructor'].includes(user.role))$('#sidebar').load(CONFIG.BASE_URL+'components/sidebar-'+user.role+'.html',function(){Layout.links(this);});}
};
$(function(){ $(document).on('click','[data-logout]',()=>Auth.logout());DB.ready.then(()=>{
  const path=location.pathname;const match=path.match(/\/pages\/(student|instructor|admin)\/([^/]+)\.html$/);const publicStudent=match&&match[1]==='student'&&['courses','course-detail'].includes(match[2]);
  if(match&&!publicStudent&&!Auth.requireRole(match[1]))return;
  Layout.load();
}).catch(err=>Toast.error(err.message+' — hãy chạy bằng máy chủ HTTP.')); });
