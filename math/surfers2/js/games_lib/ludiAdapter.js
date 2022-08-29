var myDataLayer=function(){var arr=[];return arr;};var dataLayer=new myDataLayer;var enableADS=parent.enableADS;var productKey=parent.productKey;var productTitle=parent.productTitle;if(parent.AdsState){var AdsState=parent.AdsState;}
if(parent.adsContainer){var adsContainer=parent.adsContainer;}
if(parent.adsCurrentState){var adsCurrentState=parent.adsCurrentState;}
var playAds=function(){sdk.showBanner();}
var getReferrer=function(){return parent.getReferrer();}
var show_freeFrame=function(){sdk.showBanner();}
var show_freeFrame_Loc=function(l){sdk.showBanner();}
var o_setDisplayRewardAds=function(v){sdk.showBanner();}
var ora_isDisplayingReward=function(v){sdk.showBanner();}
var ora_getPayloadAmount=function(){return parent.ora_getPayloadAmount();}
var isAdsComplete=function(){return parent.isAdsComplete();}
var myConsoleLog=function(){return parent.myConsoleLog();}
var isShowAdScreen=false;