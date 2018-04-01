var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function lifecycleAttach(componentPrototype, attachment) {
    var mount = componentPrototype.componentWillMount;
    var unmount = componentPrototype.componentWillUnmount;
    componentPrototype.componentWillMount = function () {
        if (mount)
            mount.apply(this);
        attachment.mount(this);
    };
    componentPrototype.componentWillUnmount = function () {
        if (unmount)
            unmount.apply(this);
        attachment.unmount(this);
    };
}
function stateMutation(componentPrototype, iterableFn) {
    var mounted = true;
    function execute(component) {
        return __awaiter(this, void 0, void 0, function () {
            var iterator, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iterator = iterableFn.apply(component)[Symbol.asyncIterator]();
                        result = undefined;
                        _a.label = 1;
                    case 1:
                        if (!mounted) return [3 /*break*/, 3];
                        return [4 /*yield*/, iterator.next()];
                    case 2:
                        result = _a.sent();
                        if (mounted && result && !result.done)
                            component.setState(result.value);
                        _a.label = 3;
                    case 3:
                        if (mounted && result && !result.done) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    lifecycleAttach(componentPrototype, {
        mount: function (component) {
            execute(component).catch(console.error);
        },
        unmount: function () {
            mounted = false;
        }
    });
}
export var Mutation = function (iterable) {
    return function (target) {
        if (typeof target === 'function')
            stateMutation(target.prototype, function () { return iterable; });
        else
            console.error("@Mutation of " + target + " was not installed");
    };
};
export var mutation = function (target, key) {
    if (key !== undefined) {
        var iterable = target[key];
        if (typeof iterable === 'function') {
            stateMutation(target, iterable);
        }
        else
            console.error("@mutation of " + target.constructor.name + ":" + key + " is not a Function");
    }
    else
        console.error("@mutation of " + target.constructor.name + ":" + key + " was not installed");
};
