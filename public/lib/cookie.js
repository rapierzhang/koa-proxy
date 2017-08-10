const cookie = {
  set: function (name, value) {
    const Days = 30;
    const exp = new Date();
    exp.setTime(exp.getTime() + Days  * 1000);
    document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()}`;
  },
  get: function (name) {
    let arr, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  },
  remove: function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.get(name);
    if(cval != null) {
      document.cookie = `${name}=${cval};expires=${exp.toGMTString()}`;
    }
  }
}