cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cc.fovea.cordova.purchase.InAppBillingPlugin",
    "file": "plugins/cc.fovea.cordova.purchase/www/store-android.js",
    "pluginId": "cc.fovea.cordova.purchase",
    "clobbers": [
      "store"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "cc.fovea.cordova.purchase": "7.1.3"
};
// BOTTOM OF METADATA
});