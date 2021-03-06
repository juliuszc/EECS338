kango.Browser=function(){this.superclass.apply(this,arguments);opera.extension.tabs.addEventListener("focus",kango.func.bind(this._onTabFocus,this),!1);opera.extension.tabs.addEventListener("close",kango.func.bind(this._onTabClose,this),!1);opera.extension.tabs.addEventListener("create",kango.func.bind(this._onTabCreate,this),!1);kango.addEventListener(kango.event.READY,kango.func.bind(function(){kango.addMessageListener("KangoBrowser_DOMContentLoaded",kango.func.bind(function(a){this._onDOMContentLoaded(a.target,
a.data)},this));kango.addMessageListener("KangoBrowser_BeforeNavigate",kango.func.bind(function(a){this._onBeforeNavigate(a.target,a.data)},this))},this))};
kango.Browser.prototype=kango.oop.extend(kango.BrowserBase,{_onBeforeNavigate:function(a,b){this.fireEvent(this.event.BEFORE_NAVIGATE,{url:b.url,target:a})},_onDOMContentLoaded:function(a,b){this.fireEvent(this.event.DOCUMENT_COMPLETE,{url:b.url,title:b.title,target:a})},_onTabFocus:function(a){"undefined"!=typeof a.tab&&(a=a.tab,this.fireEvent(this.event.TAB_CHANGED,{url:a.url||"",title:a.title||"",tabId:a.id,target:new kango.BrowserTab(a)}))},_onTabCreate:function(a){"undefined"!=typeof a.tab&&
this.fireEvent(this.event.TAB_CREATED,{tabId:a.tab.id,target:new kango.BrowserTab(a.tab)})},_onTabClose:function(a){"undefined"!=typeof a.tab&&this.fireEvent(this.event.TAB_REMOVED,{tabId:a.tab.id})},getName:function(){return"opera"},tabs:{getAll:function(a){for(var b=[],d=opera.extension.tabs.getAll(),c=0;c<d.length;c++)d[c].url&&b.push(new kango.BrowserTab(d[c]));a(b)},getCurrent:function(a){var b=opera.extension.tabs.getSelected();null!=b&&a(new kango.BrowserTab(b))},create:function(a){opera.extension.tabs.create({url:a.url,
focused:"undefined"!=typeof a.focused?a.focused:!0})}},windows:{getAll:function(a){a(kango.array.map(opera.extension.windows.getAll(),function(a){return new kango.BrowserWindow(a)}))},getCurrent:function(a){var b=opera.extension.windows.getLastFocused();null!=b&&a(new kango.BrowserWindow(b))},create:function(a){opera.extension.windows.create().tabs[0].url=a.url}},getTabFromUrl:function(a){var b=opera.extension.tabs.getFocused();if(null==b||b.url!=a)for(var d=opera.extension.windows.getAll(),c=0;c<
d.length;c++)for(var f=d[c].tabs.getAll(),e=0;e<f.length&&!(f[e].url==a&&(b=f[e],f[e].focused));e++);return new kango.BrowserTab(b)}});kango.BrowserWindow=function(a){this._window=a};
kango.BrowserWindow.prototype=kango.oop.extend(kango.IBrowserWindow,{_window:null,getTabs:function(a){var b=[],d=this._window.tabs.getAll();if(null!=d)for(var c=0;c<d.length;c++)d[c].url&&b.push(new kango.BrowserTab(d[c]));a(b)},getCurrentTab:function(a){var b=this._window.tabs.getSelected();null!=b&&a(new kango.BrowserTab(b))},isActive:function(){return this._window.focused}});kango.BrowserTab=function(a){this._tab=a};
kango.BrowserTab.prototype=kango.oop.extend(kango.IBrowserTab,{_tab:null,getId:function(){return this._tab.id},getUrl:function(){return this._tab.url||""},getTitle:function(){return this._tab.title||""},getDOMWindow:function(){return null},isActive:function(){return this._tab.focused},navigate:function(a){this.dispatchMessage("KangoBrowser_navigate",a)},activate:function(){this._tab.focus()},dispatchMessage:function(a,b){try{return this._tab.postMessage(JSON.stringify({name:a,data:b})),!0}catch(d){return!1}},
close:function(){this._tab.close()}});kango.registerModule(kango.getDefaultModuleRegistrar("browser",kango.Browser));
