"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib/task");
var cheerio = require("cheerio");
var fs = require("fs");
var scriptFiles_1 = __importDefault(require("./scriptFiles"));
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var inputString, jmeterReportsPaths, allJmxFiles_1, currentJmeterPath_1, customScripts, _loop_1, _i, _a, jmeterPath, content, newhtmlPath, err_1, message;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    inputString = tl.getInput('htmlType', true);
                    if (inputString == 'bad') {
                        tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
                        return [2 /*return*/];
                    }
                    if (!(inputString == 'Jmeter')) return [3 /*break*/, 5];
                    jmeterReportsPaths = tl.getInput('JmeterReportsPath', false) || '';
                    allJmxFiles_1 = '';
                    currentJmeterPath_1 = '';
                    customScripts = '';
                    _loop_1 = function (jmeterPath) {
                        var currentJmxFile, $, dashboardScript, graphScript;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    currentJmxFile = '';
                                    if (!currentJmeterPath_1) {
                                        currentJmeterPath_1 = jmeterPath;
                                    }
                                    $ = cheerio.load(fs.readFileSync(jmeterPath + '/index.html'));
                                    $("#generalInfos > tbody > tr:nth-child(1) > td:nth-child(2)").each(function (_, element) {
                                        currentJmxFile = $(element).text().replace(/\"/g, "");
                                        if (allJmxFiles_1 == '') {
                                            allJmxFiles_1 = currentJmxFile;
                                        }
                                        else {
                                            allJmxFiles_1 = "".concat(allJmxFiles_1, ",").concat(currentJmxFile);
                                        }
                                    });
                                    if (!currentJmxFile) return [3 /*break*/, 3];
                                    return [4 /*yield*/, fs.readFileSync(jmeterPath + '/content/js/dashboard.js').toString()];
                                case 1:
                                    dashboardScript = _c.sent();
                                    return [4 /*yield*/, fs.readFileSync(jmeterPath + '/content/js/graph.js').toString()];
                                case 2:
                                    graphScript = _c.sent();
                                    customScripts = "\n                        ".concat(customScripts, "\n                        \n                        if (currentFile == '").concat(currentJmxFile, "'.split('.')[0]) {\n                            ").concat(dashboardScript, ";\n                            ").concat(graphScript, ";\n                        };");
                                    _c.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = jmeterReportsPaths.split(',');
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    jmeterPath = _a[_i];
                    return [5 /*yield**/, _loop_1(jmeterPath)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    content = "\n            try {\n                const jmxSelect = $('#jmxfiles')\n                const allFiles = \"".concat(allJmxFiles_1, "\".split(\",\")\n                \n                jmxSelect.empty()\n                jmxSelect.append(allFiles.map(item => { \n                    const jFile = item.split('.')[0]\n                    return \"<option value=\" + jFile + \">\" + jFile + \"</option>\"\n                }))\n                \n                getUrlParam = function(name){\n                    const results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href)\n                    return (results && results[1]) ? results[1] : ''\n                }\n                \n                jmxSelect.change(function() {\n                    window.location.href = 'index.html?file=' + $('#jmxfiles option:selected').val()\n                });\n                \n                const currentFile = getUrlParam(\"file\") || $('#jmxfiles option:selected').val()\n                $(\"#jmxfiles\").val(currentFile)\n\n                // replace all a href link with current selected jmx file\n                $('#wrapper a').each(function(){\n                    const currentHref = $(this).attr('href')\n                    $(this).attr('href', currentHref + '?file=' + currentFile)\n                })\n\n                ").concat(customScripts, "\n\n                $( document ).trigger( \"document.ready\" )\n\n                if (allFiles.length < 2) {\n                    $('#jmxfiles').attr(\"disabled\", \"disabled\")\n                }\n            }\n            catch (e) {\n                console.log(e.message)\n            }");
                    // write the content to a file so that it would be added as as attachement later
                    fs.writeFileSync(currentJmeterPath_1 + '/content/js/utils.js', content);
                    scriptFiles_1.default.forEach(function (item) {
                        console.log("##vso[task.addattachment type=pub_".concat(item, ";name=content;]").concat(currentJmeterPath_1, "/content/js/").concat(item, ".js"));
                    });
                    _b.label = 5;
                case 5:
                    if (inputString == 'genericHTML') {
                        newhtmlPath = tl.getInput('htmlPath', false);
                        console.log('##vso[task.addattachment type=replacedhtml;name=content;]' + newhtmlPath);
                    }
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _b.sent();
                    message = err_1 instanceof Error ? err_1.message : String(err_1);
                    tl.setResult(tl.TaskResult.Failed, message);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
run();
