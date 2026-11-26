/* Đường dẫn gốc dựa trên vị trí file config, không phụ thuộc trang hiện tại. */
const CONFIG = Object.freeze({
  BASE_URL: new URL('../../../', document.currentScript.src).href,
  DATA_KEYS: ['users','categories','courses','lessons','quizzes','chapters'],
  ROLES: ['student','instructor','admin'],
  SESSION_KEY: 'elearning_current_user',
  DASHBOARDS: {student:'pages/student/dashboard.html', instructor:'pages/instructor/dashboard.html', admin:'pages/admin/dashboard.html'}
});
