module.exports = {
    trim: function(data) {
      //return data.replace(/\s/g, "");
      return data.trim();
    },
    isNumber: function(data) {
      return isNaN(data);
    },
    checkN: function(data, amount) {
      return data.split(/\r\n|\r|\n/).length > amount;
    },
    email: {
      ifEmail: function(data) {
        var re = /@/;
        return re.test(data);
      },
      toLower: function(data) {
        if(data) {
          return data.toLowerCase();
        }
      },
      isValid: function(data) {
        var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return re.test(data);
      }
    }
  }
