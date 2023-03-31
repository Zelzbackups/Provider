var playerCards={};playerCards.initialized=false;playerCards.WIDTH_PAD=10;playerCards.SCROLL_PAD=20;playerCards.cached={};playerCards.playerdata={};playerCards.playernames=[];playerCards.unloaded_cards={};playerCards.mouse_x=0;playerCards.mouse_y=0;playerCards.currently_hovering=false;playerCards.current_hover_el=false;playerCards.observer=false;playerCards.can_observe=window.hasOwnProperty('MutationObserver');playerCards.scrollTimeout=false;playerCards.currentScroll=0;playerCards.scrollAnimationFrame=false;playerCards.style='\
#playerCard_data { height:0; width:0; margin:0; padding:0; overflow:hidden; }\
.playerCard .cc_header_col { transition: background 2s ease-out }\
.playerCard { font-size:14px; filter: drop-shadow(2px 2px 5px rgba(0,0,0,.3)); position:fixed; width:250px; border-radius:4px; overflow:hidden;}\
.playerCard_loaded { display:none; padding:10px; }\
.playerCard_loading { display:block; padding:10px; }\
.playerCard img { drop-shadow:2px 2px 5px rgba(0,0,0,.6); float:left; width:40px; height:40px; border-radius:4px; margin:0 10px 0 0; }\
.playerCard_player { height:60px; padding:10px; text-shadow:2px 2px 5px rgba(0,0,0,.6);}\
.playerCard_player_name { line-height:40px; font-size:18px; }\
.playerCard_player_name.playerCard_hasTitle { line-height:20px; font-size:13px }\
.playerCard_player_title {font-size:8px;line-height:20px;}\
.playerCard_special { font-size:14px; }\
.playerCard_header {font-size:16px; font-weight:bold; border-bottom:1px solid rgba(0,0,0,.3); padding:5px;}\
.playerCard_altList { max-height:80px; border-radius:4px; overflow:hidden; list-style-type:none; font-size:14px;}\
.playerCard_altList ul { list-style-type: none; margin:0;}\
.playerCard_altList ul li { margin:0; padding:0 0 0 10px; }\
.playerCard_col_p .cc_header_col { background: #b39d3b; }\
.playerCard_col_m .cc_header_col { background: #404ab3; }\
.playerCard_col_a .cc_header_col, .playerCard_col_d .cc_header_col { background: #b33044; }\
.playerCard_col_b .cc_header_col { background:#666; }\
.playerCard_col_b .playerCard_player_name {text-decoration:line-through; color:#bbb;}\
\
';playerCards.base_card='<div class="playerCard cc_secondary_col">\
	<div class="playerCard_player cc_header_col"><img><span class="playerCard_player_name"></span><div class="playerCard_player_title"></div></div>\
	<div class="playerCard_loaded">\
		<div class="playerCard_flags"></div>\
		<div class="playerCard_registered"></div>\
		<div class="playerCard_special"></div>\
	</div>\
	<div class="playerCard_loading">Loading...</div>\
</div>';playerCards.pflags={a:'Admin',d:'Developer',e:'Editor',p:'Patron',m:'Moderator',b:'Banned',u:'Unverified'}
playerCards.registerMouseMove=function(){$(document).on('mousemove.playerCards',playerCards.MouseMove);}
playerCards.init=function(){if(!playerCards.initialized){$('body').append('<div id="playerCard_data"></div>');$('head').append('<style>'+playerCards.style+'</style>');playerCards.registerMouseMove();playerCards.observe();playerCards.registerHoverables();}
playerCards.initialized=false;}
playerCards.observe=function(){if(!playerCards.can_observe||playerCards.observer!==false){return;}
playerCards.observer=new MutationObserver(function(){setTimeout(playerCards.registerHoverables,0)});playerCards.observer.observe(document.querySelector('body'),{childList:true,subtree:true});}
playerCards.registerHoverables=function(){var hoverables=$('.player').not('.player_hoverhandled');$.each(hoverables,function(k,v){var el=$(v);el.off('mouseover.playerCards');el.off('mouseout.playerCards');el.on('mouseover.playerCards',playerCards.OnHover);el.on('mouseout.playerCards',playerCards.OnUnhover);el.addClass('player_hoverhandled')});}
playerCards.loadPlayerData=function(ply){if(playerCards.playernames.includes(ply)){setTimeout(playerCards.startAltScroll,20);return;}
playerCards.playernames.push(ply);var card=$(playerCards.base_card);card.attr('data-player-name',ply);card.find('.playerCard_player img').attr('src','/face/'+ply+'/');card.find('.playerCard_player_name').text(ply);$('#playerCard_data').append(card);$.ajax({url:'/api/player/'+ply+'?special',method:'GET'}).success(function(data){if(data&&data.id){card.find('.playerCard_player_name').text(data.name);var flagdescs=[];$.each(data.flags,function(k,v){card.addClass('playerCard_col_'+v);if(Object.keys(playerCards.pflags).includes(v)){flagdescs.push(playerCards.pflags[v]);}});flagdescs=flagdescs.join(', ');card.find('.playerCard_flags').text(flagdescs);var regtime=new Date(data.registered*1000);regtime=regtime.toISOString().split("T")[0];card.find('.playerCard_registered').text('Registered '+regtime);if(data.forum_title.length>0){card.find('.playerCard_player_title').html(data.forum_title);card.find('.playerCard_player_name').addClass('playerCard_hasTitle');}
if(data.special){var special="<div class='playerCard_header'>Special Info</div>";var alt_text="Alt";if(data.special.alts.length!=1){alt_text="Alts";}
special=special+"<div>"+data.special.alts.length+" "+alt_text+"";if(data.special.alts.length>0){special=special+"<div class='playerCard_altList cc_primary_col'><ul class='playerCard_altList_primary'><li>"+data.special.alts.join("</li><li>")+" </li></ul></div>";}
special=special+"</div>";special=special+"<div>IP: "+data.special.lastip+"</div>";special=special+"<div>Last Page: <code>"+data.special.lastpage+"</code></div>";special=special+"<div>Email: <code>"+data.special.email+"</code></div>";card.find('.playerCard_special').append($(special));}
card.find('.playerCard_loading').slideUp({duration:200,progress:playerCards.calculatePos,complete:function(){card.find('.playerCard_loaded').slideDown({duration:200,progress:playerCards.calculatePos,complete:function(){setTimeout(playerCards.startAltScroll,20);}});}});}})}
playerCards.calculatePos=function(){if(playerCards.currently_hovering){var window_width=$(window).width();var card_height=playerCards.currently_hovering.height();var card_width=playerCards.currently_hovering.width();var page_x=playerCards.mouse_x-$(window).scrollLeft();var page_y=playerCards.mouse_y-$(window).scrollTop();var end_x=page_x;var end_y=page_y-card_height-15;if(end_y<5){end_y=page_y+10;}
if(end_x+card_width>window_width-playerCards.WIDTH_PAD){end_x=window_width-card_width-playerCards.WIDTH_PAD;}
playerCards.currently_hovering.css({left:0,top:0,transform:"translate("+end_x+"px, "+end_y+"px)"});}}
playerCards.showCard=function(ply){playerCards.loadPlayerData(ply);var card=$('#playerCard_data .playerCard[data-player-name="'+ply+'"]');playerCards.currently_hovering=card;card.css({display:'fixed'});}
playerCards.setAltsScroll=function(card,px){card.find('.playerCard_altList_primary, .playerCard_altList_secondary').css({transform:'translateY(-'+px+'px'});}
playerCards.resetAltsScroll=function(){if(playerCards.scrollTimeout){clearTimeout(playerCards.scrollTimeout);}
if(playerCards.scrollAnimationFrame){window.cancelAnimationFrame(playerCards.scrollAnimationFrame);}
playerCards.scrollTimeout=false;playerCards.scrollAnimationFrame=false;}
playerCards.startAltScroll=function(){if(!playerCards.currently_hovering){return;}
var alt_field=playerCards.currently_hovering.find('.playerCard_altList');alt_field.scrollTop(0);playerCards.currentAltScroll=0;playerCards.setAltsScroll(playerCards.currently_hovering,0);if(alt_field.prop('scrollHeight')<=alt_field.prop('clientHeight')){playerCards.resetAltsScroll();return;}
if(!playerCards.currently_hovering.find('.playerCard_altList_secondary').length){var secondary_field=playerCards.currently_hovering.find('.playerCard_altList_primary').clone();secondary_field.attr('class','playerCard_altList_secondary');secondary_field.appendTo(alt_field);}
playerCards.currently_hovering.find('.playerCard_altList_primary').css({paddingBottom:playerCards.SCROLL_PAD+'px'});playerCards.scrollTimeout=setTimeout(playerCards.scrollAltList,1000);}
playerCards.scrollAltList=function(){var el=playerCards.currently_hovering;if(!el||!el.find('.playerCard_altList')){playerCards.resetAltsScroll();return;}
el=el.find('.playerCard_altList');if(el){playerCards.currentAltScroll+=17/60;playerCards.setAltsScroll(playerCards.currently_hovering,playerCards.currentAltScroll);if(playerCards.currentAltScroll>=el.find('.playerCard_altList_primary').prop('clientHeight')){playerCards.setAltsScroll(playerCards.currently_hovering,0);playerCards.scrollAnimationFrame=false;playerCards.scrollTimeout=setTimeout(playerCards.startAltScroll,750);}else{playerCards.scrollAnimationFrame=window.requestAnimationFrame(playerCards.scrollAltList);}}}
playerCards.OnHover=function(evt){var el=$(this);playerCards.current_hover_el=el;var pname=el.attr('data-player-name');if(!pname){return;}
playerCards.MouseMove(evt);playerCards.showCard(pname);}
playerCards.OnUnhover=function(evt){if(playerCards.currently_hovering){var c=playerCards.currently_hovering;playerCards.currently_hovering=false;c.css({top:'-5000px',left:'-5000px',transform:'translate(0,0)'});playerCards.setAltsScroll(c,0);playerCards.resetAltsScroll();}}
playerCards.MouseMove=function(evt){if(playerCards.currently_hovering!=false){playerCards.mouse_x=evt.pageX;playerCards.mouse_y=evt.pageY;playerCards.calculatePos();}}
$(function(){playerCards.init();});