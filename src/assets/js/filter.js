const DATA=(value)=>{
  let date = new Date(1398250549490);
  let Y,M,D,h,m,s;
  Y = date.getFullYear() + '-';
  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  D = date.getDate() + ' ';
  h = date.getHours() + ':';
  m = date.getMinutes() + ':';
  s = date.getSeconds(); 
  return Y+M+D+h+m+s;
}
export default {
  DATA
}
