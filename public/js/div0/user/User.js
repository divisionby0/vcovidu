var User = (function () {
    function User(name, password) {
        this.name = name;
        this.password = password;
    }
    User.prototype.getName = function () {
        return this.name;
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    return User;
}());
//# sourceMappingURL=User.js.map