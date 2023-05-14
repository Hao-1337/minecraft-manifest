String.prototype.isV4UUID = function() {
    return this.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)?.[0].length === 36;
};
String.prototype.isPositiveNumber = function() {
    return this.match(/\d+/)?.[0].length === this.length && +`${this}` < 100;
}

let global_scope = {},
outside_depent = [],
devc = 0;
const mcsad = {
    module_name: "@minecraft/server-admin",
    version: "1.0.0-beta"
},
mcgt = {
    module_name: "@minecraft/server-gametest",
    version: "1.0.0-beta"
},
mcnet = {
    module_name: "@minecraft/server-net",
    version: "1.0.0-beta"
},
mcui = {
    module_name: "@minecraft/server-ui",
    version: "1.0.0-beta"
},
mc = {
    module_name: "@minecraft/server",
    version: "1.0.0"
};
const UUIDGen = () => ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)),
updateForm = () => {
    (document.forms.generator.custom.value === "on") ?
    (document.forms.generator.uuid_text.style.visibility = "visible"):
    (document.forms.generator.uuid_text.style.visibility = "hidden");
},
onChangeType = () => {
    ["s","sb"].includes(document.forms.generator.pack_type.value) ? _("entrypoint").innerHTML = `
    <br><br>
    <label>Entry for scripting pack:</label>
    <input type="text" id="entry" size="30" placeholder="EX: scripts/main.js"/>
    <br><br>
    <label>Scripts eval allow to use <b><u onclick="window.open(&#34;https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function&#34;)">new Function()</u></b> and <b><u href="window.open(&#34;https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval&#34;)">eval()</u></b>:</label>
    <br>
    <input type="checkbox" id="script_eval" checked/>
    <label for="script_eval">Scripts eval</label>
    <br><br>
    <div class="box1">
    <div class="box2">
    <span>Avaliable modules</span>
    </div>
    <br>
    <input type="checkbox" id="mc_gametest" checked/>
    <label for="mc_gametest">minecraft/server-gametest</label>
    <br>
    <input type="checkbox" id="mc_mojang" checked/>
    <label for="mc_mojang">minecraft/server</label>
    <br>
    <input type="checkbox" id="mc_ui" checked/>
    <label for="mc_ui">minecraft/server-ui</label>
    <br><br>
    <label style="color:#B1B932;"><u>Note</u>: Below modules for <b>server</b> only</label>
    <br>
    <input type="checkbox" id="mc_net"/>
    <label for="mc_net">minecraft/server-net</label>
    <br>
    <input type="checkbox" id="mc_server_admin"/>
    <label for="mc_server_admin">minecraft/server-admin</label>
    </div>
    `: _("entrypoint").innerHTML = ``;
},
updateUUID = () => {
    document.forms.generator.uuid.value = UUIDGen();
},
updateDepent = () => {
    const {
        dver1,
        dver2,
        dver3,
        duuid
    } = document.forms.generator,
    data = {
        uuid: duuid.value,
        version: [
            +`${dver1.value}`,
            +`${dver2.value}`,
            +`${dver3.value}`
        ]
    };
    let er = 0;
    if ([dver1, dver2, dver3, duuid].some(v => v.value === "")) return alert("Error: You need to ne fill the blank");
    if (!duuid.value.isV4UUID()) return alert("Error: Invalid UUID (must be UUID v4)");
    if (!dver1.value.isPositiveNumber() || !dver2.value.isPositiveNumber() || !dver3.value.isPositiveNumber()) return alert("Error: Invalid version number");
    if (outside_depent.some((v, i) => (er = i+1, v.uuid === data.uuid))) return alert(`Error: Duplicated dependencies detected\n\nat dependent ${er}`);
    outside_depent.push(data);
    updateDHTML();
},
updateDHTML = () => {
    let data,
    html = "";
    for (data of outside_depent) html += `
    <br>
    <div class="box4">
    <label>UUID:</label>
    <br>
    <input type="text" style="width:100%" readonly value="${data.uuid}"/>
    <br>
    <label>Version:</label>
    <br>
    <input type="text" style="width:29%" readonly value="${data.version[0]}"/>
    <input type="text" style="width:30%" readonly value="${data.version[1]}"/>
    <input type="text" style="width:29%" readonly value="${data.version[2]}"/>
    <br><br>
    <div class="box5">
    <button type="button" onclick="return removeDepent(${outside_depent.length-1});">Remove dependency</button>
    </div>
    </div>
    `;
    _("noned").style.display = outside_depent.length > 0 ? "none" : "block";
    _("outd").innerHTML = html;
},
removeDepent = index => {
    console.log(index);
    outside_depent.splice(index, 1);
    updateDHTML();
},
headerGen = () => ({
    name: document.forms.generator.name.value,
    description: document.forms.generator.description.value,
    uuid: document.forms.generator.uuid.value,
    version: [+`${document.forms.generator.ver1.value}`, +`${document.forms.generator.ver2.value}`, +`${document.forms.generator.ver3.value}`],
    min_engine_version: [+`${document.forms.generator.mver1.value}`, +`${document.forms.generator.mver2.value}`, +`${document.forms.generator.mver3.value}`]
}),
resoucePackGen = () => ({
    type: "resources",
    uuid: UUIDGen(),
    version: [1, 0, 0]
}),
behaviorPackGen = () => ({
    type: "data",
    uuid: UUIDGen(),
    version: [1, 0, 0]
}),
scriptingPackGen = () => ({
    "type": "script",
    "language": "javascript",
    "uuid": UUIDGen(),
    "entry": document.forms.generator.entry.value,
    "version": [
        1,
        0,
        0
    ]
}),
fullManifestGen = (is_script = false) => {
    const {
        name,
        description,
        pack_type,
        uuid,
        ver1,
        ver2,
        ver3,
        mver1,
        mver2,
        mver3,
        script_eval,
        mc_gametest,
        mc_mojang,
        mc_ui,
        mc_net,
        mc_server_admin,
        entry
    } = document.forms.generator,
    [
        ev,
        mc1,
        mc2,
        mc3,
        mc4,
        mc5
    ] = [
        script_eval,
        mc_gametest,
        mc_mojang,
        mc_ui,
        mc_net,
        mc_server_admin
    ].map(v => v?.checked),
    type = pack_type.value,
    modules = [],
    scripteval = {},
    assign_depent = {};
    let dependent = [];
    if (name.value === "" || uuid.value === "") {
        _("error").innerHTML = `
        <br>
        <div class="generator_error">
        <span style="font-size:20px">ERROR</span>
        <br>
        You need to be filled in blank
        </div>
        `;
        return "error";
    } else _("error").innerHTML = "";
    if (["s", "sb"].some(v => v === type) && !mc1 && !mc2 && !mc3 && !mc4 && !mc5) {
        _("error").innerHTML = `
        <br>
        <div class="generator_error">
        <span style="font-size:20px">ERROR</span>
        <br>
        You need to select at least one module
        </div>
        `;
        return "error";
    } else _("error").innerHTML = "";
    if (!uuid.value.isV4UUID()) {
        _("error").innerHTML = `
        <br>
        <div class="generator_error">
        <span style="font-size:20px">ERROR</span>
        <br>
        Please enter a valid UUID (v4)
        </div>
        `;
        return "error";
    } else _("error").innerHTML = "";
    if (!ver1.value.isPositiveNumber() || !ver2.value.isPositiveNumber() || !ver3.value.isPositiveNumber() || !mver1.value.isPositiveNumber() || !mver2.value.isPositiveNumber() || !mver3.value.isPositiveNumber()) {
        _("error").innerHTML = `
        <br>
        <div class="generator_error">
        <span style="font-size:20px">ERROR</span>
        <br>
        Please enter vaild version number
        </div>
        `;
        return "error";
    } else _("error").innerHTML = "";
    if (["s", "sb"].some(v => v === type) && entry.value === "") {
        _("error").innerHTML = `
        <br>
        <div class="generator_error">
        <span style="font-size:20px">ERROR</span>
        <br>
        Please enter a valid entry scripts directory
        </div>
        `;
        return "error";
    } else _("error").innerHTML = "";
    if (["s", "sb"].some(v => v === type) && !entry.value.startsWith("scripts/")) {
        _("error").innerHTML = `
        <br>
        <div class="generator_error">
        <span style="font-size:20px">ERROR</span>
        <br>
        New minecraft version only allow entry scripts directory root is <b>scripts/</b>
        </div>
        `;
        return "error";
    } else _("error").innerHTML = "";
    if (type === "b" || type === "sb") modules.push(behaviorPackGen());
    else modules.push(resoucePackGen());
    if (type === "s" || type === "sb") {
        if (ev) Object.assign(scripteval, {
            "capabilities": [
                "script_eval"
            ]
        });
        if (mc1) dependent.push(mcgt);
        if (mc2) dependent.push(mc);
        if (mc3) dependent.push(mcui);
        if (mc4) dependent.push(mcnet);
        if (mc5) dependent.push(mcsad);
        console.log(outside_depent.length);
        if (outside_depent.length > 0) dependent = dependent.concat(outside_depent);
        Object.assign(assign_depent, {
            "dependencies": dependent
        });
        modules.push(scriptingPackGen());
    }
    return {
        format_version: 2,
        header: headerGen(),
        modules: modules,
        ...scripteval,
        ...assign_depent
    }
},
onSubmit = () => {
    const data = fullManifestGen(),
    output = _("output");
    if (data === "error") return;
    output.innerHTML = `
<div class="box6">
<p>Code format <input type="checkbox" id="format" onchange="return updateFormat();" checked/></p><label for="indent" id="ilabel">Tab spaces </label><input type="number" id="indent" style="width:10%;size:10px;" maxlength="1" id="space" placeholder="0" value="4" onchange="return updateFormat();"/>
<button type="button" class="button_block" onclick="return coppyToClipboard();" class="button_block1">Coppy to clipboard</button><button type="button" class="button_block" onclick="return download();" class="button_block1">Download file</button>
</div>
<pre id="codespace"><code class="language-json">${JSON.stringify(data, {type: "text/json"}, "\t")}</code></pre>
    `;
    setTimeout(() => hljs.highlightAll(), 300);
    output.rows = 80;
    console.log(data);
    global_scope = data;
},
download = (data) => {
    saveJsonFile("manifest.json", global_scope);
},
devMode = () => {
    if (devc > -1 && (devc++) > 10) {
        devc = -2;
        alert("Now you in developer mode!");
        eruda.init({
            tool: ['console', 'elements', 'network', 'resources', 'info']});
        eruda.get().config.set('displaySize', 60);
        eruda.scale(0.6);
        eruda.position({
            x: 10, y: 10
        });
        eruda.remove('settings');
    }
},
updateFormat = () => {
    const indent = _("indent"),
          codespace = _("codespace"),
          format = _("format"),
          ilabel = _("ilabel");
    if (+`${indent.value}` > 8) {
        alert(`Tab space so big! Please enter a smaller number (<= 8)`);
        indent.value = 4;
        return;
    }
    codespace.innerHTML = `
        <code class="language-json">${JSON.stringify(global_scope, {type: "text/json"}, (_("format").checked ? +`${indent.value}` : 0))}</code>
    `;
    indent.style.display = format.checked ? "inline" : "none";
    ilabel.style.display = format.checked ? "inline" : "none";
    setTimeout(() => hljs.highlightAll(), 300);
    output.cols = 50;
},
parseFormat = (obj) => {
    if (!_("format").checked) return obj;
    if (typeof obj !== "object") return obj;
    const type = Array.isArray(obj) ? [] : {};
    for (const key in obj) type[key] = typeof obj == "object" ? parseFormat(obj[key]) : obj[key];
    return type;
},
saveJsonFile = (name, data) => {
    const blob = new Blob(
        [JSON.stringify(parseFormat(data), void 0, (_("format").checked ? +`${_("indent").value}` : 0))],
        {type: "text/json"}
    ),
    link = document.createElement("a");
    link.download = name;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json",link.download,link.href].join(":");
    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true
    });
    link.dispatchEvent(evt);
    link.remove();
},
coppyToClipboard = (text = JSON.stringify(global_scope, {
    type: "text/json"
}, (_("format").checked ? +`${_("indent").value}` : 0))) => navigator.clipboard.writeText(text),
getCheckBoxByID = checkboxid => {
    return _(checkboxid).checked;
};

function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (e instanceof DOMException && (e.code === 22 || e.code === 1014 || e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED") && storage && storage.length !== 0);
    }
  }
  function cookiesEnabled() {
      document.cookie = "testcookie=true";
      const cookiesEnabled = document.cookie.indexOf("testcookie") !== -1;
      document.cookie = "testcookie=true; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      return cookiesEnabled;
  }
  
let storage = window.localStorage;

class Database {
    error = false;
    constructor() {
        if (!storageAvailable("localStorage")) {
            error = true;
            return console.warn("Local storage not available!");
        }
        return this;
    }
    get isEnabled() {
        return !this.error;
    }
    set isEnabled(_) {
        throw new SyntaxError("isEnabled is read-only");
    }
    set(key, vaule) {
        return storage.setItem(key, value);
    }
    get(key) {
        return storage.getItem(key);
    }
    remove(key) {
        if (this.get(key) === null) return false;
        return this.removeItem(key);
    }
    replace(key, vaule) {
        if (this.get(key) === null) return false;
        this.remove(key);
        return this.set(key, vaule);
    }
    forEach(func) {
        for (let i = 0; i < storage.length; i++) func(this.get(storage.key(i)));
    }
}

window.database = new Database();