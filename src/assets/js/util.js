export function computeSidebar(name,arr) {
    let resArr = [];
    if(arr.length > 0){
      for(let i = 0; i < arr.length; i++){
        if(arr[i].title === name && arr[i].children.length > 0){
          resArr = arr[i].children;
          break;
        }
      }
    }
    return resArr
}

export function computeNavbar(arr) {
    let resArr = [];
    if(arr.length > 0){
      for(let i = 0; i < arr.length; i++){
        if(arr[i].level){
          resArr.push(arr[i]);
        }
      }
    }
    return resArr
}

export function computeName(tag,arr) {
  let str = '';
    if(arr.length > 0){
      for(let i = 0; i < arr.length; i++){
        if(arr[i].children && arr[i].children.length){
          for(let j = 0; j < arr[i].children.length; j++){
            if(tag === arr[i].children[j].name){
              str = arr[i].name;
              break;
            }
          }
        }
      }
    }
    return str
}
