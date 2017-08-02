const cookie = {
  set: function (name, value, time) {
    const Days = 30;
    const exp = new Date();
    exp.setTime(exp.getTime() + Days * time * 1000);
    // document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()}`;
  },
  get: function (name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

      return unescape(arr[2]);
    else
      return null;
  },
  remove: function (name) {
    const exp = new Date();
    exp.setTime(exp.getTime() - 1);
    const cval = this.set(name);
    if (cval != null)
      // document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
      document.cookie = `${name}=${cval};expires=${exp.toGMTString()}`;
  }
}