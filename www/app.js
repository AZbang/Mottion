(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*!
 * pixi-particles - v2.1.9
 * Compiled Thu, 16 Nov 2017 01:52:39 UTC
 *
 * pixi-particles is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var i;i="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,i.pixiParticles=t()}}(function(){return function t(i,e,s){function a(n,o){if(!e[n]){if(!i[n]){var h="function"==typeof require&&require;if(!o&&h)return h(n,!0);if(r)return r(n,!0);var l=new Error("Cannot find module '"+n+"'");throw l.code="MODULE_NOT_FOUND",l}var p=e[n]={exports:{}};i[n][0].call(p.exports,function(t){var e=i[n][1][t];return a(e?e:t)},p,p.exports,t,i,e,s)}return e[n].exports}for(var r="function"==typeof require&&require,n=0;n<s.length;n++)a(s[n]);return a}({1:[function(t,i,e){"use strict";var s=t("./ParticleUtils"),a=t("./Particle"),r=PIXI.Texture,n=function(t){a.call(this,t),this.textures=null,this.duration=0,this.framerate=0,this.elapsed=0,this.loop=!1},o=a.prototype,h=n.prototype=Object.create(o);h.init=function(){this.Particle_init(),this.elapsed=0,this.framerate<0&&(this.duration=this.maxLife,this.framerate=this.textures.length/this.duration)},h.applyArt=function(t){this.textures=t.textures,this.framerate=t.framerate,this.duration=t.duration,this.loop=t.loop},h.update=function(t){if(this.Particle_update(t)>=0){this.elapsed+=t,this.elapsed>this.duration&&(this.loop?this.elapsed=this.elapsed%this.duration:this.elapsed=this.duration-1e-6);var i=this.elapsed*this.framerate+1e-7|0;this.texture=this.textures[i]||s.EMPTY_TEXTURE}},h.Particle_destroy=a.prototype.destroy,h.destroy=function(){this.Particle_destroy(),this.textures=null},n.parseArt=function(t){var i,e,s,a,n,o,h=[];for(i=0;i<t.length;++i){for(e=t[i],t[i]=h={},h.textures=o=[],a=e.textures,s=0;s<a.length;++s)if(n=a[s],"string"==typeof n)o.push(r.fromImage(n));else if(n instanceof r)o.push(n);else{var l=n.count||1;for(n="string"==typeof n.texture?r.fromImage(n.texture):n.texture;l>0;--l)o.push(n)}"matchLife"==e.framerate?(h.framerate=-1,h.duration=0,h.loop=!1):(h.loop=!!e.loop,h.framerate=e.framerate>0?e.framerate:60,h.duration=o.length/h.framerate)}return t},i.exports=n},{"./Particle":3,"./ParticleUtils":4}],2:[function(t,i,e){"use strict";var s=t("./ParticleUtils"),a=t("./Particle"),r=PIXI.particles.ParticleContainer||PIXI.ParticleContainer,n=PIXI.ticker.shared,o=function(t,i,e){this._particleConstructor=a,this.particleImages=null,this.startAlpha=1,this.endAlpha=1,this.startSpeed=0,this.endSpeed=0,this.minimumSpeedMultiplier=1,this.acceleration=null,this.maxSpeed=NaN,this.startScale=1,this.endScale=1,this.minimumScaleMultiplier=1,this.startColor=null,this.endColor=null,this.minLifetime=0,this.maxLifetime=0,this.minStartRotation=0,this.maxStartRotation=0,this.noRotation=!1,this.minRotationSpeed=0,this.maxRotationSpeed=0,this.particleBlendMode=0,this.customEase=null,this.extraData=null,this._frequency=1,this.maxParticles=1e3,this.emitterLifetime=-1,this.spawnPos=null,this.spawnType=null,this._spawnFunc=null,this.spawnRect=null,this.spawnCircle=null,this.particlesPerWave=1,this.particleSpacing=0,this.angleStart=0,this.rotation=0,this.ownerPos=null,this._prevEmitterPos=null,this._prevPosIsValid=!1,this._posChanged=!1,this._parentIsPC=!1,this._parent=null,this.addAtBack=!1,this.particleCount=0,this._emit=!1,this._spawnTimer=0,this._emitterLife=-1,this._activeParticlesFirst=null,this._activeParticlesLast=null,this._poolFirst=null,this._origConfig=null,this._origArt=null,this._autoUpdate=!1,this._destroyWhenComplete=!1,this._completeCallback=null,this.parent=t,i&&e&&this.init(i,e),this.recycle=this.recycle,this.update=this.update,this.rotate=this.rotate,this.updateSpawnPos=this.updateSpawnPos,this.updateOwnerPos=this.updateOwnerPos},h=o.prototype={},l=new PIXI.Point;Object.defineProperty(h,"frequency",{get:function(){return this._frequency},set:function(t){"number"==typeof t&&t>0?this._frequency=t:this._frequency=1}}),Object.defineProperty(h,"particleConstructor",{get:function(){return this._particleConstructor},set:function(t){if(t!=this._particleConstructor){this._particleConstructor=t,this.cleanup();for(var i=this._poolFirst;i;i=i.next)i.destroy();this._poolFirst=null,this._origConfig&&this._origArt&&this.init(this._origArt,this._origConfig)}}}),Object.defineProperty(h,"parent",{get:function(){return this._parent},set:function(t){if(this._parentIsPC)for(var i=this._poolFirst;i;i=i.next)i.parent&&i.parent.removeChild(i);this.cleanup(),this._parent=t,this._parentIsPC=r&&t&&t instanceof r}}),h.init=function(t,i){if(t&&i){this.cleanup(),this._origConfig=i,this._origArt=t,t=Array.isArray(t)?t.slice():[t];var e=this._particleConstructor;this.particleImages=e.parseArt?e.parseArt(t):t,i.alpha?(this.startAlpha=i.alpha.start,this.endAlpha=i.alpha.end):this.startAlpha=this.endAlpha=1,i.speed?(this.startSpeed=i.speed.start,this.endSpeed=i.speed.end,this.minimumSpeedMultiplier=i.speed.minimumSpeedMultiplier||1):(this.minimumSpeedMultiplier=1,this.startSpeed=this.endSpeed=0);var a=i.acceleration;a&&(a.x||a.y)?(this.endSpeed=this.startSpeed,this.acceleration=new PIXI.Point(a.x,a.y),this.maxSpeed=i.maxSpeed||NaN):this.acceleration=new PIXI.Point,i.scale?(this.startScale=i.scale.start,this.endScale=i.scale.end,this.minimumScaleMultiplier=i.scale.minimumScaleMultiplier||1):this.startScale=this.endScale=this.minimumScaleMultiplier=1,i.color&&(this.startColor=s.hexToRGB(i.color.start),i.color.start!=i.color.end?this.endColor=s.hexToRGB(i.color.end):this.endColor=null),i.startRotation?(this.minStartRotation=i.startRotation.min,this.maxStartRotation=i.startRotation.max):this.minStartRotation=this.maxStartRotation=0,i.noRotation&&(this.minStartRotation||this.maxStartRotation)?this.noRotation=!!i.noRotation:this.noRotation=!1,i.rotationSpeed?(this.minRotationSpeed=i.rotationSpeed.min,this.maxRotationSpeed=i.rotationSpeed.max):this.minRotationSpeed=this.maxRotationSpeed=0,this.minLifetime=i.lifetime.min,this.maxLifetime=i.lifetime.max,this.particleBlendMode=s.getBlendMode(i.blendMode),i.ease?this.customEase="function"==typeof i.ease?i.ease:s.generateEase(i.ease):this.customEase=null,e.parseData?this.extraData=e.parseData(i.extraData):this.extraData=i.extraData||null,this.spawnRect=this.spawnCircle=null,this.particlesPerWave=1,this.particleSpacing=0,this.angleStart=0;var r;switch(i.spawnType){case"rect":this.spawnType="rect",this._spawnFunc=this._spawnRect;var n=i.spawnRect;this.spawnRect=new PIXI.Rectangle(n.x,n.y,n.w,n.h);break;case"circle":this.spawnType="circle",this._spawnFunc=this._spawnCircle,r=i.spawnCircle,this.spawnCircle=new PIXI.Circle(r.x,r.y,r.r);break;case"ring":this.spawnType="ring",this._spawnFunc=this._spawnRing,r=i.spawnCircle,this.spawnCircle=new PIXI.Circle(r.x,r.y,r.r),this.spawnCircle.minRadius=r.minR;break;case"burst":this.spawnType="burst",this._spawnFunc=this._spawnBurst,this.particlesPerWave=i.particlesPerWave,this.particleSpacing=i.particleSpacing,this.angleStart=i.angleStart?i.angleStart:0;break;case"point":this.spawnType="point",this._spawnFunc=this._spawnPoint;break;default:this.spawnType="point",this._spawnFunc=this._spawnPoint}this.frequency=i.frequency,this.emitterLifetime=i.emitterLifetime||-1,this.maxParticles=i.maxParticles>0?i.maxParticles:1e3,this.addAtBack=!!i.addAtBack,this.rotation=0,this.ownerPos=new PIXI.Point,this.spawnPos=new PIXI.Point(i.pos.x,i.pos.y),this._prevEmitterPos=this.spawnPos.clone(),this._prevPosIsValid=!1,this._spawnTimer=0,this.emit=void 0===i.emit||!!i.emit,this.autoUpdate=void 0!==i.autoUpdate&&!!i.autoUpdate}},h.recycle=function(t){t.next&&(t.next.prev=t.prev),t.prev&&(t.prev.next=t.next),t==this._activeParticlesLast&&(this._activeParticlesLast=t.prev),t==this._activeParticlesFirst&&(this._activeParticlesFirst=t.next),t.prev=null,t.next=this._poolFirst,this._poolFirst=t,this._parentIsPC?(t.alpha=0,t.visible=!1):t.parent&&t.parent.removeChild(t),--this.particleCount},h.rotate=function(t){if(this.rotation!=t){var i=t-this.rotation;this.rotation=t,s.rotatePoint(i,this.spawnPos),this._posChanged=!0}},h.updateSpawnPos=function(t,i){this._posChanged=!0,this.spawnPos.x=t,this.spawnPos.y=i},h.updateOwnerPos=function(t,i){this._posChanged=!0,this.ownerPos.x=t,this.ownerPos.y=i},h.resetPositionTracking=function(){this._prevPosIsValid=!1},Object.defineProperty(h,"emit",{get:function(){return this._emit},set:function(t){this._emit=!!t,this._emitterLife=this.emitterLifetime}}),Object.defineProperty(h,"autoUpdate",{get:function(){return this._autoUpdate},set:function(t){this._autoUpdate&&!t?n.remove(this.update,this):!this._autoUpdate&&t&&n.add(this.update,this),this._autoUpdate=!!t}}),h.playOnceAndDestroy=function(t){this.autoUpdate=!0,this.emit=!0,this._destroyWhenComplete=!0,this._completeCallback=t},h.playOnce=function(t){this.autoUpdate=!0,this.emit=!0,this._completeCallback=t},h.update=function(t){if(this._autoUpdate&&(t=t/PIXI.settings.TARGET_FPMS/1e3),this._parent){var i,e,s;for(e=this._activeParticlesFirst;e;e=s)s=e.next,e.update(t);var a,r;this._prevPosIsValid&&(a=this._prevEmitterPos.x,r=this._prevEmitterPos.y);var n=this.ownerPos.x+this.spawnPos.x,o=this.ownerPos.y+this.spawnPos.y;if(this._emit)for(this._spawnTimer-=t;this._spawnTimer<=0;){if(this._emitterLife>0&&(this._emitterLife-=this._frequency,this._emitterLife<=0)){this._spawnTimer=0,this._emitterLife=0,this.emit=!1;break}if(this.particleCount>=this.maxParticles)this._spawnTimer+=this._frequency;else{var h;if(h=this.minLifetime==this.maxLifetime?this.minLifetime:Math.random()*(this.maxLifetime-this.minLifetime)+this.minLifetime,-this._spawnTimer<h){var l,p;if(this._prevPosIsValid&&this._posChanged){var c=1+this._spawnTimer/t;l=(n-a)*c+a,p=(o-r)*c+r}else l=n,p=o;i=0;for(var d=Math.min(this.particlesPerWave,this.maxParticles-this.particleCount);i<d;++i){var u,m;if(this._poolFirst?(u=this._poolFirst,this._poolFirst=this._poolFirst.next,u.next=null):u=new this.particleConstructor(this),this.particleImages.length>1?u.applyArt(this.particleImages[Math.floor(Math.random()*this.particleImages.length)]):u.applyArt(this.particleImages[0]),u.startAlpha=this.startAlpha,u.endAlpha=this.endAlpha,1!=this.minimumSpeedMultiplier?(m=Math.random()*(1-this.minimumSpeedMultiplier)+this.minimumSpeedMultiplier,u.startSpeed=this.startSpeed*m,u.endSpeed=this.endSpeed*m):(u.startSpeed=this.startSpeed,u.endSpeed=this.endSpeed),u.acceleration.x=this.acceleration.x,u.acceleration.y=this.acceleration.y,u.maxSpeed=this.maxSpeed,1!=this.minimumScaleMultiplier?(m=Math.random()*(1-this.minimumScaleMultiplier)+this.minimumScaleMultiplier,u.startScale=this.startScale*m,u.endScale=this.endScale*m):(u.startScale=this.startScale,u.endScale=this.endScale),u.startColor=this.startColor,u.endColor=this.endColor,this.minRotationSpeed==this.maxRotationSpeed?u.rotationSpeed=this.minRotationSpeed:u.rotationSpeed=Math.random()*(this.maxRotationSpeed-this.minRotationSpeed)+this.minRotationSpeed,u.noRotation=this.noRotation,u.maxLife=h,u.blendMode=this.particleBlendMode,u.ease=this.customEase,u.extraData=this.extraData,this._spawnFunc(u,l,p,i),u.init(),u.update(-this._spawnTimer),this._parentIsPC&&u.parent){var f=this._parent.children;if(f[0]==u)f.shift();else if(f[f.length-1]==u)f.pop();else{var _=f.indexOf(u);f.splice(_,1)}this.addAtBack?f.unshift(u):f.push(u)}else this.addAtBack?this._parent.addChildAt(u,0):this._parent.addChild(u);this._activeParticlesLast?(this._activeParticlesLast.next=u,u.prev=this._activeParticlesLast,this._activeParticlesLast=u):this._activeParticlesLast=this._activeParticlesFirst=u,++this.particleCount}}this._spawnTimer+=this._frequency}}this._posChanged&&(this._prevEmitterPos.x=n,this._prevEmitterPos.y=o,this._prevPosIsValid=!0,this._posChanged=!1),this._emit||this._activeParticlesFirst||(this._completeCallback&&this._completeCallback(),this._destroyWhenComplete&&this.destroy())}},h._spawnPoint=function(t,i,e){this.minStartRotation==this.maxStartRotation?t.rotation=this.minStartRotation+this.rotation:t.rotation=Math.random()*(this.maxStartRotation-this.minStartRotation)+this.minStartRotation+this.rotation,t.position.x=i,t.position.y=e},h._spawnRect=function(t,i,e){this.minStartRotation==this.maxStartRotation?t.rotation=this.minStartRotation+this.rotation:t.rotation=Math.random()*(this.maxStartRotation-this.minStartRotation)+this.minStartRotation+this.rotation,l.x=Math.random()*this.spawnRect.width+this.spawnRect.x,l.y=Math.random()*this.spawnRect.height+this.spawnRect.y,0!==this.rotation&&s.rotatePoint(this.rotation,l),t.position.x=i+l.x,t.position.y=e+l.y},h._spawnCircle=function(t,i,e){this.minStartRotation==this.maxStartRotation?t.rotation=this.minStartRotation+this.rotation:t.rotation=Math.random()*(this.maxStartRotation-this.minStartRotation)+this.minStartRotation+this.rotation,l.x=Math.random()*this.spawnCircle.radius,l.y=0,s.rotatePoint(360*Math.random(),l),l.x+=this.spawnCircle.x,l.y+=this.spawnCircle.y,0!==this.rotation&&s.rotatePoint(this.rotation,l),t.position.x=i+l.x,t.position.y=e+l.y},h._spawnRing=function(t,i,e){var a=this.spawnCircle;this.minStartRotation==this.maxStartRotation?t.rotation=this.minStartRotation+this.rotation:t.rotation=Math.random()*(this.maxStartRotation-this.minStartRotation)+this.minStartRotation+this.rotation,a.minRadius==a.radius?l.x=Math.random()*(a.radius-a.minRadius)+a.minRadius:l.x=a.radius,l.y=0;var r=360*Math.random();t.rotation+=r,s.rotatePoint(r,l),l.x+=this.spawnCircle.x,l.y+=this.spawnCircle.y,0!==this.rotation&&s.rotatePoint(this.rotation,l),t.position.x=i+l.x,t.position.y=e+l.y},h._spawnBurst=function(t,i,e,s){0===this.particleSpacing?t.rotation=360*Math.random():t.rotation=this.angleStart+this.particleSpacing*s+this.rotation,t.position.x=i,t.position.y=e},h.cleanup=function(){var t,i;for(t=this._activeParticlesFirst;t;t=i)i=t.next,this.recycle(t),t.parent&&t.parent.removeChild(t);this._activeParticlesFirst=this._activeParticlesLast=null,this.particleCount=0},h.destroy=function(){this.autoUpdate=!1,this.cleanup();for(var t,i=this._poolFirst;i;i=t)t=i.next,i.destroy();this._poolFirst=this._parent=this.particleImages=this.spawnPos=this.ownerPos=this.startColor=this.endColor=this.customEase=this._completeCallback=null},i.exports=o},{"./Particle":3,"./ParticleUtils":4}],3:[function(t,i,e){var s=t("./ParticleUtils"),a=PIXI.Sprite,r=function(t){a.call(this),this.emitter=t,this.anchor.x=this.anchor.y=.5,this.velocity=new PIXI.Point,this.maxLife=0,this.age=0,this.ease=null,this.extraData=null,this.startAlpha=0,this.endAlpha=0,this.startSpeed=0,this.endSpeed=0,this.acceleration=new PIXI.Point,this.maxSpeed=NaN,this.startScale=0,this.endScale=0,this.startColor=null,this._sR=0,this._sG=0,this._sB=0,this.endColor=null,this._eR=0,this._eG=0,this._eB=0,this._doAlpha=!1,this._doScale=!1,this._doSpeed=!1,this._doAcceleration=!1,this._doColor=!1,this._doNormalMovement=!1,this._oneOverLife=0,this.next=null,this.prev=null,this.init=this.init,this.Particle_init=this.Particle_init,this.update=this.update,this.Particle_update=this.Particle_update,this.applyArt=this.applyArt,this.kill=this.kill},n=r.prototype=Object.create(a.prototype);n.init=n.Particle_init=function(){this.age=0,this.velocity.x=this.startSpeed,this.velocity.y=0,s.rotatePoint(this.rotation,this.velocity),this.noRotation?this.rotation=0:this.rotation*=s.DEG_TO_RADS,this.rotationSpeed*=s.DEG_TO_RADS,this.alpha=this.startAlpha,this.scale.x=this.scale.y=this.startScale,this.startColor&&(this._sR=this.startColor[0],this._sG=this.startColor[1],this._sB=this.startColor[2],this.endColor&&(this._eR=this.endColor[0],this._eG=this.endColor[1],this._eB=this.endColor[2])),this._doAlpha=this.startAlpha!=this.endAlpha,this._doSpeed=this.startSpeed!=this.endSpeed,this._doScale=this.startScale!=this.endScale,this._doColor=!!this.endColor,this._doAcceleration=0!==this.acceleration.x||0!==this.acceleration.y,this._doNormalMovement=this._doSpeed||0!==this.startSpeed||this._doAcceleration,this._oneOverLife=1/this.maxLife,this.tint=s.combineRGBComponents(this._sR,this._sG,this._sB),this.visible=!0},n.applyArt=function(t){this.texture=t||s.EMPTY_TEXTURE},n.update=n.Particle_update=function(t){if(this.age+=t,this.age>=this.maxLife)return this.kill(),-1;var i=this.age*this._oneOverLife;if(this.ease&&(i=4==this.ease.length?this.ease(i,0,1,1):this.ease(i)),this._doAlpha&&(this.alpha=(this.endAlpha-this.startAlpha)*i+this.startAlpha),this._doScale){var e=(this.endScale-this.startScale)*i+this.startScale;this.scale.x=this.scale.y=e}if(this._doNormalMovement){if(this._doSpeed){var a=(this.endSpeed-this.startSpeed)*i+this.startSpeed;s.normalize(this.velocity),s.scaleBy(this.velocity,a)}else if(this._doAcceleration&&(this.velocity.x+=this.acceleration.x*t,this.velocity.y+=this.acceleration.y*t,this.maxSpeed)){var r=s.length(this.velocity);r>this.maxSpeed&&s.scaleBy(this.velocity,this.maxSpeed/r)}this.position.x+=this.velocity.x*t,this.position.y+=this.velocity.y*t}if(this._doColor){var n=(this._eR-this._sR)*i+this._sR,o=(this._eG-this._sG)*i+this._sG,h=(this._eB-this._sB)*i+this._sB;this.tint=s.combineRGBComponents(n,o,h)}return 0!==this.rotationSpeed?this.rotation+=this.rotationSpeed*t:this.acceleration&&!this.noRotation&&(this.rotation=Math.atan2(this.velocity.y,this.velocity.x)),i},n.kill=function(){this.emitter.recycle(this)},n.Sprite_Destroy=a.prototype.destroy,n.destroy=function(){this.parent&&this.parent.removeChild(this),this.Sprite_Destroy&&this.Sprite_Destroy(),this.emitter=this.velocity=this.startColor=this.endColor=this.ease=this.next=this.prev=null},r.parseArt=function(t){var i;for(i=t.length;i>=0;--i)"string"==typeof t[i]&&(t[i]=PIXI.Texture.fromImage(t[i]));if(s.verbose)for(i=t.length-1;i>0;--i)if(t[i].baseTexture!=t[i-1].baseTexture){window.console&&console.warn("PixiParticles: using particle textures from different images may hinder performance in WebGL");break}return t},r.parseData=function(t){return t},i.exports=r},{"./ParticleUtils":4}],4:[function(t,i,e){"use strict";var s=PIXI.BLEND_MODES||PIXI.blendModes,a=PIXI.Texture,r={};r.verbose=!1;var n=r.DEG_TO_RADS=Math.PI/180,o=r.EMPTY_TEXTURE=a.EMPTY;o.on=o.destroy=o.once=o.emit=function(){},r.rotatePoint=function(t,i){if(t){t*=n;var e=Math.sin(t),s=Math.cos(t),a=i.x*s-i.y*e,r=i.x*e+i.y*s;i.x=a,i.y=r}},r.combineRGBComponents=function(t,i,e){return t<<16|i<<8|e},r.normalize=function(t){var i=1/r.length(t);t.x*=i,t.y*=i},r.scaleBy=function(t,i){t.x*=i,t.y*=i},r.length=function(t){return Math.sqrt(t.x*t.x+t.y*t.y)},r.hexToRGB=function(t,i){i?i.length=0:i=[],"#"==t.charAt(0)?t=t.substr(1):0===t.indexOf("0x")&&(t=t.substr(2));var e;return 8==t.length&&(e=t.substr(0,2),t=t.substr(2)),i.push(parseInt(t.substr(0,2),16)),i.push(parseInt(t.substr(2,2),16)),i.push(parseInt(t.substr(4,2),16)),e&&i.push(parseInt(e,16)),i},r.generateEase=function(t){var i=t.length,e=1/i,s=function(s){var a,r,n=i*s|0;return a=(s-n*e)*i,r=t[n]||t[i-1],r.s+a*(2*(1-a)*(r.cp-r.s)+a*(r.e-r.s))};return s},r.getBlendMode=function(t){if(!t)return s.NORMAL;for(t=t.toUpperCase();t.indexOf(" ")>=0;)t=t.replace(" ","_");return s[t]||s.NORMAL},i.exports=r},{}],5:[function(t,i,e){"use strict";var s=t("./ParticleUtils"),a=t("./Particle"),r=function(t){a.call(this,t),this.path=null,this.initialRotation=0,this.initialPosition=new PIXI.Point,this.movement=0},n=a.prototype,o=r.prototype=Object.create(n),h=new PIXI.Point;o.init=function(){this.initialRotation=this.rotation,this.Particle_init(),this.path=this.extraData.path,this._doNormalMovement=!this.path,this.movement=0,this.initialPosition.x=this.position.x,this.initialPosition.y=this.position.y};for(var l=["pow","sqrt","abs","floor","round","ceil","E","PI","sin","cos","tan","asin","acos","atan","atan2","log"],p="[01234567890\\.\\*\\-\\+\\/\\(\\)x ,]",c=l.length-1;c>=0;--c)p+="|"+l[c];p=new RegExp(p,"g");var d=function(t){for(var i=t.match(p),e=i.length-1;e>=0;--e)l.indexOf(i[e])>=0&&(i[e]="Math."+i[e]);return t=i.join(""),new Function("x","return "+t+";")};o.update=function(t){var i=this.Particle_update(t);if(i>=0&&this.path){var e=(this.endSpeed-this.startSpeed)*i+this.startSpeed;this.movement+=e*t,h.x=this.movement,h.y=this.path(this.movement),s.rotatePoint(this.initialRotation,h),this.position.x=this.initialPosition.x+h.x,this.position.y=this.initialPosition.y+h.y}},o.Particle_destroy=a.prototype.destroy,o.destroy=function(){this.Particle_destroy(),this.path=this.initialPosition=null},r.parseArt=function(t){return a.parseArt(t)},r.parseData=function(t){var i={};if(t&&t.path)try{i.path=d(t.path)}catch(t){s.verbose&&console.error("PathParticle: error in parsing path expression"),i.path=null}else s.verbose&&console.error("PathParticle requires a path string in extraData!"),i.path=null;return i},i.exports=r},{"./Particle":3,"./ParticleUtils":4}],6:[function(t,i,e){},{}],7:[function(t,i,e){e.ParticleUtils=t("./ParticleUtils.js"),e.Particle=t("./Particle.js"),e.Emitter=t("./Emitter.js"),e.PathParticle=t("./PathParticle.js"),e.AnimatedParticle=t("./AnimatedParticle.js"),t("./deprecation.js")},{"./AnimatedParticle.js":1,"./Emitter.js":2,"./Particle.js":3,"./ParticleUtils.js":4,"./PathParticle.js":5,"./deprecation.js":6}],8:[function(t,i,e){"use strict";var s="undefined"!=typeof window?window:GLOBAL;if(s.PIXI.particles||(s.PIXI.particles={}),"undefined"!=typeof i&&i.exports)"undefined"==typeof PIXI&&t("pixi.js"),i.exports=s.PIXI.particles||a;else if("undefined"==typeof PIXI)throw"pixi-particles requires pixi.js to be loaded first";var a=t("./particles");for(var r in a)s.PIXI.particles[r]=a[r]},{"./particles":7,"pixi.js":void 0}]},{},[8])(8)});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
var pixi_projection;
(function (pixi_projection) {
    var utils;
    (function (utils) {
        function createIndicesForQuads(size) {
            var totalIndices = size * 6;
            var indices = new Uint16Array(totalIndices);
            for (var i = 0, j = 0; i < totalIndices; i += 6, j += 4) {
                indices[i + 0] = j + 0;
                indices[i + 1] = j + 1;
                indices[i + 2] = j + 2;
                indices[i + 3] = j + 0;
                indices[i + 4] = j + 2;
                indices[i + 5] = j + 3;
            }
            return indices;
        }
        utils.createIndicesForQuads = createIndicesForQuads;
        function isPow2(v) {
            return !(v & (v - 1)) && (!!v);
        }
        utils.isPow2 = isPow2;
        function nextPow2(v) {
            v += +(v === 0);
            --v;
            v |= v >>> 1;
            v |= v >>> 2;
            v |= v >>> 4;
            v |= v >>> 8;
            v |= v >>> 16;
            return v + 1;
        }
        utils.nextPow2 = nextPow2;
        function log2(v) {
            var r, shift;
            r = +(v > 0xFFFF) << 4;
            v >>>= r;
            shift = +(v > 0xFF) << 3;
            v >>>= shift;
            r |= shift;
            shift = +(v > 0xF) << 2;
            v >>>= shift;
            r |= shift;
            shift = +(v > 0x3) << 1;
            v >>>= shift;
            r |= shift;
            return r | (v >> 1);
        }
        utils.log2 = log2;
        function getIntersectionFactor(p1, p2, p3, p4, out) {
            var A1 = p2.x - p1.x, B1 = p3.x - p4.x, C1 = p3.x - p1.x;
            var A2 = p2.y - p1.y, B2 = p3.y - p4.y, C2 = p3.y - p1.y;
            var D = A1 * B2 - A2 * B1;
            if (Math.abs(D) < 1e-7) {
                out.x = A1;
                out.y = A2;
                return 0;
            }
            var T = C1 * B2 - C2 * B1;
            var U = A1 * C2 - A2 * C1;
            var t = T / D, u = U / D;
            if (u < (1e-6) || u - 1 > -1e-6) {
                return -1;
            }
            out.x = p1.x + t * (p2.x - p1.x);
            out.y = p1.y + t * (p2.y - p1.y);
            return 1;
        }
        utils.getIntersectionFactor = getIntersectionFactor;
        function getPositionFromQuad(p, anchor, out) {
            out = out || new PIXI.Point();
            var a1 = 1.0 - anchor.x, a2 = 1.0 - a1;
            var b1 = 1.0 - anchor.y, b2 = 1.0 - b1;
            out.x = (p[0].x * a1 + p[1].x * a2) * b1 + (p[3].x * a1 + p[2].x * a2) * b2;
            out.y = (p[0].y * a1 + p[1].y * a2) * b1 + (p[3].y * a1 + p[2].y * a2) * b2;
            return out;
        }
        utils.getPositionFromQuad = getPositionFromQuad;
    })(utils = pixi_projection.utils || (pixi_projection.utils = {}));
})(pixi_projection || (pixi_projection = {}));
PIXI.projection = pixi_projection;
var pixi_projection;
(function (pixi_projection) {
    var Projection = (function () {
        function Projection(legacy, enable) {
            if (enable === void 0) { enable = true; }
            this._enabled = false;
            this.legacy = legacy;
            if (enable) {
                this.enabled = true;
            }
            this.legacy.proj = this;
        }
        Object.defineProperty(Projection.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            set: function (value) {
                this._enabled = value;
            },
            enumerable: true,
            configurable: true
        });
        Projection.prototype.clear = function () {
        };
        return Projection;
    }());
    pixi_projection.Projection = Projection;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var webgl;
    (function (webgl) {
        var BatchBuffer = (function () {
            function BatchBuffer(size) {
                this.vertices = new ArrayBuffer(size);
                this.float32View = new Float32Array(this.vertices);
                this.uint32View = new Uint32Array(this.vertices);
            }
            BatchBuffer.prototype.destroy = function () {
                this.vertices = null;
            };
            return BatchBuffer;
        }());
        webgl.BatchBuffer = BatchBuffer;
    })(webgl = pixi_projection.webgl || (pixi_projection.webgl = {}));
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var webgl;
    (function (webgl) {
        function generateMultiTextureShader(vertexSrc, fragmentSrc, gl, maxTextures) {
            fragmentSrc = fragmentSrc.replace(/%count%/gi, maxTextures + '');
            fragmentSrc = fragmentSrc.replace(/%forloop%/gi, generateSampleSrc(maxTextures));
            var shader = new PIXI.Shader(gl, vertexSrc, fragmentSrc);
            var sampleValues = new Int32Array(maxTextures);
            for (var i = 0; i < maxTextures; i++) {
                sampleValues[i] = i;
            }
            shader.bind();
            shader.uniforms.uSamplers = sampleValues;
            return shader;
        }
        webgl.generateMultiTextureShader = generateMultiTextureShader;
        function generateSampleSrc(maxTextures) {
            var src = '';
            src += '\n';
            src += '\n';
            for (var i = 0; i < maxTextures; i++) {
                if (i > 0) {
                    src += '\nelse ';
                }
                if (i < maxTextures - 1) {
                    src += "if(textureId == " + i + ".0)";
                }
                src += '\n{';
                src += "\n\tcolor = texture2D(uSamplers[" + i + "], textureCoord);";
                src += '\n}';
            }
            src += '\n';
            src += '\n';
            return src;
        }
    })(webgl = pixi_projection.webgl || (pixi_projection.webgl = {}));
})(pixi_projection || (pixi_projection = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var pixi_projection;
(function (pixi_projection) {
    var webgl;
    (function (webgl) {
        var ObjectRenderer = PIXI.ObjectRenderer;
        var settings = PIXI.settings;
        var GLBuffer = PIXI.glCore.GLBuffer;
        var premultiplyTint = PIXI.utils.premultiplyTint;
        var premultiplyBlendMode = PIXI.utils.premultiplyBlendMode;
        var TICK = 0;
        var BatchGroup = (function () {
            function BatchGroup() {
                this.textures = [];
                this.textureCount = 0;
                this.ids = [];
                this.size = 0;
                this.start = 0;
                this.blend = PIXI.BLEND_MODES.NORMAL;
                this.uniforms = null;
            }
            return BatchGroup;
        }());
        webgl.BatchGroup = BatchGroup;
        var MultiTextureSpriteRenderer = (function (_super) {
            __extends(MultiTextureSpriteRenderer, _super);
            function MultiTextureSpriteRenderer(renderer) {
                var _this = _super.call(this, renderer) || this;
                _this.shaderVert = '';
                _this.shaderFrag = '';
                _this.MAX_TEXTURES_LOCAL = 32;
                _this.vertSize = 5;
                _this.vertByteSize = _this.vertSize * 4;
                _this.size = settings.SPRITE_BATCH_SIZE;
                _this.currentIndex = 0;
                _this.sprites = [];
                _this.vertexBuffers = [];
                _this.vaos = [];
                _this.vaoMax = 2;
                _this.vertexCount = 0;
                _this.MAX_TEXTURES = 1;
                _this.indices = pixi_projection.utils.createIndicesForQuads(_this.size);
                _this.groups = [];
                for (var k = 0; k < _this.size; k++) {
                    _this.groups[k] = new BatchGroup();
                }
                _this.vaoMax = 2;
                _this.vertexCount = 0;
                _this.renderer.on('prerender', _this.onPrerender, _this);
                return _this;
            }
            MultiTextureSpriteRenderer.prototype.getUniforms = function (spr) {
                return null;
            };
            MultiTextureSpriteRenderer.prototype.syncUniforms = function (obj) {
                if (!obj)
                    return;
                var sh = this.shader;
                for (var key in obj) {
                    sh.uniforms[key] = obj[key];
                }
            };
            MultiTextureSpriteRenderer.prototype.onContextChange = function () {
                var gl = this.renderer.gl;
                this.MAX_TEXTURES = Math.min(this.MAX_TEXTURES_LOCAL, this.renderer.plugins['sprite'].MAX_TEXTURES);
                this.shader = webgl.generateMultiTextureShader(this.shaderVert, this.shaderFrag, gl, this.MAX_TEXTURES);
                this.indexBuffer = GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);
                this.renderer.bindVao(null);
                var attrs = this.shader.attributes;
                for (var i = 0; i < this.vaoMax; i++) {
                    var vertexBuffer = this.vertexBuffers[i] = GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);
                    this.vaos[i] = this.createVao(vertexBuffer);
                }
                if (!this.buffers) {
                    this.buffers = [];
                    for (var i = 1; i <= pixi_projection.utils.nextPow2(this.size); i *= 2) {
                        this.buffers.push(new webgl.BatchBuffer(i * 4 * this.vertByteSize));
                    }
                }
                this.vao = this.vaos[0];
            };
            MultiTextureSpriteRenderer.prototype.onPrerender = function () {
                this.vertexCount = 0;
            };
            MultiTextureSpriteRenderer.prototype.render = function (sprite) {
                if (this.currentIndex >= this.size) {
                    this.flush();
                }
                if (!sprite._texture._uvs) {
                    return;
                }
                if (!sprite._texture.baseTexture) {
                    return;
                }
                this.sprites[this.currentIndex++] = sprite;
            };
            MultiTextureSpriteRenderer.prototype.flush = function () {
                if (this.currentIndex === 0) {
                    return;
                }
                var gl = this.renderer.gl;
                var MAX_TEXTURES = this.MAX_TEXTURES;
                var np2 = pixi_projection.utils.nextPow2(this.currentIndex);
                var log2 = pixi_projection.utils.log2(np2);
                var buffer = this.buffers[log2];
                var sprites = this.sprites;
                var groups = this.groups;
                var float32View = buffer.float32View;
                var uint32View = buffer.uint32View;
                var index = 0;
                var nextTexture;
                var currentTexture;
                var currentUniforms = null;
                var groupCount = 1;
                var textureCount = 0;
                var currentGroup = groups[0];
                var vertexData;
                var uvs;
                var blendMode = premultiplyBlendMode[sprites[0]._texture.baseTexture.premultipliedAlpha ? 1 : 0][sprites[0].blendMode];
                currentGroup.textureCount = 0;
                currentGroup.start = 0;
                currentGroup.blend = blendMode;
                TICK++;
                var i;
                for (i = 0; i < this.currentIndex; ++i) {
                    var sprite = sprites[i];
                    nextTexture = sprite._texture.baseTexture;
                    var spriteBlendMode = premultiplyBlendMode[Number(nextTexture.premultipliedAlpha)][sprite.blendMode];
                    if (blendMode !== spriteBlendMode) {
                        blendMode = spriteBlendMode;
                        currentTexture = null;
                        textureCount = MAX_TEXTURES;
                        TICK++;
                    }
                    var uniforms = this.getUniforms(sprite);
                    if (currentUniforms !== uniforms) {
                        currentUniforms = uniforms;
                        currentTexture = null;
                        textureCount = MAX_TEXTURES;
                        TICK++;
                    }
                    if (currentTexture !== nextTexture) {
                        currentTexture = nextTexture;
                        if (nextTexture._enabled !== TICK) {
                            if (textureCount === MAX_TEXTURES) {
                                TICK++;
                                textureCount = 0;
                                currentGroup.size = i - currentGroup.start;
                                currentGroup = groups[groupCount++];
                                currentGroup.textureCount = 0;
                                currentGroup.blend = blendMode;
                                currentGroup.start = i;
                                currentGroup.uniforms = currentUniforms;
                            }
                            nextTexture._enabled = TICK;
                            nextTexture._virtalBoundId = textureCount;
                            currentGroup.textures[currentGroup.textureCount++] = nextTexture;
                            textureCount++;
                        }
                    }
                    var alpha = Math.min(sprite.worldAlpha, 1.0);
                    var argb = alpha < 1.0 && nextTexture.premultipliedAlpha ? premultiplyTint(sprite._tintRGB, alpha)
                        : sprite._tintRGB + (alpha * 255 << 24);
                    this.fillVertices(float32View, uint32View, index, sprite, argb, nextTexture._virtalBoundId);
                    index += this.vertSize * 4;
                }
                currentGroup.size = i - currentGroup.start;
                if (!settings.CAN_UPLOAD_SAME_BUFFER) {
                    if (this.vaoMax <= this.vertexCount) {
                        this.vaoMax++;
                        var attrs = this.shader.attributes;
                        var vertexBuffer = this.vertexBuffers[this.vertexCount] = GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);
                        this.vaos[this.vertexCount] = this.createVao(vertexBuffer);
                    }
                    this.renderer.bindVao(this.vaos[this.vertexCount]);
                    this.vertexBuffers[this.vertexCount].upload(buffer.vertices, 0, false);
                    this.vertexCount++;
                }
                else {
                    this.vertexBuffers[this.vertexCount].upload(buffer.vertices, 0, true);
                }
                currentUniforms = null;
                for (i = 0; i < groupCount; i++) {
                    var group = groups[i];
                    var groupTextureCount = group.textureCount;
                    if (group.uniforms !== currentUniforms) {
                        this.syncUniforms(group.uniforms);
                    }
                    for (var j = 0; j < groupTextureCount; j++) {
                        this.renderer.bindTexture(group.textures[j], j, true);
                        group.textures[j]._virtalBoundId = -1;
                        var v = this.shader.uniforms.samplerSize;
                        if (v) {
                            v[0] = group.textures[j].realWidth;
                            v[1] = group.textures[j].realHeight;
                            this.shader.uniforms.samplerSize = v;
                        }
                    }
                    this.renderer.state.setBlendMode(group.blend);
                    gl.drawElements(gl.TRIANGLES, group.size * 6, gl.UNSIGNED_SHORT, group.start * 6 * 2);
                }
                this.currentIndex = 0;
            };
            MultiTextureSpriteRenderer.prototype.start = function () {
                this.renderer.bindShader(this.shader);
                if (settings.CAN_UPLOAD_SAME_BUFFER) {
                    this.renderer.bindVao(this.vaos[this.vertexCount]);
                    this.vertexBuffers[this.vertexCount].bind();
                }
            };
            MultiTextureSpriteRenderer.prototype.stop = function () {
                this.flush();
            };
            MultiTextureSpriteRenderer.prototype.destroy = function () {
                for (var i = 0; i < this.vaoMax; i++) {
                    if (this.vertexBuffers[i]) {
                        this.vertexBuffers[i].destroy();
                    }
                    if (this.vaos[i]) {
                        this.vaos[i].destroy();
                    }
                }
                if (this.indexBuffer) {
                    this.indexBuffer.destroy();
                }
                this.renderer.off('prerender', this.onPrerender, this);
                _super.prototype.destroy.call(this);
                if (this.shader) {
                    this.shader.destroy();
                    this.shader = null;
                }
                this.vertexBuffers = null;
                this.vaos = null;
                this.indexBuffer = null;
                this.indices = null;
                this.sprites = null;
                for (var i = 0; i < this.buffers.length; ++i) {
                    this.buffers[i].destroy();
                }
            };
            return MultiTextureSpriteRenderer;
        }(ObjectRenderer));
        webgl.MultiTextureSpriteRenderer = MultiTextureSpriteRenderer;
    })(webgl = pixi_projection.webgl || (pixi_projection.webgl = {}));
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var p = [new PIXI.Point(), new PIXI.Point(), new PIXI.Point(), new PIXI.Point()];
    var a = [0, 0, 0, 0];
    var Surface = (function () {
        function Surface() {
            this.surfaceID = "default";
            this._updateID = 0;
            this.vertexSrc = "";
            this.fragmentSrc = "";
        }
        Surface.prototype.fillUniforms = function (uniforms) {
        };
        Surface.prototype.clear = function () {
        };
        Surface.prototype.boundsQuad = function (v, out, after) {
            var minX = out[0], minY = out[1];
            var maxX = out[0], maxY = out[1];
            for (var i = 2; i < 8; i += 2) {
                if (minX > out[i])
                    minX = out[i];
                if (maxX < out[i])
                    maxX = out[i];
                if (minY > out[i + 1])
                    minY = out[i + 1];
                if (maxY < out[i + 1])
                    maxY = out[i + 1];
            }
            p[0].set(minX, minY);
            this.apply(p[0], p[0]);
            p[1].set(maxX, minY);
            this.apply(p[1], p[1]);
            p[2].set(maxX, maxY);
            this.apply(p[2], p[2]);
            p[3].set(minX, maxY);
            this.apply(p[3], p[3]);
            if (after) {
                after.apply(p[0], p[0]);
                after.apply(p[1], p[1]);
                after.apply(p[2], p[2]);
                after.apply(p[3], p[3]);
                out[0] = p[0].x;
                out[1] = p[0].y;
                out[2] = p[1].x;
                out[3] = p[1].y;
                out[4] = p[2].x;
                out[5] = p[2].y;
                out[6] = p[3].x;
                out[7] = p[3].y;
            }
            else {
                for (var i = 1; i <= 3; i++) {
                    if (p[i].y < p[0].y || p[i].y == p[0].y && p[i].x < p[0].x) {
                        var t = p[0];
                        p[0] = p[i];
                        p[i] = t;
                    }
                }
                for (var i = 1; i <= 3; i++) {
                    a[i] = Math.atan2(p[i].y - p[0].y, p[i].x - p[0].x);
                }
                for (var i = 1; i <= 3; i++) {
                    for (var j = i + 1; j <= 3; j++) {
                        if (a[i] > a[j]) {
                            var t = p[i];
                            p[i] = p[j];
                            p[j] = t;
                            var t2 = a[i];
                            a[i] = a[j];
                            a[j] = t2;
                        }
                    }
                }
                out[0] = p[0].x;
                out[1] = p[0].y;
                out[2] = p[1].x;
                out[3] = p[1].y;
                out[4] = p[2].x;
                out[5] = p[2].y;
                out[6] = p[3].x;
                out[7] = p[3].y;
                if ((p[3].x - p[2].x) * (p[1].y - p[2].y) - (p[1].x - p[2].x) * (p[3].y - p[2].y) < 0) {
                    out[4] = p[3].x;
                    out[5] = p[3].y;
                    return;
                }
            }
        };
        return Surface;
    }());
    pixi_projection.Surface = Surface;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var tempMat = new PIXI.Matrix();
    var tempRect = new PIXI.Rectangle();
    var tempPoint = new PIXI.Point();
    var BilinearSurface = (function (_super) {
        __extends(BilinearSurface, _super);
        function BilinearSurface() {
            var _this = _super.call(this) || this;
            _this.distortion = new PIXI.Point();
            return _this;
        }
        BilinearSurface.prototype.clear = function () {
            this.distortion.set(0, 0);
        };
        BilinearSurface.prototype.apply = function (pos, newPos) {
            newPos = newPos || new PIXI.Point();
            var d = this.distortion;
            var m = pos.x * pos.y;
            newPos.x = pos.x + d.x * m;
            newPos.y = pos.y + d.y * m;
            return newPos;
        };
        BilinearSurface.prototype.applyInverse = function (pos, newPos) {
            newPos = newPos || new PIXI.Point();
            var vx = pos.x, vy = pos.y;
            var dx = this.distortion.x, dy = this.distortion.y;
            if (dx == 0.0) {
                newPos.x = vx;
                newPos.y = vy / (1.0 + dy * vx);
            }
            else if (dy == 0.0) {
                newPos.y = vy;
                newPos.x = vx / (1.0 + dx * vy);
            }
            else {
                var b = (vy * dx - vx * dy + 1.0) * 0.5 / dy;
                var d = b * b + vx / dy;
                if (d <= 0.00001) {
                    newPos.set(NaN, NaN);
                    return;
                }
                if (dy > 0.0) {
                    newPos.x = -b + Math.sqrt(d);
                }
                else {
                    newPos.x = -b - Math.sqrt(d);
                }
                newPos.y = (vx / newPos.x - 1.0) / dx;
            }
            return newPos;
        };
        BilinearSurface.prototype.mapSprite = function (sprite, quad, outTransform) {
            var tex = sprite.texture;
            tempRect.x = -sprite.anchor.x * tex.orig.width;
            tempRect.y = -sprite.anchor.y * tex.orig.height;
            tempRect.width = tex.orig.width;
            tempRect.height = tex.orig.height;
            return this.mapQuad(tempRect, quad, outTransform || sprite.transform);
        };
        BilinearSurface.prototype.mapQuad = function (rect, quad, outTransform) {
            var ax = -rect.x / rect.width;
            var ay = -rect.y / rect.height;
            var ax2 = (1.0 - rect.x) / rect.width;
            var ay2 = (1.0 - rect.y) / rect.height;
            var up1x = (quad[0].x * (1.0 - ax) + quad[1].x * ax);
            var up1y = (quad[0].y * (1.0 - ax) + quad[1].y * ax);
            var up2x = (quad[0].x * (1.0 - ax2) + quad[1].x * ax2);
            var up2y = (quad[0].y * (1.0 - ax2) + quad[1].y * ax2);
            var down1x = (quad[3].x * (1.0 - ax) + quad[2].x * ax);
            var down1y = (quad[3].y * (1.0 - ax) + quad[2].y * ax);
            var down2x = (quad[3].x * (1.0 - ax2) + quad[2].x * ax2);
            var down2y = (quad[3].y * (1.0 - ax2) + quad[2].y * ax2);
            var x00 = up1x * (1.0 - ay) + down1x * ay;
            var y00 = up1y * (1.0 - ay) + down1y * ay;
            var x10 = up2x * (1.0 - ay) + down2x * ay;
            var y10 = up2y * (1.0 - ay) + down2y * ay;
            var x01 = up1x * (1.0 - ay2) + down1x * ay2;
            var y01 = up1y * (1.0 - ay2) + down1y * ay2;
            var x11 = up2x * (1.0 - ay2) + down2x * ay2;
            var y11 = up2y * (1.0 - ay2) + down2y * ay2;
            var mat = tempMat;
            mat.tx = x00;
            mat.ty = y00;
            mat.a = x10 - x00;
            mat.b = y10 - y00;
            mat.c = x01 - x00;
            mat.d = y01 - y00;
            tempPoint.set(x11, y11);
            mat.applyInverse(tempPoint, tempPoint);
            this.distortion.set(tempPoint.x - 1, tempPoint.y - 1);
            outTransform.setFromMatrix(mat);
            return this;
        };
        BilinearSurface.prototype.fillUniforms = function (uniforms) {
            uniforms.distortion = uniforms.distortion || new Float32Array([0, 0, 0, 0]);
            var ax = Math.abs(this.distortion.x);
            var ay = Math.abs(this.distortion.y);
            uniforms.distortion[0] = ax * 10000 <= ay ? 0 : this.distortion.x;
            uniforms.distortion[1] = ay * 10000 <= ax ? 0 : this.distortion.y;
            uniforms.distortion[2] = 1.0 / uniforms.distortion[0];
            uniforms.distortion[3] = 1.0 / uniforms.distortion[1];
        };
        return BilinearSurface;
    }(pixi_projection.Surface));
    pixi_projection.BilinearSurface = BilinearSurface;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Container2s = (function (_super) {
        __extends(Container2s, _super);
        function Container2s() {
            var _this = _super.call(this) || this;
            _this.proj = new pixi_projection.ProjectionSurface(_this.transform);
            return _this;
        }
        Object.defineProperty(Container2s.prototype, "worldTransform", {
            get: function () {
                return this.proj;
            },
            enumerable: true,
            configurable: true
        });
        return Container2s;
    }(PIXI.Container));
    pixi_projection.Container2s = Container2s;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var fun = PIXI.TransformStatic.prototype.updateTransform;
    function transformHack(parentTransform) {
        var proj = this.proj;
        var pp = parentTransform.proj;
        var ta = this;
        if (!pp) {
            fun.call(this, parentTransform);
            proj._activeProjection = null;
            return;
        }
        if (pp._surface) {
            proj._activeProjection = pp;
            this.updateLocalTransform();
            this.localTransform.copy(this.worldTransform);
            if (ta._parentID < 0) {
                ++ta._worldID;
            }
            return;
        }
        fun.call(this, parentTransform);
        proj._activeProjection = pp._activeProjection;
    }
    var ProjectionSurface = (function (_super) {
        __extends(ProjectionSurface, _super);
        function ProjectionSurface(legacy, enable) {
            var _this = _super.call(this, legacy, enable) || this;
            _this._surface = null;
            _this._activeProjection = null;
            _this._currentSurfaceID = -1;
            _this._currentLegacyID = -1;
            _this._lastUniforms = null;
            return _this;
        }
        Object.defineProperty(ProjectionSurface.prototype, "enabled", {
            set: function (value) {
                if (value === this._enabled) {
                    return;
                }
                this._enabled = value;
                if (value) {
                    this.legacy.updateTransform = transformHack;
                    this.legacy._parentID = -1;
                }
                else {
                    this.legacy.updateTransform = PIXI.TransformStatic.prototype.updateTransform;
                    this.legacy._parentID = -1;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProjectionSurface.prototype, "surface", {
            get: function () {
                return this._surface;
            },
            set: function (value) {
                if (this._surface == value) {
                    return;
                }
                this._surface = value || null;
                this.legacy._parentID = -1;
            },
            enumerable: true,
            configurable: true
        });
        ProjectionSurface.prototype.applyPartial = function (pos, newPos) {
            if (this._activeProjection !== null) {
                newPos = this.legacy.worldTransform.apply(pos, newPos);
                return this._activeProjection.surface.apply(newPos, newPos);
            }
            if (this._surface !== null) {
                return this.surface.apply(pos, newPos);
            }
            return this.legacy.worldTransform.apply(pos, newPos);
        };
        ProjectionSurface.prototype.apply = function (pos, newPos) {
            if (this._activeProjection !== null) {
                newPos = this.legacy.worldTransform.apply(pos, newPos);
                this._activeProjection.surface.apply(newPos, newPos);
                return this._activeProjection.legacy.worldTransform.apply(newPos, newPos);
            }
            if (this._surface !== null) {
                newPos = this.surface.apply(pos, newPos);
                return this.legacy.worldTransform.apply(newPos, newPos);
            }
            return this.legacy.worldTransform.apply(pos, newPos);
        };
        ProjectionSurface.prototype.applyInverse = function (pos, newPos) {
            if (this._activeProjection !== null) {
                newPos = this._activeProjection.legacy.worldTransform.applyInverse(pos, newPos);
                this._activeProjection._surface.applyInverse(newPos, newPos);
                return this.legacy.worldTransform.applyInverse(newPos, newPos);
            }
            if (this._surface !== null) {
                newPos = this.legacy.worldTransform.applyInverse(pos, newPos);
                return this._surface.applyInverse(newPos, newPos);
            }
            return this.legacy.worldTransform.applyInverse(pos, newPos);
        };
        ProjectionSurface.prototype.mapBilinearSprite = function (sprite, quad) {
            if (!(this._surface instanceof pixi_projection.BilinearSurface)) {
                this.surface = new pixi_projection.BilinearSurface();
            }
            this.surface.mapSprite(sprite, quad, this.legacy);
        };
        ProjectionSurface.prototype.clear = function () {
            if (this.surface) {
                this.surface.clear();
            }
        };
        Object.defineProperty(ProjectionSurface.prototype, "uniforms", {
            get: function () {
                if (this._currentLegacyID === this.legacy._worldID &&
                    this._currentSurfaceID === this.surface._updateID) {
                    return this._lastUniforms;
                }
                this._lastUniforms = this._lastUniforms || {};
                this._lastUniforms.worldTransform = this.legacy.worldTransform.toArray(true);
                this._surface.fillUniforms(this._lastUniforms);
                return this._lastUniforms;
            },
            enumerable: true,
            configurable: true
        });
        return ProjectionSurface;
    }(pixi_projection.Projection));
    pixi_projection.ProjectionSurface = ProjectionSurface;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var MultiTextureSpriteRenderer = pixi_projection.webgl.MultiTextureSpriteRenderer;
    var SpriteBilinearRenderer = (function (_super) {
        __extends(SpriteBilinearRenderer, _super);
        function SpriteBilinearRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.size = 100;
            _this.MAX_TEXTURES_LOCAL = 1;
            _this.shaderVert = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec3 aTrans1;\nattribute vec3 aTrans2;\nattribute vec4 aFrame;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 worldTransform;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vTrans1;\nvarying vec3 vTrans2;\nvarying vec4 vFrame;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position.xyw = projectionMatrix * worldTransform * vec3(aVertexPosition, 1.0);\n    gl_Position.z = 0.0;\n    \n    vTextureCoord = aVertexPosition;\n    vTrans1 = aTrans1;\n    vTrans2 = aTrans2;\n    vTextureId = aTextureId;\n    vColor = aColor;\n    vFrame = aFrame;\n}\n";
            _this.shaderFrag = "precision highp float;\nvarying vec2 vTextureCoord;\nvarying vec3 vTrans1;\nvarying vec3 vTrans2;\nvarying vec4 vFrame;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nuniform sampler2D uSamplers[%count%];\nuniform vec2 samplerSize[%count%]; \nuniform vec4 distortion;\n\nvoid main(void){\nvec2 surface;\nvec2 surface2;\n\nfloat vx = vTextureCoord.x;\nfloat vy = vTextureCoord.y;\nfloat dx = distortion.x;\nfloat dy = distortion.y;\nfloat revx = distortion.z;\nfloat revy = distortion.w;\n\nif (distortion.x == 0.0) {\n    surface.x = vx;\n    surface.y = vy / (1.0 + dy * vx);\n    surface2 = surface;\n} else\nif (distortion.y == 0.0) {\n    surface.y = vy;\n    surface.x = vx/ (1.0 + dx * vy);\n    surface2 = surface;\n} else {\n    float c = vy * dx - vx * dy;\n    float b = (c + 1.0) * 0.5;\n    float b2 = (-c + 1.0) * 0.5;\n    float d = b * b + vx * dy;\n    if (d < -0.00001) {\n        discard;\n    }\n    d = sqrt(max(d, 0.0));\n    surface.x = (- b + d) * revy;\n    surface2.x = (- b - d) * revy;\n    surface.y = (- b2 + d) * revx;\n    surface2.y = (- b2 - d) * revx;\n}\n\nvec2 uv;\nuv.x = vTrans1.x * surface.x + vTrans1.y * surface.y + vTrans1.z;\nuv.y = vTrans2.x * surface.x + vTrans2.y * surface.y + vTrans2.z;\n\nvec2 pixels = uv * samplerSize[0];\n\nif (pixels.x < vFrame.x || pixels.x > vFrame.z ||\n    pixels.y < vFrame.y || pixels.y > vFrame.w) {\n    uv.x = vTrans1.x * surface2.x + vTrans1.y * surface2.y + vTrans1.z;\n    uv.y = vTrans2.x * surface2.x + vTrans2.y * surface2.y + vTrans2.z;\n    pixels = uv * samplerSize[0];\n    \n    if (pixels.x < vFrame.x || pixels.x > vFrame.z ||\n        pixels.y < vFrame.y || pixels.y > vFrame.w) {\n        discard;\n    }\n}\n\nvec4 edge;\nedge.xy = clamp(pixels - vFrame.xy + 0.5, vec2(0.0, 0.0), vec2(1.0, 1.0));\nedge.zw = clamp(vFrame.zw - pixels + 0.5, vec2(0.0, 0.0), vec2(1.0, 1.0));\n\nfloat alpha = 1.0; //edge.x * edge.y * edge.z * edge.w;\nvec4 rColor = vColor * alpha;\n\nfloat textureId = floor(vTextureId+0.5);\nvec4 color;\nvec2 textureCoord = uv;\n%forloop%\ngl_FragColor = color * rColor;\n}";
            _this.defUniforms = {
                worldTransform: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                distortion: new Float32Array([0, 0])
            };
            return _this;
        }
        SpriteBilinearRenderer.prototype.getUniforms = function (sprite) {
            var proj = sprite.proj;
            var shader = this.shader;
            if (proj.surface !== null) {
                return proj.uniforms;
            }
            if (proj._activeProjection !== null) {
                return proj._activeProjection.uniforms;
            }
            return this.defUniforms;
        };
        SpriteBilinearRenderer.prototype.createVao = function (vertexBuffer) {
            var attrs = this.shader.attributes;
            this.vertSize = 14;
            this.vertByteSize = this.vertSize * 4;
            var gl = this.renderer.gl;
            var vao = this.renderer.createVao()
                .addIndex(this.indexBuffer)
                .addAttribute(vertexBuffer, attrs.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0)
                .addAttribute(vertexBuffer, attrs.aTrans1, gl.FLOAT, false, this.vertByteSize, 2 * 4)
                .addAttribute(vertexBuffer, attrs.aTrans2, gl.FLOAT, false, this.vertByteSize, 5 * 4)
                .addAttribute(vertexBuffer, attrs.aFrame, gl.FLOAT, false, this.vertByteSize, 8 * 4)
                .addAttribute(vertexBuffer, attrs.aColor, gl.UNSIGNED_BYTE, true, this.vertByteSize, 12 * 4);
            if (attrs.aTextureId) {
                vao.addAttribute(vertexBuffer, attrs.aTextureId, gl.FLOAT, false, this.vertByteSize, 13 * 4);
            }
            return vao;
        };
        SpriteBilinearRenderer.prototype.fillVertices = function (float32View, uint32View, index, sprite, argb, textureId) {
            var vertexData = sprite.vertexData;
            var tex = sprite._texture;
            var w = tex.orig.width;
            var h = tex.orig.height;
            var ax = sprite._anchor._x;
            var ay = sprite._anchor._y;
            var frame = tex._frame;
            var aTrans = sprite.aTrans;
            for (var i = 0; i < 4; i++) {
                float32View[index] = vertexData[i * 2];
                float32View[index + 1] = vertexData[i * 2 + 1];
                float32View[index + 2] = aTrans.a;
                float32View[index + 3] = aTrans.c;
                float32View[index + 4] = aTrans.tx;
                float32View[index + 5] = aTrans.b;
                float32View[index + 6] = aTrans.d;
                float32View[index + 7] = aTrans.ty;
                float32View[index + 8] = frame.x;
                float32View[index + 9] = frame.y;
                float32View[index + 10] = frame.x + frame.width;
                float32View[index + 11] = frame.y + frame.height;
                uint32View[index + 12] = argb;
                float32View[index + 13] = textureId;
                index += 14;
            }
        };
        return SpriteBilinearRenderer;
    }(MultiTextureSpriteRenderer));
    PIXI.WebGLRenderer.registerPlugin('sprite_bilinear', SpriteBilinearRenderer);
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var MultiTextureSpriteRenderer = pixi_projection.webgl.MultiTextureSpriteRenderer;
    var SpriteStrangeRenderer = (function (_super) {
        __extends(SpriteStrangeRenderer, _super);
        function SpriteStrangeRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.size = 100;
            _this.MAX_TEXTURES_LOCAL = 1;
            _this.shaderVert = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec3 aTrans1;\nattribute vec3 aTrans2;\nattribute vec4 aFrame;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 worldTransform;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vTrans1;\nvarying vec3 vTrans2;\nvarying vec4 vFrame;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position.xyw = projectionMatrix * worldTransform * vec3(aVertexPosition, 1.0);\n    gl_Position.z = 0.0;\n    \n    vTextureCoord = aVertexPosition;\n    vTrans1 = aTrans1;\n    vTrans2 = aTrans2;\n    vTextureId = aTextureId;\n    vColor = aColor;\n    vFrame = aFrame;\n}\n";
            _this.shaderFrag = "precision highp float;\nvarying vec2 vTextureCoord;\nvarying vec3 vTrans1;\nvarying vec3 vTrans2;\nvarying vec4 vFrame;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nuniform sampler2D uSamplers[%count%];\nuniform vec2 samplerSize[%count%]; \nuniform vec4 params;\n\nvoid main(void){\nvec2 surface;\n\nfloat vx = vTextureCoord.x;\nfloat vy = vTextureCoord.y;\nfloat aleph = params.x;\nfloat bet = params.y;\nfloat A = params.z;\nfloat B = params.w;\n\nif (aleph == 0.0) {\n\tsurface.y = vy / (1.0 + vx * bet);\n\tsurface.x = vx;\n}\nelse if (bet == 0.0) {\n\tsurface.x = vx / (1.0 + vy * aleph);\n\tsurface.y = vy;\n} else {\n\tsurface.x = vx * (bet + 1.0) / (bet + 1.0 + vy * aleph);\n\tsurface.y = vy * (aleph + 1.0) / (aleph + 1.0 + vx * bet);\n}\n\nvec2 uv;\nuv.x = vTrans1.x * surface.x + vTrans1.y * surface.y + vTrans1.z;\nuv.y = vTrans2.x * surface.x + vTrans2.y * surface.y + vTrans2.z;\n\nvec2 pixels = uv * samplerSize[0];\n\nvec4 edge;\nedge.xy = clamp(pixels - vFrame.xy + 0.5, vec2(0.0, 0.0), vec2(1.0, 1.0));\nedge.zw = clamp(vFrame.zw - pixels + 0.5, vec2(0.0, 0.0), vec2(1.0, 1.0));\n\nfloat alpha = edge.x * edge.y * edge.z * edge.w;\nvec4 rColor = vColor * alpha;\n\nfloat textureId = floor(vTextureId+0.5);\nvec4 color;\nvec2 textureCoord = uv;\n%forloop%\ngl_FragColor = color * rColor;\n}";
            _this.defUniforms = {
                worldTransform: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                distortion: new Float32Array([0, 0])
            };
            return _this;
        }
        SpriteStrangeRenderer.prototype.getUniforms = function (sprite) {
            var proj = sprite.proj;
            var shader = this.shader;
            if (proj.surface !== null) {
                return proj.uniforms;
            }
            if (proj._activeProjection !== null) {
                return proj._activeProjection.uniforms;
            }
            return this.defUniforms;
        };
        SpriteStrangeRenderer.prototype.createVao = function (vertexBuffer) {
            var attrs = this.shader.attributes;
            this.vertSize = 14;
            this.vertByteSize = this.vertSize * 4;
            var gl = this.renderer.gl;
            var vao = this.renderer.createVao()
                .addIndex(this.indexBuffer)
                .addAttribute(vertexBuffer, attrs.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0)
                .addAttribute(vertexBuffer, attrs.aTrans1, gl.FLOAT, false, this.vertByteSize, 2 * 4)
                .addAttribute(vertexBuffer, attrs.aTrans2, gl.FLOAT, false, this.vertByteSize, 5 * 4)
                .addAttribute(vertexBuffer, attrs.aFrame, gl.FLOAT, false, this.vertByteSize, 8 * 4)
                .addAttribute(vertexBuffer, attrs.aColor, gl.UNSIGNED_BYTE, true, this.vertByteSize, 12 * 4);
            if (attrs.aTextureId) {
                vao.addAttribute(vertexBuffer, attrs.aTextureId, gl.FLOAT, false, this.vertByteSize, 13 * 4);
            }
            return vao;
        };
        SpriteStrangeRenderer.prototype.fillVertices = function (float32View, uint32View, index, sprite, argb, textureId) {
            var vertexData = sprite.vertexData;
            var tex = sprite._texture;
            var w = tex.orig.width;
            var h = tex.orig.height;
            var ax = sprite._anchor._x;
            var ay = sprite._anchor._y;
            var frame = tex._frame;
            var aTrans = sprite.aTrans;
            for (var i = 0; i < 4; i++) {
                float32View[index] = vertexData[i * 2];
                float32View[index + 1] = vertexData[i * 2 + 1];
                float32View[index + 2] = aTrans.a;
                float32View[index + 3] = aTrans.c;
                float32View[index + 4] = aTrans.tx;
                float32View[index + 5] = aTrans.b;
                float32View[index + 6] = aTrans.d;
                float32View[index + 7] = aTrans.ty;
                float32View[index + 8] = frame.x;
                float32View[index + 9] = frame.y;
                float32View[index + 10] = frame.x + frame.width;
                float32View[index + 11] = frame.y + frame.height;
                uint32View[index + 12] = argb;
                float32View[index + 13] = textureId;
                index += 14;
            }
        };
        return SpriteStrangeRenderer;
    }(MultiTextureSpriteRenderer));
    PIXI.WebGLRenderer.registerPlugin('sprite_strange', SpriteStrangeRenderer);
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var tempMat = new PIXI.Matrix();
    var tempRect = new PIXI.Rectangle();
    var tempPoint = new PIXI.Point();
    var StrangeSurface = (function (_super) {
        __extends(StrangeSurface, _super);
        function StrangeSurface() {
            var _this = _super.call(this) || this;
            _this.params = [0, 0, NaN, NaN];
            return _this;
        }
        StrangeSurface.prototype.clear = function () {
            var p = this.params;
            p[0] = 0;
            p[1] = 0;
            p[2] = NaN;
            p[3] = NaN;
        };
        StrangeSurface.prototype.setAxisX = function (pos, factor, outTransform) {
            var x = pos.x, y = pos.y;
            var d = Math.sqrt(x * x + y * y);
            var rot = outTransform.rotation;
            if (rot !== 0) {
                outTransform.skew._x -= rot;
                outTransform.skew._y += rot;
                outTransform.rotation = 0;
            }
            outTransform.skew.y = Math.atan2(y, x);
            var p = this.params;
            if (factor !== 0) {
                p[2] = -d * factor;
            }
            else {
                p[2] = NaN;
            }
            this._calc01();
        };
        StrangeSurface.prototype.setAxisY = function (pos, factor, outTransform) {
            var x = pos.x, y = pos.y;
            var d = Math.sqrt(x * x + y * y);
            var rot = outTransform.rotation;
            if (rot !== 0) {
                outTransform.skew._x -= rot;
                outTransform.skew._y += rot;
                outTransform.rotation = 0;
            }
            outTransform.skew.x = -Math.atan2(y, x) + Math.PI / 2;
            var p = this.params;
            if (factor !== 0) {
                p[3] = -d * factor;
            }
            else {
                p[3] = NaN;
            }
            this._calc01();
        };
        StrangeSurface.prototype._calc01 = function () {
            var p = this.params;
            if (isNaN(p[2])) {
                p[1] = 0;
                if (isNaN(p[3])) {
                    p[0] = 0;
                }
                else {
                    p[0] = 1.0 / p[3];
                }
            }
            else {
                if (isNaN(p[3])) {
                    p[0] = 0;
                    p[1] = 1.0 / p[2];
                }
                else {
                    var d = 1.0 - p[2] * p[3];
                    p[0] = (1.0 - p[2]) / d;
                    p[1] = (1.0 - p[3]) / d;
                }
            }
        };
        StrangeSurface.prototype.apply = function (pos, newPos) {
            newPos = newPos || new PIXI.Point();
            var aleph = this.params[0], bet = this.params[1], A = this.params[2], B = this.params[3];
            var u = pos.x, v = pos.y;
            if (aleph === 0.0) {
                newPos.y = v * (1 + u * bet);
                newPos.x = u;
            }
            else if (bet === 0.0) {
                newPos.x = u * (1 + v * aleph);
                newPos.y = v;
            }
            else {
                var D = A * B - v * u;
                newPos.x = A * u * (B + v) / D;
                newPos.y = B * v * (A + u) / D;
            }
            return newPos;
        };
        StrangeSurface.prototype.applyInverse = function (pos, newPos) {
            newPos = newPos || new PIXI.Point();
            var aleph = this.params[0], bet = this.params[1], A = this.params[2], B = this.params[3];
            var x = pos.x, y = pos.y;
            if (aleph === 0.0) {
                newPos.y = y / (1 + x * bet);
                newPos.x = x;
            }
            else if (bet === 0.0) {
                newPos.x = x * (1 + y * aleph);
                newPos.y = y;
            }
            else {
                newPos.x = x * (bet + 1) / (bet + 1 + y * aleph);
                newPos.y = y * (aleph + 1) / (aleph + 1 + x * bet);
            }
            return newPos;
        };
        StrangeSurface.prototype.mapSprite = function (sprite, quad, outTransform) {
            var tex = sprite.texture;
            tempRect.x = -sprite.anchor.x * tex.orig.width;
            tempRect.y = -sprite.anchor.y * tex.orig.height;
            tempRect.width = tex.orig.width;
            tempRect.height = tex.orig.height;
            return this.mapQuad(tempRect, quad, outTransform || sprite.transform);
        };
        StrangeSurface.prototype.mapQuad = function (rect, quad, outTransform) {
            var ax = -rect.x / rect.width;
            var ay = -rect.y / rect.height;
            var ax2 = (1.0 - rect.x) / rect.width;
            var ay2 = (1.0 - rect.y) / rect.height;
            var up1x = (quad[0].x * (1.0 - ax) + quad[1].x * ax);
            var up1y = (quad[0].y * (1.0 - ax) + quad[1].y * ax);
            var up2x = (quad[0].x * (1.0 - ax2) + quad[1].x * ax2);
            var up2y = (quad[0].y * (1.0 - ax2) + quad[1].y * ax2);
            var down1x = (quad[3].x * (1.0 - ax) + quad[2].x * ax);
            var down1y = (quad[3].y * (1.0 - ax) + quad[2].y * ax);
            var down2x = (quad[3].x * (1.0 - ax2) + quad[2].x * ax2);
            var down2y = (quad[3].y * (1.0 - ax2) + quad[2].y * ax2);
            var x00 = up1x * (1.0 - ay) + down1x * ay;
            var y00 = up1y * (1.0 - ay) + down1y * ay;
            var x10 = up2x * (1.0 - ay) + down2x * ay;
            var y10 = up2y * (1.0 - ay) + down2y * ay;
            var x01 = up1x * (1.0 - ay2) + down1x * ay2;
            var y01 = up1y * (1.0 - ay2) + down1y * ay2;
            var x11 = up2x * (1.0 - ay2) + down2x * ay2;
            var y11 = up2y * (1.0 - ay2) + down2y * ay2;
            var mat = tempMat;
            mat.tx = x00;
            mat.ty = y00;
            mat.a = x10 - x00;
            mat.b = y10 - y00;
            mat.c = x01 - x00;
            mat.d = y01 - y00;
            tempPoint.set(x11, y11);
            mat.applyInverse(tempPoint, tempPoint);
            outTransform.setFromMatrix(mat);
            return this;
        };
        StrangeSurface.prototype.fillUniforms = function (uniforms) {
            var params = this.params;
            var distortion = uniforms.params || new Float32Array([0, 0, 0, 0]);
            uniforms.params = distortion;
            distortion[0] = params[0];
            distortion[1] = params[1];
            distortion[2] = params[2];
            distortion[3] = params[3];
        };
        return StrangeSurface;
    }(pixi_projection.Surface));
    pixi_projection.StrangeSurface = StrangeSurface;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    PIXI.Sprite.prototype.convertTo2s = function () {
        if (this.proj)
            return;
        this.pluginName = 'sprite_bilinear';
        this.aTrans = new PIXI.Matrix();
        this.calculateVertices = pixi_projection.Sprite2s.prototype.calculateVertices;
        this.calculateTrimmedVertices = pixi_projection.Sprite2s.prototype.calculateTrimmedVertices;
        this._calculateBounds = pixi_projection.Sprite2s.prototype._calculateBounds;
        PIXI.Container.prototype.convertTo2s.call(this);
    };
    PIXI.Container.prototype.convertTo2s = function () {
        if (this.proj)
            return;
        this.proj = new pixi_projection.Projection2d(this.transform);
        Object.defineProperty(this, "worldTransform", {
            get: function () {
                return this.proj;
            },
            enumerable: true,
            configurable: true
        });
    };
    PIXI.Container.prototype.convertSubtreeTo2s = function () {
        this.convertTo2s();
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].convertSubtreeTo2s();
        }
    };
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Sprite2s = (function (_super) {
        __extends(Sprite2s, _super);
        function Sprite2s(texture) {
            var _this = _super.call(this, texture) || this;
            _this.aTrans = new PIXI.Matrix();
            _this.proj = new pixi_projection.ProjectionSurface(_this.transform);
            _this.pluginName = 'sprite_bilinear';
            return _this;
        }
        Sprite2s.prototype._calculateBounds = function () {
            this.calculateTrimmedVertices();
            this._bounds.addQuad(this.vertexTrimmedData);
        };
        Sprite2s.prototype.calculateVertices = function () {
            var wid = this.transform._worldID;
            var tuid = this._texture._updateID;
            if (this._transformID === wid && this._textureID === tuid) {
                return;
            }
            this._transformID = wid;
            this._textureID = tuid;
            var texture = this._texture;
            var vertexData = this.vertexData;
            var trim = texture.trim;
            var orig = texture.orig;
            var anchor = this._anchor;
            var w0 = 0;
            var w1 = 0;
            var h0 = 0;
            var h1 = 0;
            if (trim) {
                w1 = trim.x - (anchor._x * orig.width);
                w0 = w1 + trim.width;
                h1 = trim.y - (anchor._y * orig.height);
                h0 = h1 + trim.height;
            }
            else {
                w1 = -anchor._x * orig.width;
                w0 = w1 + orig.width;
                h1 = -anchor._y * orig.height;
                h0 = h1 + orig.height;
            }
            if (this.proj._surface) {
                vertexData[0] = w1;
                vertexData[1] = h1;
                vertexData[2] = w0;
                vertexData[3] = h1;
                vertexData[4] = w0;
                vertexData[5] = h0;
                vertexData[6] = w1;
                vertexData[7] = h0;
                this.proj._surface.boundsQuad(vertexData, vertexData);
            }
            else {
                var wt = this.transform.worldTransform;
                var a = wt.a;
                var b = wt.b;
                var c = wt.c;
                var d = wt.d;
                var tx = wt.tx;
                var ty = wt.ty;
                vertexData[0] = (a * w1) + (c * h1) + tx;
                vertexData[1] = (d * h1) + (b * w1) + ty;
                vertexData[2] = (a * w0) + (c * h1) + tx;
                vertexData[3] = (d * h1) + (b * w0) + ty;
                vertexData[4] = (a * w0) + (c * h0) + tx;
                vertexData[5] = (d * h0) + (b * w0) + ty;
                vertexData[6] = (a * w1) + (c * h0) + tx;
                vertexData[7] = (d * h0) + (b * w1) + ty;
                if (this.proj._activeProjection) {
                    this.proj._activeProjection.surface.boundsQuad(vertexData, vertexData);
                }
            }
            if (!texture.transform) {
                texture.transform = new PIXI.extras.TextureTransform(texture);
            }
            texture.transform.update();
            var aTrans = this.aTrans;
            aTrans.set(orig.width, 0, 0, orig.height, w1, h1);
            if (this.proj._surface === null) {
                aTrans.prepend(this.transform.worldTransform);
            }
            aTrans.invert();
            aTrans.prepend(texture.transform.mapCoord);
        };
        Sprite2s.prototype.calculateTrimmedVertices = function () {
            var wid = this.transform._worldID;
            var tuid = this._texture._updateID;
            if (!this.vertexTrimmedData) {
                this.vertexTrimmedData = new Float32Array(8);
            }
            else if (this._transformTrimmedID === wid && this._textureTrimmedID === tuid) {
                return;
            }
            this._transformTrimmedID = wid;
            this._textureTrimmedID = tuid;
            var texture = this._texture;
            var vertexData = this.vertexTrimmedData;
            var orig = texture.orig;
            var anchor = this._anchor;
            var w1 = -anchor._x * orig.width;
            var w0 = w1 + orig.width;
            var h1 = -anchor._y * orig.height;
            var h0 = h1 + orig.height;
            if (this.proj._surface) {
                vertexData[0] = w1;
                vertexData[1] = h1;
                vertexData[2] = w0;
                vertexData[3] = h1;
                vertexData[4] = w0;
                vertexData[5] = h0;
                vertexData[6] = w1;
                vertexData[7] = h0;
                this.proj._surface.boundsQuad(vertexData, vertexData, this.transform.worldTransform);
            }
            else {
                var wt = this.transform.worldTransform;
                var a = wt.a;
                var b = wt.b;
                var c = wt.c;
                var d = wt.d;
                var tx = wt.tx;
                var ty = wt.ty;
                vertexData[0] = (a * w1) + (c * h1) + tx;
                vertexData[1] = (d * h1) + (b * w1) + ty;
                vertexData[2] = (a * w0) + (c * h1) + tx;
                vertexData[3] = (d * h1) + (b * w0) + ty;
                vertexData[4] = (a * w0) + (c * h0) + tx;
                vertexData[5] = (d * h0) + (b * w0) + ty;
                vertexData[6] = (a * w1) + (c * h0) + tx;
                vertexData[7] = (d * h0) + (b * w1) + ty;
                if (this.proj._activeProjection) {
                    this.proj._activeProjection.surface.boundsQuad(vertexData, vertexData, this.proj._activeProjection.legacy.worldTransform);
                }
            }
        };
        Object.defineProperty(Sprite2s.prototype, "worldTransform", {
            get: function () {
                return this.proj;
            },
            enumerable: true,
            configurable: true
        });
        return Sprite2s;
    }(PIXI.Sprite));
    pixi_projection.Sprite2s = Sprite2s;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Text2s = (function (_super) {
        __extends(Text2s, _super);
        function Text2s(text, style, canvas) {
            var _this = _super.call(this, text, style, canvas) || this;
            _this.aTrans = new PIXI.Matrix();
            _this.proj = new pixi_projection.ProjectionSurface(_this.transform);
            _this.pluginName = 'sprite_bilinear';
            return _this;
        }
        Object.defineProperty(Text2s.prototype, "worldTransform", {
            get: function () {
                return this.proj;
            },
            enumerable: true,
            configurable: true
        });
        return Text2s;
    }(PIXI.Text));
    pixi_projection.Text2s = Text2s;
    Text2s.prototype.calculateVertices = pixi_projection.Sprite2s.prototype.calculateVertices;
    Text2s.prototype.calculateTrimmedVertices = pixi_projection.Sprite2s.prototype.calculateTrimmedVertices;
    Text2s.prototype._calculateBounds = pixi_projection.Sprite2s.prototype._calculateBounds;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    function container2dWorldTransform() {
        return this.proj.affine ? this.transform.worldTransform : this.proj.world;
    }
    pixi_projection.container2dWorldTransform = container2dWorldTransform;
    var Container2d = (function (_super) {
        __extends(Container2d, _super);
        function Container2d() {
            var _this = _super.call(this) || this;
            _this.proj = new pixi_projection.Projection2d(_this.transform);
            return _this;
        }
        Object.defineProperty(Container2d.prototype, "worldTransform", {
            get: function () {
                return this.proj.affine ? this.transform.worldTransform : this.proj.world;
            },
            enumerable: true,
            configurable: true
        });
        return Container2d;
    }(PIXI.Container));
    pixi_projection.Container2d = Container2d;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Point = PIXI.Point;
    var mat3id = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    var AFFINE;
    (function (AFFINE) {
        AFFINE[AFFINE["NONE"] = 0] = "NONE";
        AFFINE[AFFINE["FREE"] = 1] = "FREE";
        AFFINE[AFFINE["AXIS_X"] = 2] = "AXIS_X";
        AFFINE[AFFINE["AXIS_Y"] = 3] = "AXIS_Y";
        AFFINE[AFFINE["POINT"] = 4] = "POINT";
    })(AFFINE = pixi_projection.AFFINE || (pixi_projection.AFFINE = {}));
    var Matrix2d = (function () {
        function Matrix2d(backingArray) {
            this.floatArray = null;
            this.mat3 = new Float64Array(backingArray || mat3id);
        }
        Object.defineProperty(Matrix2d.prototype, "a", {
            get: function () {
                return this.mat3[0];
            },
            set: function (value) {
                this.mat3[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2d.prototype, "b", {
            get: function () {
                return this.mat3[1];
            },
            set: function (value) {
                this.mat3[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2d.prototype, "c", {
            get: function () {
                return this.mat3[3];
            },
            set: function (value) {
                this.mat3[3] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2d.prototype, "d", {
            get: function () {
                return this.mat3[4];
            },
            set: function (value) {
                this.mat3[4] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2d.prototype, "tx", {
            get: function () {
                return this.mat3[6];
            },
            set: function (value) {
                this.mat3[6] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2d.prototype, "ty", {
            get: function () {
                return this.mat3[7];
            },
            set: function (value) {
                this.mat3[7] = value;
            },
            enumerable: true,
            configurable: true
        });
        Matrix2d.prototype.set = function (a, b, c, d, tx, ty) {
            var mat3 = this.mat3;
            mat3[0] = a;
            mat3[1] = b;
            mat3[2] = 0;
            mat3[3] = c;
            mat3[4] = d;
            mat3[5] = 0;
            mat3[6] = tx;
            mat3[7] = ty;
            mat3[8] = 1;
            return this;
        };
        Matrix2d.prototype.toArray = function (transpose, out) {
            if (!this.floatArray) {
                this.floatArray = new Float32Array(9);
            }
            var array = out || this.floatArray;
            var mat3 = this.mat3;
            if (transpose) {
                array[0] = mat3[0];
                array[1] = mat3[1];
                array[2] = mat3[2];
                array[3] = mat3[3];
                array[4] = mat3[4];
                array[5] = mat3[5];
                array[6] = mat3[6];
                array[7] = mat3[7];
                array[8] = mat3[8];
            }
            else {
                array[0] = mat3[0];
                array[1] = mat3[3];
                array[2] = mat3[6];
                array[3] = mat3[1];
                array[4] = mat3[4];
                array[5] = mat3[7];
                array[6] = mat3[2];
                array[7] = mat3[5];
                array[8] = mat3[8];
            }
            return array;
        };
        Matrix2d.prototype.apply = function (pos, newPos) {
            newPos = newPos || new PIXI.Point();
            var mat3 = this.mat3;
            var x = pos.x;
            var y = pos.y;
            var z = 1.0 / (mat3[2] * x + mat3[5] * y + mat3[8]);
            newPos.x = z * (mat3[0] * x + mat3[3] * y + mat3[6]);
            newPos.y = z * (mat3[1] * x + mat3[4] * y + mat3[7]);
            return newPos;
        };
        Matrix2d.prototype.translate = function (tx, ty) {
            var mat3 = this.mat3;
            mat3[0] += tx * mat3[2];
            mat3[1] += ty * mat3[2];
            mat3[3] += tx * mat3[5];
            mat3[4] += ty * mat3[5];
            mat3[6] += tx * mat3[8];
            mat3[7] += ty * mat3[8];
            return this;
        };
        Matrix2d.prototype.scale = function (x, y) {
            var mat3 = this.mat3;
            mat3[0] *= x;
            mat3[1] *= y;
            mat3[3] *= x;
            mat3[4] *= y;
            mat3[6] *= x;
            mat3[7] *= y;
            return this;
        };
        Matrix2d.prototype.scaleAndTranslate = function (scaleX, scaleY, tx, ty) {
            var mat3 = this.mat3;
            mat3[0] = scaleX * mat3[0] + tx * mat3[2];
            mat3[1] = scaleY * mat3[1] + ty * mat3[2];
            mat3[3] = scaleX * mat3[3] + tx * mat3[5];
            mat3[4] = scaleY * mat3[4] + ty * mat3[5];
            mat3[6] = scaleX * mat3[6] + tx * mat3[8];
            mat3[7] = scaleY * mat3[7] + ty * mat3[8];
        };
        Matrix2d.prototype.applyInverse = function (pos, newPos) {
            newPos = newPos || new Point();
            var a = this.mat3;
            var x = pos.x;
            var y = pos.y;
            var a00 = a[0], a01 = a[3], a02 = a[6], a10 = a[1], a11 = a[4], a12 = a[7], a20 = a[2], a21 = a[5], a22 = a[8];
            var newX = (a22 * a11 - a12 * a21) * x + (-a22 * a01 + a02 * a21) * y + (a12 * a01 - a02 * a11);
            var newY = (-a22 * a10 + a12 * a20) * x + (a22 * a00 - a02 * a20) * y + (-a12 * a00 + a02 * a10);
            var newZ = (a21 * a10 - a11 * a20) * x + (-a21 * a00 + a01 * a20) * y + (a11 * a00 - a01 * a10);
            newPos.x = newX / newZ;
            newPos.y = newY / newZ;
            return newPos;
        };
        Matrix2d.prototype.invert = function () {
            var a = this.mat3;
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20;
            var det = a00 * b01 + a01 * b11 + a02 * b21;
            if (!det) {
                return this;
            }
            det = 1.0 / det;
            a[0] = b01 * det;
            a[1] = (-a22 * a01 + a02 * a21) * det;
            a[2] = (a12 * a01 - a02 * a11) * det;
            a[3] = b11 * det;
            a[4] = (a22 * a00 - a02 * a20) * det;
            a[5] = (-a12 * a00 + a02 * a10) * det;
            a[6] = b21 * det;
            a[7] = (-a21 * a00 + a01 * a20) * det;
            a[8] = (a11 * a00 - a01 * a10) * det;
            return this;
        };
        Matrix2d.prototype.identity = function () {
            var mat3 = this.mat3;
            mat3[0] = 1;
            mat3[1] = 0;
            mat3[2] = 0;
            mat3[3] = 0;
            mat3[4] = 1;
            mat3[5] = 0;
            mat3[6] = 0;
            mat3[7] = 0;
            mat3[8] = 1;
            return this;
        };
        Matrix2d.prototype.clone = function () {
            return new Matrix2d(this.mat3);
        };
        Matrix2d.prototype.copyTo = function (matrix) {
            var mat3 = this.mat3;
            var ar2 = matrix.mat3;
            ar2[0] = mat3[0];
            ar2[1] = mat3[1];
            ar2[2] = mat3[2];
            ar2[3] = mat3[3];
            ar2[4] = mat3[4];
            ar2[5] = mat3[5];
            ar2[6] = mat3[6];
            ar2[7] = mat3[7];
            ar2[8] = mat3[8];
            return matrix;
        };
        Matrix2d.prototype.copy = function (matrix, affine) {
            var mat3 = this.mat3;
            var d = 1.0 / mat3[8];
            var tx = mat3[6] * d, ty = mat3[7] * d;
            matrix.a = (mat3[0] - mat3[2] * tx) * d;
            matrix.b = (mat3[1] - mat3[2] * ty) * d;
            matrix.c = (mat3[3] - mat3[5] * tx) * d;
            matrix.d = (mat3[4] - mat3[5] * ty) * d;
            matrix.tx = tx;
            matrix.ty = ty;
            if (affine >= 2) {
                if (affine === AFFINE.POINT) {
                    matrix.a = 1;
                    matrix.b = 0;
                    matrix.c = 0;
                    matrix.d = 1;
                }
                else if (affine === AFFINE.AXIS_X) {
                    matrix.c = -matrix.b;
                    matrix.d = matrix.a;
                }
                else if (affine === AFFINE.AXIS_Y) {
                    matrix.a = matrix.d;
                    matrix.c = -matrix.b;
                }
            }
        };
        Matrix2d.prototype.copyFrom = function (matrix) {
            var mat3 = this.mat3;
            mat3[0] = matrix.a;
            mat3[1] = matrix.b;
            mat3[2] = 0;
            mat3[3] = matrix.c;
            mat3[4] = matrix.d;
            mat3[5] = 0;
            mat3[6] = matrix.tx;
            mat3[7] = matrix.ty;
            mat3[8] = 1.0;
            return this;
        };
        Matrix2d.prototype.setToMultLegacy = function (pt, lt) {
            var out = this.mat3;
            var b = lt.mat3;
            var a00 = pt.a, a01 = pt.b, a10 = pt.c, a11 = pt.d, a20 = pt.tx, a21 = pt.ty, b00 = b[0], b01 = b[1], b02 = b[2], b10 = b[3], b11 = b[4], b12 = b[5], b20 = b[6], b21 = b[7], b22 = b[8];
            out[0] = b00 * a00 + b01 * a10 + b02 * a20;
            out[1] = b00 * a01 + b01 * a11 + b02 * a21;
            out[2] = b02;
            out[3] = b10 * a00 + b11 * a10 + b12 * a20;
            out[4] = b10 * a01 + b11 * a11 + b12 * a21;
            out[5] = b12;
            out[6] = b20 * a00 + b21 * a10 + b22 * a20;
            out[7] = b20 * a01 + b21 * a11 + b22 * a21;
            out[8] = b22;
            return this;
        };
        Matrix2d.prototype.setToMult2d = function (pt, lt) {
            var out = this.mat3;
            var a = pt.mat3, b = lt.mat3;
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b00 = b[0], b01 = b[1], b02 = b[2], b10 = b[3], b11 = b[4], b12 = b[5], b20 = b[6], b21 = b[7], b22 = b[8];
            out[0] = b00 * a00 + b01 * a10 + b02 * a20;
            out[1] = b00 * a01 + b01 * a11 + b02 * a21;
            out[2] = b00 * a02 + b01 * a12 + b02 * a22;
            out[3] = b10 * a00 + b11 * a10 + b12 * a20;
            out[4] = b10 * a01 + b11 * a11 + b12 * a21;
            out[5] = b10 * a02 + b11 * a12 + b12 * a22;
            out[6] = b20 * a00 + b21 * a10 + b22 * a20;
            out[7] = b20 * a01 + b21 * a11 + b22 * a21;
            out[8] = b20 * a02 + b21 * a12 + b22 * a22;
            return this;
        };
        Matrix2d.IDENTITY = new Matrix2d();
        Matrix2d.TEMP_MATRIX = new Matrix2d();
        return Matrix2d;
    }());
    pixi_projection.Matrix2d = Matrix2d;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    function transformHack(parentTransform) {
        var proj = this.proj;
        var ta = this;
        var pwid = parentTransform._worldID;
        var lt = ta.localTransform;
        if (ta._localID !== ta._currentLocalID) {
            lt.a = ta._cx * ta.scale._x;
            lt.b = ta._sx * ta.scale._x;
            lt.c = ta._cy * ta.scale._y;
            lt.d = ta._sy * ta.scale._y;
            lt.tx = ta.position._x - ((ta.pivot._x * lt.a) + (ta.pivot._y * lt.c));
            lt.ty = ta.position._y - ((ta.pivot._x * lt.b) + (ta.pivot._y * lt.d));
            ta._currentLocalID = ta._localID;
            proj._currentProjID = -1;
        }
        var _matrixID = proj._projID;
        if (proj._currentProjID !== _matrixID) {
            proj._currentProjID = _matrixID;
            if (_matrixID !== 0) {
                proj.local.setToMultLegacy(lt, proj.matrix);
            }
            else {
                proj.local.copyFrom(lt);
            }
            ta._parentID = -1;
        }
        if (ta._parentID !== pwid) {
            var pp = parentTransform.proj;
            if (pp && !pp.affine) {
                proj.world.setToMult2d(pp.world, proj.local);
            }
            else {
                proj.world.setToMultLegacy(parentTransform.worldTransform, proj.local);
            }
            proj.world.copy(ta.worldTransform, proj._affine);
            ta._parentID = pwid;
            ta._worldID++;
        }
    }
    var t0 = new PIXI.Point();
    var tt = [new PIXI.Point(), new PIXI.Point(), new PIXI.Point(), new PIXI.Point()];
    var tempRect = new PIXI.Rectangle();
    var tempMat = new pixi_projection.Matrix2d();
    var Projection2d = (function (_super) {
        __extends(Projection2d, _super);
        function Projection2d(legacy, enable) {
            var _this = _super.call(this, legacy, enable) || this;
            _this.matrix = new pixi_projection.Matrix2d();
            _this.local = new pixi_projection.Matrix2d();
            _this.world = new pixi_projection.Matrix2d();
            _this._projID = 0;
            _this._currentProjID = -1;
            _this._affine = pixi_projection.AFFINE.NONE;
            return _this;
        }
        Object.defineProperty(Projection2d.prototype, "affine", {
            get: function () {
                return this._affine;
            },
            set: function (value) {
                if (this._affine == value)
                    return;
                this._affine = value;
                this._currentProjID = -1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Projection2d.prototype, "enabled", {
            set: function (value) {
                if (value === this._enabled) {
                    return;
                }
                this._enabled = value;
                if (value) {
                    this.legacy.updateTransform = transformHack;
                    this.legacy._parentID = -1;
                }
                else {
                    this.legacy.updateTransform = PIXI.TransformStatic.prototype.updateTransform;
                    this.legacy._parentID = -1;
                }
            },
            enumerable: true,
            configurable: true
        });
        Projection2d.prototype.setAxisX = function (p, factor) {
            if (factor === void 0) { factor = 1; }
            var x = p.x, y = p.y;
            var d = Math.sqrt(x * x + y * y);
            var mat3 = this.matrix.mat3;
            mat3[0] = x / d;
            mat3[1] = y / d;
            mat3[2] = factor / d;
            this._projID++;
        };
        Projection2d.prototype.setAxisY = function (p, factor) {
            if (factor === void 0) { factor = 1; }
            var x = p.x, y = p.y;
            var d = Math.sqrt(x * x + y * y);
            var mat3 = this.matrix.mat3;
            mat3[3] = x / d;
            mat3[4] = y / d;
            mat3[5] = factor / d;
            this._projID++;
        };
        Projection2d.prototype.mapSprite = function (sprite, quad) {
            var tex = sprite.texture;
            tempRect.x = -sprite.anchor.x * tex.orig.width;
            tempRect.y = -sprite.anchor.y * tex.orig.height;
            tempRect.width = tex.orig.width;
            tempRect.height = tex.orig.height;
            return this.mapQuad(tempRect, quad);
        };
        Projection2d.prototype.mapQuad = function (rect, p) {
            tt[0].set(rect.x, rect.y);
            tt[1].set(rect.x + rect.width, rect.y);
            tt[2].set(rect.x + rect.width, rect.y + rect.height);
            tt[3].set(rect.x, rect.y + rect.height);
            var k1 = 1, k2 = 2, k3 = 3;
            var f = pixi_projection.utils.getIntersectionFactor(p[0], p[2], p[1], p[3], t0);
            if (f !== 0) {
                k1 = 1;
                k2 = 3;
                k3 = 2;
            }
            else {
                return;
            }
            var d0 = Math.sqrt((p[0].x - t0.x) * (p[0].x - t0.x) + (p[0].y - t0.y) * (p[0].y - t0.y));
            var d1 = Math.sqrt((p[k1].x - t0.x) * (p[k1].x - t0.x) + (p[k1].y - t0.y) * (p[k1].y - t0.y));
            var d2 = Math.sqrt((p[k2].x - t0.x) * (p[k2].x - t0.x) + (p[k2].y - t0.y) * (p[k2].y - t0.y));
            var d3 = Math.sqrt((p[k3].x - t0.x) * (p[k3].x - t0.x) + (p[k3].y - t0.y) * (p[k3].y - t0.y));
            var q0 = (d0 + d3) / d3;
            var q1 = (d1 + d2) / d2;
            var q2 = (d1 + d2) / d1;
            var mat3 = this.matrix.mat3;
            mat3[0] = tt[0].x * q0;
            mat3[1] = tt[0].y * q0;
            mat3[2] = q0;
            mat3[3] = tt[k1].x * q1;
            mat3[4] = tt[k1].y * q1;
            mat3[5] = q1;
            mat3[6] = tt[k2].x * q2;
            mat3[7] = tt[k2].y * q2;
            mat3[8] = q2;
            this.matrix.invert();
            mat3 = tempMat.mat3;
            mat3[0] = p[0].x;
            mat3[1] = p[0].y;
            mat3[2] = 1;
            mat3[3] = p[k1].x;
            mat3[4] = p[k1].y;
            mat3[5] = 1;
            mat3[6] = p[k2].x;
            mat3[7] = p[k2].y;
            mat3[8] = 1;
            this.matrix.setToMult2d(tempMat, this.matrix);
            this._projID++;
        };
        Projection2d.prototype.clear = function () {
            this._currentProjID = -1;
            this._projID = 0;
            this.matrix.identity();
        };
        return Projection2d;
    }(pixi_projection.Projection));
    pixi_projection.Projection2d = Projection2d;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Mesh2d = (function (_super) {
        __extends(Mesh2d, _super);
        function Mesh2d(texture, vertices, uvs, indices, drawMode) {
            var _this = _super.call(this, texture, vertices, uvs, indices, drawMode) || this;
            _this.proj = new pixi_projection.Projection2d(_this.transform);
            _this.pluginName = 'mesh2d';
            return _this;
        }
        Object.defineProperty(Mesh2d.prototype, "worldTransform", {
            get: function () {
                return this.proj.affine ? this.transform.worldTransform : this.proj.world;
            },
            enumerable: true,
            configurable: true
        });
        return Mesh2d;
    }(PIXI.mesh.Mesh));
    pixi_projection.Mesh2d = Mesh2d;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var shaderVert = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position.xyw = projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0);\n    gl_Position.z = 0.0;\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n";
    var shaderFrag = "\nvarying vec2 vTextureCoord;\nuniform vec4 uColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;\n}";
    var Mesh2dRenderer = (function (_super) {
        __extends(Mesh2dRenderer, _super);
        function Mesh2dRenderer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Mesh2dRenderer.prototype.onContextChange = function () {
            var gl = this.renderer.gl;
            this.shader = new PIXI.Shader(gl, shaderVert, shaderFrag);
        };
        return Mesh2dRenderer;
    }(PIXI.mesh.MeshRenderer));
    pixi_projection.Mesh2dRenderer = Mesh2dRenderer;
    PIXI.WebGLRenderer.registerPlugin('mesh2d', Mesh2dRenderer);
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    PIXI.Sprite.prototype.convertTo2d = function () {
        if (this.proj)
            return;
        this.calculateVertices = pixi_projection.Sprite2d.prototype.calculateVertices;
        this.calculateTrimmedVertices = pixi_projection.Sprite2d.prototype.calculateTrimmedVertices;
        this._calculateBounds = pixi_projection.Sprite2d.prototype._calculateBounds;
        this.proj = new pixi_projection.Projection2d(this.transform);
        this.pluginName = 'sprite2d';
        this.vertexData = new Float32Array(12);
        Object.defineProperty(this, "worldTransform", {
            get: pixi_projection.container2dWorldTransform,
            enumerable: true,
            configurable: true
        });
    };
    PIXI.mesh.Mesh.prototype.convertTo2d = function () {
        if (this.proj)
            return;
        this.proj = new pixi_projection.Projection2d(this.transform);
        this.pluginName = 'mesh2d';
        Object.defineProperty(this, "worldTransform", {
            get: pixi_projection.container2dWorldTransform,
            enumerable: true,
            configurable: true
        });
    };
    PIXI.Container.prototype.convertTo2d = function () {
        if (this.proj)
            return;
        this.proj = new pixi_projection.Projection2d(this.transform);
        Object.defineProperty(this, "worldTransform", {
            get: pixi_projection.container2dWorldTransform,
            enumerable: true,
            configurable: true
        });
    };
    PIXI.Container.prototype.convertSubtreeTo2d = function () {
        this.convertTo2d();
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].convertSubtreeTo2d();
        }
    };
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Sprite2d = (function (_super) {
        __extends(Sprite2d, _super);
        function Sprite2d(texture) {
            var _this = _super.call(this, texture) || this;
            _this.proj = new pixi_projection.Projection2d(_this.transform);
            _this.pluginName = 'sprite2d';
            _this.vertexData = new Float32Array(12);
            return _this;
        }
        Sprite2d.prototype._calculateBounds = function () {
            this.calculateTrimmedVertices();
            this._bounds.addQuad(this.vertexTrimmedData);
        };
        Sprite2d.prototype.calculateVertices = function () {
            if (this.proj._affine) {
                if (this.vertexData.length != 8) {
                    this.vertexData = new Float32Array(8);
                }
                _super.prototype.calculateVertices.call(this);
                return;
            }
            if (this.vertexData.length != 12) {
                this.vertexData = new Float32Array(12);
            }
            var wid = this.transform._worldID;
            var tuid = this._texture._updateID;
            if (this._transformID === wid && this._textureID === tuid) {
                return;
            }
            this._transformID = wid;
            this._textureID = tuid;
            var texture = this._texture;
            var wt = this.proj.world.mat3;
            var vertexData = this.vertexData;
            var trim = texture.trim;
            var orig = texture.orig;
            var anchor = this._anchor;
            var w0 = 0;
            var w1 = 0;
            var h0 = 0;
            var h1 = 0;
            if (trim) {
                w1 = trim.x - (anchor._x * orig.width);
                w0 = w1 + trim.width;
                h1 = trim.y - (anchor._y * orig.height);
                h0 = h1 + trim.height;
            }
            else {
                w1 = -anchor._x * orig.width;
                w0 = w1 + orig.width;
                h1 = -anchor._y * orig.height;
                h0 = h1 + orig.height;
            }
            vertexData[0] = (wt[0] * w1) + (wt[3] * h1) + wt[6];
            vertexData[1] = (wt[1] * w1) + (wt[4] * h1) + wt[7];
            vertexData[2] = (wt[2] * w1) + (wt[5] * h1) + wt[8];
            vertexData[3] = (wt[0] * w0) + (wt[3] * h1) + wt[6];
            vertexData[4] = (wt[1] * w0) + (wt[4] * h1) + wt[7];
            vertexData[5] = (wt[2] * w0) + (wt[5] * h1) + wt[8];
            vertexData[6] = (wt[0] * w0) + (wt[3] * h0) + wt[6];
            vertexData[7] = (wt[1] * w0) + (wt[4] * h0) + wt[7];
            vertexData[8] = (wt[2] * w0) + (wt[5] * h0) + wt[8];
            vertexData[9] = (wt[0] * w1) + (wt[3] * h0) + wt[6];
            vertexData[10] = (wt[1] * w1) + (wt[4] * h0) + wt[7];
            vertexData[11] = (wt[2] * w1) + (wt[5] * h0) + wt[8];
        };
        Sprite2d.prototype.calculateTrimmedVertices = function () {
            if (this.proj._affine) {
                _super.prototype.calculateTrimmedVertices.call(this);
                return;
            }
            var wid = this.transform._worldID;
            var tuid = this._texture._updateID;
            if (!this.vertexTrimmedData) {
                this.vertexTrimmedData = new Float32Array(8);
            }
            else if (this._transformTrimmedID === wid && this._textureTrimmedID === tuid) {
                return;
            }
            this._transformTrimmedID = wid;
            this._textureTrimmedID = tuid;
            var texture = this._texture;
            var vertexData = this.vertexTrimmedData;
            var orig = texture.orig;
            var anchor = this._anchor;
            var wt = this.proj.world.mat3;
            var w1 = -anchor._x * orig.width;
            var w0 = w1 + orig.width;
            var h1 = -anchor._y * orig.height;
            var h0 = h1 + orig.height;
            var z = 1.0 / (wt[2] * w1 + wt[5] * h1 + wt[8]);
            vertexData[0] = z * ((wt[0] * w1) + (wt[3] * h1) + wt[6]);
            vertexData[1] = z * ((wt[1] * w1) + (wt[4] * h1) + wt[7]);
            z = 1.0 / (wt[2] * w0 + wt[5] * h1 + wt[8]);
            vertexData[2] = z * ((wt[0] * w0) + (wt[3] * h1) + wt[6]);
            vertexData[3] = z * ((wt[1] * w0) + (wt[4] * h1) + wt[7]);
            z = 1.0 / (wt[2] * w0 + wt[5] * h0 + wt[8]);
            vertexData[4] = z * ((wt[0] * w0) + (wt[3] * h0) + wt[6]);
            vertexData[5] = z * ((wt[1] * w0) + (wt[4] * h0) + wt[7]);
            z = 1.0 / (wt[2] * w1 + wt[5] * h0 + wt[8]);
            vertexData[6] = z * ((wt[0] * w1) + (wt[3] * h0) + wt[6]);
            vertexData[7] = z * ((wt[1] * w1) + (wt[4] * h0) + wt[7]);
        };
        Object.defineProperty(Sprite2d.prototype, "worldTransform", {
            get: function () {
                return this.proj.affine ? this.transform.worldTransform : this.proj.world;
            },
            enumerable: true,
            configurable: true
        });
        return Sprite2d;
    }(PIXI.Sprite));
    pixi_projection.Sprite2d = Sprite2d;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var MultiTextureSpriteRenderer = pixi_projection.webgl.MultiTextureSpriteRenderer;
    var Sprite2dRenderer = (function (_super) {
        __extends(Sprite2dRenderer, _super);
        function Sprite2dRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.shaderVert = "precision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position.xyw = projectionMatrix * aVertexPosition;\n    gl_Position.z = 0.0;\n    \n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor;\n}\n";
            _this.shaderFrag = "\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\nvec4 color;\nvec2 textureCoord = vTextureCoord;\nfloat textureId = floor(vTextureId+0.5);\n%forloop%\ngl_FragColor = color * vColor;\n}";
            return _this;
        }
        Sprite2dRenderer.prototype.createVao = function (vertexBuffer) {
            var attrs = this.shader.attributes;
            this.vertSize = 6;
            this.vertByteSize = this.vertSize * 4;
            var gl = this.renderer.gl;
            var vao = this.renderer.createVao()
                .addIndex(this.indexBuffer)
                .addAttribute(vertexBuffer, attrs.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0)
                .addAttribute(vertexBuffer, attrs.aTextureCoord, gl.UNSIGNED_SHORT, true, this.vertByteSize, 3 * 4)
                .addAttribute(vertexBuffer, attrs.aColor, gl.UNSIGNED_BYTE, true, this.vertByteSize, 4 * 4);
            if (attrs.aTextureId) {
                vao.addAttribute(vertexBuffer, attrs.aTextureId, gl.FLOAT, false, this.vertByteSize, 5 * 4);
            }
            return vao;
        };
        Sprite2dRenderer.prototype.fillVertices = function (float32View, uint32View, index, sprite, argb, textureId) {
            var vertexData = sprite.vertexData;
            var uvs = sprite._texture._uvs.uvsUint32;
            if (vertexData.length === 8) {
                if (this.renderer.roundPixels) {
                    var resolution = this.renderer.resolution;
                    float32View[index] = ((vertexData[0] * resolution) | 0) / resolution;
                    float32View[index + 1] = ((vertexData[1] * resolution) | 0) / resolution;
                    float32View[index + 2] = 1.0;
                    float32View[index + 6] = ((vertexData[2] * resolution) | 0) / resolution;
                    float32View[index + 7] = ((vertexData[3] * resolution) | 0) / resolution;
                    float32View[index + 8] = 1.0;
                    float32View[index + 12] = ((vertexData[4] * resolution) | 0) / resolution;
                    float32View[index + 13] = ((vertexData[5] * resolution) | 0) / resolution;
                    float32View[index + 14] = 1.0;
                    float32View[index + 18] = ((vertexData[6] * resolution) | 0) / resolution;
                    float32View[index + 19] = ((vertexData[7] * resolution) | 0) / resolution;
                    float32View[index + 20] = 1.0;
                }
                else {
                    float32View[index] = vertexData[0];
                    float32View[index + 1] = vertexData[1];
                    float32View[index + 2] = 1.0;
                    float32View[index + 6] = vertexData[2];
                    float32View[index + 7] = vertexData[3];
                    float32View[index + 8] = 1.0;
                    float32View[index + 12] = vertexData[4];
                    float32View[index + 13] = vertexData[5];
                    float32View[index + 14] = 1.0;
                    float32View[index + 18] = vertexData[6];
                    float32View[index + 19] = vertexData[7];
                    float32View[index + 20] = 1.0;
                }
            }
            else {
                float32View[index] = vertexData[0];
                float32View[index + 1] = vertexData[1];
                float32View[index + 2] = vertexData[2];
                float32View[index + 6] = vertexData[3];
                float32View[index + 7] = vertexData[4];
                float32View[index + 8] = vertexData[5];
                float32View[index + 12] = vertexData[6];
                float32View[index + 13] = vertexData[7];
                float32View[index + 14] = vertexData[8];
                float32View[index + 18] = vertexData[9];
                float32View[index + 19] = vertexData[10];
                float32View[index + 20] = vertexData[11];
            }
            uint32View[index + 3] = uvs[0];
            uint32View[index + 9] = uvs[1];
            uint32View[index + 15] = uvs[2];
            uint32View[index + 21] = uvs[3];
            uint32View[index + 4] = uint32View[index + 10] = uint32View[index + 16] = uint32View[index + 22] = argb;
            float32View[index + 5] = float32View[index + 11] = float32View[index + 17] = float32View[index + 23] = textureId;
        };
        return Sprite2dRenderer;
    }(MultiTextureSpriteRenderer));
    PIXI.WebGLRenderer.registerPlugin('sprite2d', Sprite2dRenderer);
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Text2d = (function (_super) {
        __extends(Text2d, _super);
        function Text2d(text, style, canvas) {
            var _this = _super.call(this, text, style, canvas) || this;
            _this.proj = new pixi_projection.Projection2d(_this.transform);
            _this.pluginName = 'sprite2d';
            _this.vertexData = new Float32Array(12);
            return _this;
        }
        Object.defineProperty(Text2d.prototype, "worldTransform", {
            get: function () {
                return this.proj.affine ? this.transform.worldTransform : this.proj.world;
            },
            enumerable: true,
            configurable: true
        });
        return Text2d;
    }(PIXI.Text));
    pixi_projection.Text2d = Text2d;
    Text2d.prototype.calculateVertices = pixi_projection.Sprite2d.prototype.calculateVertices;
    Text2d.prototype.calculateTrimmedVertices = pixi_projection.Sprite2d.prototype.calculateTrimmedVertices;
    Text2d.prototype._calculateBounds = pixi_projection.Sprite2d.prototype._calculateBounds;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var ProjectionsManager = (function () {
        function ProjectionsManager(renderer) {
            var _this = this;
            this.onContextChange = function (gl) {
                _this.gl = gl;
                _this.renderer.maskManager.pushSpriteMask = pushSpriteMask;
            };
            this.renderer = renderer;
            renderer.on('context', this.onContextChange);
        }
        ProjectionsManager.prototype.destroy = function () {
            this.renderer.off('context', this.onContextChange);
        };
        return ProjectionsManager;
    }());
    pixi_projection.ProjectionsManager = ProjectionsManager;
    function pushSpriteMask(target, maskData) {
        var alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex];
        if (!alphaMaskFilter) {
            alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex] = [new pixi_projection.SpriteMaskFilter2d(maskData)];
        }
        alphaMaskFilter[0].resolution = this.renderer.resolution;
        alphaMaskFilter[0].maskSprite = maskData;
        target.filterArea = maskData.getBounds(true);
        this.renderer.filterManager.pushFilter(target, alphaMaskFilter);
        this.alphaMaskIndex++;
    }
    PIXI.WebGLRenderer.registerPlugin('projections', ProjectionsManager);
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var spriteMaskVert = "\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec3 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n\tgl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n\tvTextureCoord = aTextureCoord;\n\tvMaskCoord = otherMatrix * vec3( aTextureCoord, 1.0);\n}\n";
    var spriteMaskFrag = "\nvarying vec3 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform sampler2D mask;\n\nvoid main(void)\n{\n    vec2 uv = vMaskCoord.xy / vMaskCoord.z;\n    \n    vec2 text = abs( uv - 0.5 );\n    text = step(0.5, text);\n\n    float clip = 1.0 - max(text.y, text.x);\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, uv);\n\n    original *= (masky.r * masky.a * alpha * clip);\n\n    gl_FragColor = original;\n}\n";
    var tempMat = new pixi_projection.Matrix2d();
    var SpriteMaskFilter2d = (function (_super) {
        __extends(SpriteMaskFilter2d, _super);
        function SpriteMaskFilter2d(sprite) {
            var _this = _super.call(this, spriteMaskVert, spriteMaskFrag) || this;
            _this.maskMatrix = new pixi_projection.Matrix2d();
            sprite.renderable = false;
            _this.maskSprite = sprite;
            return _this;
        }
        SpriteMaskFilter2d.prototype.apply = function (filterManager, input, output, clear, currentState) {
            var maskSprite = this.maskSprite;
            this.uniforms.mask = maskSprite.texture;
            this.uniforms.otherMatrix = SpriteMaskFilter2d.calculateSpriteMatrix(currentState, this.maskMatrix, maskSprite);
            this.uniforms.alpha = maskSprite.worldAlpha;
            filterManager.applyFilter(this, input, output);
        };
        SpriteMaskFilter2d.calculateSpriteMatrix = function (currentState, mappedMatrix, sprite) {
            var proj = sprite.proj;
            var filterArea = currentState.sourceFrame;
            var textureSize = currentState.renderTarget.size;
            var worldTransform = proj && !proj._affine ? proj.world.copyTo(tempMat) : tempMat.copyFrom(sprite.transform.worldTransform);
            var texture = sprite.texture.orig;
            mappedMatrix.set(textureSize.width, 0, 0, textureSize.height, filterArea.x, filterArea.y);
            worldTransform.invert();
            mappedMatrix.setToMult2d(worldTransform, mappedMatrix);
            mappedMatrix.scaleAndTranslate(1.0 / texture.width, 1.0 / texture.height, sprite.anchor.x, sprite.anchor.y);
            return mappedMatrix;
        };
        return SpriteMaskFilter2d;
    }(PIXI.Filter));
    pixi_projection.SpriteMaskFilter2d = SpriteMaskFilter2d;
})(pixi_projection || (pixi_projection = {}));

},{}],3:[function(require,module,exports){
(function (global){
/*!
 * pixi-sound - v2.0.0
 * https://github.com/pixijs/pixi-sound
 * Compiled Tue, 14 Nov 2017 17:53:47 UTC
 *
 * pixi-sound is licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.__pixiSound=e.__pixiSound||{})}(this,function(e){"use strict";function t(e,t){function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}if("undefined"==typeof PIXI)throw"PixiJS required";var n=function(){function e(e,t){this._output=t,this._input=e}return Object.defineProperty(e.prototype,"destination",{get:function(){return this._input},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"filters",{get:function(){return this._filters},set:function(e){var t=this;if(this._filters&&(this._filters.forEach(function(e){e&&e.disconnect()}),this._filters=null,this._input.connect(this._output)),e&&e.length){this._filters=e.slice(0),this._input.disconnect();var n=null;e.forEach(function(e){null===n?t._input.connect(e.destination):n.connect(e.destination),n=e}),n.connect(this._output)}},enumerable:!0,configurable:!0}),e.prototype.destroy=function(){this.filters=null,this._input=null,this._output=null},e}(),o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])},i=0,r=function(e){function n(t){var n=e.call(this)||this;return n.id=i++,n.init(t),n}return t(n,e),Object.defineProperty(n.prototype,"progress",{get:function(){return this._source.currentTime/this._duration},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"paused",{get:function(){return this._paused},set:function(e){this._paused=e,this.refreshPaused()},enumerable:!0,configurable:!0}),n.prototype._onPlay=function(){this._playing=!0},n.prototype._onPause=function(){this._playing=!1},n.prototype.init=function(e){this._playing=!1,this._duration=e.source.duration;var t=this._source=e.source.cloneNode(!1);t.src=e.parent.url,t.onplay=this._onPlay.bind(this),t.onpause=this._onPause.bind(this),e.context.on("refresh",this.refresh,this),e.context.on("refreshPaused",this.refreshPaused,this),this._media=e},n.prototype._internalStop=function(){this._source&&this._playing&&(this._source.onended=null,this._source.pause())},n.prototype.stop=function(){this._internalStop(),this._source&&this.emit("stop")},Object.defineProperty(n.prototype,"speed",{get:function(){return this._speed},set:function(e){this._speed=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"volume",{get:function(){return this._volume},set:function(e){this._volume=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"loop",{get:function(){return this._loop},set:function(e){this._loop=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"muted",{get:function(){return this._muted},set:function(e){this._muted=e,this.refresh()},enumerable:!0,configurable:!0}),n.prototype.refresh=function(){var e=this._media.context,t=this._media.parent;this._source.loop=this._loop||t.loop;var n=e.volume*(e.muted?0:1),o=t.volume*(t.muted?0:1),i=this._volume*(this._muted?0:1);this._source.volume=i*n*o,this._source.playbackRate=this._speed*e.speed*t.speed},n.prototype.refreshPaused=function(){var e=this._media.context,t=this._media.parent,n=this._paused||t.paused||e.paused;n!==this._pausedReal&&(this._pausedReal=n,n?(this._internalStop(),this.emit("paused")):(this.emit("resumed"),this.play({start:this._source.currentTime,end:this._end,volume:this._volume,speed:this._speed,loop:this._loop})),this.emit("pause",n))},n.prototype.play=function(e){var t=this,o=e.start,i=e.end,r=e.speed,s=e.loop,u=e.volume,a=e.muted;i&&console.assert(i>o,"End time is before start time"),this._speed=r,this._volume=u,this._loop=!!s,this._muted=a,this.refresh(),this.loop&&null!==i&&(console.warn('Looping not support when specifying an "end" time'),this.loop=!1),this._start=o,this._end=i||this._duration,this._start=Math.max(0,this._start-n.PADDING),this._end=Math.min(this._end+n.PADDING,this._duration),this._source.onloadedmetadata=function(){t._source&&(t._source.currentTime=o,t._source.onloadedmetadata=null,t.emit("progress",o,t._duration),PIXI.ticker.shared.add(t._onUpdate,t))},this._source.onended=this._onComplete.bind(this),this._source.play(),this.emit("start")},n.prototype._onUpdate=function(){this.emit("progress",this.progress,this._duration),this._source.currentTime>=this._end&&!this._source.loop&&this._onComplete()},n.prototype._onComplete=function(){PIXI.ticker.shared.remove(this._onUpdate,this),this._internalStop(),this.emit("progress",1,this._duration),this.emit("end",this)},n.prototype.destroy=function(){PIXI.ticker.shared.remove(this._onUpdate,this),this.removeAllListeners();var e=this._source;e&&(e.onended=null,e.onplay=null,e.onpause=null,this._internalStop()),this._source=null,this._speed=1,this._volume=1,this._loop=!1,this._end=null,this._start=0,this._duration=0,this._playing=!1,this._pausedReal=!1,this._paused=!1,this._muted=!1,this._media&&(this._media.context.off("refresh",this.refresh,this),this._media.context.off("refreshPaused",this.refreshPaused,this),this._media=null)},n.prototype.toString=function(){return"[HTMLAudioInstance id="+this.id+"]"},n.PADDING=.1,n}(PIXI.utils.EventEmitter),s=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return t(n,e),n.prototype.init=function(e){this.parent=e,this._source=e.options.source||new Audio,e.url&&(this._source.src=e.url)},n.prototype.create=function(){return new r(this)},Object.defineProperty(n.prototype,"isPlayable",{get:function(){return!!this._source&&4===this._source.readyState},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"duration",{get:function(){return this._source.duration},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"context",{get:function(){return this.parent.context},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"filters",{get:function(){return null},set:function(e){console.warn("HTML Audio does not support filters")},enumerable:!0,configurable:!0}),n.prototype.destroy=function(){this.removeAllListeners(),this.parent=null,this._source&&(this._source.src="",this._source.load(),this._source=null)},Object.defineProperty(n.prototype,"source",{get:function(){return this._source},enumerable:!0,configurable:!0}),n.prototype.load=function(e){var t=this._source,n=this.parent;if(4===t.readyState){n.isLoaded=!0;var o=n.autoPlayStart();return void(e&&setTimeout(function(){e(null,n,o)},0))}if(!n.url)return e(new Error("sound.url or sound.source must be set"));t.src=n.url;var i=function(){t.removeEventListener("canplaythrough",r),t.removeEventListener("load",r),t.removeEventListener("abort",s),t.removeEventListener("error",u)},r=function(){i(),n.isLoaded=!0;var t=n.autoPlayStart();e&&e(null,n,t)},s=function(){i(),e&&e(new Error("Sound loading has been aborted"))},u=function(){i();var n="Failed to load audio element (code: "+t.error.code+")";e?e(new Error(n)):console.error(n)};t.addEventListener("canplaythrough",r,!1),t.addEventListener("load",r,!1),t.addEventListener("abort",s,!1),t.addEventListener("error",u,!1),t.load()},n}(PIXI.utils.EventEmitter),u="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},a=function(e,t){return t={exports:{}},e(t,t.exports),t.exports}(function(e){!function(t){function n(){}function o(e,t){return function(){e.apply(t,arguments)}}function i(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],l(e,this)}function r(e,t){for(;3===e._state;)e=e._value;if(0===e._state)return void e._deferreds.push(t);e._handled=!0,i._immediateFn(function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null===n)return void(1===e._state?s:u)(t.promise,e._value);var o;try{o=n(e._value)}catch(e){return void u(t.promise,e)}s(t.promise,o)})}function s(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof i)return e._state=3,e._value=t,void a(e);if("function"==typeof n)return void l(o(n,t),e)}e._state=1,e._value=t,a(e)}catch(t){u(e,t)}}function u(e,t){e._state=2,e._value=t,a(e)}function a(e){2===e._state&&0===e._deferreds.length&&i._immediateFn(function(){e._handled||i._unhandledRejectionFn(e._value)});for(var t=0,n=e._deferreds.length;t<n;t++)r(e,e._deferreds[t]);e._deferreds=null}function c(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}function l(e,t){var n=!1;try{e(function(e){n||(n=!0,s(t,e))},function(e){n||(n=!0,u(t,e))})}catch(e){if(n)return;n=!0,u(t,e)}}var p=setTimeout;i.prototype.catch=function(e){return this.then(null,e)},i.prototype.then=function(e,t){var o=new this.constructor(n);return r(this,new c(e,t,o)),o},i.all=function(e){var t=Array.prototype.slice.call(e);return new i(function(e,n){function o(r,s){try{if(s&&("object"==typeof s||"function"==typeof s)){var u=s.then;if("function"==typeof u)return void u.call(s,function(e){o(r,e)},n)}t[r]=s,0==--i&&e(t)}catch(e){n(e)}}if(0===t.length)return e([]);for(var i=t.length,r=0;r<t.length;r++)o(r,t[r])})},i.resolve=function(e){return e&&"object"==typeof e&&e.constructor===i?e:new i(function(t){t(e)})},i.reject=function(e){return new i(function(t,n){n(e)})},i.race=function(e){return new i(function(t,n){for(var o=0,i=e.length;o<i;o++)e[o].then(t,n)})},i._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){p(e,0)},i._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},i._setImmediateFn=function(e){i._immediateFn=e},i._setUnhandledRejectionFn=function(e){i._unhandledRejectionFn=e},e.exports?e.exports=i:t.Promise||(t.Promise=i)}(u)}),c=function(){function e(e,t){this.destination=e,this.source=t||e}return e.prototype.connect=function(e){this.source.connect(e)},e.prototype.disconnect=function(){this.source.disconnect()},e.prototype.destroy=function(){this.disconnect(),this.destination=null,this.source=null},e}(),l=function(){function e(){}return e.setParamValue=function(e,t){if(e.setValueAtTime){var n=S.instance.context;e.setValueAtTime(t,n.audioContext.currentTime)}else e.value=t;return t},e}(),p=function(e){function n(t,o,i,r,s,u,a,c,p,h){void 0===t&&(t=0),void 0===o&&(o=0),void 0===i&&(i=0),void 0===r&&(r=0),void 0===s&&(s=0),void 0===u&&(u=0),void 0===a&&(a=0),void 0===c&&(c=0),void 0===p&&(p=0),void 0===h&&(h=0);var d=this;if(S.instance.useLegacy)return void(d=e.call(this,null)||this);var f=[{f:n.F32,type:"lowshelf",gain:t},{f:n.F64,type:"peaking",gain:o},{f:n.F125,type:"peaking",gain:i},{f:n.F250,type:"peaking",gain:r},{f:n.F500,type:"peaking",gain:s},{f:n.F1K,type:"peaking",gain:u},{f:n.F2K,type:"peaking",gain:a},{f:n.F4K,type:"peaking",gain:c},{f:n.F8K,type:"peaking",gain:p},{f:n.F16K,type:"highshelf",gain:h}].map(function(e){var t=S.instance.context.audioContext.createBiquadFilter();return t.type=e.type,l.setParamValue(t.gain,e.gain),l.setParamValue(t.Q,1),l.setParamValue(t.frequency,e.f),t});(d=e.call(this,f[0],f[f.length-1])||this).bands=f,d.bandsMap={};for(var _=0;_<d.bands.length;_++){var y=d.bands[_];_>0&&d.bands[_-1].connect(y),d.bandsMap[y.frequency.value]=y}return d}return t(n,e),n.prototype.setGain=function(e,t){if(void 0===t&&(t=0),!this.bandsMap[e])throw"No band found for frequency "+e;l.setParamValue(this.bandsMap[e].gain,t)},n.prototype.getGain=function(e){if(!this.bandsMap[e])throw"No band found for frequency "+e;return this.bandsMap[e].gain.value},Object.defineProperty(n.prototype,"f32",{get:function(){return this.getGain(n.F32)},set:function(e){this.setGain(n.F32,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f64",{get:function(){return this.getGain(n.F64)},set:function(e){this.setGain(n.F64,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f125",{get:function(){return this.getGain(n.F125)},set:function(e){this.setGain(n.F125,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f250",{get:function(){return this.getGain(n.F250)},set:function(e){this.setGain(n.F250,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f500",{get:function(){return this.getGain(n.F500)},set:function(e){this.setGain(n.F500,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f1k",{get:function(){return this.getGain(n.F1K)},set:function(e){this.setGain(n.F1K,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f2k",{get:function(){return this.getGain(n.F2K)},set:function(e){this.setGain(n.F2K,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f4k",{get:function(){return this.getGain(n.F4K)},set:function(e){this.setGain(n.F4K,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f8k",{get:function(){return this.getGain(n.F8K)},set:function(e){this.setGain(n.F8K,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f16k",{get:function(){return this.getGain(n.F16K)},set:function(e){this.setGain(n.F16K,e)},enumerable:!0,configurable:!0}),n.prototype.reset=function(){this.bands.forEach(function(e){l.setParamValue(e.gain,0)})},n.prototype.destroy=function(){this.bands.forEach(function(e){e.disconnect()}),this.bands=null,this.bandsMap=null},n.F32=32,n.F64=64,n.F125=125,n.F250=250,n.F500=500,n.F1K=1e3,n.F2K=2e3,n.F4K=4e3,n.F8K=8e3,n.F16K=16e3,n}(c),h=function(e){function n(t){void 0===t&&(t=0);var n=this;if(S.instance.useLegacy)return void(n=e.call(this,null)||this);var o=S.instance.context.audioContext.createWaveShaper();return n=e.call(this,o)||this,n._distortion=o,n.amount=t,n}return t(n,e),Object.defineProperty(n.prototype,"amount",{get:function(){return this._amount},set:function(e){e*=1e3,this._amount=e;for(var t,n=new Float32Array(44100),o=Math.PI/180,i=0;i<44100;++i)t=2*i/44100-1,n[i]=(3+e)*t*20*o/(Math.PI+e*Math.abs(t));this._distortion.curve=n,this._distortion.oversample="4x"},enumerable:!0,configurable:!0}),n.prototype.destroy=function(){this._distortion=null,e.prototype.destroy.call(this)},n}(c),d=function(e){function n(t){void 0===t&&(t=0);var n=this;if(S.instance.useLegacy)return void(n=e.call(this,null)||this);var o,i,r,s=S.instance.context.audioContext;return s.createStereoPanner?r=o=s.createStereoPanner():((i=s.createPanner()).panningModel="equalpower",r=i),n=e.call(this,r)||this,n._stereo=o,n._panner=i,n.pan=t,n}return t(n,e),Object.defineProperty(n.prototype,"pan",{get:function(){return this._pan},set:function(e){this._pan=e,this._stereo?l.setParamValue(this._stereo.pan,e):this._panner.setPosition(e,0,1-Math.abs(e))},enumerable:!0,configurable:!0}),n.prototype.destroy=function(){e.prototype.destroy.call(this),this._stereo=null,this._panner=null},n}(c),f=function(e){function n(t,n,o){void 0===t&&(t=3),void 0===n&&(n=2),void 0===o&&(o=!1);var i=this;if(S.instance.useLegacy)return void(i=e.call(this,null)||this);var r=S.instance.context.audioContext.createConvolver();return i=e.call(this,r)||this,i._convolver=r,i._seconds=i._clamp(t,1,50),i._decay=i._clamp(n,0,100),i._reverse=o,i._rebuild(),i}return t(n,e),n.prototype._clamp=function(e,t,n){return Math.min(n,Math.max(t,e))},Object.defineProperty(n.prototype,"seconds",{get:function(){return this._seconds},set:function(e){this._seconds=this._clamp(e,1,50),this._rebuild()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"decay",{get:function(){return this._decay},set:function(e){this._decay=this._clamp(e,0,100),this._rebuild()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"reverse",{get:function(){return this._reverse},set:function(e){this._reverse=e,this._rebuild()},enumerable:!0,configurable:!0}),n.prototype._rebuild=function(){for(var e,t=S.instance.context.audioContext,n=t.sampleRate,o=n*this._seconds,i=t.createBuffer(2,o,n),r=i.getChannelData(0),s=i.getChannelData(1),u=0;u<o;u++)e=this._reverse?o-u:u,r[u]=(2*Math.random()-1)*Math.pow(1-e/o,this._decay),s[u]=(2*Math.random()-1)*Math.pow(1-e/o,this._decay);this._convolver.buffer=i},n.prototype.destroy=function(){this._convolver=null,e.prototype.destroy.call(this)},n}(c),_=function(e){function n(){var t=this;S.instance.useLegacy&&(t=e.call(this,null)||this);var n=S.instance.context.audioContext,o=n.createChannelSplitter(),i=n.createChannelMerger();return i.connect(o),t=e.call(this,i,o)||this,t._merger=i,t}return t(n,e),n.prototype.destroy=function(){this._merger.disconnect(),this._merger=null,e.prototype.destroy.call(this)},n}(c),y=function(e){function n(){if(S.instance.useLegacy)return void(e.call(this,null)||this);var t=S.instance.context.audioContext,n=t.createBiquadFilter(),o=t.createBiquadFilter(),i=t.createBiquadFilter(),r=t.createBiquadFilter();return n.type="lowpass",l.setParamValue(n.frequency,2e3),o.type="lowpass",l.setParamValue(o.frequency,2e3),i.type="highpass",l.setParamValue(i.frequency,500),r.type="highpass",l.setParamValue(r.frequency,500),n.connect(o),o.connect(i),i.connect(r),e.call(this,n,r)||this}return t(n,e),n}(c),m=Object.freeze({Filter:c,EqualizerFilter:p,DistortionFilter:h,StereoFilter:d,ReverbFilter:f,MonoFilter:_,TelephoneFilter:y}),b=function(e){function n(){var t=e.call(this)||this;return t.speed=1,t.volume=1,t.muted=!1,t.paused=!1,t}return t(n,e),n.prototype.refresh=function(){this.emit("refresh")},n.prototype.refreshPaused=function(){this.emit("refreshPaused")},Object.defineProperty(n.prototype,"filters",{get:function(){return console.warn("HTML Audio does not support filters"),null},set:function(e){console.warn("HTML Audio does not support filters")},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"audioContext",{get:function(){return console.warn("HTML Audio does not support audioContext"),null},enumerable:!0,configurable:!0}),n.prototype.toggleMute=function(){return this.muted=!this.muted,this.refresh(),this.muted},n.prototype.togglePause=function(){return this.paused=!this.paused,this.refreshPaused(),this.paused},n.prototype.destroy=function(){this.removeAllListeners()},n}(PIXI.utils.EventEmitter),g=Object.freeze({HTMLAudioMedia:s,HTMLAudioInstance:r,HTMLAudioContext:b}),v=0,P=function(e){function n(t){var n=e.call(this)||this;return n.id=v++,n._media=null,n._paused=!1,n._muted=!1,n._elapsed=0,n._updateListener=n._update.bind(n),n.init(t),n}return t(n,e),n.prototype.stop=function(){this._source&&(this._internalStop(),this.emit("stop"))},Object.defineProperty(n.prototype,"speed",{get:function(){return this._speed},set:function(e){this._speed=e,this.refresh(),this._update(!0)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"volume",{get:function(){return this._volume},set:function(e){this._volume=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"muted",{get:function(){return this._muted},set:function(e){this._muted=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"loop",{get:function(){return this._loop},set:function(e){this._loop=e,this.refresh()},enumerable:!0,configurable:!0}),n.prototype.refresh=function(){var e=this._media.context,t=this._media.parent;this._source.loop=this._loop||t.loop;var n=e.volume*(e.muted?0:1),o=t.volume*(t.muted?0:1),i=this._volume*(this._muted?0:1);l.setParamValue(this._gain.gain,i*o*n),l.setParamValue(this._source.playbackRate,this._speed*t.speed*e.speed)},n.prototype.refreshPaused=function(){var e=this._media.context,t=this._media.parent,n=this._paused||t.paused||e.paused;n!==this._pausedReal&&(this._pausedReal=n,n?(this._internalStop(),this.emit("paused")):(this.emit("resumed"),this.play({start:this._elapsed%this._duration,end:this._end,speed:this._speed,loop:this._loop,volume:this._volume})),this.emit("pause",n))},n.prototype.play=function(e){var t=e.start,n=e.end,o=e.speed,i=e.loop,r=e.volume,s=e.muted;n&&console.assert(n>t,"End time is before start time"),this._paused=!1;var u=this._media.nodes.cloneBufferSource(),a=u.source,c=u.gain;this._source=a,this._gain=c,this._speed=o,this._volume=r,this._loop=!!i,this._muted=s,this.refresh(),this.loop&&null!==n&&(console.warn('Looping not support when specifying an "end" time'),this.loop=!1),this._end=n;var l=this._source.buffer.duration;this._duration=l,this._lastUpdate=this._now(),this._elapsed=t,this._source.onended=this._onComplete.bind(this),n?this._source.start(0,t,n-t):this._source.start(0,t),this.emit("start"),this._update(!0),this._enabled=!0},n.prototype._toSec=function(e){return e>10&&(e/=1e3),e||0},Object.defineProperty(n.prototype,"_enabled",{set:function(e){var t=this._media.nodes.script;t.removeEventListener("audioprocess",this._updateListener),e&&t.addEventListener("audioprocess",this._updateListener)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"progress",{get:function(){return this._progress},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"paused",{get:function(){return this._paused},set:function(e){this._paused=e,this.refreshPaused()},enumerable:!0,configurable:!0}),n.prototype.destroy=function(){this.removeAllListeners(),this._internalStop(),this._source&&(this._source.disconnect(),this._source=null),this._gain&&(this._gain.disconnect(),this._gain=null),this._media&&(this._media.context.events.off("refresh",this.refresh,this),this._media.context.events.off("refreshPaused",this.refreshPaused,this),this._media=null),this._end=null,this._speed=1,this._volume=1,this._loop=!1,this._elapsed=0,this._duration=0,this._paused=!1,this._muted=!1,this._pausedReal=!1},n.prototype.toString=function(){return"[WebAudioInstance id="+this.id+"]"},n.prototype._now=function(){return this._media.context.audioContext.currentTime},n.prototype._update=function(e){if(void 0===e&&(e=!1),this._source){var t=this._now(),n=t-this._lastUpdate;if(n>0||e){var o=this._source.playbackRate.value;this._elapsed+=n*o,this._lastUpdate=t;var i=this._duration,r=this._elapsed%i/i;this._progress=r,this.emit("progress",this._progress,i)}}},n.prototype.init=function(e){this._media=e,e.context.events.on("refresh",this.refresh,this),e.context.events.on("refreshPaused",this.refreshPaused,this)},n.prototype._internalStop=function(){this._source&&(this._enabled=!1,this._source.onended=null,this._source.stop(),this._source=null)},n.prototype._onComplete=function(){this._source&&(this._enabled=!1,this._source.onended=null),this._source=null,this._progress=1,this.emit("progress",1,this._duration),this.emit("end",this)},n}(PIXI.utils.EventEmitter),x=function(e){function n(t){var o=this,i=t.audioContext,r=i.createBufferSource(),s=i.createScriptProcessor(n.BUFFER_SIZE),u=i.createGain(),a=i.createAnalyser();return r.connect(a),a.connect(u),u.connect(t.destination),s.connect(t.destination),o=e.call(this,a,u)||this,o.context=t,o.bufferSource=r,o.script=s,o.gain=u,o.analyser=a,o}return t(n,e),n.prototype.destroy=function(){e.prototype.destroy.call(this),this.bufferSource.disconnect(),this.script.disconnect(),this.gain.disconnect(),this.analyser.disconnect(),this.bufferSource=null,this.script=null,this.gain=null,this.analyser=null,this.context=null},n.prototype.cloneBufferSource=function(){var e=this.bufferSource,t=this.context.audioContext.createBufferSource();t.buffer=e.buffer,l.setParamValue(t.playbackRate,e.playbackRate.value),t.loop=e.loop;var n=this.context.audioContext.createGain();return t.connect(n),n.connect(this.destination),{source:t,gain:n}},n.BUFFER_SIZE=256,n}(n),O=function(){function e(){}return e.prototype.init=function(e){this.parent=e,this._nodes=new x(this.context),this._source=this._nodes.bufferSource,this.source=e.options.source},e.prototype.destroy=function(){this.parent=null,this._nodes.destroy(),this._nodes=null,this._source=null,this.source=null},e.prototype.create=function(){return new P(this)},Object.defineProperty(e.prototype,"context",{get:function(){return this.parent.context},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"isPlayable",{get:function(){return!!this._source&&!!this._source.buffer},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"filters",{get:function(){return this._nodes.filters},set:function(e){this._nodes.filters=e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"duration",{get:function(){return console.assert(this.isPlayable,"Sound not yet playable, no duration"),this._source.buffer.duration},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"buffer",{get:function(){return this._source.buffer},set:function(e){this._source.buffer=e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"nodes",{get:function(){return this._nodes},enumerable:!0,configurable:!0}),e.prototype.load=function(e){this.source?this._decode(this.source,e):this.parent.url?this._loadUrl(e):e?e(new Error("sound.url or sound.source must be set")):console.error("sound.url or sound.source must be set")},e.prototype._loadUrl=function(e){var t=this,n=new XMLHttpRequest,o=this.parent.url;n.open("GET",o,!0),n.responseType="arraybuffer",n.onload=function(){t.source=n.response,t._decode(n.response,e)},n.send()},e.prototype._decode=function(e,t){var n=this;this.parent.context.decode(e,function(e,o){if(e)t&&t(e);else{n.parent.isLoaded=!0,n.buffer=o;var i=n.parent.autoPlayStart();t&&t(null,n.parent,i)}})},e}(),w=function(){function e(){}return e.resolveUrl=function(t){var n=e.FORMAT_PATTERN,o="string"==typeof t?t:t.url;if(n.test(o)){for(var i=n.exec(o),r=i[2].split(","),s=r[r.length-1],u=0,a=r.length;u<a;u++){var c=r[u];if(e.supported[c]){s=c;break}}var l=o.replace(i[1],s);return"string"!=typeof t&&(t.extension=s,t.url=l),l}return o},e.sineTone=function(e,t){void 0===e&&(e=200),void 0===t&&(t=1);var n=I.from({singleInstance:!0});if(!(n.media instanceof O))return n;for(var o=n.media,i=n.context.audioContext.createBuffer(1,48e3*t,48e3),r=i.getChannelData(0),s=0;s<r.length;s++){var u=e*(s/i.sampleRate)*Math.PI;r[s]=2*Math.sin(u)}return o.buffer=i,n.isLoaded=!0,n},e.render=function(e,t){var n=document.createElement("canvas");t=Object.assign({width:512,height:128,fill:"black"},t||{}),n.width=t.width,n.height=t.height;var o=PIXI.BaseTexture.fromCanvas(n);if(!(e.media instanceof O))return o;var i=e.media;console.assert(!!i.buffer,"No buffer found, load first");var r=n.getContext("2d");r.fillStyle=t.fill;for(var s=i.buffer.getChannelData(0),u=Math.ceil(s.length/t.width),a=t.height/2,c=0;c<t.width;c++){for(var l=1,p=-1,h=0;h<u;h++){var d=s[c*u+h];d<l&&(l=d),d>p&&(p=d)}r.fillRect(c,(1+l)*a,1,Math.max(1,(p-l)*a))}return o},e.playOnce=function(t,n){var o="alias"+e.PLAY_ID++;return S.instance.add(o,{url:t,preload:!0,autoPlay:!0,loaded:function(e){e&&(console.error(e),S.instance.remove(o),n&&n(e))},complete:function(){S.instance.remove(o),n&&n(null)}}),o},e.PLAY_ID=0,e.FORMAT_PATTERN=/\.(\{([^\}]+)\})(\?.*)?$/,e.extensions=["mp3","ogg","oga","opus","mpeg","wav","m4a","mp4","aiff","wma","mid"],e.supported=function(){var t={m4a:"mp4",oga:"ogg"},n=document.createElement("audio"),o={};return e.extensions.forEach(function(e){var i=t[e]||e,r=n.canPlayType("audio/"+e).replace(/^no$/,""),s=n.canPlayType("audio/"+i).replace(/^no$/,"");o[e]=!!r||!!s}),Object.freeze(o)}(),e}(),j=function(e){function n(t,n){var o=e.call(this,t,n)||this;return o.use(A.plugin),o.pre(A.resolve),o}return t(n,e),n.addPixiMiddleware=function(t){e.addPixiMiddleware.call(this,t)},n}(PIXI.loaders.Loader),A=function(){function e(){}return e.install=function(t){e._sound=t,e.legacy=t.useLegacy,PIXI.loaders.Loader=j,PIXI.loader.use(e.plugin),PIXI.loader.pre(e.resolve)},Object.defineProperty(e,"legacy",{set:function(e){var t=PIXI.loaders.Resource,n=w.extensions;e?n.forEach(function(e){t.setExtensionXhrType(e,t.XHR_RESPONSE_TYPE.DEFAULT),t.setExtensionLoadType(e,t.LOAD_TYPE.AUDIO)}):n.forEach(function(e){t.setExtensionXhrType(e,t.XHR_RESPONSE_TYPE.BUFFER),t.setExtensionLoadType(e,t.LOAD_TYPE.XHR)})},enumerable:!0,configurable:!0}),e.resolve=function(e,t){w.resolveUrl(e),t()},e.plugin=function(t,n){t.data&&w.extensions.indexOf(t.extension)>-1?t.sound=e._sound.add(t.name,{loaded:n,preload:!0,url:t.url,source:t.data}):n()},e}(),F=function(){function e(e,t){this.parent=e,Object.assign(this,t),this.duration=this.end-this.start,console.assert(this.duration>0,"End time must be after start time")}return e.prototype.play=function(e){return this.parent.play(Object.assign({complete:e,speed:this.speed||this.parent.speed,end:this.end,start:this.start}))},e.prototype.destroy=function(){this.parent=null},e}(),E=function(e){function n(){var t=this,o=new n.AudioContext,i=o.createDynamicsCompressor(),r=o.createAnalyser();return r.connect(i),i.connect(o.destination),t=e.call(this,r,i)||this,t._ctx=o,t._offlineCtx=new n.OfflineAudioContext(1,2,o.sampleRate),t._unlocked=!1,t.compressor=i,t.analyser=r,t.events=new PIXI.utils.EventEmitter,t.volume=1,t.speed=1,t.muted=!1,t.paused=!1,"ontouchstart"in window&&"running"!==o.state&&(t._unlock(),t._unlock=t._unlock.bind(t),document.addEventListener("mousedown",t._unlock,!0),document.addEventListener("touchstart",t._unlock,!0),document.addEventListener("touchend",t._unlock,!0)),t}return t(n,e),n.prototype._unlock=function(){this._unlocked||(this.playEmptySound(),"running"===this._ctx.state&&(document.removeEventListener("mousedown",this._unlock,!0),document.removeEventListener("touchend",this._unlock,!0),document.removeEventListener("touchstart",this._unlock,!0),this._unlocked=!0))},n.prototype.playEmptySound=function(){var e=this._ctx.createBufferSource();e.buffer=this._ctx.createBuffer(1,1,22050),e.connect(this._ctx.destination),e.start(0,0,0)},Object.defineProperty(n,"AudioContext",{get:function(){var e=window;return e.AudioContext||e.webkitAudioContext||null},enumerable:!0,configurable:!0}),Object.defineProperty(n,"OfflineAudioContext",{get:function(){var e=window;return e.OfflineAudioContext||e.webkitOfflineAudioContext||null},enumerable:!0,configurable:!0}),n.prototype.destroy=function(){e.prototype.destroy.call(this);var t=this._ctx;void 0!==t.close&&t.close(),this.events.removeAllListeners(),this.analyser.disconnect(),this.compressor.disconnect(),this.analyser=null,this.compressor=null,this.events=null,this._offlineCtx=null,this._ctx=null},Object.defineProperty(n.prototype,"audioContext",{get:function(){return this._ctx},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"offlineContext",{get:function(){return this._offlineCtx},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"paused",{get:function(){return this._paused},set:function(e){e&&"running"===this._ctx.state?this._ctx.suspend():e||"suspended"!==this._ctx.state||this._ctx.resume(),this._paused=e},enumerable:!0,configurable:!0}),n.prototype.refresh=function(){this.events.emit("refresh")},n.prototype.refreshPaused=function(){this.events.emit("refreshPaused")},n.prototype.toggleMute=function(){return this.muted=!this.muted,this.refresh(),this.muted},n.prototype.togglePause=function(){return this.paused=!this.paused,this.refreshPaused(),this._paused},n.prototype.decode=function(e,t){this._offlineCtx.decodeAudioData(e,function(e){t(null,e)},function(){t(new Error("Unable to decode file"))})},n}(n),L=Object.freeze({WebAudioMedia:O,WebAudioInstance:P,WebAudioNodes:x,WebAudioContext:E,WebAudioUtils:l}),S=function(){function e(){this.init()}return e.prototype.init=function(){return this.supported&&(this._webAudioContext=new E),this._htmlAudioContext=new b,this._sounds={},this.useLegacy=!this.supported,this},Object.defineProperty(e.prototype,"context",{get:function(){return this._context},enumerable:!0,configurable:!0}),e.init=function(){if(e.instance)throw new Error("SoundLibrary is already created");var t=e.instance=new e;"undefined"==typeof Promise&&(window.Promise=a),void 0!==PIXI.loaders&&A.install(t),void 0===window.__pixiSound&&delete window.__pixiSound;var o=PIXI;return o.sound||(Object.defineProperty(o,"sound",{get:function(){return t}}),Object.defineProperties(t,{filters:{get:function(){return m}},htmlaudio:{get:function(){return g}},webaudio:{get:function(){return L}},utils:{get:function(){return w}},Sound:{get:function(){return I}},SoundSprite:{get:function(){return F}},Filterable:{get:function(){return n}},SoundLibrary:{get:function(){return e}}})),t},Object.defineProperty(e.prototype,"filtersAll",{get:function(){return this.useLegacy?[]:this._context.filters},set:function(e){this.useLegacy||(this._context.filters=e)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"supported",{get:function(){return null!==E.AudioContext},enumerable:!0,configurable:!0}),e.prototype.add=function(e,t){if("object"==typeof e){var n={};for(var o in e){i=this._getOptions(e[o],t);n[o]=this.add(o,i)}return n}if("string"==typeof e){if(console.assert(!this._sounds[e],"Sound with alias "+e+" already exists."),t instanceof I)return this._sounds[e]=t,t;var i=this._getOptions(t),r=I.from(i);return this._sounds[e]=r,r}},e.prototype._getOptions=function(e,t){var n;return n="string"==typeof e?{url:e}:e instanceof ArrayBuffer||e instanceof HTMLAudioElement?{source:e}:e,Object.assign(n,t||{})},Object.defineProperty(e.prototype,"useLegacy",{get:function(){return this._useLegacy},set:function(e){A.legacy=e,this._useLegacy=e,!e&&this.supported?this._context=this._webAudioContext:this._context=this._htmlAudioContext},enumerable:!0,configurable:!0}),e.prototype.remove=function(e){return this.exists(e,!0),this._sounds[e].destroy(),delete this._sounds[e],this},Object.defineProperty(e.prototype,"volumeAll",{get:function(){return this._context.volume},set:function(e){this._context.volume=e,this._context.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"speedAll",{get:function(){return this._context.speed},set:function(e){this._context.speed=e,this._context.refresh()},enumerable:!0,configurable:!0}),e.prototype.togglePauseAll=function(){return this._context.togglePause()},e.prototype.pauseAll=function(){return this._context.paused=!0,this._context.refresh(),this},e.prototype.resumeAll=function(){return this._context.paused=!1,this._context.refresh(),this},e.prototype.toggleMuteAll=function(){return this._context.toggleMute()},e.prototype.muteAll=function(){return this._context.muted=!0,this._context.refresh(),this},e.prototype.unmuteAll=function(){return this._context.muted=!1,this._context.refresh(),this},e.prototype.removeAll=function(){for(var e in this._sounds)this._sounds[e].destroy(),delete this._sounds[e];return this},e.prototype.stopAll=function(){for(var e in this._sounds)this._sounds[e].stop();return this},e.prototype.exists=function(e,t){void 0===t&&(t=!1);var n=!!this._sounds[e];return t&&console.assert(n,"No sound matching alias '"+e+"'."),n},e.prototype.find=function(e){return this.exists(e,!0),this._sounds[e]},e.prototype.play=function(e,t){return this.find(e).play(t)},e.prototype.stop=function(e){return this.find(e).stop()},e.prototype.pause=function(e){return this.find(e).pause()},e.prototype.resume=function(e){return this.find(e).resume()},e.prototype.volume=function(e,t){var n=this.find(e);return void 0!==t&&(n.volume=t),n.volume},e.prototype.speed=function(e,t){var n=this.find(e);return void 0!==t&&(n.speed=t),n.speed},e.prototype.duration=function(e){return this.find(e).duration},e.prototype.close=function(){return this.removeAll(),this._sounds=null,this._webAudioContext&&(this._webAudioContext.destroy(),this._webAudioContext=null),this._htmlAudioContext&&(this._htmlAudioContext.destroy(),this._htmlAudioContext=null),this._context=null,this},e}(),I=function(){function e(e,t){this.media=e,this.options=t,this._instances=[],this._sprites={},this.media.init(this);var n=t.complete;this._autoPlayOptions=n?{complete:n}:null,this.isLoaded=!1,this.isPlaying=!1,this.autoPlay=t.autoPlay,this.singleInstance=t.singleInstance,this.preload=t.preload||this.autoPlay,this.url=t.url,this.speed=t.speed,this.volume=t.volume,this.loop=t.loop,t.sprites&&this.addSprites(t.sprites),this.preload&&this._preload(t.loaded)}return e.from=function(t){var n={};return"string"==typeof t?n.url=t:t instanceof ArrayBuffer||t instanceof HTMLAudioElement?n.source=t:n=t,(n=Object.assign({autoPlay:!1,singleInstance:!1,url:null,source:null,preload:!1,volume:1,speed:1,complete:null,loaded:null,loop:!1},n)).url&&(n.url=w.resolveUrl(n.url)),Object.freeze(n),new e(S.instance.useLegacy?new s:new O,n)},Object.defineProperty(e.prototype,"context",{get:function(){return S.instance.context},enumerable:!0,configurable:!0}),e.prototype.pause=function(){return this.isPlaying=!1,this.paused=!0,this},e.prototype.resume=function(){return this.isPlaying=this._instances.length>0,this.paused=!1,this},Object.defineProperty(e.prototype,"paused",{get:function(){return this._paused},set:function(e){this._paused=e,this.refreshPaused()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"speed",{get:function(){return this._speed},set:function(e){this._speed=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"filters",{get:function(){return this.media.filters},set:function(e){this.media.filters=e},enumerable:!0,configurable:!0}),e.prototype.addSprites=function(e,t){if("object"==typeof e){var n={};for(var o in e)n[o]=this.addSprites(o,e[o]);return n}if("string"==typeof e){console.assert(!this._sprites[e],"Alias "+e+" is already taken");var i=new F(this,t);return this._sprites[e]=i,i}},e.prototype.destroy=function(){this._removeInstances(),this.removeSprites(),this.media.destroy(),this.media=null,this._sprites=null,this._instances=null},e.prototype.removeSprites=function(e){if(e){var t=this._sprites[e];void 0!==t&&(t.destroy(),delete this._sprites[e])}else for(var n in this._sprites)this.removeSprites(n);return this},Object.defineProperty(e.prototype,"isPlayable",{get:function(){return this.isLoaded&&this.media&&this.media.isPlayable},enumerable:!0,configurable:!0}),e.prototype.stop=function(){if(!this.isPlayable)return this.autoPlay=!1,this._autoPlayOptions=null,this;this.isPlaying=!1;for(var e=this._instances.length-1;e>=0;e--)this._instances[e].stop();return this},e.prototype.play=function(e,t){var n,o=this;if("string"==typeof e?n={sprite:r=e,complete:t}:"function"==typeof e?(n={}).complete=e:n=e,(n=Object.assign({complete:null,loaded:null,sprite:null,end:null,start:0,volume:1,speed:1,muted:!1,loop:!1},n||{})).sprite){var i=n.sprite;console.assert(!!this._sprites[i],"Alias "+i+" is not available");var r=this._sprites[i];n.start=r.start,n.end=r.end,n.speed=r.speed||1,delete n.sprite}if(n.offset&&(n.start=n.offset),!this.isLoaded)return new Promise(function(e,t){o.autoPlay=!0,o._autoPlayOptions=n,o._preload(function(o,i,r){o?t(o):(n.loaded&&n.loaded(o,i,r),e(r))})});this.singleInstance&&this._removeInstances();var s=this._createInstance();return this._instances.push(s),this.isPlaying=!0,s.once("end",function(){n.complete&&n.complete(o),o._onComplete(s)}),s.once("stop",function(){o._onComplete(s)}),s.play(n),s},e.prototype.refresh=function(){for(var e=this._instances.length,t=0;t<e;t++)this._instances[t].refresh()},e.prototype.refreshPaused=function(){for(var e=this._instances.length,t=0;t<e;t++)this._instances[t].refreshPaused()},Object.defineProperty(e.prototype,"volume",{get:function(){return this._volume},set:function(e){this._volume=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"muted",{get:function(){return this._muted},set:function(e){this._muted=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"loop",{get:function(){return this._loop},set:function(e){this._loop=e,this.refresh()},enumerable:!0,configurable:!0}),e.prototype._preload=function(e){this.media.load(e)},Object.defineProperty(e.prototype,"instances",{get:function(){return this._instances},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"sprites",{get:function(){return this._sprites},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"duration",{get:function(){return this.media.duration},enumerable:!0,configurable:!0}),e.prototype.autoPlayStart=function(){var e;return this.autoPlay&&(e=this.play(this._autoPlayOptions)),e},e.prototype._removeInstances=function(){for(var e=this._instances.length-1;e>=0;e--)this._poolInstance(this._instances[e]);this._instances.length=0},e.prototype._onComplete=function(e){if(this._instances){var t=this._instances.indexOf(e);t>-1&&this._instances.splice(t,1),this.isPlaying=this._instances.length>0}this._poolInstance(e)},e.prototype._createInstance=function(){if(e._pool.length>0){var t=e._pool.pop();return t.init(this.media),t}return this.media.create()},e.prototype._poolInstance=function(t){t.destroy(),e._pool.indexOf(t)<0&&e._pool.push(t)},e._pool=[],e}(),C=S.init();e.sound=C,e.filters=m,e.htmlaudio=g,e.webaudio=L,e.Filterable=n,e.Sound=I,e.SoundLibrary=S,e.SoundSprite=F,e.utils=w,Object.defineProperty(e,"__esModule",{value:!0})});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
!function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return t[i].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(6)},function(t,e){t.exports=PIXI},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={linear:function(){return function(t){return t}},inQuad:function(){return function(t){return t*t}},outQuad:function(){return function(t){return t*(2-t)}},inOutQuad:function(){return function(t){return t*=2,1>t?.5*t*t:-.5*(--t*(t-2)-1)}},inCubic:function(){return function(t){return t*t*t}},outCubic:function(){return function(t){return--t*t*t+1}},inOutCubic:function(){return function(t){return t*=2,1>t?.5*t*t*t:(t-=2,.5*(t*t*t+2))}},inQuart:function(){return function(t){return t*t*t*t}},outQuart:function(){return function(t){return 1- --t*t*t*t}},inOutQuart:function(){return function(t){return t*=2,1>t?.5*t*t*t*t:(t-=2,-.5*(t*t*t*t-2))}},inQuint:function(){return function(t){return t*t*t*t*t}},outQuint:function(){return function(t){return--t*t*t*t*t+1}},inOutQuint:function(){return function(t){return t*=2,1>t?.5*t*t*t*t*t:(t-=2,.5*(t*t*t*t*t+2))}},inSine:function(){return function(t){return 1-Math.cos(t*Math.PI/2)}},outSine:function(){return function(t){return Math.sin(t*Math.PI/2)}},inOutSine:function(){return function(t){return.5*(1-Math.cos(Math.PI*t))}},inExpo:function(){return function(t){return 0===t?0:Math.pow(1024,t-1)}},outExpo:function(){return function(t){return 1===t?1:1-Math.pow(2,-10*t)}},inOutExpo:function(){return function(t){return 0===t?0:1===t?1:(t*=2,1>t?.5*Math.pow(1024,t-1):.5*(-Math.pow(2,-10*(t-1))+2))}},inCirc:function(){return function(t){return 1-Math.sqrt(1-t*t)}},outCirc:function(){return function(t){return Math.sqrt(1- --t*t)}},inOutCirc:function(){return function(t){return t*=2,1>t?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-2)*(t-2))+1)}},inElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),-(t*Math.pow(2,10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)))}},outElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),t*Math.pow(2,-10*n)*Math.sin((n-i)*(2*Math.PI)/e)+1)}},inOutElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),n*=2,1>n?-.5*(t*Math.pow(2,10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)):t*Math.pow(2,-10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)*.5+1)}},inBack:function(t){return function(e){var n=t||1.70158;return e*e*((n+1)*e-n)}},outBack:function(t){return function(e){var n=t||1.70158;return--e*e*((n+1)*e+n)+1}},inOutBack:function(t){return function(e){var n=1.525*(t||1.70158);return e*=2,1>e?.5*(e*e*((n+1)*e-n)):.5*((e-2)*(e-2)*((n+1)*(e-2)+n)+2)}},inBounce:function(){return function(t){return 1-n.outBounce()(1-t)}},outBounce:function(){return function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?(t-=1.5/2.75,7.5625*t*t+.75):2.5/2.75>t?(t-=2.25/2.75,7.5625*t*t+.9375):(t-=2.625/2.75,7.5625*t*t+.984375)}},inOutBounce:function(){return function(t){return.5>t?.5*n.inBounce()(2*t):.5*n.outBounce()(2*t-1)+.5}},customArray:function(t){return t?function(t){return t}:n.linear()}};e["default"]=n},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t,e,n,i,r,s){for(var o in t)if(c(t[o]))u(t[o],e[o],n[o],i,r,s);else{var a=e[o],h=t[o]-e[o],l=i,f=r/l;n[o]=a+h*s(f)}}function h(t,e,n){for(var i in t)0===e[i]||e[i]||(c(n[i])?(e[i]=JSON.parse(JSON.stringify(n[i])),h(t[i],e[i],n[i])):e[i]=n[i])}function c(t){return"[object Object]"===Object.prototype.toString.call(t)}var l=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var f=n(1),p=r(f),d=n(2),g=i(d),v=function(t){function e(t,n){s(this,e);var i=o(this,Object.getPrototypeOf(e).call(this));return i.target=t,n&&i.addTo(n),i.clear(),i}return a(e,t),l(e,[{key:"addTo",value:function(t){return this.manager=t,this.manager.addTween(this),this}},{key:"chain",value:function(t){return t||(t=new e(this.target)),this._chainTween=t,t}},{key:"start",value:function(){return this.active=!0,this}},{key:"stop",value:function(){return this.active=!1,this.emit("stop"),this}},{key:"to",value:function(t){return this._to=t,this}},{key:"from",value:function(t){return this._from=t,this}},{key:"remove",value:function(){return this.manager?(this.manager.removeTween(this),this):this}},{key:"clear",value:function(){this.time=0,this.active=!1,this.easing=g["default"].linear(),this.expire=!1,this.repeat=0,this.loop=!1,this.delay=0,this.pingPong=!1,this.isStarted=!1,this.isEnded=!1,this._to=null,this._from=null,this._delayTime=0,this._elapsedTime=0,this._repeat=0,this._pingPong=!1,this._chainTween=null,this.path=null,this.pathReverse=!1,this.pathFrom=0,this.pathTo=0}},{key:"reset",value:function(){if(this._elapsedTime=0,this._repeat=0,this._delayTime=0,this.isStarted=!1,this.isEnded=!1,this.pingPong&&this._pingPong){var t=this._to,e=this._from;this._to=e,this._from=t,this._pingPong=!1}return this}},{key:"update",value:function(t,e){if(this._canUpdate()||!this._to&&!this.path){var n=void 0,i=void 0;if(this.delay>this._delayTime)return void(this._delayTime+=e);this.isStarted||(this._parseData(),this.isStarted=!0,this.emit("start"));var r=this.pingPong?this.time/2:this.time;if(r>this._elapsedTime){var s=this._elapsedTime+e,o=s>=r;this._elapsedTime=o?r:s,this._apply(r);var a=this._pingPong?r+this._elapsedTime:this._elapsedTime;if(this.emit("update",a),o){if(this.pingPong&&!this._pingPong)return this._pingPong=!0,n=this._to,i=this._from,this._from=n,this._to=i,this.path&&(n=this.pathTo,i=this.pathFrom,this.pathTo=i,this.pathFrom=n),this.emit("pingpong"),void(this._elapsedTime=0);if(this.loop||this.repeat>this._repeat)return this._repeat++,this.emit("repeat",this._repeat),this._elapsedTime=0,void(this.pingPong&&this._pingPong&&(n=this._to,i=this._from,this._to=i,this._from=n,this.path&&(n=this.pathTo,i=this.pathFrom,this.pathTo=i,this.pathFrom=n),this._pingPong=!1));this.isEnded=!0,this.active=!1,this.emit("end"),this._chainTween&&(this._chainTween.addTo(this.manager),this._chainTween.start())}}}}},{key:"_parseData",value:function(){if(!this.isStarted&&(this._from||(this._from={}),h(this._to,this._from,this.target),this.path)){var t=this.path.totalDistance();this.pathReverse?(this.pathFrom=t,this.pathTo=0):(this.pathFrom=0,this.pathTo=t)}}},{key:"_apply",value:function(t){if(u(this._to,this._from,this.target,t,this._elapsedTime,this.easing),this.path){var e=this.pingPong?this.time/2:this.time,n=this.pathFrom,i=this.pathTo-this.pathFrom,r=e,s=this._elapsedTime/r,o=n+i*this.easing(s),a=this.path.getPointAtDistance(o);this.target.position.set(a.x,a.y)}}},{key:"_canUpdate",value:function(){return this.time&&this.active&&this.target}}]),e}(p.utils.EventEmitter);e["default"]=v},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var o=n(3),a=i(o),u=function(){function t(){r(this,t),this.tweens=[],this._tweensToDelete=[],this._last=0}return s(t,[{key:"update",value:function(t){var e=void 0;t||0===t?e=1e3*t:(e=this._getDeltaMS(),t=e/1e3);for(var n=0;n<this.tweens.length;n++){var i=this.tweens[n];i.active&&(i.update(t,e),i.isEnded&&i.expire&&i.remove())}if(this._tweensToDelete.length){for(var n=0;n<this._tweensToDelete.length;n++)this._remove(this._tweensToDelete[n]);this._tweensToDelete.length=0}}},{key:"getTweensForTarget",value:function(t){for(var e=[],n=0;n<this.tweens.length;n++)this.tweens[n].target===t&&e.push(this.tweens[n]);return e}},{key:"createTween",value:function(t){return new a["default"](t,this)}},{key:"addTween",value:function(t){t.manager=this,this.tweens.push(t)}},{key:"removeTween",value:function(t){this._tweensToDelete.push(t)}},{key:"_remove",value:function(t){var e=this.tweens.indexOf(t);-1!==e&&this.tweens.splice(e,1)}},{key:"_getDeltaMS",value:function(){0===this._last&&(this._last=Date.now());var t=Date.now(),e=t-this._last;return this._last=t,e}}]),t}();e["default"]=u},function(t,e,n){"use strict";function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),u=function(){function t(){r(this,t),this._colsed=!1,this.polygon=new a.Polygon,this.polygon.closed=!1,this._tmpPoint=new a.Point,this._tmpPoint2=new a.Point,this._tmpDistance=[],this.currentPath=null,this.graphicsData=[],this.dirty=!0}return s(t,[{key:"moveTo",value:function(t,e){return a.Graphics.prototype.moveTo.call(this,t,e),this.dirty=!0,this}},{key:"lineTo",value:function(t,e){return a.Graphics.prototype.lineTo.call(this,t,e),this.dirty=!0,this}},{key:"bezierCurveTo",value:function(t,e,n,i,r,s){return a.Graphics.prototype.bezierCurveTo.call(this,t,e,n,i,r,s),this.dirty=!0,this}},{key:"quadraticCurveTo",value:function(t,e,n,i){return a.Graphics.prototype.quadraticCurveTo.call(this,t,e,n,i),this.dirty=!0,this}},{key:"arcTo",value:function(t,e,n,i,r){return a.Graphics.prototype.arcTo.call(this,t,e,n,i,r),this.dirty=!0,this}},{key:"arc",value:function(t,e,n,i,r,s){return a.Graphics.prototype.arc.call(this,t,e,n,i,r,s),this.dirty=!0,this}},{key:"drawShape",value:function(t){return a.Graphics.prototype.drawShape.call(this,t),this.dirty=!0,this}},{key:"getPoint",value:function(t){this.parsePoints();var e=this.closed&&t>=this.length-1?0:2*t;return this._tmpPoint.set(this.polygon.points[e],this.polygon.points[e+1]),this._tmpPoint}},{key:"distanceBetween",value:function(t,e){this.parsePoints();var n=this.getPoint(t),i=n.x,r=n.y,s=this.getPoint(e),o=s.x,a=s.y,u=o-i,h=a-r;return Math.sqrt(u*u+h*h)}},{key:"totalDistance",value:function(){this.parsePoints(),this._tmpDistance.length=0,this._tmpDistance.push(0);for(var t=this.length,e=0,n=0;t-1>n;n++)e+=this.distanceBetween(n,n+1),this._tmpDistance.push(e);return e}},{key:"getPointAt",value:function(t){if(this.parsePoints(),t>this.length)return this.getPoint(this.length-1);if(t%1===0)return this.getPoint(t);this._tmpPoint2.set(0,0);var e=t%1,n=this.getPoint(Math.ceil(t)),i=n.x,r=n.y,s=this.getPoint(Math.floor(t)),o=s.x,a=s.y,u=-((o-i)*e),h=-((a-r)*e);return this._tmpPoint2.set(o+u,a+h),this._tmpPoint2}},{key:"getPointAtDistance",value:function(t){this.parsePoints(),this._tmpDistance||this.totalDistance();var e=this._tmpDistance.length,n=0,i=this._tmpDistance[this._tmpDistance.length-1];0>t?t=i+t:t>i&&(t-=i);for(var r=0;e>r&&(t>=this._tmpDistance[r]&&(n=r),!(t<this._tmpDistance[r]));r++);if(n===this.length-1)return this.getPointAt(n);var s=t-this._tmpDistance[n],o=this._tmpDistance[n+1]-this._tmpDistance[n];return this.getPointAt(n+s/o)}},{key:"parsePoints",value:function(){if(!this.dirty)return this;this.dirty=!1,this.polygon.points.length=0;for(var t=0;t<this.graphicsData.length;t++){var e=this.graphicsData[t].shape;e&&e.points&&(this.polygon.points=this.polygon.points.concat(e.points))}return this}},{key:"clear",value:function(){return this.graphicsData.length=0,this.currentPath=null,this.polygon.points.length=0,this._closed=!1,this.dirty=!1,this}},{key:"closed",get:function(){return this._closed},set:function(t){this._closed!==t&&(this.polygon.closed=t,this._closed=t,this.dirty=!0)}},{key:"length",get:function(){return this.polygon.points.length?this.polygon.points.length/2+(this._closed?1:0):0}}]),t}();e["default"]=u},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(4),u=i(a),h=n(3),c=i(h),l=n(5),f=i(l),p=n(2),d=i(p);o.Graphics.prototype.drawPath=function(t){return t.parsePoints(),this.drawShape(t.polygon),this};var g={TweenManager:u["default"],Tween:c["default"],Easing:d["default"],TweenPath:f["default"]};o.tweenManager||(o.tweenManager=new u["default"],o.tween=g),e["default"]=g}]);

},{}],5:[function(require,module,exports){
module.exports={
  "A": {
    "image": "cell1.png",
    "active": false,
    "activationImage": "cell1-fill.png",
    "activation": 8,
    "score": 1
  },
  "B": {
    "image": "cell2.png",
    "active": false
  },
  "C": {
    "image": "cell4.png",
    "active": false,
    "activationImage": "cell4-fill.png",
    "activation": 22,
    "score": 3
  },
  "IC": {
    "activationImage": "islandC.png",
    "active": true,
    "playerDir": "top",
    "action": "history",
    "activation": 0
  },
  "ITL": {
    "activationImage": "islandTL.png",
    "active": true,
    "playerDir": "top"
  },
  "IT": {
    "activationImage": "islandT.png",
    "active": true,
    "playerDir": "top"
  },
  "ITR": {
    "activationImage": "islandTR.png",
    "active": true,
    "playerDir": "top"
  },
  "IR": {
    "activationImage": "islandR.png",
    "active": true,
    "action": "history",
    "playerDir": "top"
  },
  "IBR": {
    "activationImage": "islandBR.png",
    "active": true,
    "playerDir": "top"
  },
  "IB": {
    "activationImage": "islandB.png",
    "active": true,
    "playerDir": "top"
  },
  "IBL": {
    "activationImage": "islandBL.png",
    "active": true,
    "playerDir": "top"
  },
  "IL": {
    "activationImage": "islandL.png",
    "active": true,
    "playerDir": "top",
    "action": "history",
    "activation": 0
  }
}

},{}],6:[function(require,module,exports){
module.exports={
  "let": [
    {
      "map": ["A", "A|C|B", "A", "A", "A"],
      "shuffle": true,
      "trim": 3
    },
    {
      "map": ["A|A|C", "A|B", "A", "B", "A"],
      "shuffle": true,
    }
  ],
  "end": [
    {
      "map": ["A", "A", "A", "A", "A"],
    }
  ],
  "labirint": [
    {
      "map": ["B", "B", "B", "B", "B"],
      "append": "A"
    },
    {
      "map": ["A", "A", "A", "A", "A"],
    }
  ],
  "island": [
    {
      "map": ["A|C|B", "A", "A|C|B"]
    },
    {
      "map": ["ITL", "IT", "ITR"]
    },
    {
      "map": ["IL",  "IC",  "IR"]
    },
    {
      "map": ["IBL", "IB", "IBR"]
    }
  ]
}

},{}],7:[function(require,module,exports){
module.exports=[
  {
    "fragments": [
      {"island": 1},
      {"let": 4},
      {"labirint": 5},
      {"end": 1},
      {"island": 1},
    ],
    "history": {
      "ru": "Тлен идет за тобой по пятам. \n Отступись и он тебя поглатит... \n Но не стоит отчаиваться, ведь музыка всегда с тобой."
    }
  },
  {
    "fragments": [
      {"let": 10},
      {"labirint": 10},
      {"end": 1},
      {"island": 1}
    ],
    "history": {
      "ru": "Тлен не щадит никого. Летучие змеи падут на землю и погрузятся в рутину бытия..."
    }
  },
  {
    "fragments": [
      {"let": 5},
      {"labirint": 5},
      {"let": 5},
      {"labirint": 5},
      {"let": 5},
      {"labirint": 5},
      {"let": 5},
      {"labirint": 5},
      {"end": 1},
      {"island": 1}
    ],
    "history": {
      "ru": "И тогда он понес свечу через чужие земли освобождая летучих змей и свой народ..."
    }
  }
]

},{}],8:[function(require,module,exports){
module.exports = function parse(params){
      var template = "precision mediump float; \n" +" \n" +
" \n" +" \n" +
"varying vec2 vTextureCoord; \n" +" \n" +
" \n" +" \n" +
"uniform vec4 filterArea; \n" +" \n" +
"uniform float startGradient; \n" +" \n" +
"uniform float endGradient; \n" +" \n" +
"uniform sampler2D uSampler; \n" +" \n" +
" \n" +" \n" +
"void main() { \n" +" \n" +
"  vec4 color = texture2D(uSampler, vTextureCoord); \n" +" \n" +
" \n" +" \n" +
"  if(vTextureCoord.y > startGradient) gl_FragColor = color; \n" +" \n" +
"  else if(vTextureCoord.y < endGradient) gl_FragColor = color*0.0; \n" +" \n" +
"  else gl_FragColor = color*(vTextureCoord.y-endGradient)/(startGradient-endGradient); \n" +" \n" +
"} \n" +" \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var frag = require('./alpha.frag');
var vert = require('../basic.vert');

var AlphaGradientFilter = function (_PIXI$Filter) {
  _inherits(AlphaGradientFilter, _PIXI$Filter);

  function AlphaGradientFilter(startGradient, endGradient) {
    _classCallCheck(this, AlphaGradientFilter);

    var _this = _possibleConstructorReturn(this, (AlphaGradientFilter.__proto__ || Object.getPrototypeOf(AlphaGradientFilter)).call(this, vert(), frag()));

    _this.startGradient = startGradient || .5;
    _this.endGradient = endGradient || .2;
    return _this;
  }

  _createClass(AlphaGradientFilter, [{
    key: 'startGradient',
    set: function set(v) {
      this.uniforms.startGradient = v;
    },
    get: function get() {
      return this.uniforms.startGradient;
    }
  }, {
    key: 'endGradient',
    set: function set(v) {
      this.uniforms.endGradient = v;
    },
    get: function get() {
      return this.uniforms.endGradient;
    }
  }]);

  return AlphaGradientFilter;
}(PIXI.Filter);

module.exports = AlphaGradientFilter;

},{"../basic.vert":16,"./alpha.frag":8}],10:[function(require,module,exports){
module.exports = function parse(params){
      var template = "precision mediump float; \n" +" \n" +
" \n" +" \n" +
"varying vec2 vTextureCoord; \n" +" \n" +
" \n" +" \n" +
"uniform sampler2D uSampler; \n" +" \n" +
"uniform sampler2D noiseTexture; \n" +" \n" +
"uniform float iTime; \n" +" \n" +
" \n" +" \n" +
"//SETTINGS// \n" +" \n" +
"const float timeScale = 10.0; \n" +" \n" +
"const float cloudScale = 1.5; \n" +" \n" +
"const float skyCover = 0.6; //overwritten by mouse x drag \n" +" \n" +
"const float softness = 0.2; \n" +" \n" +
"const float brightness = 1.0; \n" +" \n" +
"const int noiseOctaves = 8; \n" +" \n" +
"const float curlStrain = 3.0; \n" +" \n" +
"//SETTINGS// \n" +" \n" +
" \n" +" \n" +
"float saturate(float num) { \n" +" \n" +
"    return clamp(num, 0.0, 1.0); \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"float noise(vec2 uv) { \n" +" \n" +
"    return texture2D(noiseTexture, uv).r; \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"vec2 rotate(vec2 uv) { \n" +" \n" +
"    uv = uv + noise(uv*0.2)*0.005; \n" +" \n" +
"    float rot = curlStrain; \n" +" \n" +
"    float sinRot=sin(rot); \n" +" \n" +
"    float cosRot=cos(rot); \n" +" \n" +
"    mat2 rotMat = mat2(cosRot,-sinRot,sinRot,cosRot); \n" +" \n" +
"    return uv * rotMat; \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"float fbm (vec2 uv) { \n" +" \n" +
"    float rot = 1.57; \n" +" \n" +
"    float sinRot=sin(rot); \n" +" \n" +
"    float cosRot=cos(rot); \n" +" \n" +
"    float f = 0.0; \n" +" \n" +
"    float total = 0.0; \n" +" \n" +
"    float mul = 0.5; \n" +" \n" +
"    mat2 rotMat = mat2(cosRot,-sinRot,sinRot,cosRot); \n" +" \n" +
" \n" +" \n" +
"    for(int i = 0; i < noiseOctaves; i++) { \n" +" \n" +
"        f += noise(uv+iTime*0.00015*timeScale*(1.0-mul))*mul; \n" +" \n" +
"        total += mul; \n" +" \n" +
"        uv *= 3.0; \n" +" \n" +
"        uv=rotate(uv); \n" +" \n" +
"        mul *= 0.5; \n" +" \n" +
"    } \n" +" \n" +
"    return f/total; \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"void main() { \n" +" \n" +
"  vec2 uv = vTextureCoord.xy/(40000.0*cloudScale); \n" +" \n" +
" \n" +" \n" +
"  float cover = 0.5; \n" +" \n" +
"  float bright = brightness*(1.8-cover); \n" +" \n" +
" \n" +" \n" +
"  float color1 = fbm(vTextureCoord.xy-0.5+iTime*0.00004*timeScale); \n" +" \n" +
"  float color2 = fbm(vTextureCoord.xy-10.5+iTime*0.00002*timeScale); \n" +" \n" +
" \n" +" \n" +
"  float clouds1 = smoothstep(1.0-cover,min((1.0-cover)+softness*2.0,1.0),color1); \n" +" \n" +
"  float clouds2 = smoothstep(1.0-cover,min((1.0-cover)+softness,1.0),color2); \n" +" \n" +
" \n" +" \n" +
"  float cloudsFormComb = saturate(clouds1+clouds2); \n" +" \n" +
" \n" +" \n" +
"  vec4 skyCol = vec4(0.6,0.8,1.0,1.0); \n" +" \n" +
"  float cloudCol = saturate(saturate(1.0-pow(color1,1.0)*0.2)*bright); \n" +" \n" +
"  vec4 clouds1Color = vec4(cloudCol,cloudCol,cloudCol,1.0); \n" +" \n" +
"  vec4 clouds2Color = mix(clouds1Color,skyCol,0.25); \n" +" \n" +
"  vec4 cloudColComb = mix(clouds1Color,clouds2Color,saturate(clouds2-clouds1)); \n" +" \n" +
" \n" +" \n" +
"	gl_FragColor = mix(texture2D(uSampler, vTextureCoord), cloudColComb, cloudsFormComb); \n" +" \n" +
"} \n" +" \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],11:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var frag = require('./clouds.frag');
var vert = require('../basic.vert');

var CloudsFilter = function (_PIXI$Filter) {
  _inherits(CloudsFilter, _PIXI$Filter);

  function CloudsFilter(texture) {
    _classCallCheck(this, CloudsFilter);

    var _this = _possibleConstructorReturn(this, (CloudsFilter.__proto__ || Object.getPrototypeOf(CloudsFilter)).call(this, vert(), frag()));

    _this.time = performance.now();
    _this.noiseTexture = texture;
    return _this;
  }

  _createClass(CloudsFilter, [{
    key: 'time',
    set: function set(v) {
      this.uniforms.iTime = v;
    },
    get: function get() {
      return this.uniforms.iTime;
    }
  }, {
    key: 'noiseTexture',
    set: function set(v) {
      this.uniforms.noiseTexture = v;
    },
    get: function get() {
      return this.uniforms.noiseTexture;
    }
  }]);

  return CloudsFilter;
}(PIXI.Filter);

module.exports = CloudsFilter;

},{"../basic.vert":16,"./clouds.frag":10}],12:[function(require,module,exports){
module.exports = function parse(params){
      var template = "precision mediump float; \n" +" \n" +
" \n" +" \n" +
"varying vec2 vTextureCoord; \n" +" \n" +
"uniform sampler2D uSampler; \n" +" \n" +
"uniform float x; \n" +" \n" +
"uniform float y; \n" +" \n" +
"uniform float r; \n" +" \n" +
" \n" +" \n" +
"void main() { \n" +" \n" +
"  gl_FragColor = texture2D(uSampler, vTextureCoord); \n" +" \n" +
"  vec3 gray = vec3(0.3, 0.59, 0.11); \n" +" \n" +
"  float col = dot(gl_FragColor.xyz, gray); \n" +" \n" +
" \n" +" \n" +
"  float dist = distance(vTextureCoord.xy, vec2(x, y)); \n" +" \n" +
"  gl_FragColor.xyz = mix(gl_FragColor.xyz, vec3(col), min(dist/r, 1.0)-.2); \n" +" \n" +
"} \n" +" \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var frag = require('./grayscale.frag');
var vert = require('../basic.vert');

var GrayscaleFilter = function (_PIXI$Filter) {
  _inherits(GrayscaleFilter, _PIXI$Filter);

  function GrayscaleFilter(x, y, r) {
    _classCallCheck(this, GrayscaleFilter);

    var _this = _possibleConstructorReturn(this, (GrayscaleFilter.__proto__ || Object.getPrototypeOf(GrayscaleFilter)).call(this, vert(), frag()));

    _this.x = x || .5;
    _this.y = y || .5;
    _this.r = r || 0.8;
    return _this;
  }

  _createClass(GrayscaleFilter, [{
    key: 'x',
    set: function set(v) {
      this.uniforms.x = v;
    },
    get: function get() {
      return this.uniforms.x;
    }
  }, {
    key: 'y',
    set: function set(v) {
      this.uniforms.y = v;
    },
    get: function get() {
      return this.uniforms.y;
    }
  }, {
    key: 'r',
    set: function set(v) {
      this.uniforms.r = v;
    },
    get: function get() {
      return this.uniforms.r;
    }
  }]);

  return GrayscaleFilter;
}(PIXI.Filter);

module.exports = GrayscaleFilter;

},{"../basic.vert":16,"./grayscale.frag":12}],14:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var frag = require('./noiseBlur.frag');
var vert = require('../basic.vert');

var NoiseBlurFilter = function (_PIXI$Filter) {
  _inherits(NoiseBlurFilter, _PIXI$Filter);

  function NoiseBlurFilter() {
    _classCallCheck(this, NoiseBlurFilter);

    var _this = _possibleConstructorReturn(this, (NoiseBlurFilter.__proto__ || Object.getPrototypeOf(NoiseBlurFilter)).call(this, vert(), frag()));

    _this.blurRadius = 0.0005;
    return _this;
  }

  _createClass(NoiseBlurFilter, [{
    key: 'blurRadius',
    set: function set(v) {
      this.uniforms.blurRadius = v;
    },
    get: function get() {
      return this.uniforms.blurRadius;
    }
  }]);

  return NoiseBlurFilter;
}(PIXI.Filter);

module.exports = NoiseBlurFilter;

},{"../basic.vert":16,"./noiseBlur.frag":15}],15:[function(require,module,exports){
module.exports = function parse(params){
      var template = "precision mediump float; \n" +" \n" +
" \n" +" \n" +
"varying vec2 vTextureCoord; \n" +" \n" +
"uniform sampler2D uSampler; \n" +" \n" +
" \n" +" \n" +
"uniform float blurRadius; \n" +" \n" +
" \n" +" \n" +
"vec2 random(vec2 p) { \n" +" \n" +
"	p = fract(p * vec2(443.897, 441.423)); \n" +" \n" +
"    p += dot(p, p.yx+19.91); \n" +" \n" +
"    return fract((p.xx+p.yx)*p.xy); \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"void main() { \n" +" \n" +
"  vec2 r = random(vTextureCoord); \n" +" \n" +
"  r.x *= 6.28305308; \n" +" \n" +
"  vec2 cr = vec2(sin(r.x),cos(r.x))*sqrt(r.y); \n" +" \n" +
" \n" +" \n" +
"	gl_FragColor = texture2D(uSampler, vTextureCoord+cr*blurRadius); \n" +" \n" +
"} \n" +" \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],16:[function(require,module,exports){
module.exports = function parse(params){
      var template = "attribute vec2 aVertexPosition; \n" +" \n" +
"attribute vec2 aTextureCoord; \n" +" \n" +
"uniform mat3 projectionMatrix; \n" +" \n" +
"varying vec2 vTextureCoord; \n" +" \n" +
" \n" +" \n" +
"void main(void) { \n" +" \n" +
"    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0); \n" +" \n" +
"    vTextureCoord = aTextureCoord; \n" +" \n" +
"} \n" +" \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],17:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// objects
var ScenesManager = require('./managers/ScenesManager');
var Sphere = require('./subjects/Sphere');

// filters
var GrayscaleFilter = require('./filters/GrayscaleFilter');
var NoiseBlurFilter = require('./filters/NoiseBlurFilter');
var CloudsFilter = require('./filters/CloudsFilter');

var Game = function (_PIXI$Application) {
    _inherits(Game, _PIXI$Application);

    function Game() {
        _classCallCheck(this, Game);

        var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, window.innerWidth, window.innerHeight, { backgroundColor: 0xfcfcfc }));

        document.body.appendChild(_this.view);

        _this.w = window.innerWidth;
        _this.h = window.innerHeight;

        _this.container = new PIXI.Container();
        _this.stage.addChild(_this.container);

        _this.bg = new PIXI.Sprite(PIXI.Texture.fromImage('bg'));
        _this.bg.width = _this.w;
        _this.bg.height = _this.h;
        _this.container.addChild(_this.bg);

        _this.scenes = new ScenesManager(_this);
        _this.container.addChild(_this.scenes);

        _this.grayscale = new GrayscaleFilter();
        _this.noiseBlur = new NoiseBlurFilter();
        _this.container.filters = [_this.grayscale, _this.noiseBlur];

        _this.container.interactive = true;
        _this.container.cursor = 'none';
        _this.mouse = new Sphere();
        _this.container.addChild(_this.mouse);

        _this.container.on('pointermove', function (e) {
            _this.grayscale.x = e.data.global.x / _this.w;
            _this.grayscale.y = e.data.global.y / _this.h;
            _this.mouse.x = e.data.global.x;
            _this.mouse.y = e.data.global.y;
        });

        _this._initTicker();
        return _this;
    }

    _createClass(Game, [{
        key: '_initTicker',
        value: function _initTicker() {
            var _this2 = this;

            this.ticker.add(function (dt) {
                PIXI.tweenManager.update();
                _this2.scenes.update(dt);
                _this2.mouse.update(dt);

                _this2.clouds.time = performance.now();
            });
        }
    }]);

    return Game;
}(PIXI.Application);

module.exports = Game;

},{"./filters/CloudsFilter":11,"./filters/GrayscaleFilter":13,"./filters/NoiseBlurFilter":14,"./managers/ScenesManager":22,"./subjects/Sphere":28}],18:[function(require,module,exports){
'use strict';

require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
require('pixi-particles');

var Game = require('./game');

WebFont.load({
  google: {
    families: ['Amatic SC']
  },
  active: function active() {
    PIXI.loader.add('blocks', 'assets/blocks.json').add('player', 'assets/player.png').add('bg', 'assets/bg.png').add('displacement', 'assets/displacement.png').add('thlen', 'assets/thlen.png').add('noise', 'assets/noise_grayscale.png').add('lightmap', 'assets/lightmap.png').add('mask', 'assets/mask.png').add('particle', 'assets/particle.png').add('music', 'assets/music.mp3').load(function (loader, resources) {
      // PIXI.sound.play('music');
      var game = new Game();
      game.scenes.enableScene('playground');

      window.game = game;
    });
  }
});

},{"./game":17,"pixi-particles":1,"pixi-projection":2,"pixi-sound":3,"pixi-tween":4}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HistoryManager = function (_PIXI$Container) {
  _inherits(HistoryManager, _PIXI$Container);

  function HistoryManager(scene) {
    _classCallCheck(this, HistoryManager);

    var _this = _possibleConstructorReturn(this, (HistoryManager.__proto__ || Object.getPrototypeOf(HistoryManager)).call(this));

    _this.game = scene.game;
    _this.scene = scene;

    _this.alpha = 0;
    _this.text = new PIXI.Text('Text', {
      font: 'normal 40px Amatic SC',
      wordWrap: true,
      wordWrapWidth: _this.game.w / 2,
      fill: '#fff',
      padding: 10,
      align: 'center'
    });
    _this.text.anchor.set(.5);
    _this.text.x = _this.game.w / 2;
    _this.text.y = 150;
    _this.addChild(_this.text);
    return _this;
  }

  _createClass(HistoryManager, [{
    key: 'showText',
    value: function showText(txt, time) {
      this.text.fontFamily = 'Amatic SC';
      this.text.setText(txt);

      var show = PIXI.tweenManager.createTween(this);
      show.from({ alpha: 0 }).to({ alpha: 1 });
      show.time = 1000;
      show.start();
      this.emit('showen');

      setTimeout(this.hideText.bind(this), time);
    }
  }, {
    key: 'hideText',
    value: function hideText() {
      var hide = PIXI.tweenManager.createTween(this);
      hide.from({ alpha: 1 }).to({ alpha: 0 });
      hide.time = 1000;
      hide.start();
      this.emit('hidden');
    }
  }]);

  return HistoryManager;
}(PIXI.Container);

module.exports = HistoryManager;

},{}],20:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Менеджер уровней, работает напрямую с MapManager
  используя данные levels.json и  fragments.json

  События:
    addedFragmentsData => new fragmentsData
    addedLevels => new levels
    addedLevel => new lvl

    switchedLevel => cur lvl
    wentNextLevel => cur lvl
    wentBackLevel => cur lvl
    switchedFragment => cur frag
    wentNextFragment => cur frag
    wentBackFragment => cur frag

    startedLevel => new lvl
    endedLevel => prev lvl
*/

var LevelManager = function (_PIXI$utils$EventEmit) {
  _inherits(LevelManager, _PIXI$utils$EventEmit);

  function LevelManager(scene, map) {
    _classCallCheck(this, LevelManager);

    var _this = _possibleConstructorReturn(this, (LevelManager.__proto__ || Object.getPrototypeOf(LevelManager)).call(this));

    _this.scene = scene;
    _this.map = map;

    _this.levels = [];
    _this.fragmentsData = {};
    _this.addFragmentsData(require('../content/fragments'));
    _this.addLevels(require('../content/levels'));

    _this.curLevelIndex = 0;
    _this.curFragmentIndex = 0;
    return _this;
  }
  // getters


  _createClass(LevelManager, [{
    key: 'getCurrentLevel',
    value: function getCurrentLevel() {
      return this.levels[this.curLevelIndex];
    }
  }, {
    key: 'getCurrentFragment',
    value: function getCurrentFragment() {
      return this.getCurrentLevel() && this.getCurrentLevel().maps[this.curFragmentIndex];
    }

    // add fragments to db fragments

  }, {
    key: 'addFragmentsData',
    value: function addFragmentsData() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.assign(this.fragmentsData, data);
      this.emit('addedFragmentsData', data);
    }

    // add levels to db levels

  }, {
    key: 'addLevels',
    value: function addLevels() {
      var levels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      for (var i = 0; i < levels.length; i++) {
        this.addLevel(levels[i]);
      }
      this.emit('addedLevels', levels);
    }
  }, {
    key: 'addLevel',
    value: function addLevel() {
      var lvl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.levels.push(lvl);

      // generated maps to lvl object
      lvl.maps = [];
      for (var i = 0; i < lvl.fragments.length; i++) {
        for (var key in lvl.fragments[i]) {
          for (var c = 0; c < lvl.fragments[i][key]; c++) {
            lvl.maps.push(this.fragmentsData[key]);
          }
        }
      }
      this.emit('addedLevel', lvl);
    }

    // Methods for levels control

  }, {
    key: 'switchLevel',
    value: function switchLevel(lvl) {
      if (lvl >= this.levels.length || lvl < 0) return;

      this.curLevelIndex = lvl;
      this.switchFragment(0);

      this.emit('startedLevel');
      this.emit('switchedLevel');
    }
  }, {
    key: 'nextLevel',
    value: function nextLevel() {
      this.switchLevel(this.curLevelIndex + 1);
      this.emit('wentNextLevel');
    }
  }, {
    key: 'backLevel',
    value: function backLevel() {
      this.switchLevel(this.curLevelIndex - 1);
      this.emit('wentBackLevel');
    }

    // Methods for fragments control

  }, {
    key: 'switchFragment',
    value: function switchFragment(frag) {
      if (frag < 0) return;
      this.curFragmentIndex = frag;

      if (this.getCurrentFragment()) this.map.addMap(this.getCurrentFragment());else this.emit('endedLevel');
      this.emit('switchedFragment');
    }
  }, {
    key: 'nextFragment',
    value: function nextFragment() {
      this.switchFragment(this.curFragmentIndex + 1);
      this.emit('wentNextFragment');
    }
  }, {
    key: 'backFragment',
    value: function backFragment() {
      this.switchFragment(this.curFragmentIndex - 1);
      this.emit('wentBackFragment');
    }
  }]);

  return LevelManager;
}(PIXI.utils.EventEmitter);

module.exports = LevelManager;

},{"../content/fragments":6,"../content/levels":7}],21:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Движок тайловой карты
  События:
    addedMap => map
    addedFragment => fragments
    addedBlock => block
    scrolledDown => dtDown
    scrolledTop => dtTop

    resized
    endedMap
    clearedOutRangeBlocks
*/

var Block = require('../subjects/Block');
var DataFragmentConverter = require('../utils/DataFragmentConverter');

var MapManager = function (_PIXI$projection$Cont) {
  _inherits(MapManager, _PIXI$projection$Cont);

  function MapManager(scene) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MapManager);

    var _this = _possibleConstructorReturn(this, (MapManager.__proto__ || Object.getPrototypeOf(MapManager)).call(this));

    scene.addChild(_this);

    _this.scene = scene;
    _this.game = scene.game;

    _this.PADDING_BOTTOM = 280;

    _this.maxAxisX = params.maxX || 5;
    _this.blockSize = params.tileSize || 100;
    _this.setBlocksData(require('../content/blocks'));
    _this.resize();

    _this.isStop = false;

    _this.speed = 500;
    _this.lastIndex = 0;
    return _this;
  }

  _createClass(MapManager, [{
    key: 'resize',
    value: function resize() {
      this.x = this.game.w / 2 - this.maxAxisX * this.blockSize / 2;
      this.y = this.game.h - this.PADDING_BOTTOM;
      this.emit('resized');
    }

    // Set params

  }, {
    key: 'setBlocksData',
    value: function setBlocksData(data) {
      this.BLOCKS = data || {};
    }
  }, {
    key: 'setMaxAxisX',
    value: function setMaxAxisX(max) {
      this.maxAxisX = max || 6;
      this.resize();
    }
  }, {
    key: 'setBlockSize',
    value: function setBlockSize(size) {
      this.blockSize = size || 100;
      this.resize();
    }
  }, {
    key: 'setSpeed',
    value: function setSpeed(speed) {
      this.speed = speed || 500;
    }

    // Map Manager

  }, {
    key: 'addMap',
    value: function addMap(map) {
      for (var i = map.length - 1; i >= 0; i--) {
        this.addFragment(map[i]);
      }
      this.emit('addedMap', map);
      this.computingMapEnd();
    }
  }, {
    key: 'addFragment',
    value: function addFragment(fragData) {
      var frag = new DataFragmentConverter(fragData).fragment;
      // add block to center X axis, for example: round((8-4)/2) => +2 padding to block X pos
      for (var i = 0; i < frag.length; i++) {
        this.addBlock(frag[i], Math.round((this.maxAxisX - frag.length) / 2) + i, this.lastIndex);
      }

      this.lastIndex++;
      this.emit('addedFragment', fragData);
    }
  }, {
    key: 'addBlock',
    value: function addBlock(id, x, y) {
      if (id === '_') return;

      var posX = x * this.blockSize;
      var posY = -y * this.blockSize;
      var block = this.addChild(new Block(this, posX, posY, this.BLOCKS[id]));
      this.emit('addedBlock', block);
    }

    // Collision Widh Block

  }, {
    key: 'getBlockFromPos',
    value: function getBlockFromPos(pos) {
      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].containsPoint(pos)) return this.children[i];
      }
    }

    // Moving Map

  }, {
    key: 'scrollDown',
    value: function scrollDown(blocks) {
      var _this2 = this;

      if (this.isStop) return;

      // Scroll map down on X blocks
      var move = PIXI.tweenManager.createTween(this);
      move.from({ y: this.y }).to({ y: this.y + blocks * this.blockSize });
      move.time = this.speed * blocks;
      move.on('end', function () {
        _this2.emit('scrolledDown', blocks);
        _this2.clearOutRangeBlocks();
        _this2.computingMapEnd();
      });
      move.start();
    }
  }, {
    key: 'scrollTop',
    value: function scrollTop(blocks) {
      var _this3 = this;

      if (this.isStop) return;

      // Scroll map top on X blocks
      var move = PIXI.tweenManager.createTween(this);
      move.from({ y: this.y }).to({ y: this.y - blocks * this.blockSize });
      move.time = this.speed * blocks;
      move.on('end', function () {
        _this3.emit('scrolledTop', blocks);
        _this3.clearOutRangeBlocks();
        _this3.computingMapEnd();
      });
      move.start();
    }

    // Computing map end (amt blocks < max amt blocks)

  }, {
    key: 'computingMapEnd',
    value: function computingMapEnd() {
      if (this.children.length < this.maxAxisX * (this.game.h / this.blockSize) * 2) {
        this.emit('endedMap');
      }
    }

    // clear out range map blocks

  }, {
    key: 'clearOutRangeBlocks',
    value: function clearOutRangeBlocks() {
      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].worldTransform.ty - this.blockSize / 2 > this.game.h) {
          this.removeChild(this.children[i]);
        }
      }
      this.emit('clearedOutRangeBlocks');
    }
  }]);

  return MapManager;
}(PIXI.projection.Container2d);

module.exports = MapManager;

},{"../content/blocks":5,"../subjects/Block":26,"../utils/DataFragmentConverter":31}],22:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Класс для переключения видимого контейнера (рабочих сцен)
  События:
    addedScenes => scenes
    addedScene => scenes
    removedScene => scene
    restartedScene => scene
    disabledScene => scene
    enabledScene => scenes
    updated => dt
*/

var ScenesManager = function (_PIXI$Container) {
  _inherits(ScenesManager, _PIXI$Container);

  function ScenesManager(game) {
    _classCallCheck(this, ScenesManager);

    var _this = _possibleConstructorReturn(this, (ScenesManager.__proto__ || Object.getPrototypeOf(ScenesManager)).call(this));

    _this.game = game;

    _this.scenes = require('../scenes');
    _this.activeScene = null;
    return _this;
  }

  _createClass(ScenesManager, [{
    key: 'getScene',
    value: function getScene(id) {
      return this.scenes[id];
    }

    // adding scenes

  }, {
    key: 'addScenes',
    value: function addScenes(scenes) {
      for (var id in scenes) {
        this.addScene(id, scenes[id]);
      }
      this.emit('addedScenes', scenes);
    }
  }, {
    key: 'addScene',
    value: function addScene(id, scene) {
      this.scenes[id] = scene;
      this.emit('addedScene', scene);
    }
  }, {
    key: 'removeScene',
    value: function removeScene(id) {
      var _scene = this.scenes[id];
      this.scenes[id] = null;
      this.emit('removedScene', _scene);
    }

    // Controls

  }, {
    key: 'restartScene',
    value: function restartScene() {
      this.enableScene(this.activeScene._idScene);
      this.emit('restartedScene', this.activeScene);
    }
  }, {
    key: 'disableScene',
    value: function disableScene() {
      var scene = this.removeChild(this.activeScene);
      this.activeScene = null;
      this.emit('disabledScene', scene);
    }
  }, {
    key: 'enableScene',
    value: function enableScene(id) {
      this.disableScene();

      var Scene = this.getScene(id);
      this.activeScene = this.addChild(new Scene(this.game, this));
      this.activeScene._idScene = id;

      this.emit('enabledScene', this.activeScene);
    }
  }, {
    key: 'update',
    value: function update(dt) {
      this.activeScene && this.activeScene.update && this.activeScene.update(dt);
      this.emit('updated', dt);
    }
  }]);

  return ScenesManager;
}(PIXI.Container);

module.exports = ScenesManager;

},{"../scenes":25}],23:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScreenManager = function (_PIXI$Container) {
  _inherits(ScreenManager, _PIXI$Container);

  function ScreenManager(scene) {
    _classCallCheck(this, ScreenManager);

    var _this = _possibleConstructorReturn(this, (ScreenManager.__proto__ || Object.getPrototypeOf(ScreenManager)).call(this));

    _this.scene = scene;
    return _this;
  }

  return ScreenManager;
}(PIXI.Container);

module.exports = ScreenManager;

},{}],24:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// managers
var MapManager = require('../managers/MapManager');
var LevelManager = require('../managers/LevelManager');
var HistoryManager = require('../managers/HistoryManager');
var ScreenManager = require('../managers/ScreenManager');

// subjects
var Player = require('../subjects/Player');
var Thlen = require('../subjects/Thlen');

// filters
var AlphaGradientFilter = require('../filters/AlphaGradientFilter');

var Playground = function (_PIXI$projection$Cont) {
    _inherits(Playground, _PIXI$projection$Cont);

    function Playground(game) {
        _classCallCheck(this, Playground);

        var _this = _possibleConstructorReturn(this, (Playground.__proto__ || Object.getPrototypeOf(Playground)).call(this));

        _this.game = game;

        // Constant for position object in projection
        _this.interactive = true;

        // Init objects
        _this.projection = new PIXI.projection.Container2d();
        _this.projection.proj.setAxisY({ x: -_this.game.w / 2 + 50, y: 4000 }, -1);
        _this.projection.filters = [new AlphaGradientFilter(.3, .1)];
        _this.addChild(_this.projection);

        _this.map = new MapManager(_this);
        _this.projection.addChild(_this.map);

        _this.levels = new LevelManager(_this, _this.map);

        _this.screen = new ScreenManager(_this);
        _this.history = new HistoryManager(_this);
        _this.player = new Player(_this, _this.map);
        _this.thlen = new Thlen(_this);
        _this.addChild(_this.screen, _this.history, _this.player, _this.thlen);

        // Controls
        _this._bindEvents();
        return _this;
    }

    _createClass(Playground, [{
        key: '_bindEvents',
        value: function _bindEvents() {
            var _this2 = this;

            this.on('pointerdown', function () {
                return _this2.player.immunity();
            });
            this.on('pointermove', function (e) {
                for (var i = 0; i < _this2.map.children.length; i++) {
                    var block = _this2.map.children[i];
                    if (block.containsPoint(e.data.global)) {
                        return block.hit();
                    } else block.unhit();
                }
            });

            this.player.on('deaded', function () {
                return _this2.restart();
            });
            this.player.on('collision', function (block) {
                if (block.action === 'history') _this2.history.showText(_this2.levels.getCurrentLevel().history.ru, 3000);
            });

            this.history.on('showen', function () {
                var tween = PIXI.tweenManager.createTween(_this2.projection.filters[0]);
                tween.from({ startGradient: .3, endGradient: .1 }).to({ startGradient: .7, endGradient: .5 });
                tween.time = 1000;
                tween.start();

                _this2.map.isStop = true;
            });
            this.history.on('hidden', function () {
                var tween = PIXI.tweenManager.createTween(_this2.projection.filters[0]);
                tween.from({ startGradient: .7, endGradient: .5 }).to({ startGradient: .3, endGradient: .1 });
                tween.time = 1000;
                tween.start();

                _this2.map.isStop = false;
                _this2.map.scrollDown(1);
            });

            this.map.on('endedMap', function () {
                return _this2.levels.nextFragment();
            });
            this.map.on('scrolledDown', function () {
                return _this2.player.moving();
            });

            this.levels.on('endedLevel', function () {
                return _this2.levels.nextLevel();
            });

            this.levels.switchLevel(0);
            this.map.scrollDown(1);
        }
    }, {
        key: 'restart',
        value: function restart() {
            this.game.scenes.restartScene('playground');

            // this.screen.splash(0xFFFFFF, 1000).then(() => {
            //   this.game.scenes.restartScene('playground');
            // });
        }
    }, {
        key: 'update',
        value: function update() {
            this.thlen.update();
        }
    }]);

    return Playground;
}(PIXI.projection.Container2d);

module.exports = Playground;

},{"../filters/AlphaGradientFilter":9,"../managers/HistoryManager":19,"../managers/LevelManager":20,"../managers/MapManager":21,"../managers/ScreenManager":23,"../subjects/Player":27,"../subjects/Thlen":29}],25:[function(require,module,exports){
'use strict';

module.exports = {
  'playground': require('./Playground')
};

},{"./Playground":24}],26:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Класс Блока, используется для тайлового движка
  События:
    activated
    deactivated
    hited
*/

var Block = function (_PIXI$projection$Spri) {
    _inherits(Block, _PIXI$projection$Spri);

    function Block(map, x, y) {
        var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        _classCallCheck(this, Block);

        var _this = _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).call(this, PIXI.Texture.fromFrame(params.image || params.activationImage)));

        _this.map = map;
        _this.game = _this.map.game;

        _this.score = params.score;
        _this.activation = params.activation || null;
        _this.deactivationTexture = params.image ? PIXI.Texture.fromFrame(params.image) : null;
        _this.activationTexture = params.activationImage ? PIXI.Texture.fromFrame(params.activationImage) : null;
        _this.isActive = params.active;
        _this.playerDir = params.playerDir || null;
        _this.action = params.action || null;

        _this.anchor.set(.5);
        _this.width = map.blockSize + 1;
        _this.height = map.blockSize + 1;
        _this.x = x + map.blockSize / 2 + .5;
        _this.y = y + map.blockSize / 2 + .5;

        _this.jolting = PIXI.tweenManager.createTween(_this);
        _this.jolting.from({ rotation: -.1 }).to({ rotation: .1 });
        _this.jolting.time = 200;
        _this.jolting.pingPong = true;
        _this.jolting.repeat = Infinity;

        _this.glow = new PIXI.filters.AlphaFilter();
        _this.glow.enabled = false;
        _this.filters = [_this.glow];
        return _this;
    }

    _createClass(Block, [{
        key: 'activate',
        value: function activate() {
            var activating = PIXI.tweenManager.createTween(this).from({ width: this.width * 3 / 4, height: this.height * 3 / 4 }).to({ width: this.width, height: this.height, rotation: 0 });
            activating.time = 500;
            activating.easing = PIXI.tween.Easing.outBounce();
            activating.start();

            this.glow.alpha = 1.0;
            this.jolting.stop();
            this.rotation = 0;

            this.isActive = true;
            if (this.activationTexture) this.texture = this.activationTexture;

            this.emit('activated');
        }
    }, {
        key: 'deactivate',
        value: function deactivate() {
            this.isActive = false;
            if (this.deactivationTexture) this.texture = this.deactivationTexture;
            this.emit('deactivated');
        }
    }, {
        key: 'unhit',
        value: function unhit() {
            this.glow.enabled = false;
            this.jolting.stop();
            this.rotation = 0;
        }
    }, {
        key: 'hit',
        value: function hit() {
            if (this.activation === null || this.isActive) return;

            this.jolting.start();
            this.glow.enabled = true;
            this.glow.alpha = 5.0;

            if (this.activation) this.activation--;else this.activate();
            this.emit('hited');
        }
    }]);

    return Block;
}(PIXI.projection.Sprite2d);

module.exports = Block;

},{}],27:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Класс Player, взаимодействует с MapManager
  События
    collision => collision block
    moved
    deaded

    actionImmunity
    actionTop
    actionLeft
    actionRight
*/

var Player = function (_PIXI$Sprite) {
    _inherits(Player, _PIXI$Sprite);

    function Player(scene, map) {
        _classCallCheck(this, Player);

        var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, PIXI.Texture.fromImage('player')));

        _this.game = scene.game;
        _this.scene = scene;
        _this.map = map;

        _this.anchor.set(.5, 1);
        _this.scale.set(.7);
        _this.x = _this.game.w / 2 + 5;
        _this.y = _this.game.h - _this.map.blockSize * 2;

        _this.walking = PIXI.tweenManager.createTween(_this);
        _this.walking.from({ y: _this.y }).to({ y: _this.y - 15 });
        _this.walking.time = 800;
        _this.walking.loop = true;
        _this.walking.pingPong = true;
        _this.walking.start();

        _this.lastMove = null;
        _this.speed = _this.map.speed || 500;
        _this.isDead = false;

        _this.IMMUNITY_BLOCKS = 2;
        _this.immunityCount = 5;
        _this.isImmunity = false;
        return _this;
    }

    _createClass(Player, [{
        key: 'moving',
        value: function moving() {
            if (this.isDead || this.isImmunity) return;

            var cur = this.map.getBlockFromPos({ x: this.x, y: this.y });
            if (cur && cur.isActive) {
                this.emit('collision', cur);

                if (cur.playerDir === 'top') return this.top();
                if (cur.playerDir === 'left') return this.left();
                if (cur.playerDir === 'right') return this.right();

                //check top
                var top = this.map.getBlockFromPos({ x: this.x, y: this.y - this.map.blockSize });
                if (top && top.isActive && this.lastMove !== 'bottom') return this.top();

                // check left
                var left = this.map.getBlockFromPos({ x: this.x - this.map.blockSize, y: this.y });
                if (left && left.isActive && this.lastMove !== 'right') return this.left();

                // check rigth
                var right = this.map.getBlockFromPos({ x: this.x + this.map.blockSize, y: this.y });
                if (right && right.isActive && this.lastMove !== 'left') return this.right();

                // or die
                this.top();
            } else this.dead();

            this.emit('moved');
        }
    }, {
        key: 'dead',
        value: function dead() {
            var _this2 = this;

            this.walking.stop();
            this.isDead = true;

            var dead = PIXI.tweenManager.createTween(this.scale);
            dead.from(this.scale).to({ x: 0, y: 0 });
            dead.time = 200;
            dead.start();
            dead.on('end', function () {
                return _this2.emit('deaded');
            });
        }
    }, {
        key: 'immunity',
        value: function immunity() {
            var _this3 = this;

            if (!this.immunityCount) return;

            var immunity = PIXI.tweenManager.createTween(this);
            immunity.from({ alpha: .5 }).to({ alpha: 1 });
            immunity.time = this.speed * this.IMMUNITY_BLOCKS;
            immunity.start();

            this.map.scrollDown(this.IMMUNITY_BLOCKS);
            immunity.on('end', function () {
                return _this3.isImmunity = false;
            });
            this.isImmunity = true;
            this.lastMove = 'top';
            this.immunityCount--;

            this.emit('actionImmunity');
        }
    }, {
        key: 'top',
        value: function top() {
            this.lastMove = 'top';
            this.map.scrollDown(1);

            this.emit('actionTop');
        }
    }, {
        key: 'left',
        value: function left() {
            var _this4 = this;

            this.lastMove = 'left';
            var move = PIXI.tweenManager.createTween(this);
            move.from({ x: this.x }).to({ x: this.x - this.map.blockSize - 20 });
            move.time = this.speed / 2;
            move.start();

            move.on('end', function () {
                return _this4.moving();
            });
            this.emit('actionLeft');
        }
    }, {
        key: 'right',
        value: function right() {
            var _this5 = this;

            this.lastMove = 'right';
            var move = PIXI.tweenManager.createTween(this);
            move.from({ x: this.x }).to({ x: this.x + this.map.blockSize + 20 });
            move.time = this.speed / 2;
            move.start();

            move.on('end', function () {
                return _this5.moving();
            });
            this.emit('actionRight');
        }
    }]);

    return Player;
}(PIXI.Sprite);

module.exports = Player;

},{}],28:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sphere = function (_PIXI$Container) {
  _inherits(Sphere, _PIXI$Container);

  function Sphere(scene) {
    _classCallCheck(this, Sphere);

    var _this = _possibleConstructorReturn(this, (Sphere.__proto__ || Object.getPrototypeOf(Sphere)).call(this));

    _this.emitter = new PIXI.particles.Emitter(_this, [PIXI.Texture.fromImage('particle')], require('./emitter.json'));
    return _this;
  }

  _createClass(Sphere, [{
    key: 'update',
    value: function update(dt) {
      this.emitter.update(dt * .01);
      this.emitter.emit = true;
    }
  }]);

  return Sphere;
}(PIXI.Container);

module.exports = Sphere;

},{"./emitter.json":30}],29:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Thlen = function (_PIXI$Container) {
    _inherits(Thlen, _PIXI$Container);

    function Thlen(scene) {
        _classCallCheck(this, Thlen);

        var _this = _possibleConstructorReturn(this, (Thlen.__proto__ || Object.getPrototypeOf(Thlen)).call(this));

        _this.scene = scene;
        _this.game = scene.game;

        _this.PADDIN = 50;

        _this.displacementSprite = new PIXI.Sprite(PIXI.Texture.fromImage('displacement'));
        _this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        scene.addChild(_this.displacementSprite);
        _this.displacementFilter = new PIXI.filters.DisplacementFilter(_this.displacementSprite);

        _this.thlen = new PIXI.Sprite(PIXI.Texture.fromImage('thlen'));
        _this.thlen.width = _this.game.w + _this.PADDIN;
        _this.thlen.y = _this.game.h - _this.thlen.height + _this.PADDIN;
        _this.thlen.x = -_this.PADDIN / 2;
        _this.thlen.filters = [_this.displacementFilter];
        scene.addChild(_this.thlen);
        return _this;
    }

    _createClass(Thlen, [{
        key: 'update',
        value: function update() {
            this.displacementSprite.x += 5;
            this.displacementSprite.y += 5;
        }
    }]);

    return Thlen;
}(PIXI.Container);

module.exports = Thlen;

},{}],30:[function(require,module,exports){
module.exports={
	"alpha": {
		"start": 0.48,
		"end": 0
	},
	"scale": {
		"start": 0.5,
		"end": 0.5,
		"minimumScaleMultiplier": 0.05
	},
	"color": {
		"start": "#ffffff",
		"end": "#ffffff"
	},
	"speed": {
		"start": 90,
		"end": 0,
		"minimumSpeedMultiplier": 1
	},
	"maxSpeed": 0,
	"startRotation": {
		"min": 0,
		"max": 360
	},
	"noRotation": false,
	"rotationSpeed": {
		"min": 0,
		"max": 0
	},
	"lifetime": {
		"min": 0.2,
		"max": 1
	},
	"blendMode": "add",
	"frequency": 0.001,
	"emitterLifetime": -1,
	"maxParticles": 500,
	"pos": {
		"x": 0,
		"y": 0
	},
	"addAtBack": false,
	"spawnType": "rect",
	"spawnRect": {
		"x": 0,
		"y": 0,
		"w": 0,
		"h": 0
	}
}

},{}],31:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
This util class for converted data from fragments.json
object to simple map array, for example: ['A', 'A', 'A', 'A']
*/

var DataFragmentConverter = function () {
  function DataFragmentConverter(data) {
    _classCallCheck(this, DataFragmentConverter);

    this.data = data;
    this.inputMap = data.map;
    this.fragment = [];

    // OPERATORS
    for (var i = 0; i < data.map.length; i++) {
      if (~~data.map[i].indexOf('|')) this.caseOperator(data.map[i], i);else this.fragment[i] = data.map[i];
    }

    // METHODS
    data.trim && this.randomTrim(data.trim);
    data.append && this.randomAppend(data.append);
    data.shuffle && this.shuffle();
  }

  // OPERATORS
  // Case operator: 'A|B|C|D' => C and etc...


  _createClass(DataFragmentConverter, [{
    key: 'caseOperator',
    value: function caseOperator(str, i) {
      var ids = str.split('|');
      this.fragment[i] = ids[Math.floor(Math.random() * ids.length)];
      return this;
    }

    // METHODS
    // Trimming array in range 0..rand(min, length)

  }, {
    key: 'randomTrim',
    value: function randomTrim(min) {
      this.fragment.length = Math.floor(Math.random() * (this.fragment.length + 1 - min) + min);
      return this;
    }
    // Shuffle array [1,2,3] => [2,1,3] and etc...

  }, {
    key: 'shuffle',
    value: function shuffle() {
      this.fragment.sort(function (a, b) {
        return Math.random() < .5 ? -1 : 1;
      });
      return this;
    }
    // Adds a block to the random location of the array: [A,A,A] => [B,A,A] and etc...

  }, {
    key: 'randomAppend',
    value: function randomAppend(id) {
      this.fragment[Math.floor(Math.random() * this.fragment.length)] = id;
      return this;
    }
  }]);

  return DataFragmentConverter;
}();

module.exports = DataFragmentConverter;

},{}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcGl4aS1wYXJ0aWNsZXMvZGlzdC9waXhpLXBhcnRpY2xlcy5taW4uanMiLCJub2RlX21vZHVsZXMvcGl4aS1wcm9qZWN0aW9uL2Rpc3QvcGl4aS1wcm9qZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3BpeGktc291bmQvZGlzdC9waXhpLXNvdW5kLmpzIiwibm9kZV9tb2R1bGVzL3BpeGktdHdlZW4vYnVpbGQvcGl4aS10d2Vlbi5qcyIsInNyYy9jb250ZW50L2Jsb2Nrcy5qc29uIiwic3JjL2NvbnRlbnQvZnJhZ21lbnRzLmpzb24iLCJzcmMvY29udGVudC9sZXZlbHMuanNvbiIsInNyYy9maWx0ZXJzL0FscGhhR3JhZGllbnRGaWx0ZXIvYWxwaGEuZnJhZyIsInNyY1xcZmlsdGVyc1xcQWxwaGFHcmFkaWVudEZpbHRlclxcaW5kZXguanMiLCJzcmMvZmlsdGVycy9DbG91ZHNGaWx0ZXIvY2xvdWRzLmZyYWciLCJzcmNcXGZpbHRlcnNcXENsb3Vkc0ZpbHRlclxcaW5kZXguanMiLCJzcmMvZmlsdGVycy9HcmF5c2NhbGVGaWx0ZXIvZ3JheXNjYWxlLmZyYWciLCJzcmNcXGZpbHRlcnNcXEdyYXlzY2FsZUZpbHRlclxcaW5kZXguanMiLCJzcmNcXGZpbHRlcnNcXE5vaXNlQmx1ckZpbHRlclxcaW5kZXguanMiLCJzcmMvZmlsdGVycy9Ob2lzZUJsdXJGaWx0ZXIvbm9pc2VCbHVyLmZyYWciLCJzcmMvZmlsdGVycy9iYXNpYy52ZXJ0Iiwic3JjXFxnYW1lLmpzIiwic3JjXFxpbmRleC5qcyIsInNyY1xcbWFuYWdlcnNcXEhpc3RvcnlNYW5hZ2VyLmpzIiwic3JjXFxtYW5hZ2Vyc1xcTGV2ZWxNYW5hZ2VyLmpzIiwic3JjXFxtYW5hZ2Vyc1xcTWFwTWFuYWdlci5qcyIsInNyY1xcbWFuYWdlcnNcXFNjZW5lc01hbmFnZXIuanMiLCJzcmNcXG1hbmFnZXJzXFxTY3JlZW5NYW5hZ2VyLmpzIiwic3JjXFxzY2VuZXNcXFBsYXlncm91bmQuanMiLCJzcmNcXHNjZW5lc1xcaW5kZXguanMiLCJzcmNcXHN1YmplY3RzXFxCbG9jay5qcyIsInNyY1xcc3ViamVjdHNcXFBsYXllci5qcyIsInNyY1xcc3ViamVjdHNcXFNwaGVyZS5qcyIsInNyY1xcc3ViamVjdHNcXFRobGVuLmpzIiwic3JjL3N1YmplY3RzL2VtaXR0ZXIuanNvbiIsInNyY1xcdXRpbHNcXERhdGFGcmFnbWVudENvbnZlcnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN0bkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNWQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LEdBQTBCLENBQXBDO0FBQUEsT0FBbkI7QUFDQSxhQUFPLElBQVA7QUFDRDtBQUNEOzs7O2lDQUNhLEUsRUFBSTtBQUNmLFdBQUssUUFBTCxDQUFjLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFjLEtBQUssUUFBTCxDQUFjLE1BQXZDLENBQWQsSUFBZ0UsRUFBaEU7QUFDQSxhQUFPLElBQVA7QUFDRDs7Ozs7O0FBR0gsT0FBTyxPQUFQLEdBQWlCLHFCQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAqIHBpeGktcGFydGljbGVzIC0gdjIuMS45XG4gKiBDb21waWxlZCBUaHUsIDE2IE5vdiAyMDE3IDAxOjUyOjM5IFVUQ1xuICpcbiAqIHBpeGktcGFydGljbGVzIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKHQpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlKW1vZHVsZS5leHBvcnRzPXQoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sdCk7ZWxzZXt2YXIgaTtpPVwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6dGhpcyxpLnBpeGlQYXJ0aWNsZXM9dCgpfX0oZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24gdChpLGUscyl7ZnVuY3Rpb24gYShuLG8pe2lmKCFlW25dKXtpZighaVtuXSl7dmFyIGg9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighbyYmaClyZXR1cm4gaChuLCEwKTtpZihyKXJldHVybiByKG4sITApO3ZhciBsPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbitcIidcIik7dGhyb3cgbC5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGx9dmFyIHA9ZVtuXT17ZXhwb3J0czp7fX07aVtuXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbih0KXt2YXIgZT1pW25dWzFdW3RdO3JldHVybiBhKGU/ZTp0KX0scCxwLmV4cG9ydHMsdCxpLGUscyl9cmV0dXJuIGVbbl0uZXhwb3J0c31mb3IodmFyIHI9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxuPTA7bjxzLmxlbmd0aDtuKyspYShzW25dKTtyZXR1cm4gYX0oezE6W2Z1bmN0aW9uKHQsaSxlKXtcInVzZSBzdHJpY3RcIjt2YXIgcz10KFwiLi9QYXJ0aWNsZVV0aWxzXCIpLGE9dChcIi4vUGFydGljbGVcIikscj1QSVhJLlRleHR1cmUsbj1mdW5jdGlvbih0KXthLmNhbGwodGhpcyx0KSx0aGlzLnRleHR1cmVzPW51bGwsdGhpcy5kdXJhdGlvbj0wLHRoaXMuZnJhbWVyYXRlPTAsdGhpcy5lbGFwc2VkPTAsdGhpcy5sb29wPSExfSxvPWEucHJvdG90eXBlLGg9bi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShvKTtoLmluaXQ9ZnVuY3Rpb24oKXt0aGlzLlBhcnRpY2xlX2luaXQoKSx0aGlzLmVsYXBzZWQ9MCx0aGlzLmZyYW1lcmF0ZTwwJiYodGhpcy5kdXJhdGlvbj10aGlzLm1heExpZmUsdGhpcy5mcmFtZXJhdGU9dGhpcy50ZXh0dXJlcy5sZW5ndGgvdGhpcy5kdXJhdGlvbil9LGguYXBwbHlBcnQ9ZnVuY3Rpb24odCl7dGhpcy50ZXh0dXJlcz10LnRleHR1cmVzLHRoaXMuZnJhbWVyYXRlPXQuZnJhbWVyYXRlLHRoaXMuZHVyYXRpb249dC5kdXJhdGlvbix0aGlzLmxvb3A9dC5sb29wfSxoLnVwZGF0ZT1mdW5jdGlvbih0KXtpZih0aGlzLlBhcnRpY2xlX3VwZGF0ZSh0KT49MCl7dGhpcy5lbGFwc2VkKz10LHRoaXMuZWxhcHNlZD50aGlzLmR1cmF0aW9uJiYodGhpcy5sb29wP3RoaXMuZWxhcHNlZD10aGlzLmVsYXBzZWQldGhpcy5kdXJhdGlvbjp0aGlzLmVsYXBzZWQ9dGhpcy5kdXJhdGlvbi0xZS02KTt2YXIgaT10aGlzLmVsYXBzZWQqdGhpcy5mcmFtZXJhdGUrMWUtN3wwO3RoaXMudGV4dHVyZT10aGlzLnRleHR1cmVzW2ldfHxzLkVNUFRZX1RFWFRVUkV9fSxoLlBhcnRpY2xlX2Rlc3Ryb3k9YS5wcm90b3R5cGUuZGVzdHJveSxoLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLlBhcnRpY2xlX2Rlc3Ryb3koKSx0aGlzLnRleHR1cmVzPW51bGx9LG4ucGFyc2VBcnQ9ZnVuY3Rpb24odCl7dmFyIGksZSxzLGEsbixvLGg9W107Zm9yKGk9MDtpPHQubGVuZ3RoOysraSl7Zm9yKGU9dFtpXSx0W2ldPWg9e30saC50ZXh0dXJlcz1vPVtdLGE9ZS50ZXh0dXJlcyxzPTA7czxhLmxlbmd0aDsrK3MpaWYobj1hW3NdLFwic3RyaW5nXCI9PXR5cGVvZiBuKW8ucHVzaChyLmZyb21JbWFnZShuKSk7ZWxzZSBpZihuIGluc3RhbmNlb2YgcilvLnB1c2gobik7ZWxzZXt2YXIgbD1uLmNvdW50fHwxO2ZvcihuPVwic3RyaW5nXCI9PXR5cGVvZiBuLnRleHR1cmU/ci5mcm9tSW1hZ2Uobi50ZXh0dXJlKTpuLnRleHR1cmU7bD4wOy0tbClvLnB1c2gobil9XCJtYXRjaExpZmVcIj09ZS5mcmFtZXJhdGU/KGguZnJhbWVyYXRlPS0xLGguZHVyYXRpb249MCxoLmxvb3A9ITEpOihoLmxvb3A9ISFlLmxvb3AsaC5mcmFtZXJhdGU9ZS5mcmFtZXJhdGU+MD9lLmZyYW1lcmF0ZTo2MCxoLmR1cmF0aW9uPW8ubGVuZ3RoL2guZnJhbWVyYXRlKX1yZXR1cm4gdH0saS5leHBvcnRzPW59LHtcIi4vUGFydGljbGVcIjozLFwiLi9QYXJ0aWNsZVV0aWxzXCI6NH1dLDI6W2Z1bmN0aW9uKHQsaSxlKXtcInVzZSBzdHJpY3RcIjt2YXIgcz10KFwiLi9QYXJ0aWNsZVV0aWxzXCIpLGE9dChcIi4vUGFydGljbGVcIikscj1QSVhJLnBhcnRpY2xlcy5QYXJ0aWNsZUNvbnRhaW5lcnx8UElYSS5QYXJ0aWNsZUNvbnRhaW5lcixuPVBJWEkudGlja2VyLnNoYXJlZCxvPWZ1bmN0aW9uKHQsaSxlKXt0aGlzLl9wYXJ0aWNsZUNvbnN0cnVjdG9yPWEsdGhpcy5wYXJ0aWNsZUltYWdlcz1udWxsLHRoaXMuc3RhcnRBbHBoYT0xLHRoaXMuZW5kQWxwaGE9MSx0aGlzLnN0YXJ0U3BlZWQ9MCx0aGlzLmVuZFNwZWVkPTAsdGhpcy5taW5pbXVtU3BlZWRNdWx0aXBsaWVyPTEsdGhpcy5hY2NlbGVyYXRpb249bnVsbCx0aGlzLm1heFNwZWVkPU5hTix0aGlzLnN0YXJ0U2NhbGU9MSx0aGlzLmVuZFNjYWxlPTEsdGhpcy5taW5pbXVtU2NhbGVNdWx0aXBsaWVyPTEsdGhpcy5zdGFydENvbG9yPW51bGwsdGhpcy5lbmRDb2xvcj1udWxsLHRoaXMubWluTGlmZXRpbWU9MCx0aGlzLm1heExpZmV0aW1lPTAsdGhpcy5taW5TdGFydFJvdGF0aW9uPTAsdGhpcy5tYXhTdGFydFJvdGF0aW9uPTAsdGhpcy5ub1JvdGF0aW9uPSExLHRoaXMubWluUm90YXRpb25TcGVlZD0wLHRoaXMubWF4Um90YXRpb25TcGVlZD0wLHRoaXMucGFydGljbGVCbGVuZE1vZGU9MCx0aGlzLmN1c3RvbUVhc2U9bnVsbCx0aGlzLmV4dHJhRGF0YT1udWxsLHRoaXMuX2ZyZXF1ZW5jeT0xLHRoaXMubWF4UGFydGljbGVzPTFlMyx0aGlzLmVtaXR0ZXJMaWZldGltZT0tMSx0aGlzLnNwYXduUG9zPW51bGwsdGhpcy5zcGF3blR5cGU9bnVsbCx0aGlzLl9zcGF3bkZ1bmM9bnVsbCx0aGlzLnNwYXduUmVjdD1udWxsLHRoaXMuc3Bhd25DaXJjbGU9bnVsbCx0aGlzLnBhcnRpY2xlc1BlcldhdmU9MSx0aGlzLnBhcnRpY2xlU3BhY2luZz0wLHRoaXMuYW5nbGVTdGFydD0wLHRoaXMucm90YXRpb249MCx0aGlzLm93bmVyUG9zPW51bGwsdGhpcy5fcHJldkVtaXR0ZXJQb3M9bnVsbCx0aGlzLl9wcmV2UG9zSXNWYWxpZD0hMSx0aGlzLl9wb3NDaGFuZ2VkPSExLHRoaXMuX3BhcmVudElzUEM9ITEsdGhpcy5fcGFyZW50PW51bGwsdGhpcy5hZGRBdEJhY2s9ITEsdGhpcy5wYXJ0aWNsZUNvdW50PTAsdGhpcy5fZW1pdD0hMSx0aGlzLl9zcGF3blRpbWVyPTAsdGhpcy5fZW1pdHRlckxpZmU9LTEsdGhpcy5fYWN0aXZlUGFydGljbGVzRmlyc3Q9bnVsbCx0aGlzLl9hY3RpdmVQYXJ0aWNsZXNMYXN0PW51bGwsdGhpcy5fcG9vbEZpcnN0PW51bGwsdGhpcy5fb3JpZ0NvbmZpZz1udWxsLHRoaXMuX29yaWdBcnQ9bnVsbCx0aGlzLl9hdXRvVXBkYXRlPSExLHRoaXMuX2Rlc3Ryb3lXaGVuQ29tcGxldGU9ITEsdGhpcy5fY29tcGxldGVDYWxsYmFjaz1udWxsLHRoaXMucGFyZW50PXQsaSYmZSYmdGhpcy5pbml0KGksZSksdGhpcy5yZWN5Y2xlPXRoaXMucmVjeWNsZSx0aGlzLnVwZGF0ZT10aGlzLnVwZGF0ZSx0aGlzLnJvdGF0ZT10aGlzLnJvdGF0ZSx0aGlzLnVwZGF0ZVNwYXduUG9zPXRoaXMudXBkYXRlU3Bhd25Qb3MsdGhpcy51cGRhdGVPd25lclBvcz10aGlzLnVwZGF0ZU93bmVyUG9zfSxoPW8ucHJvdG90eXBlPXt9LGw9bmV3IFBJWEkuUG9pbnQ7T2JqZWN0LmRlZmluZVByb3BlcnR5KGgsXCJmcmVxdWVuY3lcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2ZyZXF1ZW5jeX0sc2V0OmZ1bmN0aW9uKHQpe1wibnVtYmVyXCI9PXR5cGVvZiB0JiZ0PjA/dGhpcy5fZnJlcXVlbmN5PXQ6dGhpcy5fZnJlcXVlbmN5PTF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGgsXCJwYXJ0aWNsZUNvbnN0cnVjdG9yXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXJ0aWNsZUNvbnN0cnVjdG9yfSxzZXQ6ZnVuY3Rpb24odCl7aWYodCE9dGhpcy5fcGFydGljbGVDb25zdHJ1Y3Rvcil7dGhpcy5fcGFydGljbGVDb25zdHJ1Y3Rvcj10LHRoaXMuY2xlYW51cCgpO2Zvcih2YXIgaT10aGlzLl9wb29sRmlyc3Q7aTtpPWkubmV4dClpLmRlc3Ryb3koKTt0aGlzLl9wb29sRmlyc3Q9bnVsbCx0aGlzLl9vcmlnQ29uZmlnJiZ0aGlzLl9vcmlnQXJ0JiZ0aGlzLmluaXQodGhpcy5fb3JpZ0FydCx0aGlzLl9vcmlnQ29uZmlnKX19fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGgsXCJwYXJlbnRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhcmVudH0sc2V0OmZ1bmN0aW9uKHQpe2lmKHRoaXMuX3BhcmVudElzUEMpZm9yKHZhciBpPXRoaXMuX3Bvb2xGaXJzdDtpO2k9aS5uZXh0KWkucGFyZW50JiZpLnBhcmVudC5yZW1vdmVDaGlsZChpKTt0aGlzLmNsZWFudXAoKSx0aGlzLl9wYXJlbnQ9dCx0aGlzLl9wYXJlbnRJc1BDPXImJnQmJnQgaW5zdGFuY2VvZiByfX0pLGguaW5pdD1mdW5jdGlvbih0LGkpe2lmKHQmJmkpe3RoaXMuY2xlYW51cCgpLHRoaXMuX29yaWdDb25maWc9aSx0aGlzLl9vcmlnQXJ0PXQsdD1BcnJheS5pc0FycmF5KHQpP3Quc2xpY2UoKTpbdF07dmFyIGU9dGhpcy5fcGFydGljbGVDb25zdHJ1Y3Rvcjt0aGlzLnBhcnRpY2xlSW1hZ2VzPWUucGFyc2VBcnQ/ZS5wYXJzZUFydCh0KTp0LGkuYWxwaGE/KHRoaXMuc3RhcnRBbHBoYT1pLmFscGhhLnN0YXJ0LHRoaXMuZW5kQWxwaGE9aS5hbHBoYS5lbmQpOnRoaXMuc3RhcnRBbHBoYT10aGlzLmVuZEFscGhhPTEsaS5zcGVlZD8odGhpcy5zdGFydFNwZWVkPWkuc3BlZWQuc3RhcnQsdGhpcy5lbmRTcGVlZD1pLnNwZWVkLmVuZCx0aGlzLm1pbmltdW1TcGVlZE11bHRpcGxpZXI9aS5zcGVlZC5taW5pbXVtU3BlZWRNdWx0aXBsaWVyfHwxKToodGhpcy5taW5pbXVtU3BlZWRNdWx0aXBsaWVyPTEsdGhpcy5zdGFydFNwZWVkPXRoaXMuZW5kU3BlZWQ9MCk7dmFyIGE9aS5hY2NlbGVyYXRpb247YSYmKGEueHx8YS55KT8odGhpcy5lbmRTcGVlZD10aGlzLnN0YXJ0U3BlZWQsdGhpcy5hY2NlbGVyYXRpb249bmV3IFBJWEkuUG9pbnQoYS54LGEueSksdGhpcy5tYXhTcGVlZD1pLm1heFNwZWVkfHxOYU4pOnRoaXMuYWNjZWxlcmF0aW9uPW5ldyBQSVhJLlBvaW50LGkuc2NhbGU/KHRoaXMuc3RhcnRTY2FsZT1pLnNjYWxlLnN0YXJ0LHRoaXMuZW5kU2NhbGU9aS5zY2FsZS5lbmQsdGhpcy5taW5pbXVtU2NhbGVNdWx0aXBsaWVyPWkuc2NhbGUubWluaW11bVNjYWxlTXVsdGlwbGllcnx8MSk6dGhpcy5zdGFydFNjYWxlPXRoaXMuZW5kU2NhbGU9dGhpcy5taW5pbXVtU2NhbGVNdWx0aXBsaWVyPTEsaS5jb2xvciYmKHRoaXMuc3RhcnRDb2xvcj1zLmhleFRvUkdCKGkuY29sb3Iuc3RhcnQpLGkuY29sb3Iuc3RhcnQhPWkuY29sb3IuZW5kP3RoaXMuZW5kQ29sb3I9cy5oZXhUb1JHQihpLmNvbG9yLmVuZCk6dGhpcy5lbmRDb2xvcj1udWxsKSxpLnN0YXJ0Um90YXRpb24/KHRoaXMubWluU3RhcnRSb3RhdGlvbj1pLnN0YXJ0Um90YXRpb24ubWluLHRoaXMubWF4U3RhcnRSb3RhdGlvbj1pLnN0YXJ0Um90YXRpb24ubWF4KTp0aGlzLm1pblN0YXJ0Um90YXRpb249dGhpcy5tYXhTdGFydFJvdGF0aW9uPTAsaS5ub1JvdGF0aW9uJiYodGhpcy5taW5TdGFydFJvdGF0aW9ufHx0aGlzLm1heFN0YXJ0Um90YXRpb24pP3RoaXMubm9Sb3RhdGlvbj0hIWkubm9Sb3RhdGlvbjp0aGlzLm5vUm90YXRpb249ITEsaS5yb3RhdGlvblNwZWVkPyh0aGlzLm1pblJvdGF0aW9uU3BlZWQ9aS5yb3RhdGlvblNwZWVkLm1pbix0aGlzLm1heFJvdGF0aW9uU3BlZWQ9aS5yb3RhdGlvblNwZWVkLm1heCk6dGhpcy5taW5Sb3RhdGlvblNwZWVkPXRoaXMubWF4Um90YXRpb25TcGVlZD0wLHRoaXMubWluTGlmZXRpbWU9aS5saWZldGltZS5taW4sdGhpcy5tYXhMaWZldGltZT1pLmxpZmV0aW1lLm1heCx0aGlzLnBhcnRpY2xlQmxlbmRNb2RlPXMuZ2V0QmxlbmRNb2RlKGkuYmxlbmRNb2RlKSxpLmVhc2U/dGhpcy5jdXN0b21FYXNlPVwiZnVuY3Rpb25cIj09dHlwZW9mIGkuZWFzZT9pLmVhc2U6cy5nZW5lcmF0ZUVhc2UoaS5lYXNlKTp0aGlzLmN1c3RvbUVhc2U9bnVsbCxlLnBhcnNlRGF0YT90aGlzLmV4dHJhRGF0YT1lLnBhcnNlRGF0YShpLmV4dHJhRGF0YSk6dGhpcy5leHRyYURhdGE9aS5leHRyYURhdGF8fG51bGwsdGhpcy5zcGF3blJlY3Q9dGhpcy5zcGF3bkNpcmNsZT1udWxsLHRoaXMucGFydGljbGVzUGVyV2F2ZT0xLHRoaXMucGFydGljbGVTcGFjaW5nPTAsdGhpcy5hbmdsZVN0YXJ0PTA7dmFyIHI7c3dpdGNoKGkuc3Bhd25UeXBlKXtjYXNlXCJyZWN0XCI6dGhpcy5zcGF3blR5cGU9XCJyZWN0XCIsdGhpcy5fc3Bhd25GdW5jPXRoaXMuX3NwYXduUmVjdDt2YXIgbj1pLnNwYXduUmVjdDt0aGlzLnNwYXduUmVjdD1uZXcgUElYSS5SZWN0YW5nbGUobi54LG4ueSxuLncsbi5oKTticmVhaztjYXNlXCJjaXJjbGVcIjp0aGlzLnNwYXduVHlwZT1cImNpcmNsZVwiLHRoaXMuX3NwYXduRnVuYz10aGlzLl9zcGF3bkNpcmNsZSxyPWkuc3Bhd25DaXJjbGUsdGhpcy5zcGF3bkNpcmNsZT1uZXcgUElYSS5DaXJjbGUoci54LHIueSxyLnIpO2JyZWFrO2Nhc2VcInJpbmdcIjp0aGlzLnNwYXduVHlwZT1cInJpbmdcIix0aGlzLl9zcGF3bkZ1bmM9dGhpcy5fc3Bhd25SaW5nLHI9aS5zcGF3bkNpcmNsZSx0aGlzLnNwYXduQ2lyY2xlPW5ldyBQSVhJLkNpcmNsZShyLngsci55LHIuciksdGhpcy5zcGF3bkNpcmNsZS5taW5SYWRpdXM9ci5taW5SO2JyZWFrO2Nhc2VcImJ1cnN0XCI6dGhpcy5zcGF3blR5cGU9XCJidXJzdFwiLHRoaXMuX3NwYXduRnVuYz10aGlzLl9zcGF3bkJ1cnN0LHRoaXMucGFydGljbGVzUGVyV2F2ZT1pLnBhcnRpY2xlc1BlcldhdmUsdGhpcy5wYXJ0aWNsZVNwYWNpbmc9aS5wYXJ0aWNsZVNwYWNpbmcsdGhpcy5hbmdsZVN0YXJ0PWkuYW5nbGVTdGFydD9pLmFuZ2xlU3RhcnQ6MDticmVhaztjYXNlXCJwb2ludFwiOnRoaXMuc3Bhd25UeXBlPVwicG9pbnRcIix0aGlzLl9zcGF3bkZ1bmM9dGhpcy5fc3Bhd25Qb2ludDticmVhaztkZWZhdWx0OnRoaXMuc3Bhd25UeXBlPVwicG9pbnRcIix0aGlzLl9zcGF3bkZ1bmM9dGhpcy5fc3Bhd25Qb2ludH10aGlzLmZyZXF1ZW5jeT1pLmZyZXF1ZW5jeSx0aGlzLmVtaXR0ZXJMaWZldGltZT1pLmVtaXR0ZXJMaWZldGltZXx8LTEsdGhpcy5tYXhQYXJ0aWNsZXM9aS5tYXhQYXJ0aWNsZXM+MD9pLm1heFBhcnRpY2xlczoxZTMsdGhpcy5hZGRBdEJhY2s9ISFpLmFkZEF0QmFjayx0aGlzLnJvdGF0aW9uPTAsdGhpcy5vd25lclBvcz1uZXcgUElYSS5Qb2ludCx0aGlzLnNwYXduUG9zPW5ldyBQSVhJLlBvaW50KGkucG9zLngsaS5wb3MueSksdGhpcy5fcHJldkVtaXR0ZXJQb3M9dGhpcy5zcGF3blBvcy5jbG9uZSgpLHRoaXMuX3ByZXZQb3NJc1ZhbGlkPSExLHRoaXMuX3NwYXduVGltZXI9MCx0aGlzLmVtaXQ9dm9pZCAwPT09aS5lbWl0fHwhIWkuZW1pdCx0aGlzLmF1dG9VcGRhdGU9dm9pZCAwIT09aS5hdXRvVXBkYXRlJiYhIWkuYXV0b1VwZGF0ZX19LGgucmVjeWNsZT1mdW5jdGlvbih0KXt0Lm5leHQmJih0Lm5leHQucHJldj10LnByZXYpLHQucHJldiYmKHQucHJldi5uZXh0PXQubmV4dCksdD09dGhpcy5fYWN0aXZlUGFydGljbGVzTGFzdCYmKHRoaXMuX2FjdGl2ZVBhcnRpY2xlc0xhc3Q9dC5wcmV2KSx0PT10aGlzLl9hY3RpdmVQYXJ0aWNsZXNGaXJzdCYmKHRoaXMuX2FjdGl2ZVBhcnRpY2xlc0ZpcnN0PXQubmV4dCksdC5wcmV2PW51bGwsdC5uZXh0PXRoaXMuX3Bvb2xGaXJzdCx0aGlzLl9wb29sRmlyc3Q9dCx0aGlzLl9wYXJlbnRJc1BDPyh0LmFscGhhPTAsdC52aXNpYmxlPSExKTp0LnBhcmVudCYmdC5wYXJlbnQucmVtb3ZlQ2hpbGQodCksLS10aGlzLnBhcnRpY2xlQ291bnR9LGgucm90YXRlPWZ1bmN0aW9uKHQpe2lmKHRoaXMucm90YXRpb24hPXQpe3ZhciBpPXQtdGhpcy5yb3RhdGlvbjt0aGlzLnJvdGF0aW9uPXQscy5yb3RhdGVQb2ludChpLHRoaXMuc3Bhd25Qb3MpLHRoaXMuX3Bvc0NoYW5nZWQ9ITB9fSxoLnVwZGF0ZVNwYXduUG9zPWZ1bmN0aW9uKHQsaSl7dGhpcy5fcG9zQ2hhbmdlZD0hMCx0aGlzLnNwYXduUG9zLng9dCx0aGlzLnNwYXduUG9zLnk9aX0saC51cGRhdGVPd25lclBvcz1mdW5jdGlvbih0LGkpe3RoaXMuX3Bvc0NoYW5nZWQ9ITAsdGhpcy5vd25lclBvcy54PXQsdGhpcy5vd25lclBvcy55PWl9LGgucmVzZXRQb3NpdGlvblRyYWNraW5nPWZ1bmN0aW9uKCl7dGhpcy5fcHJldlBvc0lzVmFsaWQ9ITF9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShoLFwiZW1pdFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZW1pdH0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMuX2VtaXQ9ISF0LHRoaXMuX2VtaXR0ZXJMaWZlPXRoaXMuZW1pdHRlckxpZmV0aW1lfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShoLFwiYXV0b1VwZGF0ZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXV0b1VwZGF0ZX0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMuX2F1dG9VcGRhdGUmJiF0P24ucmVtb3ZlKHRoaXMudXBkYXRlLHRoaXMpOiF0aGlzLl9hdXRvVXBkYXRlJiZ0JiZuLmFkZCh0aGlzLnVwZGF0ZSx0aGlzKSx0aGlzLl9hdXRvVXBkYXRlPSEhdH19KSxoLnBsYXlPbmNlQW5kRGVzdHJveT1mdW5jdGlvbih0KXt0aGlzLmF1dG9VcGRhdGU9ITAsdGhpcy5lbWl0PSEwLHRoaXMuX2Rlc3Ryb3lXaGVuQ29tcGxldGU9ITAsdGhpcy5fY29tcGxldGVDYWxsYmFjaz10fSxoLnBsYXlPbmNlPWZ1bmN0aW9uKHQpe3RoaXMuYXV0b1VwZGF0ZT0hMCx0aGlzLmVtaXQ9ITAsdGhpcy5fY29tcGxldGVDYWxsYmFjaz10fSxoLnVwZGF0ZT1mdW5jdGlvbih0KXtpZih0aGlzLl9hdXRvVXBkYXRlJiYodD10L1BJWEkuc2V0dGluZ3MuVEFSR0VUX0ZQTVMvMWUzKSx0aGlzLl9wYXJlbnQpe3ZhciBpLGUscztmb3IoZT10aGlzLl9hY3RpdmVQYXJ0aWNsZXNGaXJzdDtlO2U9cylzPWUubmV4dCxlLnVwZGF0ZSh0KTt2YXIgYSxyO3RoaXMuX3ByZXZQb3NJc1ZhbGlkJiYoYT10aGlzLl9wcmV2RW1pdHRlclBvcy54LHI9dGhpcy5fcHJldkVtaXR0ZXJQb3MueSk7dmFyIG49dGhpcy5vd25lclBvcy54K3RoaXMuc3Bhd25Qb3MueCxvPXRoaXMub3duZXJQb3MueSt0aGlzLnNwYXduUG9zLnk7aWYodGhpcy5fZW1pdClmb3IodGhpcy5fc3Bhd25UaW1lci09dDt0aGlzLl9zcGF3blRpbWVyPD0wOyl7aWYodGhpcy5fZW1pdHRlckxpZmU+MCYmKHRoaXMuX2VtaXR0ZXJMaWZlLT10aGlzLl9mcmVxdWVuY3ksdGhpcy5fZW1pdHRlckxpZmU8PTApKXt0aGlzLl9zcGF3blRpbWVyPTAsdGhpcy5fZW1pdHRlckxpZmU9MCx0aGlzLmVtaXQ9ITE7YnJlYWt9aWYodGhpcy5wYXJ0aWNsZUNvdW50Pj10aGlzLm1heFBhcnRpY2xlcyl0aGlzLl9zcGF3blRpbWVyKz10aGlzLl9mcmVxdWVuY3k7ZWxzZXt2YXIgaDtpZihoPXRoaXMubWluTGlmZXRpbWU9PXRoaXMubWF4TGlmZXRpbWU/dGhpcy5taW5MaWZldGltZTpNYXRoLnJhbmRvbSgpKih0aGlzLm1heExpZmV0aW1lLXRoaXMubWluTGlmZXRpbWUpK3RoaXMubWluTGlmZXRpbWUsLXRoaXMuX3NwYXduVGltZXI8aCl7dmFyIGwscDtpZih0aGlzLl9wcmV2UG9zSXNWYWxpZCYmdGhpcy5fcG9zQ2hhbmdlZCl7dmFyIGM9MSt0aGlzLl9zcGF3blRpbWVyL3Q7bD0obi1hKSpjK2EscD0oby1yKSpjK3J9ZWxzZSBsPW4scD1vO2k9MDtmb3IodmFyIGQ9TWF0aC5taW4odGhpcy5wYXJ0aWNsZXNQZXJXYXZlLHRoaXMubWF4UGFydGljbGVzLXRoaXMucGFydGljbGVDb3VudCk7aTxkOysraSl7dmFyIHUsbTtpZih0aGlzLl9wb29sRmlyc3Q/KHU9dGhpcy5fcG9vbEZpcnN0LHRoaXMuX3Bvb2xGaXJzdD10aGlzLl9wb29sRmlyc3QubmV4dCx1Lm5leHQ9bnVsbCk6dT1uZXcgdGhpcy5wYXJ0aWNsZUNvbnN0cnVjdG9yKHRoaXMpLHRoaXMucGFydGljbGVJbWFnZXMubGVuZ3RoPjE/dS5hcHBseUFydCh0aGlzLnBhcnRpY2xlSW1hZ2VzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSp0aGlzLnBhcnRpY2xlSW1hZ2VzLmxlbmd0aCldKTp1LmFwcGx5QXJ0KHRoaXMucGFydGljbGVJbWFnZXNbMF0pLHUuc3RhcnRBbHBoYT10aGlzLnN0YXJ0QWxwaGEsdS5lbmRBbHBoYT10aGlzLmVuZEFscGhhLDEhPXRoaXMubWluaW11bVNwZWVkTXVsdGlwbGllcj8obT1NYXRoLnJhbmRvbSgpKigxLXRoaXMubWluaW11bVNwZWVkTXVsdGlwbGllcikrdGhpcy5taW5pbXVtU3BlZWRNdWx0aXBsaWVyLHUuc3RhcnRTcGVlZD10aGlzLnN0YXJ0U3BlZWQqbSx1LmVuZFNwZWVkPXRoaXMuZW5kU3BlZWQqbSk6KHUuc3RhcnRTcGVlZD10aGlzLnN0YXJ0U3BlZWQsdS5lbmRTcGVlZD10aGlzLmVuZFNwZWVkKSx1LmFjY2VsZXJhdGlvbi54PXRoaXMuYWNjZWxlcmF0aW9uLngsdS5hY2NlbGVyYXRpb24ueT10aGlzLmFjY2VsZXJhdGlvbi55LHUubWF4U3BlZWQ9dGhpcy5tYXhTcGVlZCwxIT10aGlzLm1pbmltdW1TY2FsZU11bHRpcGxpZXI/KG09TWF0aC5yYW5kb20oKSooMS10aGlzLm1pbmltdW1TY2FsZU11bHRpcGxpZXIpK3RoaXMubWluaW11bVNjYWxlTXVsdGlwbGllcix1LnN0YXJ0U2NhbGU9dGhpcy5zdGFydFNjYWxlKm0sdS5lbmRTY2FsZT10aGlzLmVuZFNjYWxlKm0pOih1LnN0YXJ0U2NhbGU9dGhpcy5zdGFydFNjYWxlLHUuZW5kU2NhbGU9dGhpcy5lbmRTY2FsZSksdS5zdGFydENvbG9yPXRoaXMuc3RhcnRDb2xvcix1LmVuZENvbG9yPXRoaXMuZW5kQ29sb3IsdGhpcy5taW5Sb3RhdGlvblNwZWVkPT10aGlzLm1heFJvdGF0aW9uU3BlZWQ/dS5yb3RhdGlvblNwZWVkPXRoaXMubWluUm90YXRpb25TcGVlZDp1LnJvdGF0aW9uU3BlZWQ9TWF0aC5yYW5kb20oKSoodGhpcy5tYXhSb3RhdGlvblNwZWVkLXRoaXMubWluUm90YXRpb25TcGVlZCkrdGhpcy5taW5Sb3RhdGlvblNwZWVkLHUubm9Sb3RhdGlvbj10aGlzLm5vUm90YXRpb24sdS5tYXhMaWZlPWgsdS5ibGVuZE1vZGU9dGhpcy5wYXJ0aWNsZUJsZW5kTW9kZSx1LmVhc2U9dGhpcy5jdXN0b21FYXNlLHUuZXh0cmFEYXRhPXRoaXMuZXh0cmFEYXRhLHRoaXMuX3NwYXduRnVuYyh1LGwscCxpKSx1LmluaXQoKSx1LnVwZGF0ZSgtdGhpcy5fc3Bhd25UaW1lciksdGhpcy5fcGFyZW50SXNQQyYmdS5wYXJlbnQpe3ZhciBmPXRoaXMuX3BhcmVudC5jaGlsZHJlbjtpZihmWzBdPT11KWYuc2hpZnQoKTtlbHNlIGlmKGZbZi5sZW5ndGgtMV09PXUpZi5wb3AoKTtlbHNle3ZhciBfPWYuaW5kZXhPZih1KTtmLnNwbGljZShfLDEpfXRoaXMuYWRkQXRCYWNrP2YudW5zaGlmdCh1KTpmLnB1c2godSl9ZWxzZSB0aGlzLmFkZEF0QmFjaz90aGlzLl9wYXJlbnQuYWRkQ2hpbGRBdCh1LDApOnRoaXMuX3BhcmVudC5hZGRDaGlsZCh1KTt0aGlzLl9hY3RpdmVQYXJ0aWNsZXNMYXN0Pyh0aGlzLl9hY3RpdmVQYXJ0aWNsZXNMYXN0Lm5leHQ9dSx1LnByZXY9dGhpcy5fYWN0aXZlUGFydGljbGVzTGFzdCx0aGlzLl9hY3RpdmVQYXJ0aWNsZXNMYXN0PXUpOnRoaXMuX2FjdGl2ZVBhcnRpY2xlc0xhc3Q9dGhpcy5fYWN0aXZlUGFydGljbGVzRmlyc3Q9dSwrK3RoaXMucGFydGljbGVDb3VudH19dGhpcy5fc3Bhd25UaW1lcis9dGhpcy5fZnJlcXVlbmN5fX10aGlzLl9wb3NDaGFuZ2VkJiYodGhpcy5fcHJldkVtaXR0ZXJQb3MueD1uLHRoaXMuX3ByZXZFbWl0dGVyUG9zLnk9byx0aGlzLl9wcmV2UG9zSXNWYWxpZD0hMCx0aGlzLl9wb3NDaGFuZ2VkPSExKSx0aGlzLl9lbWl0fHx0aGlzLl9hY3RpdmVQYXJ0aWNsZXNGaXJzdHx8KHRoaXMuX2NvbXBsZXRlQ2FsbGJhY2smJnRoaXMuX2NvbXBsZXRlQ2FsbGJhY2soKSx0aGlzLl9kZXN0cm95V2hlbkNvbXBsZXRlJiZ0aGlzLmRlc3Ryb3koKSl9fSxoLl9zcGF3blBvaW50PWZ1bmN0aW9uKHQsaSxlKXt0aGlzLm1pblN0YXJ0Um90YXRpb249PXRoaXMubWF4U3RhcnRSb3RhdGlvbj90LnJvdGF0aW9uPXRoaXMubWluU3RhcnRSb3RhdGlvbit0aGlzLnJvdGF0aW9uOnQucm90YXRpb249TWF0aC5yYW5kb20oKSoodGhpcy5tYXhTdGFydFJvdGF0aW9uLXRoaXMubWluU3RhcnRSb3RhdGlvbikrdGhpcy5taW5TdGFydFJvdGF0aW9uK3RoaXMucm90YXRpb24sdC5wb3NpdGlvbi54PWksdC5wb3NpdGlvbi55PWV9LGguX3NwYXduUmVjdD1mdW5jdGlvbih0LGksZSl7dGhpcy5taW5TdGFydFJvdGF0aW9uPT10aGlzLm1heFN0YXJ0Um90YXRpb24/dC5yb3RhdGlvbj10aGlzLm1pblN0YXJ0Um90YXRpb24rdGhpcy5yb3RhdGlvbjp0LnJvdGF0aW9uPU1hdGgucmFuZG9tKCkqKHRoaXMubWF4U3RhcnRSb3RhdGlvbi10aGlzLm1pblN0YXJ0Um90YXRpb24pK3RoaXMubWluU3RhcnRSb3RhdGlvbit0aGlzLnJvdGF0aW9uLGwueD1NYXRoLnJhbmRvbSgpKnRoaXMuc3Bhd25SZWN0LndpZHRoK3RoaXMuc3Bhd25SZWN0LngsbC55PU1hdGgucmFuZG9tKCkqdGhpcy5zcGF3blJlY3QuaGVpZ2h0K3RoaXMuc3Bhd25SZWN0LnksMCE9PXRoaXMucm90YXRpb24mJnMucm90YXRlUG9pbnQodGhpcy5yb3RhdGlvbixsKSx0LnBvc2l0aW9uLng9aStsLngsdC5wb3NpdGlvbi55PWUrbC55fSxoLl9zcGF3bkNpcmNsZT1mdW5jdGlvbih0LGksZSl7dGhpcy5taW5TdGFydFJvdGF0aW9uPT10aGlzLm1heFN0YXJ0Um90YXRpb24/dC5yb3RhdGlvbj10aGlzLm1pblN0YXJ0Um90YXRpb24rdGhpcy5yb3RhdGlvbjp0LnJvdGF0aW9uPU1hdGgucmFuZG9tKCkqKHRoaXMubWF4U3RhcnRSb3RhdGlvbi10aGlzLm1pblN0YXJ0Um90YXRpb24pK3RoaXMubWluU3RhcnRSb3RhdGlvbit0aGlzLnJvdGF0aW9uLGwueD1NYXRoLnJhbmRvbSgpKnRoaXMuc3Bhd25DaXJjbGUucmFkaXVzLGwueT0wLHMucm90YXRlUG9pbnQoMzYwKk1hdGgucmFuZG9tKCksbCksbC54Kz10aGlzLnNwYXduQ2lyY2xlLngsbC55Kz10aGlzLnNwYXduQ2lyY2xlLnksMCE9PXRoaXMucm90YXRpb24mJnMucm90YXRlUG9pbnQodGhpcy5yb3RhdGlvbixsKSx0LnBvc2l0aW9uLng9aStsLngsdC5wb3NpdGlvbi55PWUrbC55fSxoLl9zcGF3blJpbmc9ZnVuY3Rpb24odCxpLGUpe3ZhciBhPXRoaXMuc3Bhd25DaXJjbGU7dGhpcy5taW5TdGFydFJvdGF0aW9uPT10aGlzLm1heFN0YXJ0Um90YXRpb24/dC5yb3RhdGlvbj10aGlzLm1pblN0YXJ0Um90YXRpb24rdGhpcy5yb3RhdGlvbjp0LnJvdGF0aW9uPU1hdGgucmFuZG9tKCkqKHRoaXMubWF4U3RhcnRSb3RhdGlvbi10aGlzLm1pblN0YXJ0Um90YXRpb24pK3RoaXMubWluU3RhcnRSb3RhdGlvbit0aGlzLnJvdGF0aW9uLGEubWluUmFkaXVzPT1hLnJhZGl1cz9sLng9TWF0aC5yYW5kb20oKSooYS5yYWRpdXMtYS5taW5SYWRpdXMpK2EubWluUmFkaXVzOmwueD1hLnJhZGl1cyxsLnk9MDt2YXIgcj0zNjAqTWF0aC5yYW5kb20oKTt0LnJvdGF0aW9uKz1yLHMucm90YXRlUG9pbnQocixsKSxsLngrPXRoaXMuc3Bhd25DaXJjbGUueCxsLnkrPXRoaXMuc3Bhd25DaXJjbGUueSwwIT09dGhpcy5yb3RhdGlvbiYmcy5yb3RhdGVQb2ludCh0aGlzLnJvdGF0aW9uLGwpLHQucG9zaXRpb24ueD1pK2wueCx0LnBvc2l0aW9uLnk9ZStsLnl9LGguX3NwYXduQnVyc3Q9ZnVuY3Rpb24odCxpLGUscyl7MD09PXRoaXMucGFydGljbGVTcGFjaW5nP3Qucm90YXRpb249MzYwKk1hdGgucmFuZG9tKCk6dC5yb3RhdGlvbj10aGlzLmFuZ2xlU3RhcnQrdGhpcy5wYXJ0aWNsZVNwYWNpbmcqcyt0aGlzLnJvdGF0aW9uLHQucG9zaXRpb24ueD1pLHQucG9zaXRpb24ueT1lfSxoLmNsZWFudXA9ZnVuY3Rpb24oKXt2YXIgdCxpO2Zvcih0PXRoaXMuX2FjdGl2ZVBhcnRpY2xlc0ZpcnN0O3Q7dD1pKWk9dC5uZXh0LHRoaXMucmVjeWNsZSh0KSx0LnBhcmVudCYmdC5wYXJlbnQucmVtb3ZlQ2hpbGQodCk7dGhpcy5fYWN0aXZlUGFydGljbGVzRmlyc3Q9dGhpcy5fYWN0aXZlUGFydGljbGVzTGFzdD1udWxsLHRoaXMucGFydGljbGVDb3VudD0wfSxoLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmF1dG9VcGRhdGU9ITEsdGhpcy5jbGVhbnVwKCk7Zm9yKHZhciB0LGk9dGhpcy5fcG9vbEZpcnN0O2k7aT10KXQ9aS5uZXh0LGkuZGVzdHJveSgpO3RoaXMuX3Bvb2xGaXJzdD10aGlzLl9wYXJlbnQ9dGhpcy5wYXJ0aWNsZUltYWdlcz10aGlzLnNwYXduUG9zPXRoaXMub3duZXJQb3M9dGhpcy5zdGFydENvbG9yPXRoaXMuZW5kQ29sb3I9dGhpcy5jdXN0b21FYXNlPXRoaXMuX2NvbXBsZXRlQ2FsbGJhY2s9bnVsbH0saS5leHBvcnRzPW99LHtcIi4vUGFydGljbGVcIjozLFwiLi9QYXJ0aWNsZVV0aWxzXCI6NH1dLDM6W2Z1bmN0aW9uKHQsaSxlKXt2YXIgcz10KFwiLi9QYXJ0aWNsZVV0aWxzXCIpLGE9UElYSS5TcHJpdGUscj1mdW5jdGlvbih0KXthLmNhbGwodGhpcyksdGhpcy5lbWl0dGVyPXQsdGhpcy5hbmNob3IueD10aGlzLmFuY2hvci55PS41LHRoaXMudmVsb2NpdHk9bmV3IFBJWEkuUG9pbnQsdGhpcy5tYXhMaWZlPTAsdGhpcy5hZ2U9MCx0aGlzLmVhc2U9bnVsbCx0aGlzLmV4dHJhRGF0YT1udWxsLHRoaXMuc3RhcnRBbHBoYT0wLHRoaXMuZW5kQWxwaGE9MCx0aGlzLnN0YXJ0U3BlZWQ9MCx0aGlzLmVuZFNwZWVkPTAsdGhpcy5hY2NlbGVyYXRpb249bmV3IFBJWEkuUG9pbnQsdGhpcy5tYXhTcGVlZD1OYU4sdGhpcy5zdGFydFNjYWxlPTAsdGhpcy5lbmRTY2FsZT0wLHRoaXMuc3RhcnRDb2xvcj1udWxsLHRoaXMuX3NSPTAsdGhpcy5fc0c9MCx0aGlzLl9zQj0wLHRoaXMuZW5kQ29sb3I9bnVsbCx0aGlzLl9lUj0wLHRoaXMuX2VHPTAsdGhpcy5fZUI9MCx0aGlzLl9kb0FscGhhPSExLHRoaXMuX2RvU2NhbGU9ITEsdGhpcy5fZG9TcGVlZD0hMSx0aGlzLl9kb0FjY2VsZXJhdGlvbj0hMSx0aGlzLl9kb0NvbG9yPSExLHRoaXMuX2RvTm9ybWFsTW92ZW1lbnQ9ITEsdGhpcy5fb25lT3ZlckxpZmU9MCx0aGlzLm5leHQ9bnVsbCx0aGlzLnByZXY9bnVsbCx0aGlzLmluaXQ9dGhpcy5pbml0LHRoaXMuUGFydGljbGVfaW5pdD10aGlzLlBhcnRpY2xlX2luaXQsdGhpcy51cGRhdGU9dGhpcy51cGRhdGUsdGhpcy5QYXJ0aWNsZV91cGRhdGU9dGhpcy5QYXJ0aWNsZV91cGRhdGUsdGhpcy5hcHBseUFydD10aGlzLmFwcGx5QXJ0LHRoaXMua2lsbD10aGlzLmtpbGx9LG49ci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShhLnByb3RvdHlwZSk7bi5pbml0PW4uUGFydGljbGVfaW5pdD1mdW5jdGlvbigpe3RoaXMuYWdlPTAsdGhpcy52ZWxvY2l0eS54PXRoaXMuc3RhcnRTcGVlZCx0aGlzLnZlbG9jaXR5Lnk9MCxzLnJvdGF0ZVBvaW50KHRoaXMucm90YXRpb24sdGhpcy52ZWxvY2l0eSksdGhpcy5ub1JvdGF0aW9uP3RoaXMucm90YXRpb249MDp0aGlzLnJvdGF0aW9uKj1zLkRFR19UT19SQURTLHRoaXMucm90YXRpb25TcGVlZCo9cy5ERUdfVE9fUkFEUyx0aGlzLmFscGhhPXRoaXMuc3RhcnRBbHBoYSx0aGlzLnNjYWxlLng9dGhpcy5zY2FsZS55PXRoaXMuc3RhcnRTY2FsZSx0aGlzLnN0YXJ0Q29sb3ImJih0aGlzLl9zUj10aGlzLnN0YXJ0Q29sb3JbMF0sdGhpcy5fc0c9dGhpcy5zdGFydENvbG9yWzFdLHRoaXMuX3NCPXRoaXMuc3RhcnRDb2xvclsyXSx0aGlzLmVuZENvbG9yJiYodGhpcy5fZVI9dGhpcy5lbmRDb2xvclswXSx0aGlzLl9lRz10aGlzLmVuZENvbG9yWzFdLHRoaXMuX2VCPXRoaXMuZW5kQ29sb3JbMl0pKSx0aGlzLl9kb0FscGhhPXRoaXMuc3RhcnRBbHBoYSE9dGhpcy5lbmRBbHBoYSx0aGlzLl9kb1NwZWVkPXRoaXMuc3RhcnRTcGVlZCE9dGhpcy5lbmRTcGVlZCx0aGlzLl9kb1NjYWxlPXRoaXMuc3RhcnRTY2FsZSE9dGhpcy5lbmRTY2FsZSx0aGlzLl9kb0NvbG9yPSEhdGhpcy5lbmRDb2xvcix0aGlzLl9kb0FjY2VsZXJhdGlvbj0wIT09dGhpcy5hY2NlbGVyYXRpb24ueHx8MCE9PXRoaXMuYWNjZWxlcmF0aW9uLnksdGhpcy5fZG9Ob3JtYWxNb3ZlbWVudD10aGlzLl9kb1NwZWVkfHwwIT09dGhpcy5zdGFydFNwZWVkfHx0aGlzLl9kb0FjY2VsZXJhdGlvbix0aGlzLl9vbmVPdmVyTGlmZT0xL3RoaXMubWF4TGlmZSx0aGlzLnRpbnQ9cy5jb21iaW5lUkdCQ29tcG9uZW50cyh0aGlzLl9zUix0aGlzLl9zRyx0aGlzLl9zQiksdGhpcy52aXNpYmxlPSEwfSxuLmFwcGx5QXJ0PWZ1bmN0aW9uKHQpe3RoaXMudGV4dHVyZT10fHxzLkVNUFRZX1RFWFRVUkV9LG4udXBkYXRlPW4uUGFydGljbGVfdXBkYXRlPWZ1bmN0aW9uKHQpe2lmKHRoaXMuYWdlKz10LHRoaXMuYWdlPj10aGlzLm1heExpZmUpcmV0dXJuIHRoaXMua2lsbCgpLC0xO3ZhciBpPXRoaXMuYWdlKnRoaXMuX29uZU92ZXJMaWZlO2lmKHRoaXMuZWFzZSYmKGk9ND09dGhpcy5lYXNlLmxlbmd0aD90aGlzLmVhc2UoaSwwLDEsMSk6dGhpcy5lYXNlKGkpKSx0aGlzLl9kb0FscGhhJiYodGhpcy5hbHBoYT0odGhpcy5lbmRBbHBoYS10aGlzLnN0YXJ0QWxwaGEpKmkrdGhpcy5zdGFydEFscGhhKSx0aGlzLl9kb1NjYWxlKXt2YXIgZT0odGhpcy5lbmRTY2FsZS10aGlzLnN0YXJ0U2NhbGUpKmkrdGhpcy5zdGFydFNjYWxlO3RoaXMuc2NhbGUueD10aGlzLnNjYWxlLnk9ZX1pZih0aGlzLl9kb05vcm1hbE1vdmVtZW50KXtpZih0aGlzLl9kb1NwZWVkKXt2YXIgYT0odGhpcy5lbmRTcGVlZC10aGlzLnN0YXJ0U3BlZWQpKmkrdGhpcy5zdGFydFNwZWVkO3Mubm9ybWFsaXplKHRoaXMudmVsb2NpdHkpLHMuc2NhbGVCeSh0aGlzLnZlbG9jaXR5LGEpfWVsc2UgaWYodGhpcy5fZG9BY2NlbGVyYXRpb24mJih0aGlzLnZlbG9jaXR5LngrPXRoaXMuYWNjZWxlcmF0aW9uLngqdCx0aGlzLnZlbG9jaXR5LnkrPXRoaXMuYWNjZWxlcmF0aW9uLnkqdCx0aGlzLm1heFNwZWVkKSl7dmFyIHI9cy5sZW5ndGgodGhpcy52ZWxvY2l0eSk7cj50aGlzLm1heFNwZWVkJiZzLnNjYWxlQnkodGhpcy52ZWxvY2l0eSx0aGlzLm1heFNwZWVkL3IpfXRoaXMucG9zaXRpb24ueCs9dGhpcy52ZWxvY2l0eS54KnQsdGhpcy5wb3NpdGlvbi55Kz10aGlzLnZlbG9jaXR5LnkqdH1pZih0aGlzLl9kb0NvbG9yKXt2YXIgbj0odGhpcy5fZVItdGhpcy5fc1IpKmkrdGhpcy5fc1Isbz0odGhpcy5fZUctdGhpcy5fc0cpKmkrdGhpcy5fc0csaD0odGhpcy5fZUItdGhpcy5fc0IpKmkrdGhpcy5fc0I7dGhpcy50aW50PXMuY29tYmluZVJHQkNvbXBvbmVudHMobixvLGgpfXJldHVybiAwIT09dGhpcy5yb3RhdGlvblNwZWVkP3RoaXMucm90YXRpb24rPXRoaXMucm90YXRpb25TcGVlZCp0OnRoaXMuYWNjZWxlcmF0aW9uJiYhdGhpcy5ub1JvdGF0aW9uJiYodGhpcy5yb3RhdGlvbj1NYXRoLmF0YW4yKHRoaXMudmVsb2NpdHkueSx0aGlzLnZlbG9jaXR5LngpKSxpfSxuLmtpbGw9ZnVuY3Rpb24oKXt0aGlzLmVtaXR0ZXIucmVjeWNsZSh0aGlzKX0sbi5TcHJpdGVfRGVzdHJveT1hLnByb3RvdHlwZS5kZXN0cm95LG4uZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucGFyZW50JiZ0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKSx0aGlzLlNwcml0ZV9EZXN0cm95JiZ0aGlzLlNwcml0ZV9EZXN0cm95KCksdGhpcy5lbWl0dGVyPXRoaXMudmVsb2NpdHk9dGhpcy5zdGFydENvbG9yPXRoaXMuZW5kQ29sb3I9dGhpcy5lYXNlPXRoaXMubmV4dD10aGlzLnByZXY9bnVsbH0sci5wYXJzZUFydD1mdW5jdGlvbih0KXt2YXIgaTtmb3IoaT10Lmxlbmd0aDtpPj0wOy0taSlcInN0cmluZ1wiPT10eXBlb2YgdFtpXSYmKHRbaV09UElYSS5UZXh0dXJlLmZyb21JbWFnZSh0W2ldKSk7aWYocy52ZXJib3NlKWZvcihpPXQubGVuZ3RoLTE7aT4wOy0taSlpZih0W2ldLmJhc2VUZXh0dXJlIT10W2ktMV0uYmFzZVRleHR1cmUpe3dpbmRvdy5jb25zb2xlJiZjb25zb2xlLndhcm4oXCJQaXhpUGFydGljbGVzOiB1c2luZyBwYXJ0aWNsZSB0ZXh0dXJlcyBmcm9tIGRpZmZlcmVudCBpbWFnZXMgbWF5IGhpbmRlciBwZXJmb3JtYW5jZSBpbiBXZWJHTFwiKTticmVha31yZXR1cm4gdH0sci5wYXJzZURhdGE9ZnVuY3Rpb24odCl7cmV0dXJuIHR9LGkuZXhwb3J0cz1yfSx7XCIuL1BhcnRpY2xlVXRpbHNcIjo0fV0sNDpbZnVuY3Rpb24odCxpLGUpe1widXNlIHN0cmljdFwiO3ZhciBzPVBJWEkuQkxFTkRfTU9ERVN8fFBJWEkuYmxlbmRNb2RlcyxhPVBJWEkuVGV4dHVyZSxyPXt9O3IudmVyYm9zZT0hMTt2YXIgbj1yLkRFR19UT19SQURTPU1hdGguUEkvMTgwLG89ci5FTVBUWV9URVhUVVJFPWEuRU1QVFk7by5vbj1vLmRlc3Ryb3k9by5vbmNlPW8uZW1pdD1mdW5jdGlvbigpe30sci5yb3RhdGVQb2ludD1mdW5jdGlvbih0LGkpe2lmKHQpe3QqPW47dmFyIGU9TWF0aC5zaW4odCkscz1NYXRoLmNvcyh0KSxhPWkueCpzLWkueSplLHI9aS54KmUraS55KnM7aS54PWEsaS55PXJ9fSxyLmNvbWJpbmVSR0JDb21wb25lbnRzPWZ1bmN0aW9uKHQsaSxlKXtyZXR1cm4gdDw8MTZ8aTw8OHxlfSxyLm5vcm1hbGl6ZT1mdW5jdGlvbih0KXt2YXIgaT0xL3IubGVuZ3RoKHQpO3QueCo9aSx0LnkqPWl9LHIuc2NhbGVCeT1mdW5jdGlvbih0LGkpe3QueCo9aSx0LnkqPWl9LHIubGVuZ3RoPWZ1bmN0aW9uKHQpe3JldHVybiBNYXRoLnNxcnQodC54KnQueCt0LnkqdC55KX0sci5oZXhUb1JHQj1mdW5jdGlvbih0LGkpe2k/aS5sZW5ndGg9MDppPVtdLFwiI1wiPT10LmNoYXJBdCgwKT90PXQuc3Vic3RyKDEpOjA9PT10LmluZGV4T2YoXCIweFwiKSYmKHQ9dC5zdWJzdHIoMikpO3ZhciBlO3JldHVybiA4PT10Lmxlbmd0aCYmKGU9dC5zdWJzdHIoMCwyKSx0PXQuc3Vic3RyKDIpKSxpLnB1c2gocGFyc2VJbnQodC5zdWJzdHIoMCwyKSwxNikpLGkucHVzaChwYXJzZUludCh0LnN1YnN0cigyLDIpLDE2KSksaS5wdXNoKHBhcnNlSW50KHQuc3Vic3RyKDQsMiksMTYpKSxlJiZpLnB1c2gocGFyc2VJbnQoZSwxNikpLGl9LHIuZ2VuZXJhdGVFYXNlPWZ1bmN0aW9uKHQpe3ZhciBpPXQubGVuZ3RoLGU9MS9pLHM9ZnVuY3Rpb24ocyl7dmFyIGEscixuPWkqc3wwO3JldHVybiBhPShzLW4qZSkqaSxyPXRbbl18fHRbaS0xXSxyLnMrYSooMiooMS1hKSooci5jcC1yLnMpK2EqKHIuZS1yLnMpKX07cmV0dXJuIHN9LHIuZ2V0QmxlbmRNb2RlPWZ1bmN0aW9uKHQpe2lmKCF0KXJldHVybiBzLk5PUk1BTDtmb3IodD10LnRvVXBwZXJDYXNlKCk7dC5pbmRleE9mKFwiIFwiKT49MDspdD10LnJlcGxhY2UoXCIgXCIsXCJfXCIpO3JldHVybiBzW3RdfHxzLk5PUk1BTH0saS5leHBvcnRzPXJ9LHt9XSw1OltmdW5jdGlvbih0LGksZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHM9dChcIi4vUGFydGljbGVVdGlsc1wiKSxhPXQoXCIuL1BhcnRpY2xlXCIpLHI9ZnVuY3Rpb24odCl7YS5jYWxsKHRoaXMsdCksdGhpcy5wYXRoPW51bGwsdGhpcy5pbml0aWFsUm90YXRpb249MCx0aGlzLmluaXRpYWxQb3NpdGlvbj1uZXcgUElYSS5Qb2ludCx0aGlzLm1vdmVtZW50PTB9LG49YS5wcm90b3R5cGUsbz1yLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG4pLGg9bmV3IFBJWEkuUG9pbnQ7by5pbml0PWZ1bmN0aW9uKCl7dGhpcy5pbml0aWFsUm90YXRpb249dGhpcy5yb3RhdGlvbix0aGlzLlBhcnRpY2xlX2luaXQoKSx0aGlzLnBhdGg9dGhpcy5leHRyYURhdGEucGF0aCx0aGlzLl9kb05vcm1hbE1vdmVtZW50PSF0aGlzLnBhdGgsdGhpcy5tb3ZlbWVudD0wLHRoaXMuaW5pdGlhbFBvc2l0aW9uLng9dGhpcy5wb3NpdGlvbi54LHRoaXMuaW5pdGlhbFBvc2l0aW9uLnk9dGhpcy5wb3NpdGlvbi55fTtmb3IodmFyIGw9W1wicG93XCIsXCJzcXJ0XCIsXCJhYnNcIixcImZsb29yXCIsXCJyb3VuZFwiLFwiY2VpbFwiLFwiRVwiLFwiUElcIixcInNpblwiLFwiY29zXCIsXCJ0YW5cIixcImFzaW5cIixcImFjb3NcIixcImF0YW5cIixcImF0YW4yXCIsXCJsb2dcIl0scD1cIlswMTIzNDU2Nzg5MFxcXFwuXFxcXCpcXFxcLVxcXFwrXFxcXC9cXFxcKFxcXFwpeCAsXVwiLGM9bC5sZW5ndGgtMTtjPj0wOy0tYylwKz1cInxcIitsW2NdO3A9bmV3IFJlZ0V4cChwLFwiZ1wiKTt2YXIgZD1mdW5jdGlvbih0KXtmb3IodmFyIGk9dC5tYXRjaChwKSxlPWkubGVuZ3RoLTE7ZT49MDstLWUpbC5pbmRleE9mKGlbZV0pPj0wJiYoaVtlXT1cIk1hdGguXCIraVtlXSk7cmV0dXJuIHQ9aS5qb2luKFwiXCIpLG5ldyBGdW5jdGlvbihcInhcIixcInJldHVybiBcIit0K1wiO1wiKX07by51cGRhdGU9ZnVuY3Rpb24odCl7dmFyIGk9dGhpcy5QYXJ0aWNsZV91cGRhdGUodCk7aWYoaT49MCYmdGhpcy5wYXRoKXt2YXIgZT0odGhpcy5lbmRTcGVlZC10aGlzLnN0YXJ0U3BlZWQpKmkrdGhpcy5zdGFydFNwZWVkO3RoaXMubW92ZW1lbnQrPWUqdCxoLng9dGhpcy5tb3ZlbWVudCxoLnk9dGhpcy5wYXRoKHRoaXMubW92ZW1lbnQpLHMucm90YXRlUG9pbnQodGhpcy5pbml0aWFsUm90YXRpb24saCksdGhpcy5wb3NpdGlvbi54PXRoaXMuaW5pdGlhbFBvc2l0aW9uLngraC54LHRoaXMucG9zaXRpb24ueT10aGlzLmluaXRpYWxQb3NpdGlvbi55K2gueX19LG8uUGFydGljbGVfZGVzdHJveT1hLnByb3RvdHlwZS5kZXN0cm95LG8uZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuUGFydGljbGVfZGVzdHJveSgpLHRoaXMucGF0aD10aGlzLmluaXRpYWxQb3NpdGlvbj1udWxsfSxyLnBhcnNlQXJ0PWZ1bmN0aW9uKHQpe3JldHVybiBhLnBhcnNlQXJ0KHQpfSxyLnBhcnNlRGF0YT1mdW5jdGlvbih0KXt2YXIgaT17fTtpZih0JiZ0LnBhdGgpdHJ5e2kucGF0aD1kKHQucGF0aCl9Y2F0Y2godCl7cy52ZXJib3NlJiZjb25zb2xlLmVycm9yKFwiUGF0aFBhcnRpY2xlOiBlcnJvciBpbiBwYXJzaW5nIHBhdGggZXhwcmVzc2lvblwiKSxpLnBhdGg9bnVsbH1lbHNlIHMudmVyYm9zZSYmY29uc29sZS5lcnJvcihcIlBhdGhQYXJ0aWNsZSByZXF1aXJlcyBhIHBhdGggc3RyaW5nIGluIGV4dHJhRGF0YSFcIiksaS5wYXRoPW51bGw7cmV0dXJuIGl9LGkuZXhwb3J0cz1yfSx7XCIuL1BhcnRpY2xlXCI6MyxcIi4vUGFydGljbGVVdGlsc1wiOjR9XSw2OltmdW5jdGlvbih0LGksZSl7fSx7fV0sNzpbZnVuY3Rpb24odCxpLGUpe2UuUGFydGljbGVVdGlscz10KFwiLi9QYXJ0aWNsZVV0aWxzLmpzXCIpLGUuUGFydGljbGU9dChcIi4vUGFydGljbGUuanNcIiksZS5FbWl0dGVyPXQoXCIuL0VtaXR0ZXIuanNcIiksZS5QYXRoUGFydGljbGU9dChcIi4vUGF0aFBhcnRpY2xlLmpzXCIpLGUuQW5pbWF0ZWRQYXJ0aWNsZT10KFwiLi9BbmltYXRlZFBhcnRpY2xlLmpzXCIpLHQoXCIuL2RlcHJlY2F0aW9uLmpzXCIpfSx7XCIuL0FuaW1hdGVkUGFydGljbGUuanNcIjoxLFwiLi9FbWl0dGVyLmpzXCI6MixcIi4vUGFydGljbGUuanNcIjozLFwiLi9QYXJ0aWNsZVV0aWxzLmpzXCI6NCxcIi4vUGF0aFBhcnRpY2xlLmpzXCI6NSxcIi4vZGVwcmVjYXRpb24uanNcIjo2fV0sODpbZnVuY3Rpb24odCxpLGUpe1widXNlIHN0cmljdFwiO3ZhciBzPVwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OkdMT0JBTDtpZihzLlBJWEkucGFydGljbGVzfHwocy5QSVhJLnBhcnRpY2xlcz17fSksXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGkmJmkuZXhwb3J0cylcInVuZGVmaW5lZFwiPT10eXBlb2YgUElYSSYmdChcInBpeGkuanNcIiksaS5leHBvcnRzPXMuUElYSS5wYXJ0aWNsZXN8fGE7ZWxzZSBpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgUElYSSl0aHJvd1wicGl4aS1wYXJ0aWNsZXMgcmVxdWlyZXMgcGl4aS5qcyB0byBiZSBsb2FkZWQgZmlyc3RcIjt2YXIgYT10KFwiLi9wYXJ0aWNsZXNcIik7Zm9yKHZhciByIGluIGEpcy5QSVhJLnBhcnRpY2xlc1tyXT1hW3JdfSx7XCIuL3BhcnRpY2xlc1wiOjcsXCJwaXhpLmpzXCI6dm9pZCAwfV19LHt9LFs4XSkoOCl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpeGktcGFydGljbGVzLm1pbi5qcy5tYXBcbiIsInZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgdXRpbHM7XHJcbiAgICAoZnVuY3Rpb24gKHV0aWxzKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlSW5kaWNlc0ZvclF1YWRzKHNpemUpIHtcclxuICAgICAgICAgICAgdmFyIHRvdGFsSW5kaWNlcyA9IHNpemUgKiA2O1xyXG4gICAgICAgICAgICB2YXIgaW5kaWNlcyA9IG5ldyBVaW50MTZBcnJheSh0b3RhbEluZGljZXMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IDA7IGkgPCB0b3RhbEluZGljZXM7IGkgKz0gNiwgaiArPSA0KSB7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyAwXSA9IGogKyAwO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgMV0gPSBqICsgMTtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDJdID0gaiArIDI7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyAzXSA9IGogKyAwO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgNF0gPSBqICsgMjtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDVdID0gaiArIDM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGluZGljZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmNyZWF0ZUluZGljZXNGb3JRdWFkcyA9IGNyZWF0ZUluZGljZXNGb3JRdWFkcztcclxuICAgICAgICBmdW5jdGlvbiBpc1BvdzIodikge1xyXG4gICAgICAgICAgICByZXR1cm4gISh2ICYgKHYgLSAxKSkgJiYgKCEhdik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmlzUG93MiA9IGlzUG93MjtcclxuICAgICAgICBmdW5jdGlvbiBuZXh0UG93Mih2KSB7XHJcbiAgICAgICAgICAgIHYgKz0gKyh2ID09PSAwKTtcclxuICAgICAgICAgICAgLS12O1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDE7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gMjtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiA0O1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDg7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gMTY7XHJcbiAgICAgICAgICAgIHJldHVybiB2ICsgMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMubmV4dFBvdzIgPSBuZXh0UG93MjtcclxuICAgICAgICBmdW5jdGlvbiBsb2cyKHYpIHtcclxuICAgICAgICAgICAgdmFyIHIsIHNoaWZ0O1xyXG4gICAgICAgICAgICByID0gKyh2ID4gMHhGRkZGKSA8PCA0O1xyXG4gICAgICAgICAgICB2ID4+Pj0gcjtcclxuICAgICAgICAgICAgc2hpZnQgPSArKHYgPiAweEZGKSA8PCAzO1xyXG4gICAgICAgICAgICB2ID4+Pj0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHIgfD0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHNoaWZ0ID0gKyh2ID4gMHhGKSA8PCAyO1xyXG4gICAgICAgICAgICB2ID4+Pj0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHIgfD0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHNoaWZ0ID0gKyh2ID4gMHgzKSA8PCAxO1xyXG4gICAgICAgICAgICB2ID4+Pj0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHIgfD0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHJldHVybiByIHwgKHYgPj4gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmxvZzIgPSBsb2cyO1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldEludGVyc2VjdGlvbkZhY3RvcihwMSwgcDIsIHAzLCBwNCwgb3V0KSB7XHJcbiAgICAgICAgICAgIHZhciBBMSA9IHAyLnggLSBwMS54LCBCMSA9IHAzLnggLSBwNC54LCBDMSA9IHAzLnggLSBwMS54O1xyXG4gICAgICAgICAgICB2YXIgQTIgPSBwMi55IC0gcDEueSwgQjIgPSBwMy55IC0gcDQueSwgQzIgPSBwMy55IC0gcDEueTtcclxuICAgICAgICAgICAgdmFyIEQgPSBBMSAqIEIyIC0gQTIgKiBCMTtcclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKEQpIDwgMWUtNykge1xyXG4gICAgICAgICAgICAgICAgb3V0LnggPSBBMTtcclxuICAgICAgICAgICAgICAgIG91dC55ID0gQTI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgVCA9IEMxICogQjIgLSBDMiAqIEIxO1xyXG4gICAgICAgICAgICB2YXIgVSA9IEExICogQzIgLSBBMiAqIEMxO1xyXG4gICAgICAgICAgICB2YXIgdCA9IFQgLyBELCB1ID0gVSAvIEQ7XHJcbiAgICAgICAgICAgIGlmICh1IDwgKDFlLTYpIHx8IHUgLSAxID4gLTFlLTYpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXQueCA9IHAxLnggKyB0ICogKHAyLnggLSBwMS54KTtcclxuICAgICAgICAgICAgb3V0LnkgPSBwMS55ICsgdCAqIChwMi55IC0gcDEueSk7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5nZXRJbnRlcnNlY3Rpb25GYWN0b3IgPSBnZXRJbnRlcnNlY3Rpb25GYWN0b3I7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UG9zaXRpb25Gcm9tUXVhZChwLCBhbmNob3IsIG91dCkge1xyXG4gICAgICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGExID0gMS4wIC0gYW5jaG9yLngsIGEyID0gMS4wIC0gYTE7XHJcbiAgICAgICAgICAgIHZhciBiMSA9IDEuMCAtIGFuY2hvci55LCBiMiA9IDEuMCAtIGIxO1xyXG4gICAgICAgICAgICBvdXQueCA9IChwWzBdLnggKiBhMSArIHBbMV0ueCAqIGEyKSAqIGIxICsgKHBbM10ueCAqIGExICsgcFsyXS54ICogYTIpICogYjI7XHJcbiAgICAgICAgICAgIG91dC55ID0gKHBbMF0ueSAqIGExICsgcFsxXS55ICogYTIpICogYjEgKyAocFszXS55ICogYTEgKyBwWzJdLnkgKiBhMikgKiBiMjtcclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMuZ2V0UG9zaXRpb25Gcm9tUXVhZCA9IGdldFBvc2l0aW9uRnJvbVF1YWQ7XHJcbiAgICB9KSh1dGlscyA9IHBpeGlfcHJvamVjdGlvbi51dGlscyB8fCAocGl4aV9wcm9qZWN0aW9uLnV0aWxzID0ge30pKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG5QSVhJLnByb2plY3Rpb24gPSBwaXhpX3Byb2plY3Rpb247XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgUHJvamVjdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gUHJvamVjdGlvbihsZWdhY3ksIGVuYWJsZSkge1xyXG4gICAgICAgICAgICBpZiAoZW5hYmxlID09PSB2b2lkIDApIHsgZW5hYmxlID0gdHJ1ZTsgfVxyXG4gICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubGVnYWN5ID0gbGVnYWN5O1xyXG4gICAgICAgICAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubGVnYWN5LnByb2ogPSB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvbi5wcm90b3R5cGUsIFwiZW5hYmxlZFwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFByb2plY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3Rpb247XHJcbiAgICB9KCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24gPSBQcm9qZWN0aW9uO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgd2ViZ2w7XHJcbiAgICAoZnVuY3Rpb24gKHdlYmdsKSB7XHJcbiAgICAgICAgdmFyIEJhdGNoQnVmZmVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gQmF0Y2hCdWZmZXIoc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IG5ldyBBcnJheUJ1ZmZlcihzaXplKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvYXQzMlZpZXcgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMudmVydGljZXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51aW50MzJWaWV3ID0gbmV3IFVpbnQzMkFycmF5KHRoaXMudmVydGljZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEJhdGNoQnVmZmVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IG51bGw7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBCYXRjaEJ1ZmZlcjtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIHdlYmdsLkJhdGNoQnVmZmVyID0gQmF0Y2hCdWZmZXI7XHJcbiAgICB9KSh3ZWJnbCA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbCB8fCAocGl4aV9wcm9qZWN0aW9uLndlYmdsID0ge30pKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHdlYmdsO1xyXG4gICAgKGZ1bmN0aW9uICh3ZWJnbCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlTXVsdGlUZXh0dXJlU2hhZGVyKHZlcnRleFNyYywgZnJhZ21lbnRTcmMsIGdsLCBtYXhUZXh0dXJlcykge1xyXG4gICAgICAgICAgICBmcmFnbWVudFNyYyA9IGZyYWdtZW50U3JjLnJlcGxhY2UoLyVjb3VudCUvZ2ksIG1heFRleHR1cmVzICsgJycpO1xyXG4gICAgICAgICAgICBmcmFnbWVudFNyYyA9IGZyYWdtZW50U3JjLnJlcGxhY2UoLyVmb3Jsb29wJS9naSwgZ2VuZXJhdGVTYW1wbGVTcmMobWF4VGV4dHVyZXMpKTtcclxuICAgICAgICAgICAgdmFyIHNoYWRlciA9IG5ldyBQSVhJLlNoYWRlcihnbCwgdmVydGV4U3JjLCBmcmFnbWVudFNyYyk7XHJcbiAgICAgICAgICAgIHZhciBzYW1wbGVWYWx1ZXMgPSBuZXcgSW50MzJBcnJheShtYXhUZXh0dXJlcyk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4VGV4dHVyZXM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgc2FtcGxlVmFsdWVzW2ldID0gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzaGFkZXIuYmluZCgpO1xyXG4gICAgICAgICAgICBzaGFkZXIudW5pZm9ybXMudVNhbXBsZXJzID0gc2FtcGxlVmFsdWVzO1xyXG4gICAgICAgICAgICByZXR1cm4gc2hhZGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3ZWJnbC5nZW5lcmF0ZU11bHRpVGV4dHVyZVNoYWRlciA9IGdlbmVyYXRlTXVsdGlUZXh0dXJlU2hhZGVyO1xyXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2FtcGxlU3JjKG1heFRleHR1cmVzKSB7XHJcbiAgICAgICAgICAgIHZhciBzcmMgPSAnJztcclxuICAgICAgICAgICAgc3JjICs9ICdcXG4nO1xyXG4gICAgICAgICAgICBzcmMgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4VGV4dHVyZXM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjICs9ICdcXG5lbHNlICc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IG1heFRleHR1cmVzIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYyArPSBcImlmKHRleHR1cmVJZCA9PSBcIiArIGkgKyBcIi4wKVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3JjICs9ICdcXG57JztcclxuICAgICAgICAgICAgICAgIHNyYyArPSBcIlxcblxcdGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyc1tcIiArIGkgKyBcIl0sIHRleHR1cmVDb29yZCk7XCI7XHJcbiAgICAgICAgICAgICAgICBzcmMgKz0gJ1xcbn0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNyYyArPSAnXFxuJztcclxuICAgICAgICAgICAgc3JjICs9ICdcXG4nO1xyXG4gICAgICAgICAgICByZXR1cm4gc3JjO1xyXG4gICAgICAgIH1cclxuICAgIH0pKHdlYmdsID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsIHx8IChwaXhpX3Byb2plY3Rpb24ud2ViZ2wgPSB7fSkpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHdlYmdsO1xyXG4gICAgKGZ1bmN0aW9uICh3ZWJnbCkge1xyXG4gICAgICAgIHZhciBPYmplY3RSZW5kZXJlciA9IFBJWEkuT2JqZWN0UmVuZGVyZXI7XHJcbiAgICAgICAgdmFyIHNldHRpbmdzID0gUElYSS5zZXR0aW5ncztcclxuICAgICAgICB2YXIgR0xCdWZmZXIgPSBQSVhJLmdsQ29yZS5HTEJ1ZmZlcjtcclxuICAgICAgICB2YXIgcHJlbXVsdGlwbHlUaW50ID0gUElYSS51dGlscy5wcmVtdWx0aXBseVRpbnQ7XHJcbiAgICAgICAgdmFyIHByZW11bHRpcGx5QmxlbmRNb2RlID0gUElYSS51dGlscy5wcmVtdWx0aXBseUJsZW5kTW9kZTtcclxuICAgICAgICB2YXIgVElDSyA9IDA7XHJcbiAgICAgICAgdmFyIEJhdGNoR3JvdXAgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBCYXRjaEdyb3VwKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pZHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmxlbmQgPSBQSVhJLkJMRU5EX01PREVTLk5PUk1BTDtcclxuICAgICAgICAgICAgICAgIHRoaXMudW5pZm9ybXMgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBCYXRjaEdyb3VwO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgd2ViZ2wuQmF0Y2hHcm91cCA9IEJhdGNoR3JvdXA7XHJcbiAgICAgICAgdmFyIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgX19leHRlbmRzKE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcihyZW5kZXJlcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgcmVuZGVyZXIpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zaGFkZXJWZXJ0ID0gJyc7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zaGFkZXJGcmFnID0gJyc7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5NQVhfVEVYVFVSRVNfTE9DQUwgPSAzMjtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRTaXplID0gNTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRCeXRlU2l6ZSA9IF90aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnNpemUgPSBzZXR0aW5ncy5TUFJJVEVfQkFUQ0hfU0laRTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zcHJpdGVzID0gW107XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0ZXhCdWZmZXJzID0gW107XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YW9zID0gW107XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YW9NYXggPSAyO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuTUFYX1RFWFRVUkVTID0gMTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmluZGljZXMgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMuY3JlYXRlSW5kaWNlc0ZvclF1YWRzKF90aGlzLnNpemUpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZ3JvdXBzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IF90aGlzLnNpemU7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmdyb3Vwc1trXSA9IG5ldyBCYXRjaEdyb3VwKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YW9NYXggPSAyO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucmVuZGVyZXIub24oJ3ByZXJlbmRlcicsIF90aGlzLm9uUHJlcmVuZGVyLCBfdGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLmdldFVuaWZvcm1zID0gZnVuY3Rpb24gKHNwcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5zeW5jVW5pZm9ybXMgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9iailcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB2YXIgc2ggPSB0aGlzLnNoYWRlcjtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICBzaC51bmlmb3Jtc1trZXldID0gb2JqW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5vbkNvbnRleHRDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5NQVhfVEVYVFVSRVMgPSBNYXRoLm1pbih0aGlzLk1BWF9URVhUVVJFU19MT0NBTCwgdGhpcy5yZW5kZXJlci5wbHVnaW5zWydzcHJpdGUnXS5NQVhfVEVYVFVSRVMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGFkZXIgPSB3ZWJnbC5nZW5lcmF0ZU11bHRpVGV4dHVyZVNoYWRlcih0aGlzLnNoYWRlclZlcnQsIHRoaXMuc2hhZGVyRnJhZywgZ2wsIHRoaXMuTUFYX1RFWFRVUkVTKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBHTEJ1ZmZlci5jcmVhdGVJbmRleEJ1ZmZlcihnbCwgdGhpcy5pbmRpY2VzLCBnbC5TVEFUSUNfRFJBVyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRWYW8obnVsbCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnZhb01heDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZlcnRleEJ1ZmZlciA9IHRoaXMudmVydGV4QnVmZmVyc1tpXSA9IEdMQnVmZmVyLmNyZWF0ZVZlcnRleEJ1ZmZlcihnbCwgbnVsbCwgZ2wuU1RSRUFNX0RSQVcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFvc1tpXSA9IHRoaXMuY3JlYXRlVmFvKHZlcnRleEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYnVmZmVycykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVycyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IHBpeGlfcHJvamVjdGlvbi51dGlscy5uZXh0UG93Mih0aGlzLnNpemUpOyBpICo9IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJzLnB1c2gobmV3IHdlYmdsLkJhdGNoQnVmZmVyKGkgKiA0ICogdGhpcy52ZXJ0Qnl0ZVNpemUpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbyA9IHRoaXMudmFvc1swXTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLm9uUHJlcmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoc3ByaXRlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50SW5kZXggPj0gdGhpcy5zaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbHVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFzcHJpdGUuX3RleHR1cmUuX3V2cykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghc3ByaXRlLl90ZXh0dXJlLmJhc2VUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVzW3RoaXMuY3VycmVudEluZGV4KytdID0gc3ByaXRlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuZmx1c2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50SW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICAgICAgdmFyIE1BWF9URVhUVVJFUyA9IHRoaXMuTUFYX1RFWFRVUkVTO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5wMiA9IHBpeGlfcHJvamVjdGlvbi51dGlscy5uZXh0UG93Mih0aGlzLmN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbG9nMiA9IHBpeGlfcHJvamVjdGlvbi51dGlscy5sb2cyKG5wMik7XHJcbiAgICAgICAgICAgICAgICB2YXIgYnVmZmVyID0gdGhpcy5idWZmZXJzW2xvZzJdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNwcml0ZXMgPSB0aGlzLnNwcml0ZXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBzID0gdGhpcy5ncm91cHM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmxvYXQzMlZpZXcgPSBidWZmZXIuZmxvYXQzMlZpZXc7XHJcbiAgICAgICAgICAgICAgICB2YXIgdWludDMyVmlldyA9IGJ1ZmZlci51aW50MzJWaWV3O1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0VGV4dHVyZTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VGV4dHVyZTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VW5pZm9ybXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwQ291bnQgPSAxO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudEdyb3VwID0gZ3JvdXBzWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZlcnRleERhdGE7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXZzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJsZW5kTW9kZSA9IHByZW11bHRpcGx5QmxlbmRNb2RlW3Nwcml0ZXNbMF0uX3RleHR1cmUuYmFzZVRleHR1cmUucHJlbXVsdGlwbGllZEFscGhhID8gMSA6IDBdW3Nwcml0ZXNbMF0uYmxlbmRNb2RlXTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC50ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5ibGVuZCA9IGJsZW5kTW9kZTtcclxuICAgICAgICAgICAgICAgIFRJQ0srKztcclxuICAgICAgICAgICAgICAgIHZhciBpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuY3VycmVudEluZGV4OyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3ByaXRlID0gc3ByaXRlc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0VGV4dHVyZSA9IHNwcml0ZS5fdGV4dHVyZS5iYXNlVGV4dHVyZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3ByaXRlQmxlbmRNb2RlID0gcHJlbXVsdGlwbHlCbGVuZE1vZGVbTnVtYmVyKG5leHRUZXh0dXJlLnByZW11bHRpcGxpZWRBbHBoYSldW3Nwcml0ZS5ibGVuZE1vZGVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibGVuZE1vZGUgIT09IHNwcml0ZUJsZW5kTW9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibGVuZE1vZGUgPSBzcHJpdGVCbGVuZE1vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUNvdW50ID0gTUFYX1RFWFRVUkVTO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUSUNLKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB1bmlmb3JtcyA9IHRoaXMuZ2V0VW5pZm9ybXMoc3ByaXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFVuaWZvcm1zICE9PSB1bmlmb3Jtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VW5pZm9ybXMgPSB1bmlmb3JtcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRleHR1cmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlQ291bnQgPSBNQVhfVEVYVFVSRVM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRJQ0srKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUZXh0dXJlICE9PSBuZXh0VGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGV4dHVyZSA9IG5leHRUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFRleHR1cmUuX2VuYWJsZWQgIT09IFRJQ0spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0dXJlQ291bnQgPT09IE1BWF9URVhUVVJFUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRJQ0srKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5zaXplID0gaSAtIGN1cnJlbnRHcm91cC5zdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAgPSBncm91cHNbZ3JvdXBDb3VudCsrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAudGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuYmxlbmQgPSBibGVuZE1vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnN0YXJ0ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAudW5pZm9ybXMgPSBjdXJyZW50VW5pZm9ybXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGV4dHVyZS5fZW5hYmxlZCA9IFRJQ0s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGV4dHVyZS5fdmlydGFsQm91bmRJZCA9IHRleHR1cmVDb3VudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC50ZXh0dXJlc1tjdXJyZW50R3JvdXAudGV4dHVyZUNvdW50KytdID0gbmV4dFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWxwaGEgPSBNYXRoLm1pbihzcHJpdGUud29ybGRBbHBoYSwgMS4wKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXJnYiA9IGFscGhhIDwgMS4wICYmIG5leHRUZXh0dXJlLnByZW11bHRpcGxpZWRBbHBoYSA/IHByZW11bHRpcGx5VGludChzcHJpdGUuX3RpbnRSR0IsIGFscGhhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHNwcml0ZS5fdGludFJHQiArIChhbHBoYSAqIDI1NSA8PCAyNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxsVmVydGljZXMoZmxvYXQzMlZpZXcsIHVpbnQzMlZpZXcsIGluZGV4LCBzcHJpdGUsIGFyZ2IsIG5leHRUZXh0dXJlLl92aXJ0YWxCb3VuZElkKTtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCArPSB0aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5zaXplID0gaSAtIGN1cnJlbnRHcm91cC5zdGFydDtcclxuICAgICAgICAgICAgICAgIGlmICghc2V0dGluZ3MuQ0FOX1VQTE9BRF9TQU1FX0JVRkZFUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhb01heCA8PSB0aGlzLnZlcnRleENvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFvTWF4Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhCdWZmZXIgPSB0aGlzLnZlcnRleEJ1ZmZlcnNbdGhpcy52ZXJ0ZXhDb3VudF0gPSBHTEJ1ZmZlci5jcmVhdGVWZXJ0ZXhCdWZmZXIoZ2wsIG51bGwsIGdsLlNUUkVBTV9EUkFXKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YW9zW3RoaXMudmVydGV4Q291bnRdID0gdGhpcy5jcmVhdGVWYW8odmVydGV4QnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kVmFvKHRoaXMudmFvc1t0aGlzLnZlcnRleENvdW50XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzW3RoaXMudmVydGV4Q291bnRdLnVwbG9hZChidWZmZXIudmVydGljZXMsIDAsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbdGhpcy52ZXJ0ZXhDb3VudF0udXBsb2FkKGJ1ZmZlci52ZXJ0aWNlcywgMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VW5pZm9ybXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGdyb3VwQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBncm91cCA9IGdyb3Vwc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXBUZXh0dXJlQ291bnQgPSBncm91cC50ZXh0dXJlQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwLnVuaWZvcm1zICE9PSBjdXJyZW50VW5pZm9ybXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zeW5jVW5pZm9ybXMoZ3JvdXAudW5pZm9ybXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGdyb3VwVGV4dHVyZUNvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kVGV4dHVyZShncm91cC50ZXh0dXJlc1tqXSwgaiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwLnRleHR1cmVzW2pdLl92aXJ0YWxCb3VuZElkID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gdGhpcy5zaGFkZXIudW5pZm9ybXMuc2FtcGxlclNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2WzBdID0gZ3JvdXAudGV4dHVyZXNbal0ucmVhbFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdlsxXSA9IGdyb3VwLnRleHR1cmVzW2pdLnJlYWxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNoYWRlci51bmlmb3Jtcy5zYW1wbGVyU2l6ZSA9IHY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zdGF0ZS5zZXRCbGVuZE1vZGUoZ3JvdXAuYmxlbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmRyYXdFbGVtZW50cyhnbC5UUklBTkdMRVMsIGdyb3VwLnNpemUgKiA2LCBnbC5VTlNJR05FRF9TSE9SVCwgZ3JvdXAuc3RhcnQgKiA2ICogMik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFNoYWRlcih0aGlzLnNoYWRlcik7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuQ0FOX1VQTE9BRF9TQU1FX0JVRkZFUikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFZhbyh0aGlzLnZhb3NbdGhpcy52ZXJ0ZXhDb3VudF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1t0aGlzLnZlcnRleENvdW50XS5iaW5kKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbHVzaCgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy52YW9NYXg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRleEJ1ZmZlcnNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFvc1tpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhb3NbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluZGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLm9mZigncHJlcmVuZGVyJywgdGhpcy5vblByZXJlbmRlciwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNoYWRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoYWRlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YW9zID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRpY2VzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnVmZmVycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgICAgICB9KE9iamVjdFJlbmRlcmVyKSk7XHJcbiAgICAgICAgd2ViZ2wuTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgIH0pKHdlYmdsID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsIHx8IChwaXhpX3Byb2plY3Rpb24ud2ViZ2wgPSB7fSkpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgcCA9IFtuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpXTtcclxuICAgIHZhciBhID0gWzAsIDAsIDAsIDBdO1xyXG4gICAgdmFyIFN1cmZhY2UgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIFN1cmZhY2UoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VyZmFjZUlEID0gXCJkZWZhdWx0XCI7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUlEID0gMDtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhTcmMgPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLmZyYWdtZW50U3JjID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgU3VyZmFjZS5wcm90b3R5cGUuZmlsbFVuaWZvcm1zID0gZnVuY3Rpb24gKHVuaWZvcm1zKSB7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdXJmYWNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN1cmZhY2UucHJvdG90eXBlLmJvdW5kc1F1YWQgPSBmdW5jdGlvbiAodiwgb3V0LCBhZnRlcikge1xyXG4gICAgICAgICAgICB2YXIgbWluWCA9IG91dFswXSwgbWluWSA9IG91dFsxXTtcclxuICAgICAgICAgICAgdmFyIG1heFggPSBvdXRbMF0sIG1heFkgPSBvdXRbMV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAyOyBpIDwgODsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWluWCA+IG91dFtpXSlcclxuICAgICAgICAgICAgICAgICAgICBtaW5YID0gb3V0W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1heFggPCBvdXRbaV0pXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4WCA9IG91dFtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChtaW5ZID4gb3V0W2kgKyAxXSlcclxuICAgICAgICAgICAgICAgICAgICBtaW5ZID0gb3V0W2kgKyAxXTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXhZIDwgb3V0W2kgKyAxXSlcclxuICAgICAgICAgICAgICAgICAgICBtYXhZID0gb3V0W2kgKyAxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwWzBdLnNldChtaW5YLCBtaW5ZKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBseShwWzBdLCBwWzBdKTtcclxuICAgICAgICAgICAgcFsxXS5zZXQobWF4WCwgbWluWSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHkocFsxXSwgcFsxXSk7XHJcbiAgICAgICAgICAgIHBbMl0uc2V0KG1heFgsIG1heFkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5KHBbMl0sIHBbMl0pO1xyXG4gICAgICAgICAgICBwWzNdLnNldChtaW5YLCBtYXhZKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBseShwWzNdLCBwWzNdKTtcclxuICAgICAgICAgICAgaWYgKGFmdGVyKSB7XHJcbiAgICAgICAgICAgICAgICBhZnRlci5hcHBseShwWzBdLCBwWzBdKTtcclxuICAgICAgICAgICAgICAgIGFmdGVyLmFwcGx5KHBbMV0sIHBbMV0pO1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXIuYXBwbHkocFsyXSwgcFsyXSk7XHJcbiAgICAgICAgICAgICAgICBhZnRlci5hcHBseShwWzNdLCBwWzNdKTtcclxuICAgICAgICAgICAgICAgIG91dFswXSA9IHBbMF0ueDtcclxuICAgICAgICAgICAgICAgIG91dFsxXSA9IHBbMF0ueTtcclxuICAgICAgICAgICAgICAgIG91dFsyXSA9IHBbMV0ueDtcclxuICAgICAgICAgICAgICAgIG91dFszXSA9IHBbMV0ueTtcclxuICAgICAgICAgICAgICAgIG91dFs0XSA9IHBbMl0ueDtcclxuICAgICAgICAgICAgICAgIG91dFs1XSA9IHBbMl0ueTtcclxuICAgICAgICAgICAgICAgIG91dFs2XSA9IHBbM10ueDtcclxuICAgICAgICAgICAgICAgIG91dFs3XSA9IHBbM10ueTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IDM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwW2ldLnkgPCBwWzBdLnkgfHwgcFtpXS55ID09IHBbMF0ueSAmJiBwW2ldLnggPCBwWzBdLngpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwWzBdID0gcFtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcFtpXSA9IHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYVtpXSA9IE1hdGguYXRhbjIocFtpXS55IC0gcFswXS55LCBwW2ldLnggLSBwWzBdLngpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IGkgKyAxOyBqIDw9IDM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYVtpXSA+IGFbal0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gcFtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBbaV0gPSBwW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcFtqXSA9IHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdDIgPSBhW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYVtpXSA9IGFbal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhW2pdID0gdDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvdXRbMF0gPSBwWzBdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbMV0gPSBwWzBdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbMl0gPSBwWzFdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbM10gPSBwWzFdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbNF0gPSBwWzJdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbNV0gPSBwWzJdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbNl0gPSBwWzNdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbN10gPSBwWzNdLnk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHBbM10ueCAtIHBbMl0ueCkgKiAocFsxXS55IC0gcFsyXS55KSAtIChwWzFdLnggLSBwWzJdLngpICogKHBbM10ueSAtIHBbMl0ueSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0WzRdID0gcFszXS54O1xyXG4gICAgICAgICAgICAgICAgICAgIG91dFs1XSA9IHBbM10ueTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTdXJmYWNlO1xyXG4gICAgfSgpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TdXJmYWNlID0gU3VyZmFjZTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHRlbXBNYXQgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgIHZhciB0ZW1wUmVjdCA9IG5ldyBQSVhJLlJlY3RhbmdsZSgpO1xyXG4gICAgdmFyIHRlbXBQb2ludCA9IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICB2YXIgQmlsaW5lYXJTdXJmYWNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoQmlsaW5lYXJTdXJmYWNlLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIEJpbGluZWFyU3VyZmFjZSgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuZGlzdG9ydGlvbiA9IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXN0b3J0aW9uLnNldCgwLCAwKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBkID0gdGhpcy5kaXN0b3J0aW9uO1xyXG4gICAgICAgICAgICB2YXIgbSA9IHBvcy54ICogcG9zLnk7XHJcbiAgICAgICAgICAgIG5ld1Bvcy54ID0gcG9zLnggKyBkLnggKiBtO1xyXG4gICAgICAgICAgICBuZXdQb3MueSA9IHBvcy55ICsgZC55ICogbTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlJbnZlcnNlID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgdnggPSBwb3MueCwgdnkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIGR4ID0gdGhpcy5kaXN0b3J0aW9uLngsIGR5ID0gdGhpcy5kaXN0b3J0aW9uLnk7XHJcbiAgICAgICAgICAgIGlmIChkeCA9PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gdng7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHZ5IC8gKDEuMCArIGR5ICogdngpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGR5ID09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB2eTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gdnggLyAoMS4wICsgZHggKiB2eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYiA9ICh2eSAqIGR4IC0gdnggKiBkeSArIDEuMCkgKiAwLjUgLyBkeTtcclxuICAgICAgICAgICAgICAgIHZhciBkID0gYiAqIGIgKyB2eCAvIGR5O1xyXG4gICAgICAgICAgICAgICAgaWYgKGQgPD0gMC4wMDAwMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Bvcy5zZXQoTmFOLCBOYU4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChkeSA+IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gLWIgKyBNYXRoLnNxcnQoZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdQb3MueCA9IC1iIC0gTWF0aC5zcXJ0KGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSAodnggLyBuZXdQb3MueCAtIDEuMCkgLyBkeDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5tYXBTcHJpdGUgPSBmdW5jdGlvbiAoc3ByaXRlLCBxdWFkLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS50ZXh0dXJlO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC54ID0gLXNwcml0ZS5hbmNob3IueCAqIHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC55ID0gLXNwcml0ZS5hbmNob3IueSAqIHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdGVtcFJlY3Qud2lkdGggPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QuaGVpZ2h0ID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXBRdWFkKHRlbXBSZWN0LCBxdWFkLCBvdXRUcmFuc2Zvcm0gfHwgc3ByaXRlLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLm1hcFF1YWQgPSBmdW5jdGlvbiAocmVjdCwgcXVhZCwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciBheCA9IC1yZWN0LnggLyByZWN0LndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgYXkgPSAtcmVjdC55IC8gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBheDIgPSAoMS4wIC0gcmVjdC54KSAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBheTIgPSAoMS4wIC0gcmVjdC55KSAvIHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgdXAxeCA9IChxdWFkWzBdLnggKiAoMS4wIC0gYXgpICsgcXVhZFsxXS54ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgdXAxeSA9IChxdWFkWzBdLnkgKiAoMS4wIC0gYXgpICsgcXVhZFsxXS55ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgdXAyeCA9IChxdWFkWzBdLnggKiAoMS4wIC0gYXgyKSArIHF1YWRbMV0ueCAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciB1cDJ5ID0gKHF1YWRbMF0ueSAqICgxLjAgLSBheDIpICsgcXVhZFsxXS55ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIGRvd24xeCA9IChxdWFkWzNdLnggKiAoMS4wIC0gYXgpICsgcXVhZFsyXS54ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjF5ID0gKHF1YWRbM10ueSAqICgxLjAgLSBheCkgKyBxdWFkWzJdLnkgKiBheCk7XHJcbiAgICAgICAgICAgIHZhciBkb3duMnggPSAocXVhZFszXS54ICogKDEuMCAtIGF4MikgKyBxdWFkWzJdLnggKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjJ5ID0gKHF1YWRbM10ueSAqICgxLjAgLSBheDIpICsgcXVhZFsyXS55ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIHgwMCA9IHVwMXggKiAoMS4wIC0gYXkpICsgZG93bjF4ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB5MDAgPSB1cDF5ICogKDEuMCAtIGF5KSArIGRvd24xeSAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeDEwID0gdXAyeCAqICgxLjAgLSBheSkgKyBkb3duMnggKiBheTtcclxuICAgICAgICAgICAgdmFyIHkxMCA9IHVwMnkgKiAoMS4wIC0gYXkpICsgZG93bjJ5ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB4MDEgPSB1cDF4ICogKDEuMCAtIGF5MikgKyBkb3duMXggKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB5MDEgPSB1cDF5ICogKDEuMCAtIGF5MikgKyBkb3duMXkgKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB4MTEgPSB1cDJ4ICogKDEuMCAtIGF5MikgKyBkb3duMnggKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB5MTEgPSB1cDJ5ICogKDEuMCAtIGF5MikgKyBkb3duMnkgKiBheTI7XHJcbiAgICAgICAgICAgIHZhciBtYXQgPSB0ZW1wTWF0O1xyXG4gICAgICAgICAgICBtYXQudHggPSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC50eSA9IHkwMDtcclxuICAgICAgICAgICAgbWF0LmEgPSB4MTAgLSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC5iID0geTEwIC0geTAwO1xyXG4gICAgICAgICAgICBtYXQuYyA9IHgwMSAtIHgwMDtcclxuICAgICAgICAgICAgbWF0LmQgPSB5MDEgLSB5MDA7XHJcbiAgICAgICAgICAgIHRlbXBQb2ludC5zZXQoeDExLCB5MTEpO1xyXG4gICAgICAgICAgICBtYXQuYXBwbHlJbnZlcnNlKHRlbXBQb2ludCwgdGVtcFBvaW50KTtcclxuICAgICAgICAgICAgdGhpcy5kaXN0b3J0aW9uLnNldCh0ZW1wUG9pbnQueCAtIDEsIHRlbXBQb2ludC55IC0gMSk7XHJcbiAgICAgICAgICAgIG91dFRyYW5zZm9ybS5zZXRGcm9tTWF0cml4KG1hdCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5maWxsVW5pZm9ybXMgPSBmdW5jdGlvbiAodW5pZm9ybXMpIHtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvbiA9IHVuaWZvcm1zLmRpc3RvcnRpb24gfHwgbmV3IEZsb2F0MzJBcnJheShbMCwgMCwgMCwgMF0pO1xyXG4gICAgICAgICAgICB2YXIgYXggPSBNYXRoLmFicyh0aGlzLmRpc3RvcnRpb24ueCk7XHJcbiAgICAgICAgICAgIHZhciBheSA9IE1hdGguYWJzKHRoaXMuZGlzdG9ydGlvbi55KTtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvblswXSA9IGF4ICogMTAwMDAgPD0gYXkgPyAwIDogdGhpcy5kaXN0b3J0aW9uLng7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb25bMV0gPSBheSAqIDEwMDAwIDw9IGF4ID8gMCA6IHRoaXMuZGlzdG9ydGlvbi55O1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uWzJdID0gMS4wIC8gdW5pZm9ybXMuZGlzdG9ydGlvblswXTtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvblszXSA9IDEuMCAvIHVuaWZvcm1zLmRpc3RvcnRpb25bMV07XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gQmlsaW5lYXJTdXJmYWNlO1xyXG4gICAgfShwaXhpX3Byb2plY3Rpb24uU3VyZmFjZSkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLkJpbGluZWFyU3VyZmFjZSA9IEJpbGluZWFyU3VyZmFjZTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIENvbnRhaW5lcjJzID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoQ29udGFpbmVyMnMsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gQ29udGFpbmVyMnMoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25TdXJmYWNlKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbnRhaW5lcjJzLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvajtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIENvbnRhaW5lcjJzO1xyXG4gICAgfShQSVhJLkNvbnRhaW5lcikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLkNvbnRhaW5lcjJzID0gQ29udGFpbmVyMnM7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBmdW4gPSBQSVhJLlRyYW5zZm9ybVN0YXRpYy5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtO1xyXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtSGFjayhwYXJlbnRUcmFuc2Zvcm0pIHtcclxuICAgICAgICB2YXIgcHJvaiA9IHRoaXMucHJvajtcclxuICAgICAgICB2YXIgcHAgPSBwYXJlbnRUcmFuc2Zvcm0ucHJvajtcclxuICAgICAgICB2YXIgdGEgPSB0aGlzO1xyXG4gICAgICAgIGlmICghcHApIHtcclxuICAgICAgICAgICAgZnVuLmNhbGwodGhpcywgcGFyZW50VHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgcHJvai5fYWN0aXZlUHJvamVjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBwLl9zdXJmYWNlKSB7XHJcbiAgICAgICAgICAgIHByb2ouX2FjdGl2ZVByb2plY3Rpb24gPSBwcDtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVMb2NhbFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICB0aGlzLmxvY2FsVHJhbnNmb3JtLmNvcHkodGhpcy53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIGlmICh0YS5fcGFyZW50SUQgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICArK3RhLl93b3JsZElEO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuLmNhbGwodGhpcywgcGFyZW50VHJhbnNmb3JtKTtcclxuICAgICAgICBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uID0gcHAuX2FjdGl2ZVByb2plY3Rpb247XHJcbiAgICB9XHJcbiAgICB2YXIgUHJvamVjdGlvblN1cmZhY2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhQcm9qZWN0aW9uU3VyZmFjZSwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0aW9uU3VyZmFjZShsZWdhY3ksIGVuYWJsZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBsZWdhY3ksIGVuYWJsZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuX3N1cmZhY2UgPSBudWxsO1xyXG4gICAgICAgICAgICBfdGhpcy5fYWN0aXZlUHJvamVjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIF90aGlzLl9jdXJyZW50U3VyZmFjZUlEID0gLTE7XHJcbiAgICAgICAgICAgIF90aGlzLl9jdXJyZW50TGVnYWN5SUQgPSAtMTtcclxuICAgICAgICAgICAgX3RoaXMuX2xhc3RVbmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZSwgXCJlbmFibGVkXCIsIHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5fZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5LnVwZGF0ZVRyYW5zZm9ybSA9IHRyYW5zZm9ybUhhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS51cGRhdGVUcmFuc2Zvcm0gPSBQSVhJLlRyYW5zZm9ybVN0YXRpYy5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLCBcInN1cmZhY2VcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdXJmYWNlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N1cmZhY2UgPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXJmYWNlID0gdmFsdWUgfHwgbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlQYXJ0aWFsID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5zdXJmYWNlLmFwcGx5KG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3VyZmFjZS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5zdXJmYWNlLmFwcGx5KG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMuc3VyZmFjZS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlJbnZlcnNlID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5fc3VyZmFjZS5hcHBseUludmVyc2UobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5SW52ZXJzZShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5SW52ZXJzZShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3VyZmFjZS5hcHBseUludmVyc2UobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLm1hcEJpbGluZWFyU3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZSwgcXVhZCkge1xyXG4gICAgICAgICAgICBpZiAoISh0aGlzLl9zdXJmYWNlIGluc3RhbmNlb2YgcGl4aV9wcm9qZWN0aW9uLkJpbGluZWFyU3VyZmFjZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VyZmFjZSA9IG5ldyBwaXhpX3Byb2plY3Rpb24uQmlsaW5lYXJTdXJmYWNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zdXJmYWNlLm1hcFNwcml0ZShzcHJpdGUsIHF1YWQsIHRoaXMubGVnYWN5KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VyZmFjZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJmYWNlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUsIFwidW5pZm9ybXNcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50TGVnYWN5SUQgPT09IHRoaXMubGVnYWN5Ll93b3JsZElEICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFN1cmZhY2VJRCA9PT0gdGhpcy5zdXJmYWNlLl91cGRhdGVJRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sYXN0VW5pZm9ybXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VW5pZm9ybXMgPSB0aGlzLl9sYXN0VW5pZm9ybXMgfHwge307XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VW5pZm9ybXMud29ybGRUcmFuc2Zvcm0gPSB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS50b0FycmF5KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3VyZmFjZS5maWxsVW5pZm9ybXModGhpcy5fbGFzdFVuaWZvcm1zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sYXN0VW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBQcm9qZWN0aW9uU3VyZmFjZTtcclxuICAgIH0ocGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24pKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uU3VyZmFjZSA9IFByb2plY3Rpb25TdXJmYWNlO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wuTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICB2YXIgU3ByaXRlQmlsaW5lYXJSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZUJpbGluZWFyUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlQmlsaW5lYXJSZW5kZXJlcigpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnNpemUgPSAxMDA7XHJcbiAgICAgICAgICAgIF90aGlzLk1BWF9URVhUVVJFU19MT0NBTCA9IDE7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlclZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzMgYVRyYW5zMTtcXG5hdHRyaWJ1dGUgdmVjMyBhVHJhbnMyO1xcbmF0dHJpYnV0ZSB2ZWM0IGFGcmFtZTtcXG5hdHRyaWJ1dGUgdmVjNCBhQ29sb3I7XFxuYXR0cmlidXRlIGZsb2F0IGFUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIHdvcmxkVHJhbnNmb3JtO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMxO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMyO1xcbnZhcnlpbmcgdmVjNCB2RnJhbWU7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbiAgICBnbF9Qb3NpdGlvbi54eXcgPSBwcm9qZWN0aW9uTWF0cml4ICogd29ybGRUcmFuc2Zvcm0gKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgZ2xfUG9zaXRpb24ueiA9IDAuMDtcXG4gICAgXFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVmVydGV4UG9zaXRpb247XFxuICAgIHZUcmFuczEgPSBhVHJhbnMxO1xcbiAgICB2VHJhbnMyID0gYVRyYW5zMjtcXG4gICAgdlRleHR1cmVJZCA9IGFUZXh0dXJlSWQ7XFxuICAgIHZDb2xvciA9IGFDb2xvcjtcXG4gICAgdkZyYW1lID0gYUZyYW1lO1xcbn1cXG5cIjtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyRnJhZyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMxO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMyO1xcbnZhcnlpbmcgdmVjNCB2RnJhbWU7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXJzWyVjb3VudCVdO1xcbnVuaWZvcm0gdmVjMiBzYW1wbGVyU2l6ZVslY291bnQlXTsgXFxudW5pZm9ybSB2ZWM0IGRpc3RvcnRpb247XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbnZlYzIgc3VyZmFjZTtcXG52ZWMyIHN1cmZhY2UyO1xcblxcbmZsb2F0IHZ4ID0gdlRleHR1cmVDb29yZC54O1xcbmZsb2F0IHZ5ID0gdlRleHR1cmVDb29yZC55O1xcbmZsb2F0IGR4ID0gZGlzdG9ydGlvbi54O1xcbmZsb2F0IGR5ID0gZGlzdG9ydGlvbi55O1xcbmZsb2F0IHJldnggPSBkaXN0b3J0aW9uLno7XFxuZmxvYXQgcmV2eSA9IGRpc3RvcnRpb24udztcXG5cXG5pZiAoZGlzdG9ydGlvbi54ID09IDAuMCkge1xcbiAgICBzdXJmYWNlLnggPSB2eDtcXG4gICAgc3VyZmFjZS55ID0gdnkgLyAoMS4wICsgZHkgKiB2eCk7XFxuICAgIHN1cmZhY2UyID0gc3VyZmFjZTtcXG59IGVsc2VcXG5pZiAoZGlzdG9ydGlvbi55ID09IDAuMCkge1xcbiAgICBzdXJmYWNlLnkgPSB2eTtcXG4gICAgc3VyZmFjZS54ID0gdngvICgxLjAgKyBkeCAqIHZ5KTtcXG4gICAgc3VyZmFjZTIgPSBzdXJmYWNlO1xcbn0gZWxzZSB7XFxuICAgIGZsb2F0IGMgPSB2eSAqIGR4IC0gdnggKiBkeTtcXG4gICAgZmxvYXQgYiA9IChjICsgMS4wKSAqIDAuNTtcXG4gICAgZmxvYXQgYjIgPSAoLWMgKyAxLjApICogMC41O1xcbiAgICBmbG9hdCBkID0gYiAqIGIgKyB2eCAqIGR5O1xcbiAgICBpZiAoZCA8IC0wLjAwMDAxKSB7XFxuICAgICAgICBkaXNjYXJkO1xcbiAgICB9XFxuICAgIGQgPSBzcXJ0KG1heChkLCAwLjApKTtcXG4gICAgc3VyZmFjZS54ID0gKC0gYiArIGQpICogcmV2eTtcXG4gICAgc3VyZmFjZTIueCA9ICgtIGIgLSBkKSAqIHJldnk7XFxuICAgIHN1cmZhY2UueSA9ICgtIGIyICsgZCkgKiByZXZ4O1xcbiAgICBzdXJmYWNlMi55ID0gKC0gYjIgLSBkKSAqIHJldng7XFxufVxcblxcbnZlYzIgdXY7XFxudXYueCA9IHZUcmFuczEueCAqIHN1cmZhY2UueCArIHZUcmFuczEueSAqIHN1cmZhY2UueSArIHZUcmFuczEuejtcXG51di55ID0gdlRyYW5zMi54ICogc3VyZmFjZS54ICsgdlRyYW5zMi55ICogc3VyZmFjZS55ICsgdlRyYW5zMi56O1xcblxcbnZlYzIgcGl4ZWxzID0gdXYgKiBzYW1wbGVyU2l6ZVswXTtcXG5cXG5pZiAocGl4ZWxzLnggPCB2RnJhbWUueCB8fCBwaXhlbHMueCA+IHZGcmFtZS56IHx8XFxuICAgIHBpeGVscy55IDwgdkZyYW1lLnkgfHwgcGl4ZWxzLnkgPiB2RnJhbWUudykge1xcbiAgICB1di54ID0gdlRyYW5zMS54ICogc3VyZmFjZTIueCArIHZUcmFuczEueSAqIHN1cmZhY2UyLnkgKyB2VHJhbnMxLno7XFxuICAgIHV2LnkgPSB2VHJhbnMyLnggKiBzdXJmYWNlMi54ICsgdlRyYW5zMi55ICogc3VyZmFjZTIueSArIHZUcmFuczIuejtcXG4gICAgcGl4ZWxzID0gdXYgKiBzYW1wbGVyU2l6ZVswXTtcXG4gICAgXFxuICAgIGlmIChwaXhlbHMueCA8IHZGcmFtZS54IHx8IHBpeGVscy54ID4gdkZyYW1lLnogfHxcXG4gICAgICAgIHBpeGVscy55IDwgdkZyYW1lLnkgfHwgcGl4ZWxzLnkgPiB2RnJhbWUudykge1xcbiAgICAgICAgZGlzY2FyZDtcXG4gICAgfVxcbn1cXG5cXG52ZWM0IGVkZ2U7XFxuZWRnZS54eSA9IGNsYW1wKHBpeGVscyAtIHZGcmFtZS54eSArIDAuNSwgdmVjMigwLjAsIDAuMCksIHZlYzIoMS4wLCAxLjApKTtcXG5lZGdlLnp3ID0gY2xhbXAodkZyYW1lLnp3IC0gcGl4ZWxzICsgMC41LCB2ZWMyKDAuMCwgMC4wKSwgdmVjMigxLjAsIDEuMCkpO1xcblxcbmZsb2F0IGFscGhhID0gMS4wOyAvL2VkZ2UueCAqIGVkZ2UueSAqIGVkZ2UueiAqIGVkZ2UudztcXG52ZWM0IHJDb2xvciA9IHZDb2xvciAqIGFscGhhO1xcblxcbmZsb2F0IHRleHR1cmVJZCA9IGZsb29yKHZUZXh0dXJlSWQrMC41KTtcXG52ZWM0IGNvbG9yO1xcbnZlYzIgdGV4dHVyZUNvb3JkID0gdXY7XFxuJWZvcmxvb3AlXFxuZ2xfRnJhZ0NvbG9yID0gY29sb3IgKiByQ29sb3I7XFxufVwiO1xyXG4gICAgICAgICAgICBfdGhpcy5kZWZVbmlmb3JtcyA9IHtcclxuICAgICAgICAgICAgICAgIHdvcmxkVHJhbnNmb3JtOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAxXSksXHJcbiAgICAgICAgICAgICAgICBkaXN0b3J0aW9uOiBuZXcgRmxvYXQzMkFycmF5KFswLCAwXSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGVCaWxpbmVhclJlbmRlcmVyLnByb3RvdHlwZS5nZXRVbmlmb3JtcyA9IGZ1bmN0aW9uIChzcHJpdGUpIHtcclxuICAgICAgICAgICAgdmFyIHByb2ogPSBzcHJpdGUucHJvajtcclxuICAgICAgICAgICAgdmFyIHNoYWRlciA9IHRoaXMuc2hhZGVyO1xyXG4gICAgICAgICAgICBpZiAocHJvai5zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvai51bmlmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvai5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2ouX2FjdGl2ZVByb2plY3Rpb24udW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVmVW5pZm9ybXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVCaWxpbmVhclJlbmRlcmVyLnByb3RvdHlwZS5jcmVhdGVWYW8gPSBmdW5jdGlvbiAodmVydGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgIHRoaXMudmVydFNpemUgPSAxNDtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0Qnl0ZVNpemUgPSB0aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgdmFyIHZhbyA9IHRoaXMucmVuZGVyZXIuY3JlYXRlVmFvKClcclxuICAgICAgICAgICAgICAgIC5hZGRJbmRleCh0aGlzLmluZGV4QnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFWZXJ0ZXhQb3NpdGlvbiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVHJhbnMxLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAyICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVHJhbnMyLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA1ICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hRnJhbWUsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDggKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFDb2xvciwgZ2wuVU5TSUdORURfQllURSwgdHJ1ZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDEyICogNCk7XHJcbiAgICAgICAgICAgIGlmIChhdHRycy5hVGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgICAgICB2YW8uYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRleHR1cmVJZCwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMTMgKiA0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFvO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlQmlsaW5lYXJSZW5kZXJlci5wcm90b3R5cGUuZmlsbFZlcnRpY2VzID0gZnVuY3Rpb24gKGZsb2F0MzJWaWV3LCB1aW50MzJWaWV3LCBpbmRleCwgc3ByaXRlLCBhcmdiLCB0ZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSBzcHJpdGUudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHcgPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGggPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBheCA9IHNwcml0ZS5fYW5jaG9yLl94O1xyXG4gICAgICAgICAgICB2YXIgYXkgPSBzcHJpdGUuX2FuY2hvci5feTtcclxuICAgICAgICAgICAgdmFyIGZyYW1lID0gdGV4Ll9mcmFtZTtcclxuICAgICAgICAgICAgdmFyIGFUcmFucyA9IHNwcml0ZS5hVHJhbnM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSB2ZXJ0ZXhEYXRhW2kgKiAyXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSB2ZXJ0ZXhEYXRhW2kgKiAyICsgMV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gYVRyYW5zLmE7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDNdID0gYVRyYW5zLmM7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDRdID0gYVRyYW5zLnR4O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA1XSA9IGFUcmFucy5iO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9IGFUcmFucy5kO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9IGFUcmFucy50eTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSBmcmFtZS54O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA5XSA9IGZyYW1lLnk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEwXSA9IGZyYW1lLnggKyBmcmFtZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTFdID0gZnJhbWUueSArIGZyYW1lLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAxMl0gPSBhcmdiO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSB0ZXh0dXJlSWQ7XHJcbiAgICAgICAgICAgICAgICBpbmRleCArPSAxNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZUJpbGluZWFyUmVuZGVyZXI7XHJcbiAgICB9KE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyKSk7XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ3Nwcml0ZV9iaWxpbmVhcicsIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wuTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICB2YXIgU3ByaXRlU3RyYW5nZVJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlU3RyYW5nZVJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZVN0cmFuZ2VSZW5kZXJlcigpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnNpemUgPSAxMDA7XHJcbiAgICAgICAgICAgIF90aGlzLk1BWF9URVhUVVJFU19MT0NBTCA9IDE7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlclZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzMgYVRyYW5zMTtcXG5hdHRyaWJ1dGUgdmVjMyBhVHJhbnMyO1xcbmF0dHJpYnV0ZSB2ZWM0IGFGcmFtZTtcXG5hdHRyaWJ1dGUgdmVjNCBhQ29sb3I7XFxuYXR0cmlidXRlIGZsb2F0IGFUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIHdvcmxkVHJhbnNmb3JtO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMxO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMyO1xcbnZhcnlpbmcgdmVjNCB2RnJhbWU7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbiAgICBnbF9Qb3NpdGlvbi54eXcgPSBwcm9qZWN0aW9uTWF0cml4ICogd29ybGRUcmFuc2Zvcm0gKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgZ2xfUG9zaXRpb24ueiA9IDAuMDtcXG4gICAgXFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVmVydGV4UG9zaXRpb247XFxuICAgIHZUcmFuczEgPSBhVHJhbnMxO1xcbiAgICB2VHJhbnMyID0gYVRyYW5zMjtcXG4gICAgdlRleHR1cmVJZCA9IGFUZXh0dXJlSWQ7XFxuICAgIHZDb2xvciA9IGFDb2xvcjtcXG4gICAgdkZyYW1lID0gYUZyYW1lO1xcbn1cXG5cIjtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyRnJhZyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMxO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMyO1xcbnZhcnlpbmcgdmVjNCB2RnJhbWU7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXJzWyVjb3VudCVdO1xcbnVuaWZvcm0gdmVjMiBzYW1wbGVyU2l6ZVslY291bnQlXTsgXFxudW5pZm9ybSB2ZWM0IHBhcmFtcztcXG5cXG52b2lkIG1haW4odm9pZCl7XFxudmVjMiBzdXJmYWNlO1xcblxcbmZsb2F0IHZ4ID0gdlRleHR1cmVDb29yZC54O1xcbmZsb2F0IHZ5ID0gdlRleHR1cmVDb29yZC55O1xcbmZsb2F0IGFsZXBoID0gcGFyYW1zLng7XFxuZmxvYXQgYmV0ID0gcGFyYW1zLnk7XFxuZmxvYXQgQSA9IHBhcmFtcy56O1xcbmZsb2F0IEIgPSBwYXJhbXMudztcXG5cXG5pZiAoYWxlcGggPT0gMC4wKSB7XFxuXFx0c3VyZmFjZS55ID0gdnkgLyAoMS4wICsgdnggKiBiZXQpO1xcblxcdHN1cmZhY2UueCA9IHZ4O1xcbn1cXG5lbHNlIGlmIChiZXQgPT0gMC4wKSB7XFxuXFx0c3VyZmFjZS54ID0gdnggLyAoMS4wICsgdnkgKiBhbGVwaCk7XFxuXFx0c3VyZmFjZS55ID0gdnk7XFxufSBlbHNlIHtcXG5cXHRzdXJmYWNlLnggPSB2eCAqIChiZXQgKyAxLjApIC8gKGJldCArIDEuMCArIHZ5ICogYWxlcGgpO1xcblxcdHN1cmZhY2UueSA9IHZ5ICogKGFsZXBoICsgMS4wKSAvIChhbGVwaCArIDEuMCArIHZ4ICogYmV0KTtcXG59XFxuXFxudmVjMiB1djtcXG51di54ID0gdlRyYW5zMS54ICogc3VyZmFjZS54ICsgdlRyYW5zMS55ICogc3VyZmFjZS55ICsgdlRyYW5zMS56O1xcbnV2LnkgPSB2VHJhbnMyLnggKiBzdXJmYWNlLnggKyB2VHJhbnMyLnkgKiBzdXJmYWNlLnkgKyB2VHJhbnMyLno7XFxuXFxudmVjMiBwaXhlbHMgPSB1diAqIHNhbXBsZXJTaXplWzBdO1xcblxcbnZlYzQgZWRnZTtcXG5lZGdlLnh5ID0gY2xhbXAocGl4ZWxzIC0gdkZyYW1lLnh5ICsgMC41LCB2ZWMyKDAuMCwgMC4wKSwgdmVjMigxLjAsIDEuMCkpO1xcbmVkZ2UuencgPSBjbGFtcCh2RnJhbWUuencgLSBwaXhlbHMgKyAwLjUsIHZlYzIoMC4wLCAwLjApLCB2ZWMyKDEuMCwgMS4wKSk7XFxuXFxuZmxvYXQgYWxwaGEgPSBlZGdlLnggKiBlZGdlLnkgKiBlZGdlLnogKiBlZGdlLnc7XFxudmVjNCByQ29sb3IgPSB2Q29sb3IgKiBhbHBoYTtcXG5cXG5mbG9hdCB0ZXh0dXJlSWQgPSBmbG9vcih2VGV4dHVyZUlkKzAuNSk7XFxudmVjNCBjb2xvcjtcXG52ZWMyIHRleHR1cmVDb29yZCA9IHV2O1xcbiVmb3Jsb29wJVxcbmdsX0ZyYWdDb2xvciA9IGNvbG9yICogckNvbG9yO1xcbn1cIjtcclxuICAgICAgICAgICAgX3RoaXMuZGVmVW5pZm9ybXMgPSB7XHJcbiAgICAgICAgICAgICAgICB3b3JsZFRyYW5zZm9ybTogbmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMV0pLFxyXG4gICAgICAgICAgICAgICAgZGlzdG9ydGlvbjogbmV3IEZsb2F0MzJBcnJheShbMCwgMF0pXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlU3RyYW5nZVJlbmRlcmVyLnByb3RvdHlwZS5nZXRVbmlmb3JtcyA9IGZ1bmN0aW9uIChzcHJpdGUpIHtcclxuICAgICAgICAgICAgdmFyIHByb2ogPSBzcHJpdGUucHJvajtcclxuICAgICAgICAgICAgdmFyIHNoYWRlciA9IHRoaXMuc2hhZGVyO1xyXG4gICAgICAgICAgICBpZiAocHJvai5zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvai51bmlmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvai5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2ouX2FjdGl2ZVByb2plY3Rpb24udW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVmVW5pZm9ybXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVTdHJhbmdlUmVuZGVyZXIucHJvdG90eXBlLmNyZWF0ZVZhbyA9IGZ1bmN0aW9uICh2ZXJ0ZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgdGhpcy52ZXJ0U2l6ZSA9IDE0O1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRCeXRlU2l6ZSA9IHRoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICB2YXIgdmFvID0gdGhpcy5yZW5kZXJlci5jcmVhdGVWYW8oKVxyXG4gICAgICAgICAgICAgICAgLmFkZEluZGV4KHRoaXMuaW5kZXhCdWZmZXIpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVZlcnRleFBvc2l0aW9uLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAwKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUcmFuczEsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDIgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUcmFuczIsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDUgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFGcmFtZSwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgOCAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUNvbG9yLCBnbC5VTlNJR05FRF9CWVRFLCB0cnVlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMTIgKiA0KTtcclxuICAgICAgICAgICAgaWYgKGF0dHJzLmFUZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgICAgIHZhby5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVGV4dHVyZUlkLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAxMyAqIDQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YW87XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVTdHJhbmdlUmVuZGVyZXIucHJvdG90eXBlLmZpbGxWZXJ0aWNlcyA9IGZ1bmN0aW9uIChmbG9hdDMyVmlldywgdWludDMyVmlldywgaW5kZXgsIHNwcml0ZSwgYXJnYiwgdGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gc3ByaXRlLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB3ID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYXggPSBzcHJpdGUuX2FuY2hvci5feDtcclxuICAgICAgICAgICAgdmFyIGF5ID0gc3ByaXRlLl9hbmNob3IuX3k7XHJcbiAgICAgICAgICAgIHZhciBmcmFtZSA9IHRleC5fZnJhbWU7XHJcbiAgICAgICAgICAgIHZhciBhVHJhbnMgPSBzcHJpdGUuYVRyYW5zO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gdmVydGV4RGF0YVtpICogMl07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gdmVydGV4RGF0YVtpICogMiArIDFdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IGFUcmFucy5hO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAzXSA9IGFUcmFucy5jO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA0XSA9IGFUcmFucy50eDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNV0gPSBhVHJhbnMuYjtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSBhVHJhbnMuZDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSBhVHJhbnMudHk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gZnJhbWUueDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOV0gPSBmcmFtZS55O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMF0gPSBmcmFtZS54ICsgZnJhbWUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDExXSA9IGZyYW1lLnkgKyBmcmFtZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgMTJdID0gYXJnYjtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gdGV4dHVyZUlkO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gMTQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTcHJpdGVTdHJhbmdlUmVuZGVyZXI7XHJcbiAgICB9KE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyKSk7XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ3Nwcml0ZV9zdHJhbmdlJywgU3ByaXRlU3RyYW5nZVJlbmRlcmVyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHRlbXBNYXQgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgIHZhciB0ZW1wUmVjdCA9IG5ldyBQSVhJLlJlY3RhbmdsZSgpO1xyXG4gICAgdmFyIHRlbXBQb2ludCA9IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICB2YXIgU3RyYW5nZVN1cmZhY2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTdHJhbmdlU3VyZmFjZSwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTdHJhbmdlU3VyZmFjZSgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucGFyYW1zID0gWzAsIDAsIE5hTiwgTmFOXTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIHBbMF0gPSAwO1xyXG4gICAgICAgICAgICBwWzFdID0gMDtcclxuICAgICAgICAgICAgcFsyXSA9IE5hTjtcclxuICAgICAgICAgICAgcFszXSA9IE5hTjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5zZXRBeGlzWCA9IGZ1bmN0aW9uIChwb3MsIGZhY3Rvciwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLngsIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICAgICAgICAgIHZhciByb3QgPSBvdXRUcmFuc2Zvcm0ucm90YXRpb247XHJcbiAgICAgICAgICAgIGlmIChyb3QgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3Ll94IC09IHJvdDtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3Ll95ICs9IHJvdDtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5yb3RhdGlvbiA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcueSA9IE1hdGguYXRhbjIoeSwgeCk7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIGlmIChmYWN0b3IgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHBbMl0gPSAtZCAqIGZhY3RvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBbMl0gPSBOYU47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fY2FsYzAxKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuc2V0QXhpc1kgPSBmdW5jdGlvbiAocG9zLCBmYWN0b3IsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54LCB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgICAgICAgICB2YXIgcm90ID0gb3V0VHJhbnNmb3JtLnJvdGF0aW9uO1xyXG4gICAgICAgICAgICBpZiAocm90ICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy5feCAtPSByb3Q7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy5feSArPSByb3Q7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0ucm90YXRpb24gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3LnggPSAtTWF0aC5hdGFuMih5LCB4KSArIE1hdGguUEkgLyAyO1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICBpZiAoZmFjdG9yICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwWzNdID0gLWQgKiBmYWN0b3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwWzNdID0gTmFOO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGMwMSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLl9jYWxjMDEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIGlmIChpc05hTihwWzJdKSkge1xyXG4gICAgICAgICAgICAgICAgcFsxXSA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4ocFszXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwWzBdID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSAxLjAgLyBwWzNdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKHBbM10pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcFswXSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcFsxXSA9IDEuMCAvIHBbMl07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IDEuMCAtIHBbMl0gKiBwWzNdO1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSAoMS4wIC0gcFsyXSkgLyBkO1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMV0gPSAoMS4wIC0gcFszXSkgLyBkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBhbGVwaCA9IHRoaXMucGFyYW1zWzBdLCBiZXQgPSB0aGlzLnBhcmFtc1sxXSwgQSA9IHRoaXMucGFyYW1zWzJdLCBCID0gdGhpcy5wYXJhbXNbM107XHJcbiAgICAgICAgICAgIHZhciB1ID0gcG9zLngsIHYgPSBwb3MueTtcclxuICAgICAgICAgICAgaWYgKGFsZXBoID09PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gdiAqICgxICsgdSAqIGJldCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYmV0ID09PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gdSAqICgxICsgdiAqIGFsZXBoKTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gdjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBEID0gQSAqIEIgLSB2ICogdTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gQSAqIHUgKiAoQiArIHYpIC8gRDtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gQiAqIHYgKiAoQSArIHUpIC8gRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLmFwcGx5SW52ZXJzZSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGFsZXBoID0gdGhpcy5wYXJhbXNbMF0sIGJldCA9IHRoaXMucGFyYW1zWzFdLCBBID0gdGhpcy5wYXJhbXNbMl0sIEIgPSB0aGlzLnBhcmFtc1szXTtcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueCwgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICBpZiAoYWxlcGggPT09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB5IC8gKDEgKyB4ICogYmV0KTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0geDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChiZXQgPT09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB4ICogKDEgKyB5ICogYWxlcGgpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB4ICogKGJldCArIDEpIC8gKGJldCArIDEgKyB5ICogYWxlcGgpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB5ICogKGFsZXBoICsgMSkgLyAoYWxlcGggKyAxICsgeCAqIGJldCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5tYXBTcHJpdGUgPSBmdW5jdGlvbiAoc3ByaXRlLCBxdWFkLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS50ZXh0dXJlO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC54ID0gLXNwcml0ZS5hbmNob3IueCAqIHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC55ID0gLXNwcml0ZS5hbmNob3IueSAqIHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdGVtcFJlY3Qud2lkdGggPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QuaGVpZ2h0ID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXBRdWFkKHRlbXBSZWN0LCBxdWFkLCBvdXRUcmFuc2Zvcm0gfHwgc3ByaXRlLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUubWFwUXVhZCA9IGZ1bmN0aW9uIChyZWN0LCBxdWFkLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIGF4ID0gLXJlY3QueCAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBheSA9IC1yZWN0LnkgLyByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGF4MiA9ICgxLjAgLSByZWN0LngpIC8gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGF5MiA9ICgxLjAgLSByZWN0LnkpIC8gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciB1cDF4ID0gKHF1YWRbMF0ueCAqICgxLjAgLSBheCkgKyBxdWFkWzFdLnggKiBheCk7XHJcbiAgICAgICAgICAgIHZhciB1cDF5ID0gKHF1YWRbMF0ueSAqICgxLjAgLSBheCkgKyBxdWFkWzFdLnkgKiBheCk7XHJcbiAgICAgICAgICAgIHZhciB1cDJ4ID0gKHF1YWRbMF0ueCAqICgxLjAgLSBheDIpICsgcXVhZFsxXS54ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIHVwMnkgPSAocXVhZFswXS55ICogKDEuMCAtIGF4MikgKyBxdWFkWzFdLnkgKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjF4ID0gKHF1YWRbM10ueCAqICgxLjAgLSBheCkgKyBxdWFkWzJdLnggKiBheCk7XHJcbiAgICAgICAgICAgIHZhciBkb3duMXkgPSAocXVhZFszXS55ICogKDEuMCAtIGF4KSArIHF1YWRbMl0ueSAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIGRvd24yeCA9IChxdWFkWzNdLnggKiAoMS4wIC0gYXgyKSArIHF1YWRbMl0ueCAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciBkb3duMnkgPSAocXVhZFszXS55ICogKDEuMCAtIGF4MikgKyBxdWFkWzJdLnkgKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgeDAwID0gdXAxeCAqICgxLjAgLSBheSkgKyBkb3duMXggKiBheTtcclxuICAgICAgICAgICAgdmFyIHkwMCA9IHVwMXkgKiAoMS4wIC0gYXkpICsgZG93bjF5ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB4MTAgPSB1cDJ4ICogKDEuMCAtIGF5KSArIGRvd24yeCAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeTEwID0gdXAyeSAqICgxLjAgLSBheSkgKyBkb3duMnkgKiBheTtcclxuICAgICAgICAgICAgdmFyIHgwMSA9IHVwMXggKiAoMS4wIC0gYXkyKSArIGRvd24xeCAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHkwMSA9IHVwMXkgKiAoMS4wIC0gYXkyKSArIGRvd24xeSAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHgxMSA9IHVwMnggKiAoMS4wIC0gYXkyKSArIGRvd24yeCAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHkxMSA9IHVwMnkgKiAoMS4wIC0gYXkyKSArIGRvd24yeSAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIG1hdCA9IHRlbXBNYXQ7XHJcbiAgICAgICAgICAgIG1hdC50eCA9IHgwMDtcclxuICAgICAgICAgICAgbWF0LnR5ID0geTAwO1xyXG4gICAgICAgICAgICBtYXQuYSA9IHgxMCAtIHgwMDtcclxuICAgICAgICAgICAgbWF0LmIgPSB5MTAgLSB5MDA7XHJcbiAgICAgICAgICAgIG1hdC5jID0geDAxIC0geDAwO1xyXG4gICAgICAgICAgICBtYXQuZCA9IHkwMSAtIHkwMDtcclxuICAgICAgICAgICAgdGVtcFBvaW50LnNldCh4MTEsIHkxMSk7XHJcbiAgICAgICAgICAgIG1hdC5hcHBseUludmVyc2UodGVtcFBvaW50LCB0ZW1wUG9pbnQpO1xyXG4gICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2V0RnJvbU1hdHJpeChtYXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5maWxsVW5pZm9ybXMgPSBmdW5jdGlvbiAodW5pZm9ybXMpIHtcclxuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICB2YXIgZGlzdG9ydGlvbiA9IHVuaWZvcm1zLnBhcmFtcyB8fCBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwLCAwXSk7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLnBhcmFtcyA9IGRpc3RvcnRpb247XHJcbiAgICAgICAgICAgIGRpc3RvcnRpb25bMF0gPSBwYXJhbXNbMF07XHJcbiAgICAgICAgICAgIGRpc3RvcnRpb25bMV0gPSBwYXJhbXNbMV07XHJcbiAgICAgICAgICAgIGRpc3RvcnRpb25bMl0gPSBwYXJhbXNbMl07XHJcbiAgICAgICAgICAgIGRpc3RvcnRpb25bM10gPSBwYXJhbXNbM107XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3RyYW5nZVN1cmZhY2U7XHJcbiAgICB9KHBpeGlfcHJvamVjdGlvbi5TdXJmYWNlKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3RyYW5nZVN1cmZhY2UgPSBTdHJhbmdlU3VyZmFjZTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgUElYSS5TcHJpdGUucHJvdG90eXBlLmNvbnZlcnRUbzJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlX2JpbGluZWFyJztcclxuICAgICAgICB0aGlzLmFUcmFucyA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXM7XHJcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlQm91bmRzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzO1xyXG4gICAgICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0VG8ycy5jYWxsKHRoaXMpO1xyXG4gICAgfTtcclxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0VG8ycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFN1YnRyZWVUbzJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY29udmVydFRvMnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5jb252ZXJ0U3VidHJlZVRvMnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgU3ByaXRlMnMgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGUycywgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGUycyh0ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHR1cmUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLmFUcmFucyA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uU3VyZmFjZShfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZV9iaWxpbmVhcic7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlMnMucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kcy5hZGRRdWFkKHRoaXMudmVydGV4VHJpbW1lZERhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgd2lkID0gdGhpcy50cmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIHZhciB0dWlkID0gdGhpcy5fdGV4dHVyZS5fdXBkYXRlSUQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90cmFuc2Zvcm1JRCA9PT0gd2lkICYmIHRoaXMuX3RleHR1cmVJRCA9PT0gdHVpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybUlEID0gd2lkO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlSUQgPSB0dWlkO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gdGhpcy52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdHJpbSA9IHRleHR1cmUudHJpbTtcclxuICAgICAgICAgICAgdmFyIG9yaWcgPSB0ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSB0aGlzLl9hbmNob3I7XHJcbiAgICAgICAgICAgIHZhciB3MCA9IDA7XHJcbiAgICAgICAgICAgIHZhciB3MSA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoMCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoMSA9IDA7XHJcbiAgICAgICAgICAgIGlmICh0cmltKSB7XHJcbiAgICAgICAgICAgICAgICB3MSA9IHRyaW0ueCAtIChhbmNob3IuX3ggKiBvcmlnLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIHcwID0gdzEgKyB0cmltLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgaDEgPSB0cmltLnkgLSAoYW5jaG9yLl95ICogb3JpZy5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgaDAgPSBoMSArIHRyaW0uaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdzEgPSAtYW5jaG9yLl94ICogb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIHcwID0gdzEgKyBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgaDEgPSAtYW5jaG9yLl95ICogb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBoMCA9IGgxICsgb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fc3VyZmFjZSkge1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IHcxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IGgxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IHcwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IGgxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IHcwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IGgwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IHcxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IGgwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qLl9zdXJmYWNlLmJvdW5kc1F1YWQodmVydGV4RGF0YSwgdmVydGV4RGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgd3QgPSB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybTtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gd3QuYTtcclxuICAgICAgICAgICAgICAgIHZhciBiID0gd3QuYjtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gd3QuYztcclxuICAgICAgICAgICAgICAgIHZhciBkID0gd3QuZDtcclxuICAgICAgICAgICAgICAgIHZhciB0eCA9IHd0LnR4O1xyXG4gICAgICAgICAgICAgICAgdmFyIHR5ID0gd3QudHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gKGEgKiB3MSkgKyAoYyAqIGgxKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IChkICogaDEpICsgKGIgKiB3MSkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSAoYSAqIHcwKSArIChjICogaDEpICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gKGQgKiBoMSkgKyAoYiAqIHcwKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IChhICogdzApICsgKGMgKiBoMCkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSAoZCAqIGgwKSArIChiICogdzApICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gKGEgKiB3MSkgKyAoYyAqIGgwKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IChkICogaDApICsgKGIgKiB3MSkgKyB0eTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24uc3VyZmFjZS5ib3VuZHNRdWFkKHZlcnRleERhdGEsIHZlcnRleERhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGV4dHVyZS50cmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgICAgIHRleHR1cmUudHJhbnNmb3JtID0gbmV3IFBJWEkuZXh0cmFzLlRleHR1cmVUcmFuc2Zvcm0odGV4dHVyZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGV4dHVyZS50cmFuc2Zvcm0udXBkYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBhVHJhbnMgPSB0aGlzLmFUcmFucztcclxuICAgICAgICAgICAgYVRyYW5zLnNldChvcmlnLndpZHRoLCAwLCAwLCBvcmlnLmhlaWdodCwgdzEsIGgxKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fc3VyZmFjZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYVRyYW5zLnByZXBlbmQodGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFUcmFucy5pbnZlcnQoKTtcclxuICAgICAgICAgICAgYVRyYW5zLnByZXBlbmQodGV4dHVyZS50cmFuc2Zvcm0ubWFwQ29vcmQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHdpZCA9IHRoaXMudHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgICAgICB2YXIgdHVpZCA9IHRoaXMuX3RleHR1cmUuX3VwZGF0ZUlEO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmVydGV4VHJpbW1lZERhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4VHJpbW1lZERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3RyYW5zZm9ybVRyaW1tZWRJRCA9PT0gd2lkICYmIHRoaXMuX3RleHR1cmVUcmltbWVkSUQgPT09IHR1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1UcmltbWVkSUQgPSB3aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVUcmltbWVkSUQgPSB0dWlkO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YTtcclxuICAgICAgICAgICAgdmFyIG9yaWcgPSB0ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSB0aGlzLl9hbmNob3I7XHJcbiAgICAgICAgICAgIHZhciB3MSA9IC1hbmNob3IuX3ggKiBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgdzAgPSB3MSArIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoMSA9IC1hbmNob3IuX3kgKiBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGgwID0gaDEgKyBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fc3VyZmFjZSkge1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IHcxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IGgxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IHcwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IGgxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IHcwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IGgwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IHcxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IGgwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qLl9zdXJmYWNlLmJvdW5kc1F1YWQodmVydGV4RGF0YSwgdmVydGV4RGF0YSwgdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHd0ID0gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IHd0LmE7XHJcbiAgICAgICAgICAgICAgICB2YXIgYiA9IHd0LmI7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHd0LmM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHd0LmQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHggPSB3dC50eDtcclxuICAgICAgICAgICAgICAgIHZhciB0eSA9IHd0LnR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IChhICogdzEpICsgKGMgKiBoMSkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSAoZCAqIGgxKSArIChiICogdzEpICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gKGEgKiB3MCkgKyAoYyAqIGgxKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IChkICogaDEpICsgKGIgKiB3MCkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSAoYSAqIHcwKSArIChjICogaDApICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gKGQgKiBoMCkgKyAoYiAqIHcwKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IChhICogdzEpICsgKGMgKiBoMCkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSAoZCAqIGgwKSArIChiICogdzEpICsgdHk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uLnN1cmZhY2UuYm91bmRzUXVhZCh2ZXJ0ZXhEYXRhLCB2ZXJ0ZXhEYXRhLCB0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24ubGVnYWN5LndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNwcml0ZTJzLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvajtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZTJzO1xyXG4gICAgfShQSVhJLlNwcml0ZSkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzID0gU3ByaXRlMnM7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBUZXh0MnMgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhUZXh0MnMsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gVGV4dDJzKHRleHQsIHN0eWxlLCBjYW52YXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dCwgc3R5bGUsIGNhbnZhcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuYVRyYW5zID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25TdXJmYWNlKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlX2JpbGluZWFyJztcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGV4dDJzLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvajtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFRleHQycztcclxuICAgIH0oUElYSS5UZXh0KSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uVGV4dDJzID0gVGV4dDJzO1xyXG4gICAgVGV4dDJzLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXM7XHJcbiAgICBUZXh0MnMucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzO1xyXG4gICAgVGV4dDJzLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICBmdW5jdGlvbiBjb250YWluZXIyZFdvcmxkVHJhbnNmb3JtKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICB9XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSA9IGNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm07XHJcbiAgICB2YXIgQ29udGFpbmVyMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhDb250YWluZXIyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBDb250YWluZXIyZCgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbnRhaW5lcjJkLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIENvbnRhaW5lcjJkO1xyXG4gICAgfShQSVhJLkNvbnRhaW5lcikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLkNvbnRhaW5lcjJkID0gQ29udGFpbmVyMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBQb2ludCA9IFBJWEkuUG9pbnQ7XHJcbiAgICB2YXIgbWF0M2lkID0gWzEsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDFdO1xyXG4gICAgdmFyIEFGRklORTtcclxuICAgIChmdW5jdGlvbiAoQUZGSU5FKSB7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIk5PTkVcIl0gPSAwXSA9IFwiTk9ORVwiO1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJGUkVFXCJdID0gMV0gPSBcIkZSRUVcIjtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiQVhJU19YXCJdID0gMl0gPSBcIkFYSVNfWFwiO1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJBWElTX1lcIl0gPSAzXSA9IFwiQVhJU19ZXCI7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIlBPSU5UXCJdID0gNF0gPSBcIlBPSU5UXCI7XHJcbiAgICB9KShBRkZJTkUgPSBwaXhpX3Byb2plY3Rpb24uQUZGSU5FIHx8IChwaXhpX3Byb2plY3Rpb24uQUZGSU5FID0ge30pKTtcclxuICAgIHZhciBNYXRyaXgyZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gTWF0cml4MmQoYmFja2luZ0FycmF5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmxvYXRBcnJheSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMubWF0MyA9IG5ldyBGbG9hdDY0QXJyYXkoYmFja2luZ0FycmF5IHx8IG1hdDNpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwiYVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1swXTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1swXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcImJcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbMV07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbMV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJjXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzNdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzNdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwiZFwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1s0XTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1s0XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcInR4XCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzZdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzZdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwidHlcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbN107XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbN10gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB0eCwgdHkpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSBhO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gYjtcclxuICAgICAgICAgICAgbWF0M1syXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSBjO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gZDtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSB0eDtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IHR5O1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gMTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICh0cmFuc3Bvc2UsIG91dCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZmxvYXRBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG9hdEFycmF5ID0gbmV3IEZsb2F0MzJBcnJheSg5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBvdXQgfHwgdGhpcy5mbG9hdEFycmF5O1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgaWYgKHRyYW5zcG9zZSkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMF0gPSBtYXQzWzBdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMV0gPSBtYXQzWzFdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMl0gPSBtYXQzWzJdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbM10gPSBtYXQzWzNdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNF0gPSBtYXQzWzRdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNV0gPSBtYXQzWzVdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNl0gPSBtYXQzWzZdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbN10gPSBtYXQzWzddO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbOF0gPSBtYXQzWzhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMF0gPSBtYXQzWzBdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMV0gPSBtYXQzWzNdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMl0gPSBtYXQzWzZdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbM10gPSBtYXQzWzFdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNF0gPSBtYXQzWzRdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNV0gPSBtYXQzWzddO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNl0gPSBtYXQzWzJdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbN10gPSBtYXQzWzVdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbOF0gPSBtYXQzWzhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLng7XHJcbiAgICAgICAgICAgIHZhciB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciB6ID0gMS4wIC8gKG1hdDNbMl0gKiB4ICsgbWF0M1s1XSAqIHkgKyBtYXQzWzhdKTtcclxuICAgICAgICAgICAgbmV3UG9zLnggPSB6ICogKG1hdDNbMF0gKiB4ICsgbWF0M1szXSAqIHkgKyBtYXQzWzZdKTtcclxuICAgICAgICAgICAgbmV3UG9zLnkgPSB6ICogKG1hdDNbMV0gKiB4ICsgbWF0M1s0XSAqIHkgKyBtYXQzWzddKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS50cmFuc2xhdGUgPSBmdW5jdGlvbiAodHgsIHR5KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdICs9IHR4ICogbWF0M1syXTtcclxuICAgICAgICAgICAgbWF0M1sxXSArPSB0eSAqIG1hdDNbMl07XHJcbiAgICAgICAgICAgIG1hdDNbM10gKz0gdHggKiBtYXQzWzVdO1xyXG4gICAgICAgICAgICBtYXQzWzRdICs9IHR5ICogbWF0M1s1XTtcclxuICAgICAgICAgICAgbWF0M1s2XSArPSB0eCAqIG1hdDNbOF07XHJcbiAgICAgICAgICAgIG1hdDNbN10gKz0gdHkgKiBtYXQzWzhdO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdICo9IHg7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gKj0geTtcclxuICAgICAgICAgICAgbWF0M1szXSAqPSB4O1xyXG4gICAgICAgICAgICBtYXQzWzRdICo9IHk7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gKj0geDtcclxuICAgICAgICAgICAgbWF0M1s3XSAqPSB5O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zY2FsZUFuZFRyYW5zbGF0ZSA9IGZ1bmN0aW9uIChzY2FsZVgsIHNjYWxlWSwgdHgsIHR5KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gc2NhbGVYICogbWF0M1swXSArIHR4ICogbWF0M1syXTtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IHNjYWxlWSAqIG1hdDNbMV0gKyB0eSAqIG1hdDNbMl07XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSBzY2FsZVggKiBtYXQzWzNdICsgdHggKiBtYXQzWzVdO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gc2NhbGVZICogbWF0M1s0XSArIHR5ICogbWF0M1s1XTtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IHNjYWxlWCAqIG1hdDNbNl0gKyB0eCAqIG1hdDNbOF07XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSBzY2FsZVkgKiBtYXQzWzddICsgdHkgKiBtYXQzWzhdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmFwcGx5SW52ZXJzZSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBhID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54O1xyXG4gICAgICAgICAgICB2YXIgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVszXSwgYTAyID0gYVs2XSwgYTEwID0gYVsxXSwgYTExID0gYVs0XSwgYTEyID0gYVs3XSwgYTIwID0gYVsyXSwgYTIxID0gYVs1XSwgYTIyID0gYVs4XTtcclxuICAgICAgICAgICAgdmFyIG5ld1ggPSAoYTIyICogYTExIC0gYTEyICogYTIxKSAqIHggKyAoLWEyMiAqIGEwMSArIGEwMiAqIGEyMSkgKiB5ICsgKGExMiAqIGEwMSAtIGEwMiAqIGExMSk7XHJcbiAgICAgICAgICAgIHZhciBuZXdZID0gKC1hMjIgKiBhMTAgKyBhMTIgKiBhMjApICogeCArIChhMjIgKiBhMDAgLSBhMDIgKiBhMjApICogeSArICgtYTEyICogYTAwICsgYTAyICogYTEwKTtcclxuICAgICAgICAgICAgdmFyIG5ld1ogPSAoYTIxICogYTEwIC0gYTExICogYTIwKSAqIHggKyAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCkgKiB5ICsgKGExMSAqIGEwMCAtIGEwMSAqIGExMCk7XHJcbiAgICAgICAgICAgIG5ld1Bvcy54ID0gbmV3WCAvIG5ld1o7XHJcbiAgICAgICAgICAgIG5ld1Bvcy55ID0gbmV3WSAvIG5ld1o7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgYSA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGExMCA9IGFbM10sIGExMSA9IGFbNF0sIGExMiA9IGFbNV0sIGEyMCA9IGFbNl0sIGEyMSA9IGFbN10sIGEyMiA9IGFbOF0sIGIwMSA9IGEyMiAqIGExMSAtIGExMiAqIGEyMSwgYjExID0gLWEyMiAqIGExMCArIGExMiAqIGEyMCwgYjIxID0gYTIxICogYTEwIC0gYTExICogYTIwO1xyXG4gICAgICAgICAgICB2YXIgZGV0ID0gYTAwICogYjAxICsgYTAxICogYjExICsgYTAyICogYjIxO1xyXG4gICAgICAgICAgICBpZiAoIWRldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGV0ID0gMS4wIC8gZGV0O1xyXG4gICAgICAgICAgICBhWzBdID0gYjAxICogZGV0O1xyXG4gICAgICAgICAgICBhWzFdID0gKC1hMjIgKiBhMDEgKyBhMDIgKiBhMjEpICogZGV0O1xyXG4gICAgICAgICAgICBhWzJdID0gKGExMiAqIGEwMSAtIGEwMiAqIGExMSkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbM10gPSBiMTEgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbNF0gPSAoYTIyICogYTAwIC0gYTAyICogYTIwKSAqIGRldDtcclxuICAgICAgICAgICAgYVs1XSA9ICgtYTEyICogYTAwICsgYTAyICogYTEwKSAqIGRldDtcclxuICAgICAgICAgICAgYVs2XSA9IGIyMSAqIGRldDtcclxuICAgICAgICAgICAgYVs3XSA9ICgtYTIxICogYTAwICsgYTAxICogYTIwKSAqIGRldDtcclxuICAgICAgICAgICAgYVs4XSA9IChhMTEgKiBhMDAgLSBhMDEgKiBhMTApICogZGV0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5pZGVudGl0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSAxO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gMDtcclxuICAgICAgICAgICAgbWF0M1syXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gMTtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzddID0gMDtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdHJpeDJkKHRoaXMubWF0Myk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuY29weVRvID0gZnVuY3Rpb24gKG1hdHJpeCkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGFyMiA9IG1hdHJpeC5tYXQzO1xyXG4gICAgICAgICAgICBhcjJbMF0gPSBtYXQzWzBdO1xyXG4gICAgICAgICAgICBhcjJbMV0gPSBtYXQzWzFdO1xyXG4gICAgICAgICAgICBhcjJbMl0gPSBtYXQzWzJdO1xyXG4gICAgICAgICAgICBhcjJbM10gPSBtYXQzWzNdO1xyXG4gICAgICAgICAgICBhcjJbNF0gPSBtYXQzWzRdO1xyXG4gICAgICAgICAgICBhcjJbNV0gPSBtYXQzWzVdO1xyXG4gICAgICAgICAgICBhcjJbNl0gPSBtYXQzWzZdO1xyXG4gICAgICAgICAgICBhcjJbN10gPSBtYXQzWzddO1xyXG4gICAgICAgICAgICBhcjJbOF0gPSBtYXQzWzhdO1xyXG4gICAgICAgICAgICByZXR1cm4gbWF0cml4O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAobWF0cml4LCBhZmZpbmUpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBkID0gMS4wIC8gbWF0M1s4XTtcclxuICAgICAgICAgICAgdmFyIHR4ID0gbWF0M1s2XSAqIGQsIHR5ID0gbWF0M1s3XSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC5hID0gKG1hdDNbMF0gLSBtYXQzWzJdICogdHgpICogZDtcclxuICAgICAgICAgICAgbWF0cml4LmIgPSAobWF0M1sxXSAtIG1hdDNbMl0gKiB0eSkgKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXguYyA9IChtYXQzWzNdIC0gbWF0M1s1XSAqIHR4KSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC5kID0gKG1hdDNbNF0gLSBtYXQzWzVdICogdHkpICogZDtcclxuICAgICAgICAgICAgbWF0cml4LnR4ID0gdHg7XHJcbiAgICAgICAgICAgIG1hdHJpeC50eSA9IHR5O1xyXG4gICAgICAgICAgICBpZiAoYWZmaW5lID49IDIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhZmZpbmUgPT09IEFGRklORS5QT0lOVCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5hID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5kID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFmZmluZSA9PT0gQUZGSU5FLkFYSVNfWCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5jID0gLW1hdHJpeC5iO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5kID0gbWF0cml4LmE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhZmZpbmUgPT09IEFGRklORS5BWElTX1kpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYSA9IG1hdHJpeC5kO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5jID0gLW1hdHJpeC5iO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuY29weUZyb20gPSBmdW5jdGlvbiAobWF0cml4KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gbWF0cml4LmE7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSBtYXRyaXguYjtcclxuICAgICAgICAgICAgbWF0M1syXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSBtYXRyaXguYztcclxuICAgICAgICAgICAgbWF0M1s0XSA9IG1hdHJpeC5kO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IG1hdHJpeC50eDtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IG1hdHJpeC50eTtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IDEuMDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2V0VG9NdWx0TGVnYWN5ID0gZnVuY3Rpb24gKHB0LCBsdCkge1xyXG4gICAgICAgICAgICB2YXIgb3V0ID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYiA9IGx0Lm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhMDAgPSBwdC5hLCBhMDEgPSBwdC5iLCBhMTAgPSBwdC5jLCBhMTEgPSBwdC5kLCBhMjAgPSBwdC50eCwgYTIxID0gcHQudHksIGIwMCA9IGJbMF0sIGIwMSA9IGJbMV0sIGIwMiA9IGJbMl0sIGIxMCA9IGJbM10sIGIxMSA9IGJbNF0sIGIxMiA9IGJbNV0sIGIyMCA9IGJbNl0sIGIyMSA9IGJbN10sIGIyMiA9IGJbOF07XHJcbiAgICAgICAgICAgIG91dFswXSA9IGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzFdID0gYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbMl0gPSBiMDI7XHJcbiAgICAgICAgICAgIG91dFszXSA9IGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzRdID0gYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbNV0gPSBiMTI7XHJcbiAgICAgICAgICAgIG91dFs2XSA9IGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzddID0gYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbOF0gPSBiMjI7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNldFRvTXVsdDJkID0gZnVuY3Rpb24gKHB0LCBsdCkge1xyXG4gICAgICAgICAgICB2YXIgb3V0ID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYSA9IHB0Lm1hdDMsIGIgPSBsdC5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTEwID0gYVszXSwgYTExID0gYVs0XSwgYTEyID0gYVs1XSwgYTIwID0gYVs2XSwgYTIxID0gYVs3XSwgYTIyID0gYVs4XSwgYjAwID0gYlswXSwgYjAxID0gYlsxXSwgYjAyID0gYlsyXSwgYjEwID0gYlszXSwgYjExID0gYls0XSwgYjEyID0gYls1XSwgYjIwID0gYls2XSwgYjIxID0gYls3XSwgYjIyID0gYls4XTtcclxuICAgICAgICAgICAgb3V0WzBdID0gYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbMV0gPSBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFsyXSA9IGIwMCAqIGEwMiArIGIwMSAqIGExMiArIGIwMiAqIGEyMjtcclxuICAgICAgICAgICAgb3V0WzNdID0gYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbNF0gPSBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFs1XSA9IGIxMCAqIGEwMiArIGIxMSAqIGExMiArIGIxMiAqIGEyMjtcclxuICAgICAgICAgICAgb3V0WzZdID0gYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbN10gPSBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFs4XSA9IGIyMCAqIGEwMiArIGIyMSAqIGExMiArIGIyMiAqIGEyMjtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5JREVOVElUWSA9IG5ldyBNYXRyaXgyZCgpO1xyXG4gICAgICAgIE1hdHJpeDJkLlRFTVBfTUFUUklYID0gbmV3IE1hdHJpeDJkKCk7XHJcbiAgICAgICAgcmV0dXJuIE1hdHJpeDJkO1xyXG4gICAgfSgpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCA9IE1hdHJpeDJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1IYWNrKHBhcmVudFRyYW5zZm9ybSkge1xyXG4gICAgICAgIHZhciBwcm9qID0gdGhpcy5wcm9qO1xyXG4gICAgICAgIHZhciB0YSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHB3aWQgPSBwYXJlbnRUcmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgdmFyIGx0ID0gdGEubG9jYWxUcmFuc2Zvcm07XHJcbiAgICAgICAgaWYgKHRhLl9sb2NhbElEICE9PSB0YS5fY3VycmVudExvY2FsSUQpIHtcclxuICAgICAgICAgICAgbHQuYSA9IHRhLl9jeCAqIHRhLnNjYWxlLl94O1xyXG4gICAgICAgICAgICBsdC5iID0gdGEuX3N4ICogdGEuc2NhbGUuX3g7XHJcbiAgICAgICAgICAgIGx0LmMgPSB0YS5fY3kgKiB0YS5zY2FsZS5feTtcclxuICAgICAgICAgICAgbHQuZCA9IHRhLl9zeSAqIHRhLnNjYWxlLl95O1xyXG4gICAgICAgICAgICBsdC50eCA9IHRhLnBvc2l0aW9uLl94IC0gKCh0YS5waXZvdC5feCAqIGx0LmEpICsgKHRhLnBpdm90Ll95ICogbHQuYykpO1xyXG4gICAgICAgICAgICBsdC50eSA9IHRhLnBvc2l0aW9uLl95IC0gKCh0YS5waXZvdC5feCAqIGx0LmIpICsgKHRhLnBpdm90Ll95ICogbHQuZCkpO1xyXG4gICAgICAgICAgICB0YS5fY3VycmVudExvY2FsSUQgPSB0YS5fbG9jYWxJRDtcclxuICAgICAgICAgICAgcHJvai5fY3VycmVudFByb2pJRCA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgX21hdHJpeElEID0gcHJvai5fcHJvaklEO1xyXG4gICAgICAgIGlmIChwcm9qLl9jdXJyZW50UHJvaklEICE9PSBfbWF0cml4SUQpIHtcclxuICAgICAgICAgICAgcHJvai5fY3VycmVudFByb2pJRCA9IF9tYXRyaXhJRDtcclxuICAgICAgICAgICAgaWYgKF9tYXRyaXhJRCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcHJvai5sb2NhbC5zZXRUb011bHRMZWdhY3kobHQsIHByb2oubWF0cml4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByb2oubG9jYWwuY29weUZyb20obHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhLl9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGEuX3BhcmVudElEICE9PSBwd2lkKSB7XHJcbiAgICAgICAgICAgIHZhciBwcCA9IHBhcmVudFRyYW5zZm9ybS5wcm9qO1xyXG4gICAgICAgICAgICBpZiAocHAgJiYgIXBwLmFmZmluZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvai53b3JsZC5zZXRUb011bHQyZChwcC53b3JsZCwgcHJvai5sb2NhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qLndvcmxkLnNldFRvTXVsdExlZ2FjeShwYXJlbnRUcmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0sIHByb2oubG9jYWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb2oud29ybGQuY29weSh0YS53b3JsZFRyYW5zZm9ybSwgcHJvai5fYWZmaW5lKTtcclxuICAgICAgICAgICAgdGEuX3BhcmVudElEID0gcHdpZDtcclxuICAgICAgICAgICAgdGEuX3dvcmxkSUQrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB2YXIgdDAgPSBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgdmFyIHR0ID0gW25ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCldO1xyXG4gICAgdmFyIHRlbXBSZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKCk7XHJcbiAgICB2YXIgdGVtcE1hdCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgIHZhciBQcm9qZWN0aW9uMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhQcm9qZWN0aW9uMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gUHJvamVjdGlvbjJkKGxlZ2FjeSwgZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGxlZ2FjeSwgZW5hYmxlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5tYXRyaXggPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICAgICAgICAgIF90aGlzLmxvY2FsID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgICAgICAgICBfdGhpcy53b3JsZCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb2pJRCA9IDA7XHJcbiAgICAgICAgICAgIF90aGlzLl9jdXJyZW50UHJvaklEID0gLTE7XHJcbiAgICAgICAgICAgIF90aGlzLl9hZmZpbmUgPSBwaXhpX3Byb2plY3Rpb24uQUZGSU5FLk5PTkU7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb24yZC5wcm90b3R5cGUsIFwiYWZmaW5lXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWZmaW5lO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FmZmluZSA9PSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hZmZpbmUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRQcm9qSUQgPSAtMTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb24yZC5wcm90b3R5cGUsIFwiZW5hYmxlZFwiLCB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuX2VuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS51cGRhdGVUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1IYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kudXBkYXRlVHJhbnNmb3JtID0gUElYSS5UcmFuc2Zvcm1TdGF0aWMucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5zZXRBeGlzWCA9IGZ1bmN0aW9uIChwLCBmYWN0b3IpIHtcclxuICAgICAgICAgICAgaWYgKGZhY3RvciA9PT0gdm9pZCAwKSB7IGZhY3RvciA9IDE7IH1cclxuICAgICAgICAgICAgdmFyIHggPSBwLngsIHkgPSBwLnk7XHJcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0cml4Lm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSB4IC8gZDtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IHkgLyBkO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gZmFjdG9yIC8gZDtcclxuICAgICAgICAgICAgdGhpcy5fcHJvaklEKys7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLnNldEF4aXNZID0gZnVuY3Rpb24gKHAsIGZhY3Rvcikge1xyXG4gICAgICAgICAgICBpZiAoZmFjdG9yID09PSB2b2lkIDApIHsgZmFjdG9yID0gMTsgfVxyXG4gICAgICAgICAgICB2YXIgeCA9IHAueCwgeSA9IHAueTtcclxuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXRyaXgubWF0MztcclxuICAgICAgICAgICAgbWF0M1szXSA9IHggLyBkO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0geSAvIGQ7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSBmYWN0b3IgLyBkO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qSUQrKztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUubWFwU3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZSwgcXVhZCkge1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLnRleHR1cmU7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnggPSAtc3ByaXRlLmFuY2hvci54ICogdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnkgPSAtc3ByaXRlLmFuY2hvci55ICogdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC53aWR0aCA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC5oZWlnaHQgPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcFF1YWQodGVtcFJlY3QsIHF1YWQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5tYXBRdWFkID0gZnVuY3Rpb24gKHJlY3QsIHApIHtcclxuICAgICAgICAgICAgdHRbMF0uc2V0KHJlY3QueCwgcmVjdC55KTtcclxuICAgICAgICAgICAgdHRbMV0uc2V0KHJlY3QueCArIHJlY3Qud2lkdGgsIHJlY3QueSk7XHJcbiAgICAgICAgICAgIHR0WzJdLnNldChyZWN0LnggKyByZWN0LndpZHRoLCByZWN0LnkgKyByZWN0LmhlaWdodCk7XHJcbiAgICAgICAgICAgIHR0WzNdLnNldChyZWN0LngsIHJlY3QueSArIHJlY3QuaGVpZ2h0KTtcclxuICAgICAgICAgICAgdmFyIGsxID0gMSwgazIgPSAyLCBrMyA9IDM7XHJcbiAgICAgICAgICAgIHZhciBmID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLmdldEludGVyc2VjdGlvbkZhY3RvcihwWzBdLCBwWzJdLCBwWzFdLCBwWzNdLCB0MCk7XHJcbiAgICAgICAgICAgIGlmIChmICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBrMSA9IDE7XHJcbiAgICAgICAgICAgICAgICBrMiA9IDM7XHJcbiAgICAgICAgICAgICAgICBrMyA9IDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGQwID0gTWF0aC5zcXJ0KChwWzBdLnggLSB0MC54KSAqIChwWzBdLnggLSB0MC54KSArIChwWzBdLnkgLSB0MC55KSAqIChwWzBdLnkgLSB0MC55KSk7XHJcbiAgICAgICAgICAgIHZhciBkMSA9IE1hdGguc3FydCgocFtrMV0ueCAtIHQwLngpICogKHBbazFdLnggLSB0MC54KSArIChwW2sxXS55IC0gdDAueSkgKiAocFtrMV0ueSAtIHQwLnkpKTtcclxuICAgICAgICAgICAgdmFyIGQyID0gTWF0aC5zcXJ0KChwW2syXS54IC0gdDAueCkgKiAocFtrMl0ueCAtIHQwLngpICsgKHBbazJdLnkgLSB0MC55KSAqIChwW2syXS55IC0gdDAueSkpO1xyXG4gICAgICAgICAgICB2YXIgZDMgPSBNYXRoLnNxcnQoKHBbazNdLnggLSB0MC54KSAqIChwW2szXS54IC0gdDAueCkgKyAocFtrM10ueSAtIHQwLnkpICogKHBbazNdLnkgLSB0MC55KSk7XHJcbiAgICAgICAgICAgIHZhciBxMCA9IChkMCArIGQzKSAvIGQzO1xyXG4gICAgICAgICAgICB2YXIgcTEgPSAoZDEgKyBkMikgLyBkMjtcclxuICAgICAgICAgICAgdmFyIHEyID0gKGQxICsgZDIpIC8gZDE7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXRyaXgubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IHR0WzBdLnggKiBxMDtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IHR0WzBdLnkgKiBxMDtcclxuICAgICAgICAgICAgbWF0M1syXSA9IHEwO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gdHRbazFdLnggKiBxMTtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IHR0W2sxXS55ICogcTE7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSBxMTtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IHR0W2syXS54ICogcTI7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSB0dFtrMl0ueSAqIHEyO1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gcTI7XHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4LmludmVydCgpO1xyXG4gICAgICAgICAgICBtYXQzID0gdGVtcE1hdC5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gcFswXS54O1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gcFswXS55O1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gMTtcclxuICAgICAgICAgICAgbWF0M1szXSA9IHBbazFdLng7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSBwW2sxXS55O1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gMTtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IHBbazJdLng7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSBwW2syXS55O1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gMTtcclxuICAgICAgICAgICAgdGhpcy5tYXRyaXguc2V0VG9NdWx0MmQodGVtcE1hdCwgdGhpcy5tYXRyaXgpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qSUQrKztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRQcm9qSUQgPSAtMTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvaklEID0gMDtcclxuICAgICAgICAgICAgdGhpcy5tYXRyaXguaWRlbnRpdHkoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBQcm9qZWN0aW9uMmQ7XHJcbiAgICB9KHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkID0gUHJvamVjdGlvbjJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgTWVzaDJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoTWVzaDJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIE1lc2gyZCh0ZXh0dXJlLCB2ZXJ0aWNlcywgdXZzLCBpbmRpY2VzLCBkcmF3TW9kZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0dXJlLCB2ZXJ0aWNlcywgdXZzLCBpbmRpY2VzLCBkcmF3TW9kZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnbWVzaDJkJztcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVzaDJkLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIE1lc2gyZDtcclxuICAgIH0oUElYSS5tZXNoLk1lc2gpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5NZXNoMmQgPSBNZXNoMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBzaGFkZXJWZXJ0ID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIHRyYW5zbGF0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyB1VHJhbnNmb3JtO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24ueHl3ID0gcHJvamVjdGlvbk1hdHJpeCAqIHRyYW5zbGF0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuICAgIGdsX1Bvc2l0aW9uLnogPSAwLjA7XFxuXFxuICAgIHZUZXh0dXJlQ29vcmQgPSAodVRyYW5zZm9ybSAqIHZlYzMoYVRleHR1cmVDb29yZCwgMS4wKSkueHk7XFxufVxcblwiO1xyXG4gICAgdmFyIHNoYWRlckZyYWcgPSBcIlxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gdmVjNCB1Q29sb3I7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpICogdUNvbG9yO1xcbn1cIjtcclxuICAgIHZhciBNZXNoMmRSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKE1lc2gyZFJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIE1lc2gyZFJlbmRlcmVyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE1lc2gyZFJlbmRlcmVyLnByb3RvdHlwZS5vbkNvbnRleHRDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhZGVyID0gbmV3IFBJWEkuU2hhZGVyKGdsLCBzaGFkZXJWZXJ0LCBzaGFkZXJGcmFnKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBNZXNoMmRSZW5kZXJlcjtcclxuICAgIH0oUElYSS5tZXNoLk1lc2hSZW5kZXJlcikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLk1lc2gyZFJlbmRlcmVyID0gTWVzaDJkUmVuZGVyZXI7XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ21lc2gyZCcsIE1lc2gyZFJlbmRlcmVyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgUElYSS5TcHJpdGUucHJvdG90eXBlLmNvbnZlcnRUbzJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUJvdW5kcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcztcclxuICAgICAgICB0aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZTJkJztcclxuICAgICAgICB0aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDEyKTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogcGl4aV9wcm9qZWN0aW9uLmNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBJWEkubWVzaC5NZXNoLnByb3RvdHlwZS5jb252ZXJ0VG8yZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIHRoaXMucGx1Z2luTmFtZSA9ICdtZXNoMmQnO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBwaXhpX3Byb2plY3Rpb24uY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRUbzJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IHBpeGlfcHJvamVjdGlvbi5jb250YWluZXIyZFdvcmxkVHJhbnNmb3JtLFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFN1YnRyZWVUbzJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY29udmVydFRvMmQoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5jb252ZXJ0U3VidHJlZVRvMmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgU3ByaXRlMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGUyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGUyZCh0ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHR1cmUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZChfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZTJkJztcclxuICAgICAgICAgICAgX3RoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMTIpO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZTJkLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcygpO1xyXG4gICAgICAgICAgICB0aGlzLl9ib3VuZHMuYWRkUXVhZCh0aGlzLnZlcnRleFRyaW1tZWREYXRhKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fYWZmaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52ZXJ0ZXhEYXRhLmxlbmd0aCAhPSA4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSg4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy52ZXJ0ZXhEYXRhLmxlbmd0aCAhPSAxMikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSgxMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHdpZCA9IHRoaXMudHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgICAgICB2YXIgdHVpZCA9IHRoaXMuX3RleHR1cmUuX3VwZGF0ZUlEO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdHJhbnNmb3JtSUQgPT09IHdpZCAmJiB0aGlzLl90ZXh0dXJlSUQgPT09IHR1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1JRCA9IHdpZDtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUlEID0gdHVpZDtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgd3QgPSB0aGlzLnByb2oud29ybGQubWF0MztcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSB0aGlzLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB0cmltID0gdGV4dHVyZS50cmltO1xyXG4gICAgICAgICAgICB2YXIgb3JpZyA9IHRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgdmFyIGFuY2hvciA9IHRoaXMuX2FuY2hvcjtcclxuICAgICAgICAgICAgdmFyIHcwID0gMDtcclxuICAgICAgICAgICAgdmFyIHcxID0gMDtcclxuICAgICAgICAgICAgdmFyIGgwID0gMDtcclxuICAgICAgICAgICAgdmFyIGgxID0gMDtcclxuICAgICAgICAgICAgaWYgKHRyaW0pIHtcclxuICAgICAgICAgICAgICAgIHcxID0gdHJpbS54IC0gKGFuY2hvci5feCAqIG9yaWcud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgdzAgPSB3MSArIHRyaW0ud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBoMSA9IHRyaW0ueSAtIChhbmNob3IuX3kgKiBvcmlnLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBoMCA9IGgxICsgdHJpbS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3MSA9IC1hbmNob3IuX3ggKiBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgdzAgPSB3MSArIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBoMSA9IC1hbmNob3IuX3kgKiBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIGgwID0gaDEgKyBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gKHd0WzBdICogdzEpICsgKHd0WzNdICogaDEpICsgd3RbNl07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSAod3RbMV0gKiB3MSkgKyAod3RbNF0gKiBoMSkgKyB3dFs3XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9ICh3dFsyXSAqIHcxKSArICh3dFs1XSAqIGgxKSArIHd0WzhdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gKHd0WzBdICogdzApICsgKHd0WzNdICogaDEpICsgd3RbNl07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSAod3RbMV0gKiB3MCkgKyAod3RbNF0gKiBoMSkgKyB3dFs3XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9ICh3dFsyXSAqIHcwKSArICh3dFs1XSAqIGgxKSArIHd0WzhdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gKHd0WzBdICogdzApICsgKHd0WzNdICogaDApICsgd3RbNl07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSAod3RbMV0gKiB3MCkgKyAod3RbNF0gKiBoMCkgKyB3dFs3XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs4XSA9ICh3dFsyXSAqIHcwKSArICh3dFs1XSAqIGgwKSArIHd0WzhdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzldID0gKHd0WzBdICogdzEpICsgKHd0WzNdICogaDApICsgd3RbNl07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMTBdID0gKHd0WzFdICogdzEpICsgKHd0WzRdICogaDApICsgd3RbN107XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMTFdID0gKHd0WzJdICogdzEpICsgKHd0WzVdICogaDApICsgd3RbOF07XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9hZmZpbmUpIHtcclxuICAgICAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHdpZCA9IHRoaXMudHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgICAgICB2YXIgdHVpZCA9IHRoaXMuX3RleHR1cmUuX3VwZGF0ZUlEO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmVydGV4VHJpbW1lZERhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4VHJpbW1lZERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3RyYW5zZm9ybVRyaW1tZWRJRCA9PT0gd2lkICYmIHRoaXMuX3RleHR1cmVUcmltbWVkSUQgPT09IHR1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1UcmltbWVkSUQgPSB3aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVUcmltbWVkSUQgPSB0dWlkO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YTtcclxuICAgICAgICAgICAgdmFyIG9yaWcgPSB0ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSB0aGlzLl9hbmNob3I7XHJcbiAgICAgICAgICAgIHZhciB3dCA9IHRoaXMucHJvai53b3JsZC5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgdzEgPSAtYW5jaG9yLl94ICogb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIHcwID0gdzEgKyBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgaDEgPSAtYW5jaG9yLl95ICogb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBoMCA9IGgxICsgb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciB6ID0gMS4wIC8gKHd0WzJdICogdzEgKyB3dFs1XSAqIGgxICsgd3RbOF0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0geiAqICgod3RbMF0gKiB3MSkgKyAod3RbM10gKiBoMSkgKyB3dFs2XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSB6ICogKCh3dFsxXSAqIHcxKSArICh3dFs0XSAqIGgxKSArIHd0WzddKTtcclxuICAgICAgICAgICAgeiA9IDEuMCAvICh3dFsyXSAqIHcwICsgd3RbNV0gKiBoMSArIHd0WzhdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IHogKiAoKHd0WzBdICogdzApICsgKHd0WzNdICogaDEpICsgd3RbNl0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0geiAqICgod3RbMV0gKiB3MCkgKyAod3RbNF0gKiBoMSkgKyB3dFs3XSk7XHJcbiAgICAgICAgICAgIHogPSAxLjAgLyAod3RbMl0gKiB3MCArIHd0WzVdICogaDAgKyB3dFs4XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSB6ICogKCh3dFswXSAqIHcwKSArICh3dFszXSAqIGgwKSArIHd0WzZdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IHogKiAoKHd0WzFdICogdzApICsgKHd0WzRdICogaDApICsgd3RbN10pO1xyXG4gICAgICAgICAgICB6ID0gMS4wIC8gKHd0WzJdICogdzEgKyB3dFs1XSAqIGgwICsgd3RbOF0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0geiAqICgod3RbMF0gKiB3MSkgKyAod3RbM10gKiBoMCkgKyB3dFs2XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSB6ICogKCh3dFsxXSAqIHcxKSArICh3dFs0XSAqIGgwKSArIHd0WzddKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTcHJpdGUyZC5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBTcHJpdGUyZDtcclxuICAgIH0oUElYSS5TcHJpdGUpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZCA9IFNwcml0ZTJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wuTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICB2YXIgU3ByaXRlMmRSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZTJkUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlMmRSZW5kZXJlcigpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlclZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5hdHRyaWJ1dGUgdmVjNCBhQ29sb3I7XFxuYXR0cmlidXRlIGZsb2F0IGFUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbiAgICBnbF9Qb3NpdGlvbi54eXcgPSBwcm9qZWN0aW9uTWF0cml4ICogYVZlcnRleFBvc2l0aW9uO1xcbiAgICBnbF9Qb3NpdGlvbi56ID0gMC4wO1xcbiAgICBcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxuICAgIHZUZXh0dXJlSWQgPSBhVGV4dHVyZUlkO1xcbiAgICB2Q29sb3IgPSBhQ29sb3I7XFxufVxcblwiO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJGcmFnID0gXCJcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcnNbJWNvdW50JV07XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbnZlYzQgY29sb3I7XFxudmVjMiB0ZXh0dXJlQ29vcmQgPSB2VGV4dHVyZUNvb3JkO1xcbmZsb2F0IHRleHR1cmVJZCA9IGZsb29yKHZUZXh0dXJlSWQrMC41KTtcXG4lZm9ybG9vcCVcXG5nbF9GcmFnQ29sb3IgPSBjb2xvciAqIHZDb2xvcjtcXG59XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlMmRSZW5kZXJlci5wcm90b3R5cGUuY3JlYXRlVmFvID0gZnVuY3Rpb24gKHZlcnRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRTaXplID0gNjtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0Qnl0ZVNpemUgPSB0aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgdmFyIHZhbyA9IHRoaXMucmVuZGVyZXIuY3JlYXRlVmFvKClcclxuICAgICAgICAgICAgICAgIC5hZGRJbmRleCh0aGlzLmluZGV4QnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFWZXJ0ZXhQb3NpdGlvbiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVGV4dHVyZUNvb3JkLCBnbC5VTlNJR05FRF9TSE9SVCwgdHJ1ZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDMgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFDb2xvciwgZ2wuVU5TSUdORURfQllURSwgdHJ1ZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDQgKiA0KTtcclxuICAgICAgICAgICAgaWYgKGF0dHJzLmFUZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgICAgIHZhby5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVGV4dHVyZUlkLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA1ICogNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJkUmVuZGVyZXIucHJvdG90eXBlLmZpbGxWZXJ0aWNlcyA9IGZ1bmN0aW9uIChmbG9hdDMyVmlldywgdWludDMyVmlldywgaW5kZXgsIHNwcml0ZSwgYXJnYiwgdGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gc3ByaXRlLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB1dnMgPSBzcHJpdGUuX3RleHR1cmUuX3V2cy51dnNVaW50MzI7XHJcbiAgICAgICAgICAgIGlmICh2ZXJ0ZXhEYXRhLmxlbmd0aCA9PT0gOCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyZXIucm91bmRQaXhlbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb2x1dGlvbiA9IHRoaXMucmVuZGVyZXIucmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSAoKHZlcnRleERhdGFbMF0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gKCh2ZXJ0ZXhEYXRhWzFdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gKCh2ZXJ0ZXhEYXRhWzJdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9ICgodmVydGV4RGF0YVszXSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMl0gPSAoKHZlcnRleERhdGFbNF0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9ICgodmVydGV4RGF0YVs1XSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTRdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMThdID0gKCh2ZXJ0ZXhEYXRhWzZdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOV0gPSAoKHZlcnRleERhdGFbN10gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDIwXSA9IDEuMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9IHZlcnRleERhdGFbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9IHZlcnRleERhdGFbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gdmVydGV4RGF0YVsyXTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gdmVydGV4RGF0YVszXTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTJdID0gdmVydGV4RGF0YVs0XTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9IHZlcnRleERhdGFbNV07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxNF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOF0gPSB2ZXJ0ZXhEYXRhWzZdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTldID0gdmVydGV4RGF0YVs3XTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDIwXSA9IDEuMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9IHZlcnRleERhdGFbMF07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gdmVydGV4RGF0YVsxXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSB2ZXJ0ZXhEYXRhWzJdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9IHZlcnRleERhdGFbM107XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gdmVydGV4RGF0YVs0XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSB2ZXJ0ZXhEYXRhWzVdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMl0gPSB2ZXJ0ZXhEYXRhWzZdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSB2ZXJ0ZXhEYXRhWzddO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxNF0gPSB2ZXJ0ZXhEYXRhWzhdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOF0gPSB2ZXJ0ZXhEYXRhWzldO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOV0gPSB2ZXJ0ZXhEYXRhWzEwXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMjBdID0gdmVydGV4RGF0YVsxMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDNdID0gdXZzWzBdO1xyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgOV0gPSB1dnNbMV07XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAxNV0gPSB1dnNbMl07XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAyMV0gPSB1dnNbM107XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyA0XSA9IHVpbnQzMlZpZXdbaW5kZXggKyAxMF0gPSB1aW50MzJWaWV3W2luZGV4ICsgMTZdID0gdWludDMyVmlld1tpbmRleCArIDIyXSA9IGFyZ2I7XHJcbiAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNV0gPSBmbG9hdDMyVmlld1tpbmRleCArIDExXSA9IGZsb2F0MzJWaWV3W2luZGV4ICsgMTddID0gZmxvYXQzMlZpZXdbaW5kZXggKyAyM10gPSB0ZXh0dXJlSWQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlMmRSZW5kZXJlcjtcclxuICAgIH0oTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIpKTtcclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbignc3ByaXRlMmQnLCBTcHJpdGUyZFJlbmRlcmVyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFRleHQyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFRleHQyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBUZXh0MmQodGV4dCwgc3R5bGUsIGNhbnZhcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0LCBzdHlsZSwgY2FudmFzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGUyZCc7XHJcbiAgICAgICAgICAgIF90aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDEyKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGV4dDJkLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFRleHQyZDtcclxuICAgIH0oUElYSS5UZXh0KSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uVGV4dDJkID0gVGV4dDJkO1xyXG4gICAgVGV4dDJkLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXM7XHJcbiAgICBUZXh0MmQucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzO1xyXG4gICAgVGV4dDJkLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgUHJvamVjdGlvbnNNYW5hZ2VyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0aW9uc01hbmFnZXIocmVuZGVyZXIpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5vbkNvbnRleHRDaGFuZ2UgPSBmdW5jdGlvbiAoZ2wpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmdsID0gZ2w7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5yZW5kZXJlci5tYXNrTWFuYWdlci5wdXNoU3ByaXRlTWFzayA9IHB1c2hTcHJpdGVNYXNrO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyLm9uKCdjb250ZXh0JywgdGhpcy5vbkNvbnRleHRDaGFuZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBQcm9qZWN0aW9uc01hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIub2ZmKCdjb250ZXh0JywgdGhpcy5vbkNvbnRleHRDaGFuZ2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3Rpb25zTWFuYWdlcjtcclxuICAgIH0oKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbnNNYW5hZ2VyID0gUHJvamVjdGlvbnNNYW5hZ2VyO1xyXG4gICAgZnVuY3Rpb24gcHVzaFNwcml0ZU1hc2sodGFyZ2V0LCBtYXNrRGF0YSkge1xyXG4gICAgICAgIHZhciBhbHBoYU1hc2tGaWx0ZXIgPSB0aGlzLmFscGhhTWFza1Bvb2xbdGhpcy5hbHBoYU1hc2tJbmRleF07XHJcbiAgICAgICAgaWYgKCFhbHBoYU1hc2tGaWx0ZXIpIHtcclxuICAgICAgICAgICAgYWxwaGFNYXNrRmlsdGVyID0gdGhpcy5hbHBoYU1hc2tQb29sW3RoaXMuYWxwaGFNYXNrSW5kZXhdID0gW25ldyBwaXhpX3Byb2plY3Rpb24uU3ByaXRlTWFza0ZpbHRlcjJkKG1hc2tEYXRhKV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFscGhhTWFza0ZpbHRlclswXS5yZXNvbHV0aW9uID0gdGhpcy5yZW5kZXJlci5yZXNvbHV0aW9uO1xyXG4gICAgICAgIGFscGhhTWFza0ZpbHRlclswXS5tYXNrU3ByaXRlID0gbWFza0RhdGE7XHJcbiAgICAgICAgdGFyZ2V0LmZpbHRlckFyZWEgPSBtYXNrRGF0YS5nZXRCb3VuZHModHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5maWx0ZXJNYW5hZ2VyLnB1c2hGaWx0ZXIodGFyZ2V0LCBhbHBoYU1hc2tGaWx0ZXIpO1xyXG4gICAgICAgIHRoaXMuYWxwaGFNYXNrSW5kZXgrKztcclxuICAgIH1cclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbigncHJvamVjdGlvbnMnLCBQcm9qZWN0aW9uc01hbmFnZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgc3ByaXRlTWFza1ZlcnQgPSBcIlxcbmF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyBvdGhlck1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzMgdk1hc2tDb29yZDtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuXFx0Z2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuXFxuXFx0dlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxuXFx0dk1hc2tDb29yZCA9IG90aGVyTWF0cml4ICogdmVjMyggYVRleHR1cmVDb29yZCwgMS4wKTtcXG59XFxuXCI7XHJcbiAgICB2YXIgc3ByaXRlTWFza0ZyYWcgPSBcIlxcbnZhcnlpbmcgdmVjMyB2TWFza0Nvb3JkO1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgYWxwaGE7XFxudW5pZm9ybSBzYW1wbGVyMkQgbWFzaztcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIHZlYzIgdXYgPSB2TWFza0Nvb3JkLnh5IC8gdk1hc2tDb29yZC56O1xcbiAgICBcXG4gICAgdmVjMiB0ZXh0ID0gYWJzKCB1diAtIDAuNSApO1xcbiAgICB0ZXh0ID0gc3RlcCgwLjUsIHRleHQpO1xcblxcbiAgICBmbG9hdCBjbGlwID0gMS4wIC0gbWF4KHRleHQueSwgdGV4dC54KTtcXG4gICAgdmVjNCBvcmlnaW5hbCA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzQgbWFza3kgPSB0ZXh0dXJlMkQobWFzaywgdXYpO1xcblxcbiAgICBvcmlnaW5hbCAqPSAobWFza3kuciAqIG1hc2t5LmEgKiBhbHBoYSAqIGNsaXApO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBvcmlnaW5hbDtcXG59XFxuXCI7XHJcbiAgICB2YXIgdGVtcE1hdCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgIHZhciBTcHJpdGVNYXNrRmlsdGVyMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGVNYXNrRmlsdGVyMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlTWFza0ZpbHRlcjJkKHNwcml0ZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzcHJpdGVNYXNrVmVydCwgc3ByaXRlTWFza0ZyYWcpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLm1hc2tNYXRyaXggPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICAgICAgICAgIHNwcml0ZS5yZW5kZXJhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF90aGlzLm1hc2tTcHJpdGUgPSBzcHJpdGU7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlTWFza0ZpbHRlcjJkLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChmaWx0ZXJNYW5hZ2VyLCBpbnB1dCwgb3V0cHV0LCBjbGVhciwgY3VycmVudFN0YXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXNrU3ByaXRlID0gdGhpcy5tYXNrU3ByaXRlO1xyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1zLm1hc2sgPSBtYXNrU3ByaXRlLnRleHR1cmU7XHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybXMub3RoZXJNYXRyaXggPSBTcHJpdGVNYXNrRmlsdGVyMmQuY2FsY3VsYXRlU3ByaXRlTWF0cml4KGN1cnJlbnRTdGF0ZSwgdGhpcy5tYXNrTWF0cml4LCBtYXNrU3ByaXRlKTtcclxuICAgICAgICAgICAgdGhpcy51bmlmb3Jtcy5hbHBoYSA9IG1hc2tTcHJpdGUud29ybGRBbHBoYTtcclxuICAgICAgICAgICAgZmlsdGVyTWFuYWdlci5hcHBseUZpbHRlcih0aGlzLCBpbnB1dCwgb3V0cHV0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZU1hc2tGaWx0ZXIyZC5jYWxjdWxhdGVTcHJpdGVNYXRyaXggPSBmdW5jdGlvbiAoY3VycmVudFN0YXRlLCBtYXBwZWRNYXRyaXgsIHNwcml0ZSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvaiA9IHNwcml0ZS5wcm9qO1xyXG4gICAgICAgICAgICB2YXIgZmlsdGVyQXJlYSA9IGN1cnJlbnRTdGF0ZS5zb3VyY2VGcmFtZTtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmVTaXplID0gY3VycmVudFN0YXRlLnJlbmRlclRhcmdldC5zaXplO1xyXG4gICAgICAgICAgICB2YXIgd29ybGRUcmFuc2Zvcm0gPSBwcm9qICYmICFwcm9qLl9hZmZpbmUgPyBwcm9qLndvcmxkLmNvcHlUbyh0ZW1wTWF0KSA6IHRlbXBNYXQuY29weUZyb20oc3ByaXRlLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gc3ByaXRlLnRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgbWFwcGVkTWF0cml4LnNldCh0ZXh0dXJlU2l6ZS53aWR0aCwgMCwgMCwgdGV4dHVyZVNpemUuaGVpZ2h0LCBmaWx0ZXJBcmVhLngsIGZpbHRlckFyZWEueSk7XHJcbiAgICAgICAgICAgIHdvcmxkVHJhbnNmb3JtLmludmVydCgpO1xyXG4gICAgICAgICAgICBtYXBwZWRNYXRyaXguc2V0VG9NdWx0MmQod29ybGRUcmFuc2Zvcm0sIG1hcHBlZE1hdHJpeCk7XHJcbiAgICAgICAgICAgIG1hcHBlZE1hdHJpeC5zY2FsZUFuZFRyYW5zbGF0ZSgxLjAgLyB0ZXh0dXJlLndpZHRoLCAxLjAgLyB0ZXh0dXJlLmhlaWdodCwgc3ByaXRlLmFuY2hvci54LCBzcHJpdGUuYW5jaG9yLnkpO1xyXG4gICAgICAgICAgICByZXR1cm4gbWFwcGVkTWF0cml4O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZU1hc2tGaWx0ZXIyZDtcclxuICAgIH0oUElYSS5GaWx0ZXIpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TcHJpdGVNYXNrRmlsdGVyMmQgPSBTcHJpdGVNYXNrRmlsdGVyMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGl4aS1wcm9qZWN0aW9uLmpzLm1hcCIsIi8qIVxuICogcGl4aS1zb3VuZCAtIHYyLjAuMFxuICogaHR0cHM6Ly9naXRodWIuY29tL3BpeGlqcy9waXhpLXNvdW5kXG4gKiBDb21waWxlZCBUdWUsIDE0IE5vdiAyMDE3IDE3OjUzOjQ3IFVUQ1xuICpcbiAqIHBpeGktc291bmQgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KGUuX19waXhpU291bmQ9ZS5fX3BpeGlTb3VuZHx8e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHQoZSx0KXtmdW5jdGlvbiBuKCl7dGhpcy5jb25zdHJ1Y3Rvcj1lfW8oZSx0KSxlLnByb3RvdHlwZT1udWxsPT09dD9PYmplY3QuY3JlYXRlKHQpOihuLnByb3RvdHlwZT10LnByb3RvdHlwZSxuZXcgbil9aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFBJWEkpdGhyb3dcIlBpeGlKUyByZXF1aXJlZFwiO3ZhciBuPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe3RoaXMuX291dHB1dD10LHRoaXMuX2lucHV0PWV9cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImRlc3RpbmF0aW9uXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9pbnB1dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9maWx0ZXJzfSxzZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcztpZih0aGlzLl9maWx0ZXJzJiYodGhpcy5fZmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UmJmUuZGlzY29ubmVjdCgpfSksdGhpcy5fZmlsdGVycz1udWxsLHRoaXMuX2lucHV0LmNvbm5lY3QodGhpcy5fb3V0cHV0KSksZSYmZS5sZW5ndGgpe3RoaXMuX2ZpbHRlcnM9ZS5zbGljZSgwKSx0aGlzLl9pbnB1dC5kaXNjb25uZWN0KCk7dmFyIG49bnVsbDtlLmZvckVhY2goZnVuY3Rpb24oZSl7bnVsbD09PW4/dC5faW5wdXQuY29ubmVjdChlLmRlc3RpbmF0aW9uKTpuLmNvbm5lY3QoZS5kZXN0aW5hdGlvbiksbj1lfSksbi5jb25uZWN0KHRoaXMuX291dHB1dCl9fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmZpbHRlcnM9bnVsbCx0aGlzLl9pbnB1dD1udWxsLHRoaXMuX291dHB1dD1udWxsfSxlfSgpLG89T2JqZWN0LnNldFByb3RvdHlwZU9mfHx7X19wcm90b19fOltdfWluc3RhbmNlb2YgQXJyYXkmJmZ1bmN0aW9uKGUsdCl7ZS5fX3Byb3RvX189dH18fGZ1bmN0aW9uKGUsdCl7Zm9yKHZhciBuIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShuKSYmKGVbbl09dFtuXSl9LGk9MCxyPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dmFyIG49ZS5jYWxsKHRoaXMpfHx0aGlzO3JldHVybiBuLmlkPWkrKyxuLmluaXQodCksbn1yZXR1cm4gdChuLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInByb2dyZXNzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zb3VyY2UuY3VycmVudFRpbWUvdGhpcy5fZHVyYXRpb259LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicGF1c2VkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXVzZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9wYXVzZWQ9ZSx0aGlzLnJlZnJlc2hQYXVzZWQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5fb25QbGF5PWZ1bmN0aW9uKCl7dGhpcy5fcGxheWluZz0hMH0sbi5wcm90b3R5cGUuX29uUGF1c2U9ZnVuY3Rpb24oKXt0aGlzLl9wbGF5aW5nPSExfSxuLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGUpe3RoaXMuX3BsYXlpbmc9ITEsdGhpcy5fZHVyYXRpb249ZS5zb3VyY2UuZHVyYXRpb247dmFyIHQ9dGhpcy5fc291cmNlPWUuc291cmNlLmNsb25lTm9kZSghMSk7dC5zcmM9ZS5wYXJlbnQudXJsLHQub25wbGF5PXRoaXMuX29uUGxheS5iaW5kKHRoaXMpLHQub25wYXVzZT10aGlzLl9vblBhdXNlLmJpbmQodGhpcyksZS5jb250ZXh0Lm9uKFwicmVmcmVzaFwiLHRoaXMucmVmcmVzaCx0aGlzKSxlLmNvbnRleHQub24oXCJyZWZyZXNoUGF1c2VkXCIsdGhpcy5yZWZyZXNoUGF1c2VkLHRoaXMpLHRoaXMuX21lZGlhPWV9LG4ucHJvdG90eXBlLl9pbnRlcm5hbFN0b3A9ZnVuY3Rpb24oKXt0aGlzLl9zb3VyY2UmJnRoaXMuX3BsYXlpbmcmJih0aGlzLl9zb3VyY2Uub25lbmRlZD1udWxsLHRoaXMuX3NvdXJjZS5wYXVzZSgpKX0sbi5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbigpe3RoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuX3NvdXJjZSYmdGhpcy5lbWl0KFwic3RvcFwiKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwic3BlZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NwZWVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc3BlZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJ2b2x1bWVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZvbHVtZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3ZvbHVtZT1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImxvb3BcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2xvb3B9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9sb29wPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwibXV0ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX211dGVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbXV0ZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fbWVkaWEuY29udGV4dCx0PXRoaXMuX21lZGlhLnBhcmVudDt0aGlzLl9zb3VyY2UubG9vcD10aGlzLl9sb29wfHx0Lmxvb3A7dmFyIG49ZS52b2x1bWUqKGUubXV0ZWQ/MDoxKSxvPXQudm9sdW1lKih0Lm11dGVkPzA6MSksaT10aGlzLl92b2x1bWUqKHRoaXMuX211dGVkPzA6MSk7dGhpcy5fc291cmNlLnZvbHVtZT1pKm4qbyx0aGlzLl9zb3VyY2UucGxheWJhY2tSYXRlPXRoaXMuX3NwZWVkKmUuc3BlZWQqdC5zcGVlZH0sbi5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX21lZGlhLmNvbnRleHQsdD10aGlzLl9tZWRpYS5wYXJlbnQsbj10aGlzLl9wYXVzZWR8fHQucGF1c2VkfHxlLnBhdXNlZDtuIT09dGhpcy5fcGF1c2VkUmVhbCYmKHRoaXMuX3BhdXNlZFJlYWw9bixuPyh0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLmVtaXQoXCJwYXVzZWRcIikpOih0aGlzLmVtaXQoXCJyZXN1bWVkXCIpLHRoaXMucGxheSh7c3RhcnQ6dGhpcy5fc291cmNlLmN1cnJlbnRUaW1lLGVuZDp0aGlzLl9lbmQsdm9sdW1lOnRoaXMuX3ZvbHVtZSxzcGVlZDp0aGlzLl9zcGVlZCxsb29wOnRoaXMuX2xvb3B9KSksdGhpcy5lbWl0KFwicGF1c2VcIixuKSl9LG4ucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxvPWUuc3RhcnQsaT1lLmVuZCxyPWUuc3BlZWQscz1lLmxvb3AsdT1lLnZvbHVtZSxhPWUubXV0ZWQ7aSYmY29uc29sZS5hc3NlcnQoaT5vLFwiRW5kIHRpbWUgaXMgYmVmb3JlIHN0YXJ0IHRpbWVcIiksdGhpcy5fc3BlZWQ9cix0aGlzLl92b2x1bWU9dSx0aGlzLl9sb29wPSEhcyx0aGlzLl9tdXRlZD1hLHRoaXMucmVmcmVzaCgpLHRoaXMubG9vcCYmbnVsbCE9PWkmJihjb25zb2xlLndhcm4oJ0xvb3Bpbmcgbm90IHN1cHBvcnQgd2hlbiBzcGVjaWZ5aW5nIGFuIFwiZW5kXCIgdGltZScpLHRoaXMubG9vcD0hMSksdGhpcy5fc3RhcnQ9byx0aGlzLl9lbmQ9aXx8dGhpcy5fZHVyYXRpb24sdGhpcy5fc3RhcnQ9TWF0aC5tYXgoMCx0aGlzLl9zdGFydC1uLlBBRERJTkcpLHRoaXMuX2VuZD1NYXRoLm1pbih0aGlzLl9lbmQrbi5QQURESU5HLHRoaXMuX2R1cmF0aW9uKSx0aGlzLl9zb3VyY2Uub25sb2FkZWRtZXRhZGF0YT1mdW5jdGlvbigpe3QuX3NvdXJjZSYmKHQuX3NvdXJjZS5jdXJyZW50VGltZT1vLHQuX3NvdXJjZS5vbmxvYWRlZG1ldGFkYXRhPW51bGwsdC5lbWl0KFwicHJvZ3Jlc3NcIixvLHQuX2R1cmF0aW9uKSxQSVhJLnRpY2tlci5zaGFyZWQuYWRkKHQuX29uVXBkYXRlLHQpKX0sdGhpcy5fc291cmNlLm9uZW5kZWQ9dGhpcy5fb25Db21wbGV0ZS5iaW5kKHRoaXMpLHRoaXMuX3NvdXJjZS5wbGF5KCksdGhpcy5lbWl0KFwic3RhcnRcIil9LG4ucHJvdG90eXBlLl9vblVwZGF0ZT1mdW5jdGlvbigpe3RoaXMuZW1pdChcInByb2dyZXNzXCIsdGhpcy5wcm9ncmVzcyx0aGlzLl9kdXJhdGlvbiksdGhpcy5fc291cmNlLmN1cnJlbnRUaW1lPj10aGlzLl9lbmQmJiF0aGlzLl9zb3VyY2UubG9vcCYmdGhpcy5fb25Db21wbGV0ZSgpfSxuLnByb3RvdHlwZS5fb25Db21wbGV0ZT1mdW5jdGlvbigpe1BJWEkudGlja2VyLnNoYXJlZC5yZW1vdmUodGhpcy5fb25VcGRhdGUsdGhpcyksdGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5lbWl0KFwicHJvZ3Jlc3NcIiwxLHRoaXMuX2R1cmF0aW9uKSx0aGlzLmVtaXQoXCJlbmRcIix0aGlzKX0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe1BJWEkudGlja2VyLnNoYXJlZC5yZW1vdmUodGhpcy5fb25VcGRhdGUsdGhpcyksdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTt2YXIgZT10aGlzLl9zb3VyY2U7ZSYmKGUub25lbmRlZD1udWxsLGUub25wbGF5PW51bGwsZS5vbnBhdXNlPW51bGwsdGhpcy5faW50ZXJuYWxTdG9wKCkpLHRoaXMuX3NvdXJjZT1udWxsLHRoaXMuX3NwZWVkPTEsdGhpcy5fdm9sdW1lPTEsdGhpcy5fbG9vcD0hMSx0aGlzLl9lbmQ9bnVsbCx0aGlzLl9zdGFydD0wLHRoaXMuX2R1cmF0aW9uPTAsdGhpcy5fcGxheWluZz0hMSx0aGlzLl9wYXVzZWRSZWFsPSExLHRoaXMuX3BhdXNlZD0hMSx0aGlzLl9tdXRlZD0hMSx0aGlzLl9tZWRpYSYmKHRoaXMuX21lZGlhLmNvbnRleHQub2ZmKFwicmVmcmVzaFwiLHRoaXMucmVmcmVzaCx0aGlzKSx0aGlzLl9tZWRpYS5jb250ZXh0Lm9mZihcInJlZnJlc2hQYXVzZWRcIix0aGlzLnJlZnJlc2hQYXVzZWQsdGhpcyksdGhpcy5fbWVkaWE9bnVsbCl9LG4ucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJbSFRNTEF1ZGlvSW5zdGFuY2UgaWQ9XCIrdGhpcy5pZCtcIl1cIn0sbi5QQURESU5HPS4xLG59KFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyKSxzPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXtyZXR1cm4gbnVsbCE9PWUmJmUuYXBwbHkodGhpcyxhcmd1bWVudHMpfHx0aGlzfXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt0aGlzLnBhcmVudD1lLHRoaXMuX3NvdXJjZT1lLm9wdGlvbnMuc291cmNlfHxuZXcgQXVkaW8sZS51cmwmJih0aGlzLl9zb3VyY2Uuc3JjPWUudXJsKX0sbi5wcm90b3R5cGUuY3JlYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyByKHRoaXMpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJpc1BsYXlhYmxlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiEhdGhpcy5fc291cmNlJiY0PT09dGhpcy5fc291cmNlLnJlYWR5U3RhdGV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZHVyYXRpb25cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NvdXJjZS5kdXJhdGlvbn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJjb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBhcmVudC5jb250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9LHNldDpmdW5jdGlvbihlKXtjb25zb2xlLndhcm4oXCJIVE1MIEF1ZGlvIGRvZXMgbm90IHN1cHBvcnQgZmlsdGVyc1wiKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKSx0aGlzLnBhcmVudD1udWxsLHRoaXMuX3NvdXJjZSYmKHRoaXMuX3NvdXJjZS5zcmM9XCJcIix0aGlzLl9zb3VyY2UubG9hZCgpLHRoaXMuX3NvdXJjZT1udWxsKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwic291cmNlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zb3VyY2V9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihlKXt2YXIgdD10aGlzLl9zb3VyY2Usbj10aGlzLnBhcmVudDtpZig0PT09dC5yZWFkeVN0YXRlKXtuLmlzTG9hZGVkPSEwO3ZhciBvPW4uYXV0b1BsYXlTdGFydCgpO3JldHVybiB2b2lkKGUmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtlKG51bGwsbixvKX0sMCkpfWlmKCFuLnVybClyZXR1cm4gZShuZXcgRXJyb3IoXCJzb3VuZC51cmwgb3Igc291bmQuc291cmNlIG11c3QgYmUgc2V0XCIpKTt0LnNyYz1uLnVybDt2YXIgaT1mdW5jdGlvbigpe3QucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNhbnBsYXl0aHJvdWdoXCIsciksdC5yZW1vdmVFdmVudExpc3RlbmVyKFwibG9hZFwiLHIpLHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIscyksdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXJyb3JcIix1KX0scj1mdW5jdGlvbigpe2koKSxuLmlzTG9hZGVkPSEwO3ZhciB0PW4uYXV0b1BsYXlTdGFydCgpO2UmJmUobnVsbCxuLHQpfSxzPWZ1bmN0aW9uKCl7aSgpLGUmJmUobmV3IEVycm9yKFwiU291bmQgbG9hZGluZyBoYXMgYmVlbiBhYm9ydGVkXCIpKX0sdT1mdW5jdGlvbigpe2koKTt2YXIgbj1cIkZhaWxlZCB0byBsb2FkIGF1ZGlvIGVsZW1lbnQgKGNvZGU6IFwiK3QuZXJyb3IuY29kZStcIilcIjtlP2UobmV3IEVycm9yKG4pKTpjb25zb2xlLmVycm9yKG4pfTt0LmFkZEV2ZW50TGlzdGVuZXIoXCJjYW5wbGF5dGhyb3VnaFwiLHIsITEpLHQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixyLCExKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLHMsITEpLHQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsdSwhMSksdC5sb2FkKCl9LG59KFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyKSx1PVwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6e30sYT1mdW5jdGlvbihlLHQpe3JldHVybiB0PXtleHBvcnRzOnt9fSxlKHQsdC5leHBvcnRzKSx0LmV4cG9ydHN9KGZ1bmN0aW9uKGUpeyFmdW5jdGlvbih0KXtmdW5jdGlvbiBuKCl7fWZ1bmN0aW9uIG8oZSx0KXtyZXR1cm4gZnVuY3Rpb24oKXtlLmFwcGx5KHQsYXJndW1lbnRzKX19ZnVuY3Rpb24gaShlKXtpZihcIm9iamVjdFwiIT10eXBlb2YgdGhpcyl0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3XCIpO2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBhIGZ1bmN0aW9uXCIpO3RoaXMuX3N0YXRlPTAsdGhpcy5faGFuZGxlZD0hMSx0aGlzLl92YWx1ZT12b2lkIDAsdGhpcy5fZGVmZXJyZWRzPVtdLGwoZSx0aGlzKX1mdW5jdGlvbiByKGUsdCl7Zm9yKDszPT09ZS5fc3RhdGU7KWU9ZS5fdmFsdWU7aWYoMD09PWUuX3N0YXRlKXJldHVybiB2b2lkIGUuX2RlZmVycmVkcy5wdXNoKHQpO2UuX2hhbmRsZWQ9ITAsaS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKXt2YXIgbj0xPT09ZS5fc3RhdGU/dC5vbkZ1bGZpbGxlZDp0Lm9uUmVqZWN0ZWQ7aWYobnVsbD09PW4pcmV0dXJuIHZvaWQoMT09PWUuX3N0YXRlP3M6dSkodC5wcm9taXNlLGUuX3ZhbHVlKTt2YXIgbzt0cnl7bz1uKGUuX3ZhbHVlKX1jYXRjaChlKXtyZXR1cm4gdm9pZCB1KHQucHJvbWlzZSxlKX1zKHQucHJvbWlzZSxvKX0pfWZ1bmN0aW9uIHMoZSx0KXt0cnl7aWYodD09PWUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkEgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuXCIpO2lmKHQmJihcIm9iamVjdFwiPT10eXBlb2YgdHx8XCJmdW5jdGlvblwiPT10eXBlb2YgdCkpe3ZhciBuPXQudGhlbjtpZih0IGluc3RhbmNlb2YgaSlyZXR1cm4gZS5fc3RhdGU9MyxlLl92YWx1ZT10LHZvaWQgYShlKTtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBuKXJldHVybiB2b2lkIGwobyhuLHQpLGUpfWUuX3N0YXRlPTEsZS5fdmFsdWU9dCxhKGUpfWNhdGNoKHQpe3UoZSx0KX19ZnVuY3Rpb24gdShlLHQpe2UuX3N0YXRlPTIsZS5fdmFsdWU9dCxhKGUpfWZ1bmN0aW9uIGEoZSl7Mj09PWUuX3N0YXRlJiYwPT09ZS5fZGVmZXJyZWRzLmxlbmd0aCYmaS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKXtlLl9oYW5kbGVkfHxpLl91bmhhbmRsZWRSZWplY3Rpb25GbihlLl92YWx1ZSl9KTtmb3IodmFyIHQ9MCxuPWUuX2RlZmVycmVkcy5sZW5ndGg7dDxuO3QrKylyKGUsZS5fZGVmZXJyZWRzW3RdKTtlLl9kZWZlcnJlZHM9bnVsbH1mdW5jdGlvbiBjKGUsdCxuKXt0aGlzLm9uRnVsZmlsbGVkPVwiZnVuY3Rpb25cIj09dHlwZW9mIGU/ZTpudWxsLHRoaXMub25SZWplY3RlZD1cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Q6bnVsbCx0aGlzLnByb21pc2U9bn1mdW5jdGlvbiBsKGUsdCl7dmFyIG49ITE7dHJ5e2UoZnVuY3Rpb24oZSl7bnx8KG49ITAscyh0LGUpKX0sZnVuY3Rpb24oZSl7bnx8KG49ITAsdSh0LGUpKX0pfWNhdGNoKGUpe2lmKG4pcmV0dXJuO249ITAsdSh0LGUpfX12YXIgcD1zZXRUaW1lb3V0O2kucHJvdG90eXBlLmNhdGNoPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLnRoZW4obnVsbCxlKX0saS5wcm90b3R5cGUudGhlbj1mdW5jdGlvbihlLHQpe3ZhciBvPW5ldyB0aGlzLmNvbnN0cnVjdG9yKG4pO3JldHVybiByKHRoaXMsbmV3IGMoZSx0LG8pKSxvfSxpLmFsbD1mdW5jdGlvbihlKXt2YXIgdD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlKTtyZXR1cm4gbmV3IGkoZnVuY3Rpb24oZSxuKXtmdW5jdGlvbiBvKHIscyl7dHJ5e2lmKHMmJihcIm9iamVjdFwiPT10eXBlb2Ygc3x8XCJmdW5jdGlvblwiPT10eXBlb2Ygcykpe3ZhciB1PXMudGhlbjtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiB1KXJldHVybiB2b2lkIHUuY2FsbChzLGZ1bmN0aW9uKGUpe28ocixlKX0sbil9dFtyXT1zLDA9PS0taSYmZSh0KX1jYXRjaChlKXtuKGUpfX1pZigwPT09dC5sZW5ndGgpcmV0dXJuIGUoW10pO2Zvcih2YXIgaT10Lmxlbmd0aCxyPTA7cjx0Lmxlbmd0aDtyKyspbyhyLHRbcl0pfSl9LGkucmVzb2x2ZT1mdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJvYmplY3RcIj09dHlwZW9mIGUmJmUuY29uc3RydWN0b3I9PT1pP2U6bmV3IGkoZnVuY3Rpb24odCl7dChlKX0pfSxpLnJlamVjdD1mdW5jdGlvbihlKXtyZXR1cm4gbmV3IGkoZnVuY3Rpb24odCxuKXtuKGUpfSl9LGkucmFjZT1mdW5jdGlvbihlKXtyZXR1cm4gbmV3IGkoZnVuY3Rpb24odCxuKXtmb3IodmFyIG89MCxpPWUubGVuZ3RoO288aTtvKyspZVtvXS50aGVuKHQsbil9KX0saS5faW1tZWRpYXRlRm49XCJmdW5jdGlvblwiPT10eXBlb2Ygc2V0SW1tZWRpYXRlJiZmdW5jdGlvbihlKXtzZXRJbW1lZGlhdGUoZSl9fHxmdW5jdGlvbihlKXtwKGUsMCl9LGkuX3VuaGFuZGxlZFJlamVjdGlvbkZuPWZ1bmN0aW9uKGUpe1widW5kZWZpbmVkXCIhPXR5cGVvZiBjb25zb2xlJiZjb25zb2xlJiZjb25zb2xlLndhcm4oXCJQb3NzaWJsZSBVbmhhbmRsZWQgUHJvbWlzZSBSZWplY3Rpb246XCIsZSl9LGkuX3NldEltbWVkaWF0ZUZuPWZ1bmN0aW9uKGUpe2kuX2ltbWVkaWF0ZUZuPWV9LGkuX3NldFVuaGFuZGxlZFJlamVjdGlvbkZuPWZ1bmN0aW9uKGUpe2kuX3VuaGFuZGxlZFJlamVjdGlvbkZuPWV9LGUuZXhwb3J0cz9lLmV4cG9ydHM9aTp0LlByb21pc2V8fCh0LlByb21pc2U9aSl9KHUpfSksYz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXt0aGlzLmRlc3RpbmF0aW9uPWUsdGhpcy5zb3VyY2U9dHx8ZX1yZXR1cm4gZS5wcm90b3R5cGUuY29ubmVjdD1mdW5jdGlvbihlKXt0aGlzLnNvdXJjZS5jb25uZWN0KGUpfSxlLnByb3RvdHlwZS5kaXNjb25uZWN0PWZ1bmN0aW9uKCl7dGhpcy5zb3VyY2UuZGlzY29ubmVjdCgpfSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5kaXNjb25uZWN0KCksdGhpcy5kZXN0aW5hdGlvbj1udWxsLHRoaXMuc291cmNlPW51bGx9LGV9KCksbD1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9cmV0dXJuIGUuc2V0UGFyYW1WYWx1ZT1mdW5jdGlvbihlLHQpe2lmKGUuc2V0VmFsdWVBdFRpbWUpe3ZhciBuPVMuaW5zdGFuY2UuY29udGV4dDtlLnNldFZhbHVlQXRUaW1lKHQsbi5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUpfWVsc2UgZS52YWx1ZT10O3JldHVybiB0fSxlfSgpLHA9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0LG8saSxyLHMsdSxhLGMscCxoKXt2b2lkIDA9PT10JiYodD0wKSx2b2lkIDA9PT1vJiYobz0wKSx2b2lkIDA9PT1pJiYoaT0wKSx2b2lkIDA9PT1yJiYocj0wKSx2b2lkIDA9PT1zJiYocz0wKSx2b2lkIDA9PT11JiYodT0wKSx2b2lkIDA9PT1hJiYoYT0wKSx2b2lkIDA9PT1jJiYoYz0wKSx2b2lkIDA9PT1wJiYocD0wKSx2b2lkIDA9PT1oJiYoaD0wKTt2YXIgZD10aGlzO2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKGQ9ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciBmPVt7ZjpuLkYzMix0eXBlOlwibG93c2hlbGZcIixnYWluOnR9LHtmOm4uRjY0LHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpvfSx7ZjpuLkYxMjUsdHlwZTpcInBlYWtpbmdcIixnYWluOml9LHtmOm4uRjI1MCx0eXBlOlwicGVha2luZ1wiLGdhaW46cn0se2Y6bi5GNTAwLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpzfSx7ZjpuLkYxSyx0eXBlOlwicGVha2luZ1wiLGdhaW46dX0se2Y6bi5GMkssdHlwZTpcInBlYWtpbmdcIixnYWluOmF9LHtmOm4uRjRLLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpjfSx7ZjpuLkY4Syx0eXBlOlwicGVha2luZ1wiLGdhaW46cH0se2Y6bi5GMTZLLHR5cGU6XCJoaWdoc2hlbGZcIixnYWluOmh9XS5tYXAoZnVuY3Rpb24oZSl7dmFyIHQ9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtyZXR1cm4gdC50eXBlPWUudHlwZSxsLnNldFBhcmFtVmFsdWUodC5nYWluLGUuZ2FpbiksbC5zZXRQYXJhbVZhbHVlKHQuUSwxKSxsLnNldFBhcmFtVmFsdWUodC5mcmVxdWVuY3ksZS5mKSx0fSk7KGQ9ZS5jYWxsKHRoaXMsZlswXSxmW2YubGVuZ3RoLTFdKXx8dGhpcykuYmFuZHM9ZixkLmJhbmRzTWFwPXt9O2Zvcih2YXIgXz0wO188ZC5iYW5kcy5sZW5ndGg7XysrKXt2YXIgeT1kLmJhbmRzW19dO18+MCYmZC5iYW5kc1tfLTFdLmNvbm5lY3QoeSksZC5iYW5kc01hcFt5LmZyZXF1ZW5jeS52YWx1ZV09eX1yZXR1cm4gZH1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLnNldEdhaW49ZnVuY3Rpb24oZSx0KXtpZih2b2lkIDA9PT10JiYodD0wKSwhdGhpcy5iYW5kc01hcFtlXSl0aHJvd1wiTm8gYmFuZCBmb3VuZCBmb3IgZnJlcXVlbmN5IFwiK2U7bC5zZXRQYXJhbVZhbHVlKHRoaXMuYmFuZHNNYXBbZV0uZ2Fpbix0KX0sbi5wcm90b3R5cGUuZ2V0R2Fpbj1mdW5jdGlvbihlKXtpZighdGhpcy5iYW5kc01hcFtlXSl0aHJvd1wiTm8gYmFuZCBmb3VuZCBmb3IgZnJlcXVlbmN5IFwiK2U7cmV0dXJuIHRoaXMuYmFuZHNNYXBbZV0uZ2Fpbi52YWx1ZX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjMyXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMzIpfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjMyLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImY2NFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjY0KX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkY2NCxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMTI1XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMTI1KX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYxMjUsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjI1MFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjI1MCl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMjUwLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImY1MDBcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkY1MDApfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjUwMCxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMWtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYxSyl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMUssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjJrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMkspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjJLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImY0a1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjRLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkY0SyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmOGtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkY4Syl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GOEssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjE2a1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjE2Syl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMTZLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnJlc2V0PWZ1bmN0aW9uKCl7dGhpcy5iYW5kcy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2wuc2V0UGFyYW1WYWx1ZShlLmdhaW4sMCl9KX0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuYmFuZHMuZm9yRWFjaChmdW5jdGlvbihlKXtlLmRpc2Nvbm5lY3QoKX0pLHRoaXMuYmFuZHM9bnVsbCx0aGlzLmJhbmRzTWFwPW51bGx9LG4uRjMyPTMyLG4uRjY0PTY0LG4uRjEyNT0xMjUsbi5GMjUwPTI1MCxuLkY1MDA9NTAwLG4uRjFLPTFlMyxuLkYySz0yZTMsbi5GNEs9NGUzLG4uRjhLPThlMyxuLkYxNks9MTZlMyxufShjKSxoPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dm9pZCAwPT09dCYmKHQ9MCk7dmFyIG49dGhpcztpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChuPWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgbz1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZVdhdmVTaGFwZXIoKTtyZXR1cm4gbj1lLmNhbGwodGhpcyxvKXx8dGhpcyxuLl9kaXN0b3J0aW9uPW8sbi5hbW91bnQ9dCxufXJldHVybiB0KG4sZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiYW1vdW50XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hbW91bnR9LHNldDpmdW5jdGlvbihlKXtlKj0xZTMsdGhpcy5fYW1vdW50PWU7Zm9yKHZhciB0LG49bmV3IEZsb2F0MzJBcnJheSg0NDEwMCksbz1NYXRoLlBJLzE4MCxpPTA7aTw0NDEwMDsrK2kpdD0yKmkvNDQxMDAtMSxuW2ldPSgzK2UpKnQqMjAqby8oTWF0aC5QSStlKk1hdGguYWJzKHQpKTt0aGlzLl9kaXN0b3J0aW9uLmN1cnZlPW4sdGhpcy5fZGlzdG9ydGlvbi5vdmVyc2FtcGxlPVwiNHhcIn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5fZGlzdG9ydGlvbj1udWxsLGUucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKX0sbn0oYyksZD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZvaWQgMD09PXQmJih0PTApO3ZhciBuPXRoaXM7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQobj1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIG8saSxyLHM9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dDtyZXR1cm4gcy5jcmVhdGVTdGVyZW9QYW5uZXI/cj1vPXMuY3JlYXRlU3RlcmVvUGFubmVyKCk6KChpPXMuY3JlYXRlUGFubmVyKCkpLnBhbm5pbmdNb2RlbD1cImVxdWFscG93ZXJcIixyPWkpLG49ZS5jYWxsKHRoaXMscil8fHRoaXMsbi5fc3RlcmVvPW8sbi5fcGFubmVyPWksbi5wYW49dCxufXJldHVybiB0KG4sZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicGFuXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYW59LHNldDpmdW5jdGlvbihlKXt0aGlzLl9wYW49ZSx0aGlzLl9zdGVyZW8/bC5zZXRQYXJhbVZhbHVlKHRoaXMuX3N0ZXJlby5wYW4sZSk6dGhpcy5fcGFubmVyLnNldFBvc2l0aW9uKGUsMCwxLU1hdGguYWJzKGUpKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7ZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpLHRoaXMuX3N0ZXJlbz1udWxsLHRoaXMuX3Bhbm5lcj1udWxsfSxufShjKSxmPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCxuLG8pe3ZvaWQgMD09PXQmJih0PTMpLHZvaWQgMD09PW4mJihuPTIpLHZvaWQgMD09PW8mJihvPSExKTt2YXIgaT10aGlzO2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKGk9ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciByPVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlQ29udm9sdmVyKCk7cmV0dXJuIGk9ZS5jYWxsKHRoaXMscil8fHRoaXMsaS5fY29udm9sdmVyPXIsaS5fc2Vjb25kcz1pLl9jbGFtcCh0LDEsNTApLGkuX2RlY2F5PWkuX2NsYW1wKG4sMCwxMDApLGkuX3JldmVyc2U9byxpLl9yZWJ1aWxkKCksaX1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLl9jbGFtcD1mdW5jdGlvbihlLHQsbil7cmV0dXJuIE1hdGgubWluKG4sTWF0aC5tYXgodCxlKSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInNlY29uZHNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NlY29uZHN9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zZWNvbmRzPXRoaXMuX2NsYW1wKGUsMSw1MCksdGhpcy5fcmVidWlsZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImRlY2F5XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9kZWNheX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2RlY2F5PXRoaXMuX2NsYW1wKGUsMCwxMDApLHRoaXMuX3JlYnVpbGQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJyZXZlcnNlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZXZlcnNlfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcmV2ZXJzZT1lLHRoaXMuX3JlYnVpbGQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5fcmVidWlsZD1mdW5jdGlvbigpe2Zvcih2YXIgZSx0PVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQsbj10LnNhbXBsZVJhdGUsbz1uKnRoaXMuX3NlY29uZHMsaT10LmNyZWF0ZUJ1ZmZlcigyLG8sbikscj1pLmdldENoYW5uZWxEYXRhKDApLHM9aS5nZXRDaGFubmVsRGF0YSgxKSx1PTA7dTxvO3UrKyllPXRoaXMuX3JldmVyc2U/by11OnUsclt1XT0oMipNYXRoLnJhbmRvbSgpLTEpKk1hdGgucG93KDEtZS9vLHRoaXMuX2RlY2F5KSxzW3VdPSgyKk1hdGgucmFuZG9tKCktMSkqTWF0aC5wb3coMS1lL28sdGhpcy5fZGVjYXkpO3RoaXMuX2NvbnZvbHZlci5idWZmZXI9aX0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuX2NvbnZvbHZlcj1udWxsLGUucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKX0sbn0oYyksXz1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7dmFyIHQ9dGhpcztTLmluc3RhbmNlLnVzZUxlZ2FjeSYmKHQ9ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciBuPVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQsbz1uLmNyZWF0ZUNoYW5uZWxTcGxpdHRlcigpLGk9bi5jcmVhdGVDaGFubmVsTWVyZ2VyKCk7cmV0dXJuIGkuY29ubmVjdChvKSx0PWUuY2FsbCh0aGlzLGksbyl8fHRoaXMsdC5fbWVyZ2VyPWksdH1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLl9tZXJnZXIuZGlzY29ubmVjdCgpLHRoaXMuX21lcmdlcj1udWxsLGUucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKX0sbn0oYykseT1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQoZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciB0PVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQsbj10LmNyZWF0ZUJpcXVhZEZpbHRlcigpLG89dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKSxpPXQuY3JlYXRlQmlxdWFkRmlsdGVyKCkscj10LmNyZWF0ZUJpcXVhZEZpbHRlcigpO3JldHVybiBuLnR5cGU9XCJsb3dwYXNzXCIsbC5zZXRQYXJhbVZhbHVlKG4uZnJlcXVlbmN5LDJlMyksby50eXBlPVwibG93cGFzc1wiLGwuc2V0UGFyYW1WYWx1ZShvLmZyZXF1ZW5jeSwyZTMpLGkudHlwZT1cImhpZ2hwYXNzXCIsbC5zZXRQYXJhbVZhbHVlKGkuZnJlcXVlbmN5LDUwMCksci50eXBlPVwiaGlnaHBhc3NcIixsLnNldFBhcmFtVmFsdWUoci5mcmVxdWVuY3ksNTAwKSxuLmNvbm5lY3Qobyksby5jb25uZWN0KGkpLGkuY29ubmVjdChyKSxlLmNhbGwodGhpcyxuLHIpfHx0aGlzfXJldHVybiB0KG4sZSksbn0oYyksbT1PYmplY3QuZnJlZXplKHtGaWx0ZXI6YyxFcXVhbGl6ZXJGaWx0ZXI6cCxEaXN0b3J0aW9uRmlsdGVyOmgsU3RlcmVvRmlsdGVyOmQsUmV2ZXJiRmlsdGVyOmYsTW9ub0ZpbHRlcjpfLFRlbGVwaG9uZUZpbHRlcjp5fSksYj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7dmFyIHQ9ZS5jYWxsKHRoaXMpfHx0aGlzO3JldHVybiB0LnNwZWVkPTEsdC52b2x1bWU9MSx0Lm11dGVkPSExLHQucGF1c2VkPSExLHR9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KFwicmVmcmVzaFwiKX0sbi5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe3RoaXMuZW1pdChcInJlZnJlc2hQYXVzZWRcIil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGNvbnNvbGUud2FybihcIkhUTUwgQXVkaW8gZG9lcyBub3Qgc3VwcG9ydCBmaWx0ZXJzXCIpLG51bGx9LHNldDpmdW5jdGlvbihlKXtjb25zb2xlLndhcm4oXCJIVE1MIEF1ZGlvIGRvZXMgbm90IHN1cHBvcnQgZmlsdGVyc1wiKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJhdWRpb0NvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGNvbnNvbGUud2FybihcIkhUTUwgQXVkaW8gZG9lcyBub3Qgc3VwcG9ydCBhdWRpb0NvbnRleHRcIiksbnVsbH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS50b2dnbGVNdXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubXV0ZWQ9IXRoaXMubXV0ZWQsdGhpcy5yZWZyZXNoKCksdGhpcy5tdXRlZH0sbi5wcm90b3R5cGUudG9nZ2xlUGF1c2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXVzZWQ9IXRoaXMucGF1c2VkLHRoaXMucmVmcmVzaFBhdXNlZCgpLHRoaXMucGF1c2VkfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKX0sbn0oUElYSS51dGlscy5FdmVudEVtaXR0ZXIpLGc9T2JqZWN0LmZyZWV6ZSh7SFRNTEF1ZGlvTWVkaWE6cyxIVE1MQXVkaW9JbnN0YW5jZTpyLEhUTUxBdWRpb0NvbnRleHQ6Yn0pLHY9MCxQPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dmFyIG49ZS5jYWxsKHRoaXMpfHx0aGlzO3JldHVybiBuLmlkPXYrKyxuLl9tZWRpYT1udWxsLG4uX3BhdXNlZD0hMSxuLl9tdXRlZD0hMSxuLl9lbGFwc2VkPTAsbi5fdXBkYXRlTGlzdGVuZXI9bi5fdXBkYXRlLmJpbmQobiksbi5pbml0KHQpLG59cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKCl7dGhpcy5fc291cmNlJiYodGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5lbWl0KFwic3RvcFwiKSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInNwZWVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zcGVlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NwZWVkPWUsdGhpcy5yZWZyZXNoKCksdGhpcy5fdXBkYXRlKCEwKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJ2b2x1bWVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZvbHVtZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3ZvbHVtZT1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcIm11dGVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tdXRlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX211dGVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwibG9vcFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbG9vcH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2xvb3A9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fbWVkaWEuY29udGV4dCx0PXRoaXMuX21lZGlhLnBhcmVudDt0aGlzLl9zb3VyY2UubG9vcD10aGlzLl9sb29wfHx0Lmxvb3A7dmFyIG49ZS52b2x1bWUqKGUubXV0ZWQ/MDoxKSxvPXQudm9sdW1lKih0Lm11dGVkPzA6MSksaT10aGlzLl92b2x1bWUqKHRoaXMuX211dGVkPzA6MSk7bC5zZXRQYXJhbVZhbHVlKHRoaXMuX2dhaW4uZ2FpbixpKm8qbiksbC5zZXRQYXJhbVZhbHVlKHRoaXMuX3NvdXJjZS5wbGF5YmFja1JhdGUsdGhpcy5fc3BlZWQqdC5zcGVlZCplLnNwZWVkKX0sbi5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX21lZGlhLmNvbnRleHQsdD10aGlzLl9tZWRpYS5wYXJlbnQsbj10aGlzLl9wYXVzZWR8fHQucGF1c2VkfHxlLnBhdXNlZDtuIT09dGhpcy5fcGF1c2VkUmVhbCYmKHRoaXMuX3BhdXNlZFJlYWw9bixuPyh0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLmVtaXQoXCJwYXVzZWRcIikpOih0aGlzLmVtaXQoXCJyZXN1bWVkXCIpLHRoaXMucGxheSh7c3RhcnQ6dGhpcy5fZWxhcHNlZCV0aGlzLl9kdXJhdGlvbixlbmQ6dGhpcy5fZW5kLHNwZWVkOnRoaXMuX3NwZWVkLGxvb3A6dGhpcy5fbG9vcCx2b2x1bWU6dGhpcy5fdm9sdW1lfSkpLHRoaXMuZW1pdChcInBhdXNlXCIsbikpfSxuLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUpe3ZhciB0PWUuc3RhcnQsbj1lLmVuZCxvPWUuc3BlZWQsaT1lLmxvb3Ascj1lLnZvbHVtZSxzPWUubXV0ZWQ7biYmY29uc29sZS5hc3NlcnQobj50LFwiRW5kIHRpbWUgaXMgYmVmb3JlIHN0YXJ0IHRpbWVcIiksdGhpcy5fcGF1c2VkPSExO3ZhciB1PXRoaXMuX21lZGlhLm5vZGVzLmNsb25lQnVmZmVyU291cmNlKCksYT11LnNvdXJjZSxjPXUuZ2Fpbjt0aGlzLl9zb3VyY2U9YSx0aGlzLl9nYWluPWMsdGhpcy5fc3BlZWQ9byx0aGlzLl92b2x1bWU9cix0aGlzLl9sb29wPSEhaSx0aGlzLl9tdXRlZD1zLHRoaXMucmVmcmVzaCgpLHRoaXMubG9vcCYmbnVsbCE9PW4mJihjb25zb2xlLndhcm4oJ0xvb3Bpbmcgbm90IHN1cHBvcnQgd2hlbiBzcGVjaWZ5aW5nIGFuIFwiZW5kXCIgdGltZScpLHRoaXMubG9vcD0hMSksdGhpcy5fZW5kPW47dmFyIGw9dGhpcy5fc291cmNlLmJ1ZmZlci5kdXJhdGlvbjt0aGlzLl9kdXJhdGlvbj1sLHRoaXMuX2xhc3RVcGRhdGU9dGhpcy5fbm93KCksdGhpcy5fZWxhcHNlZD10LHRoaXMuX3NvdXJjZS5vbmVuZGVkPXRoaXMuX29uQ29tcGxldGUuYmluZCh0aGlzKSxuP3RoaXMuX3NvdXJjZS5zdGFydCgwLHQsbi10KTp0aGlzLl9zb3VyY2Uuc3RhcnQoMCx0KSx0aGlzLmVtaXQoXCJzdGFydFwiKSx0aGlzLl91cGRhdGUoITApLHRoaXMuX2VuYWJsZWQ9ITB9LG4ucHJvdG90eXBlLl90b1NlYz1mdW5jdGlvbihlKXtyZXR1cm4gZT4xMCYmKGUvPTFlMyksZXx8MH0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiX2VuYWJsZWRcIix7c2V0OmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuX21lZGlhLm5vZGVzLnNjcmlwdDt0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhdWRpb3Byb2Nlc3NcIix0aGlzLl91cGRhdGVMaXN0ZW5lciksZSYmdC5hZGRFdmVudExpc3RlbmVyKFwiYXVkaW9wcm9jZXNzXCIsdGhpcy5fdXBkYXRlTGlzdGVuZXIpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInByb2dyZXNzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wcm9ncmVzc30sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwYXVzZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhdXNlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3BhdXNlZD1lLHRoaXMucmVmcmVzaFBhdXNlZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpLHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuX3NvdXJjZSYmKHRoaXMuX3NvdXJjZS5kaXNjb25uZWN0KCksdGhpcy5fc291cmNlPW51bGwpLHRoaXMuX2dhaW4mJih0aGlzLl9nYWluLmRpc2Nvbm5lY3QoKSx0aGlzLl9nYWluPW51bGwpLHRoaXMuX21lZGlhJiYodGhpcy5fbWVkaWEuY29udGV4dC5ldmVudHMub2ZmKFwicmVmcmVzaFwiLHRoaXMucmVmcmVzaCx0aGlzKSx0aGlzLl9tZWRpYS5jb250ZXh0LmV2ZW50cy5vZmYoXCJyZWZyZXNoUGF1c2VkXCIsdGhpcy5yZWZyZXNoUGF1c2VkLHRoaXMpLHRoaXMuX21lZGlhPW51bGwpLHRoaXMuX2VuZD1udWxsLHRoaXMuX3NwZWVkPTEsdGhpcy5fdm9sdW1lPTEsdGhpcy5fbG9vcD0hMSx0aGlzLl9lbGFwc2VkPTAsdGhpcy5fZHVyYXRpb249MCx0aGlzLl9wYXVzZWQ9ITEsdGhpcy5fbXV0ZWQ9ITEsdGhpcy5fcGF1c2VkUmVhbD0hMX0sbi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIltXZWJBdWRpb0luc3RhbmNlIGlkPVwiK3RoaXMuaWQrXCJdXCJ9LG4ucHJvdG90eXBlLl9ub3c9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbWVkaWEuY29udGV4dC5hdWRpb0NvbnRleHQuY3VycmVudFRpbWV9LG4ucHJvdG90eXBlLl91cGRhdGU9ZnVuY3Rpb24oZSl7aWYodm9pZCAwPT09ZSYmKGU9ITEpLHRoaXMuX3NvdXJjZSl7dmFyIHQ9dGhpcy5fbm93KCksbj10LXRoaXMuX2xhc3RVcGRhdGU7aWYobj4wfHxlKXt2YXIgbz10aGlzLl9zb3VyY2UucGxheWJhY2tSYXRlLnZhbHVlO3RoaXMuX2VsYXBzZWQrPW4qbyx0aGlzLl9sYXN0VXBkYXRlPXQ7dmFyIGk9dGhpcy5fZHVyYXRpb24scj10aGlzLl9lbGFwc2VkJWkvaTt0aGlzLl9wcm9ncmVzcz1yLHRoaXMuZW1pdChcInByb2dyZXNzXCIsdGhpcy5fcHJvZ3Jlc3MsaSl9fX0sbi5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt0aGlzLl9tZWRpYT1lLGUuY29udGV4dC5ldmVudHMub24oXCJyZWZyZXNoXCIsdGhpcy5yZWZyZXNoLHRoaXMpLGUuY29udGV4dC5ldmVudHMub24oXCJyZWZyZXNoUGF1c2VkXCIsdGhpcy5yZWZyZXNoUGF1c2VkLHRoaXMpfSxuLnByb3RvdHlwZS5faW50ZXJuYWxTdG9wPWZ1bmN0aW9uKCl7dGhpcy5fc291cmNlJiYodGhpcy5fZW5hYmxlZD0hMSx0aGlzLl9zb3VyY2Uub25lbmRlZD1udWxsLHRoaXMuX3NvdXJjZS5zdG9wKCksdGhpcy5fc291cmNlPW51bGwpfSxuLnByb3RvdHlwZS5fb25Db21wbGV0ZT1mdW5jdGlvbigpe3RoaXMuX3NvdXJjZSYmKHRoaXMuX2VuYWJsZWQ9ITEsdGhpcy5fc291cmNlLm9uZW5kZWQ9bnVsbCksdGhpcy5fc291cmNlPW51bGwsdGhpcy5fcHJvZ3Jlc3M9MSx0aGlzLmVtaXQoXCJwcm9ncmVzc1wiLDEsdGhpcy5fZHVyYXRpb24pLHRoaXMuZW1pdChcImVuZFwiLHRoaXMpfSxufShQSVhJLnV0aWxzLkV2ZW50RW1pdHRlcikseD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZhciBvPXRoaXMsaT10LmF1ZGlvQ29udGV4dCxyPWkuY3JlYXRlQnVmZmVyU291cmNlKCkscz1pLmNyZWF0ZVNjcmlwdFByb2Nlc3NvcihuLkJVRkZFUl9TSVpFKSx1PWkuY3JlYXRlR2FpbigpLGE9aS5jcmVhdGVBbmFseXNlcigpO3JldHVybiByLmNvbm5lY3QoYSksYS5jb25uZWN0KHUpLHUuY29ubmVjdCh0LmRlc3RpbmF0aW9uKSxzLmNvbm5lY3QodC5kZXN0aW5hdGlvbiksbz1lLmNhbGwodGhpcyxhLHUpfHx0aGlzLG8uY29udGV4dD10LG8uYnVmZmVyU291cmNlPXIsby5zY3JpcHQ9cyxvLmdhaW49dSxvLmFuYWx5c2VyPWEsb31yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXtlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyksdGhpcy5idWZmZXJTb3VyY2UuZGlzY29ubmVjdCgpLHRoaXMuc2NyaXB0LmRpc2Nvbm5lY3QoKSx0aGlzLmdhaW4uZGlzY29ubmVjdCgpLHRoaXMuYW5hbHlzZXIuZGlzY29ubmVjdCgpLHRoaXMuYnVmZmVyU291cmNlPW51bGwsdGhpcy5zY3JpcHQ9bnVsbCx0aGlzLmdhaW49bnVsbCx0aGlzLmFuYWx5c2VyPW51bGwsdGhpcy5jb250ZXh0PW51bGx9LG4ucHJvdG90eXBlLmNsb25lQnVmZmVyU291cmNlPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5idWZmZXJTb3VyY2UsdD10aGlzLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO3QuYnVmZmVyPWUuYnVmZmVyLGwuc2V0UGFyYW1WYWx1ZSh0LnBsYXliYWNrUmF0ZSxlLnBsYXliYWNrUmF0ZS52YWx1ZSksdC5sb29wPWUubG9vcDt2YXIgbj10aGlzLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtyZXR1cm4gdC5jb25uZWN0KG4pLG4uY29ubmVjdCh0aGlzLmRlc3RpbmF0aW9uKSx7c291cmNlOnQsZ2FpbjpufX0sbi5CVUZGRVJfU0laRT0yNTYsbn0obiksTz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9cmV0dXJuIGUucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dGhpcy5wYXJlbnQ9ZSx0aGlzLl9ub2Rlcz1uZXcgeCh0aGlzLmNvbnRleHQpLHRoaXMuX3NvdXJjZT10aGlzLl9ub2Rlcy5idWZmZXJTb3VyY2UsdGhpcy5zb3VyY2U9ZS5vcHRpb25zLnNvdXJjZX0sZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucGFyZW50PW51bGwsdGhpcy5fbm9kZXMuZGVzdHJveSgpLHRoaXMuX25vZGVzPW51bGwsdGhpcy5fc291cmNlPW51bGwsdGhpcy5zb3VyY2U9bnVsbH0sZS5wcm90b3R5cGUuY3JlYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBQKHRoaXMpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJjb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBhcmVudC5jb250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImlzUGxheWFibGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuISF0aGlzLl9zb3VyY2UmJiEhdGhpcy5fc291cmNlLmJ1ZmZlcn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9ub2Rlcy5maWx0ZXJzfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbm9kZXMuZmlsdGVycz1lfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImR1cmF0aW9uXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBjb25zb2xlLmFzc2VydCh0aGlzLmlzUGxheWFibGUsXCJTb3VuZCBub3QgeWV0IHBsYXlhYmxlLCBubyBkdXJhdGlvblwiKSx0aGlzLl9zb3VyY2UuYnVmZmVyLmR1cmF0aW9ufSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImJ1ZmZlclwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc291cmNlLmJ1ZmZlcn0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NvdXJjZS5idWZmZXI9ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJub2Rlc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbm9kZXN9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihlKXt0aGlzLnNvdXJjZT90aGlzLl9kZWNvZGUodGhpcy5zb3VyY2UsZSk6dGhpcy5wYXJlbnQudXJsP3RoaXMuX2xvYWRVcmwoZSk6ZT9lKG5ldyBFcnJvcihcInNvdW5kLnVybCBvciBzb3VuZC5zb3VyY2UgbXVzdCBiZSBzZXRcIikpOmNvbnNvbGUuZXJyb3IoXCJzb3VuZC51cmwgb3Igc291bmQuc291cmNlIG11c3QgYmUgc2V0XCIpfSxlLnByb3RvdHlwZS5fbG9hZFVybD1mdW5jdGlvbihlKXt2YXIgdD10aGlzLG49bmV3IFhNTEh0dHBSZXF1ZXN0LG89dGhpcy5wYXJlbnQudXJsO24ub3BlbihcIkdFVFwiLG8sITApLG4ucmVzcG9uc2VUeXBlPVwiYXJyYXlidWZmZXJcIixuLm9ubG9hZD1mdW5jdGlvbigpe3Quc291cmNlPW4ucmVzcG9uc2UsdC5fZGVjb2RlKG4ucmVzcG9uc2UsZSl9LG4uc2VuZCgpfSxlLnByb3RvdHlwZS5fZGVjb2RlPWZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpczt0aGlzLnBhcmVudC5jb250ZXh0LmRlY29kZShlLGZ1bmN0aW9uKGUsbyl7aWYoZSl0JiZ0KGUpO2Vsc2V7bi5wYXJlbnQuaXNMb2FkZWQ9ITAsbi5idWZmZXI9bzt2YXIgaT1uLnBhcmVudC5hdXRvUGxheVN0YXJ0KCk7dCYmdChudWxsLG4ucGFyZW50LGkpfX0pfSxlfSgpLHc9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fXJldHVybiBlLnJlc29sdmVVcmw9ZnVuY3Rpb24odCl7dmFyIG49ZS5GT1JNQVRfUEFUVEVSTixvPVwic3RyaW5nXCI9PXR5cGVvZiB0P3Q6dC51cmw7aWYobi50ZXN0KG8pKXtmb3IodmFyIGk9bi5leGVjKG8pLHI9aVsyXS5zcGxpdChcIixcIikscz1yW3IubGVuZ3RoLTFdLHU9MCxhPXIubGVuZ3RoO3U8YTt1Kyspe3ZhciBjPXJbdV07aWYoZS5zdXBwb3J0ZWRbY10pe3M9YzticmVha319dmFyIGw9by5yZXBsYWNlKGlbMV0scyk7cmV0dXJuXCJzdHJpbmdcIiE9dHlwZW9mIHQmJih0LmV4dGVuc2lvbj1zLHQudXJsPWwpLGx9cmV0dXJuIG99LGUuc2luZVRvbmU9ZnVuY3Rpb24oZSx0KXt2b2lkIDA9PT1lJiYoZT0yMDApLHZvaWQgMD09PXQmJih0PTEpO3ZhciBuPUkuZnJvbSh7c2luZ2xlSW5zdGFuY2U6ITB9KTtpZighKG4ubWVkaWEgaW5zdGFuY2VvZiBPKSlyZXR1cm4gbjtmb3IodmFyIG89bi5tZWRpYSxpPW4uY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsNDhlMyp0LDQ4ZTMpLHI9aS5nZXRDaGFubmVsRGF0YSgwKSxzPTA7czxyLmxlbmd0aDtzKyspe3ZhciB1PWUqKHMvaS5zYW1wbGVSYXRlKSpNYXRoLlBJO3Jbc109MipNYXRoLnNpbih1KX1yZXR1cm4gby5idWZmZXI9aSxuLmlzTG9hZGVkPSEwLG59LGUucmVuZGVyPWZ1bmN0aW9uKGUsdCl7dmFyIG49ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTt0PU9iamVjdC5hc3NpZ24oe3dpZHRoOjUxMixoZWlnaHQ6MTI4LGZpbGw6XCJibGFja1wifSx0fHx7fSksbi53aWR0aD10LndpZHRoLG4uaGVpZ2h0PXQuaGVpZ2h0O3ZhciBvPVBJWEkuQmFzZVRleHR1cmUuZnJvbUNhbnZhcyhuKTtpZighKGUubWVkaWEgaW5zdGFuY2VvZiBPKSlyZXR1cm4gbzt2YXIgaT1lLm1lZGlhO2NvbnNvbGUuYXNzZXJ0KCEhaS5idWZmZXIsXCJObyBidWZmZXIgZm91bmQsIGxvYWQgZmlyc3RcIik7dmFyIHI9bi5nZXRDb250ZXh0KFwiMmRcIik7ci5maWxsU3R5bGU9dC5maWxsO2Zvcih2YXIgcz1pLmJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKSx1PU1hdGguY2VpbChzLmxlbmd0aC90LndpZHRoKSxhPXQuaGVpZ2h0LzIsYz0wO2M8dC53aWR0aDtjKyspe2Zvcih2YXIgbD0xLHA9LTEsaD0wO2g8dTtoKyspe3ZhciBkPXNbYyp1K2hdO2Q8bCYmKGw9ZCksZD5wJiYocD1kKX1yLmZpbGxSZWN0KGMsKDErbCkqYSwxLE1hdGgubWF4KDEsKHAtbCkqYSkpfXJldHVybiBvfSxlLnBsYXlPbmNlPWZ1bmN0aW9uKHQsbil7dmFyIG89XCJhbGlhc1wiK2UuUExBWV9JRCsrO3JldHVybiBTLmluc3RhbmNlLmFkZChvLHt1cmw6dCxwcmVsb2FkOiEwLGF1dG9QbGF5OiEwLGxvYWRlZDpmdW5jdGlvbihlKXtlJiYoY29uc29sZS5lcnJvcihlKSxTLmluc3RhbmNlLnJlbW92ZShvKSxuJiZuKGUpKX0sY29tcGxldGU6ZnVuY3Rpb24oKXtTLmluc3RhbmNlLnJlbW92ZShvKSxuJiZuKG51bGwpfX0pLG99LGUuUExBWV9JRD0wLGUuRk9STUFUX1BBVFRFUk49L1xcLihcXHsoW15cXH1dKylcXH0pKFxcPy4qKT8kLyxlLmV4dGVuc2lvbnM9W1wibXAzXCIsXCJvZ2dcIixcIm9nYVwiLFwib3B1c1wiLFwibXBlZ1wiLFwid2F2XCIsXCJtNGFcIixcIm1wNFwiLFwiYWlmZlwiLFwid21hXCIsXCJtaWRcIl0sZS5zdXBwb3J0ZWQ9ZnVuY3Rpb24oKXt2YXIgdD17bTRhOlwibXA0XCIsb2dhOlwib2dnXCJ9LG49ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpLG89e307cmV0dXJuIGUuZXh0ZW5zaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciBpPXRbZV18fGUscj1uLmNhblBsYXlUeXBlKFwiYXVkaW8vXCIrZSkucmVwbGFjZSgvXm5vJC8sXCJcIikscz1uLmNhblBsYXlUeXBlKFwiYXVkaW8vXCIraSkucmVwbGFjZSgvXm5vJC8sXCJcIik7b1tlXT0hIXJ8fCEhc30pLE9iamVjdC5mcmVlemUobyl9KCksZX0oKSxqPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCxuKXt2YXIgbz1lLmNhbGwodGhpcyx0LG4pfHx0aGlzO3JldHVybiBvLnVzZShBLnBsdWdpbiksby5wcmUoQS5yZXNvbHZlKSxvfXJldHVybiB0KG4sZSksbi5hZGRQaXhpTWlkZGxld2FyZT1mdW5jdGlvbih0KXtlLmFkZFBpeGlNaWRkbGV3YXJlLmNhbGwodGhpcyx0KX0sbn0oUElYSS5sb2FkZXJzLkxvYWRlciksQT1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9cmV0dXJuIGUuaW5zdGFsbD1mdW5jdGlvbih0KXtlLl9zb3VuZD10LGUubGVnYWN5PXQudXNlTGVnYWN5LFBJWEkubG9hZGVycy5Mb2FkZXI9aixQSVhJLmxvYWRlci51c2UoZS5wbHVnaW4pLFBJWEkubG9hZGVyLnByZShlLnJlc29sdmUpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImxlZ2FjeVwiLHtzZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9UElYSS5sb2FkZXJzLlJlc291cmNlLG49dy5leHRlbnNpb25zO2U/bi5mb3JFYWNoKGZ1bmN0aW9uKGUpe3Quc2V0RXh0ZW5zaW9uWGhyVHlwZShlLHQuWEhSX1JFU1BPTlNFX1RZUEUuREVGQVVMVCksdC5zZXRFeHRlbnNpb25Mb2FkVHlwZShlLHQuTE9BRF9UWVBFLkFVRElPKX0pOm4uZm9yRWFjaChmdW5jdGlvbihlKXt0LnNldEV4dGVuc2lvblhoclR5cGUoZSx0LlhIUl9SRVNQT05TRV9UWVBFLkJVRkZFUiksdC5zZXRFeHRlbnNpb25Mb2FkVHlwZShlLHQuTE9BRF9UWVBFLlhIUil9KX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnJlc29sdmU9ZnVuY3Rpb24oZSx0KXt3LnJlc29sdmVVcmwoZSksdCgpfSxlLnBsdWdpbj1mdW5jdGlvbih0LG4pe3QuZGF0YSYmdy5leHRlbnNpb25zLmluZGV4T2YodC5leHRlbnNpb24pPi0xP3Quc291bmQ9ZS5fc291bmQuYWRkKHQubmFtZSx7bG9hZGVkOm4scHJlbG9hZDohMCx1cmw6dC51cmwsc291cmNlOnQuZGF0YX0pOm4oKX0sZX0oKSxGPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe3RoaXMucGFyZW50PWUsT2JqZWN0LmFzc2lnbih0aGlzLHQpLHRoaXMuZHVyYXRpb249dGhpcy5lbmQtdGhpcy5zdGFydCxjb25zb2xlLmFzc2VydCh0aGlzLmR1cmF0aW9uPjAsXCJFbmQgdGltZSBtdXN0IGJlIGFmdGVyIHN0YXJ0IHRpbWVcIil9cmV0dXJuIGUucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMucGFyZW50LnBsYXkoT2JqZWN0LmFzc2lnbih7Y29tcGxldGU6ZSxzcGVlZDp0aGlzLnNwZWVkfHx0aGlzLnBhcmVudC5zcGVlZCxlbmQ6dGhpcy5lbmQsc3RhcnQ6dGhpcy5zdGFydH0pKX0sZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucGFyZW50PW51bGx9LGV9KCksRT1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7dmFyIHQ9dGhpcyxvPW5ldyBuLkF1ZGlvQ29udGV4dCxpPW8uY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCkscj1vLmNyZWF0ZUFuYWx5c2VyKCk7cmV0dXJuIHIuY29ubmVjdChpKSxpLmNvbm5lY3Qoby5kZXN0aW5hdGlvbiksdD1lLmNhbGwodGhpcyxyLGkpfHx0aGlzLHQuX2N0eD1vLHQuX29mZmxpbmVDdHg9bmV3IG4uT2ZmbGluZUF1ZGlvQ29udGV4dCgxLDIsby5zYW1wbGVSYXRlKSx0Ll91bmxvY2tlZD0hMSx0LmNvbXByZXNzb3I9aSx0LmFuYWx5c2VyPXIsdC5ldmVudHM9bmV3IFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyLHQudm9sdW1lPTEsdC5zcGVlZD0xLHQubXV0ZWQ9ITEsdC5wYXVzZWQ9ITEsXCJvbnRvdWNoc3RhcnRcImluIHdpbmRvdyYmXCJydW5uaW5nXCIhPT1vLnN0YXRlJiYodC5fdW5sb2NrKCksdC5fdW5sb2NrPXQuX3VubG9jay5iaW5kKHQpLGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIix0Ll91bmxvY2ssITApLGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsdC5fdW5sb2NrLCEwKSxkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIix0Ll91bmxvY2ssITApKSx0fXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuX3VubG9jaz1mdW5jdGlvbigpe3RoaXMuX3VubG9ja2VkfHwodGhpcy5wbGF5RW1wdHlTb3VuZCgpLFwicnVubmluZ1wiPT09dGhpcy5fY3R4LnN0YXRlJiYoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLHRoaXMuX3VubG9jaywhMCksZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsdGhpcy5fdW5sb2NrLCEwKSxkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLHRoaXMuX3VubG9jaywhMCksdGhpcy5fdW5sb2NrZWQ9ITApKX0sbi5wcm90b3R5cGUucGxheUVtcHR5U291bmQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7ZS5idWZmZXI9dGhpcy5fY3R4LmNyZWF0ZUJ1ZmZlcigxLDEsMjIwNTApLGUuY29ubmVjdCh0aGlzLl9jdHguZGVzdGluYXRpb24pLGUuc3RhcnQoMCwwLDApfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobixcIkF1ZGlvQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXt2YXIgZT13aW5kb3c7cmV0dXJuIGUuQXVkaW9Db250ZXh0fHxlLndlYmtpdEF1ZGlvQ29udGV4dHx8bnVsbH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobixcIk9mZmxpbmVBdWRpb0NvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7dmFyIGU9d2luZG93O3JldHVybiBlLk9mZmxpbmVBdWRpb0NvbnRleHR8fGUud2Via2l0T2ZmbGluZUF1ZGlvQ29udGV4dHx8bnVsbH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7ZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpO3ZhciB0PXRoaXMuX2N0eDt2b2lkIDAhPT10LmNsb3NlJiZ0LmNsb3NlKCksdGhpcy5ldmVudHMucmVtb3ZlQWxsTGlzdGVuZXJzKCksdGhpcy5hbmFseXNlci5kaXNjb25uZWN0KCksdGhpcy5jb21wcmVzc29yLmRpc2Nvbm5lY3QoKSx0aGlzLmFuYWx5c2VyPW51bGwsdGhpcy5jb21wcmVzc29yPW51bGwsdGhpcy5ldmVudHM9bnVsbCx0aGlzLl9vZmZsaW5lQ3R4PW51bGwsdGhpcy5fY3R4PW51bGx9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImF1ZGlvQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY3R4fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcIm9mZmxpbmVDb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9vZmZsaW5lQ3R4fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInBhdXNlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGF1c2VkfSxzZXQ6ZnVuY3Rpb24oZSl7ZSYmXCJydW5uaW5nXCI9PT10aGlzLl9jdHguc3RhdGU/dGhpcy5fY3R4LnN1c3BlbmQoKTplfHxcInN1c3BlbmRlZFwiIT09dGhpcy5fY3R4LnN0YXRlfHx0aGlzLl9jdHgucmVzdW1lKCksdGhpcy5fcGF1c2VkPWV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3RoaXMuZXZlbnRzLmVtaXQoXCJyZWZyZXNoXCIpfSxuLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7dGhpcy5ldmVudHMuZW1pdChcInJlZnJlc2hQYXVzZWRcIil9LG4ucHJvdG90eXBlLnRvZ2dsZU11dGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tdXRlZD0hdGhpcy5tdXRlZCx0aGlzLnJlZnJlc2goKSx0aGlzLm11dGVkfSxuLnByb3RvdHlwZS50b2dnbGVQYXVzZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdXNlZD0hdGhpcy5wYXVzZWQsdGhpcy5yZWZyZXNoUGF1c2VkKCksdGhpcy5fcGF1c2VkfSxuLnByb3RvdHlwZS5kZWNvZGU9ZnVuY3Rpb24oZSx0KXt0aGlzLl9vZmZsaW5lQ3R4LmRlY29kZUF1ZGlvRGF0YShlLGZ1bmN0aW9uKGUpe3QobnVsbCxlKX0sZnVuY3Rpb24oKXt0KG5ldyBFcnJvcihcIlVuYWJsZSB0byBkZWNvZGUgZmlsZVwiKSl9KX0sbn0obiksTD1PYmplY3QuZnJlZXplKHtXZWJBdWRpb01lZGlhOk8sV2ViQXVkaW9JbnN0YW5jZTpQLFdlYkF1ZGlvTm9kZXM6eCxXZWJBdWRpb0NvbnRleHQ6RSxXZWJBdWRpb1V0aWxzOmx9KSxTPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe3RoaXMuaW5pdCgpfXJldHVybiBlLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc3VwcG9ydGVkJiYodGhpcy5fd2ViQXVkaW9Db250ZXh0PW5ldyBFKSx0aGlzLl9odG1sQXVkaW9Db250ZXh0PW5ldyBiLHRoaXMuX3NvdW5kcz17fSx0aGlzLnVzZUxlZ2FjeT0hdGhpcy5zdXBwb3J0ZWQsdGhpc30sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiY29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLmluaXQ9ZnVuY3Rpb24oKXtpZihlLmluc3RhbmNlKXRocm93IG5ldyBFcnJvcihcIlNvdW5kTGlicmFyeSBpcyBhbHJlYWR5IGNyZWF0ZWRcIik7dmFyIHQ9ZS5pbnN0YW5jZT1uZXcgZTtcInVuZGVmaW5lZFwiPT10eXBlb2YgUHJvbWlzZSYmKHdpbmRvdy5Qcm9taXNlPWEpLHZvaWQgMCE9PVBJWEkubG9hZGVycyYmQS5pbnN0YWxsKHQpLHZvaWQgMD09PXdpbmRvdy5fX3BpeGlTb3VuZCYmZGVsZXRlIHdpbmRvdy5fX3BpeGlTb3VuZDt2YXIgbz1QSVhJO3JldHVybiBvLnNvdW5kfHwoT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sXCJzb3VuZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0LHtmaWx0ZXJzOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbX19LGh0bWxhdWRpbzp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGd9fSx3ZWJhdWRpbzp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIEx9fSx1dGlsczp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHd9fSxTb3VuZDp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIEl9fSxTb3VuZFNwcml0ZTp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIEZ9fSxGaWx0ZXJhYmxlOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbn19LFNvdW5kTGlicmFyeTp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGV9fX0pKSx0fSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJmaWx0ZXJzQWxsXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnVzZUxlZ2FjeT9bXTp0aGlzLl9jb250ZXh0LmZpbHRlcnN9LHNldDpmdW5jdGlvbihlKXt0aGlzLnVzZUxlZ2FjeXx8KHRoaXMuX2NvbnRleHQuZmlsdGVycz1lKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJzdXBwb3J0ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG51bGwhPT1FLkF1ZGlvQ29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24oZSx0KXtpZihcIm9iamVjdFwiPT10eXBlb2YgZSl7dmFyIG49e307Zm9yKHZhciBvIGluIGUpe2k9dGhpcy5fZ2V0T3B0aW9ucyhlW29dLHQpO25bb109dGhpcy5hZGQobyxpKX1yZXR1cm4gbn1pZihcInN0cmluZ1wiPT10eXBlb2YgZSl7aWYoY29uc29sZS5hc3NlcnQoIXRoaXMuX3NvdW5kc1tlXSxcIlNvdW5kIHdpdGggYWxpYXMgXCIrZStcIiBhbHJlYWR5IGV4aXN0cy5cIiksdCBpbnN0YW5jZW9mIEkpcmV0dXJuIHRoaXMuX3NvdW5kc1tlXT10LHQ7dmFyIGk9dGhpcy5fZ2V0T3B0aW9ucyh0KSxyPUkuZnJvbShpKTtyZXR1cm4gdGhpcy5fc291bmRzW2VdPXIscn19LGUucHJvdG90eXBlLl9nZXRPcHRpb25zPWZ1bmN0aW9uKGUsdCl7dmFyIG47cmV0dXJuIG49XCJzdHJpbmdcIj09dHlwZW9mIGU/e3VybDplfTplIGluc3RhbmNlb2YgQXJyYXlCdWZmZXJ8fGUgaW5zdGFuY2VvZiBIVE1MQXVkaW9FbGVtZW50P3tzb3VyY2U6ZX06ZSxPYmplY3QuYXNzaWduKG4sdHx8e30pfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJ1c2VMZWdhY3lcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3VzZUxlZ2FjeX0sc2V0OmZ1bmN0aW9uKGUpe0EubGVnYWN5PWUsdGhpcy5fdXNlTGVnYWN5PWUsIWUmJnRoaXMuc3VwcG9ydGVkP3RoaXMuX2NvbnRleHQ9dGhpcy5fd2ViQXVkaW9Db250ZXh0OnRoaXMuX2NvbnRleHQ9dGhpcy5faHRtbEF1ZGlvQ29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZXhpc3RzKGUsITApLHRoaXMuX3NvdW5kc1tlXS5kZXN0cm95KCksZGVsZXRlIHRoaXMuX3NvdW5kc1tlXSx0aGlzfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJ2b2x1bWVBbGxcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQudm9sdW1lfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fY29udGV4dC52b2x1bWU9ZSx0aGlzLl9jb250ZXh0LnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJzcGVlZEFsbFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5zcGVlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2NvbnRleHQuc3BlZWQ9ZSx0aGlzLl9jb250ZXh0LnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS50b2dnbGVQYXVzZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnRvZ2dsZVBhdXNlKCl9LGUucHJvdG90eXBlLnBhdXNlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQucGF1c2VkPSEwLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpLHRoaXN9LGUucHJvdG90eXBlLnJlc3VtZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnBhdXNlZD0hMSx0aGlzLl9jb250ZXh0LnJlZnJlc2goKSx0aGlzfSxlLnByb3RvdHlwZS50b2dnbGVNdXRlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQudG9nZ2xlTXV0ZSgpfSxlLnByb3RvdHlwZS5tdXRlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQubXV0ZWQ9ITAsdGhpcy5fY29udGV4dC5yZWZyZXNoKCksdGhpc30sZS5wcm90b3R5cGUudW5tdXRlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQubXV0ZWQ9ITEsdGhpcy5fY29udGV4dC5yZWZyZXNoKCksdGhpc30sZS5wcm90b3R5cGUucmVtb3ZlQWxsPWZ1bmN0aW9uKCl7Zm9yKHZhciBlIGluIHRoaXMuX3NvdW5kcyl0aGlzLl9zb3VuZHNbZV0uZGVzdHJveSgpLGRlbGV0ZSB0aGlzLl9zb3VuZHNbZV07cmV0dXJuIHRoaXN9LGUucHJvdG90eXBlLnN0b3BBbGw9ZnVuY3Rpb24oKXtmb3IodmFyIGUgaW4gdGhpcy5fc291bmRzKXRoaXMuX3NvdW5kc1tlXS5zdG9wKCk7cmV0dXJuIHRoaXN9LGUucHJvdG90eXBlLmV4aXN0cz1mdW5jdGlvbihlLHQpe3ZvaWQgMD09PXQmJih0PSExKTt2YXIgbj0hIXRoaXMuX3NvdW5kc1tlXTtyZXR1cm4gdCYmY29uc29sZS5hc3NlcnQobixcIk5vIHNvdW5kIG1hdGNoaW5nIGFsaWFzICdcIitlK1wiJy5cIiksbn0sZS5wcm90b3R5cGUuZmluZD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5leGlzdHMoZSwhMCksdGhpcy5fc291bmRzW2VdfSxlLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuZmluZChlKS5wbGF5KHQpfSxlLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmZpbmQoZSkuc3RvcCgpfSxlLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5maW5kKGUpLnBhdXNlKCl9LGUucHJvdG90eXBlLnJlc3VtZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5maW5kKGUpLnJlc3VtZSgpfSxlLnByb3RvdHlwZS52b2x1bWU9ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzLmZpbmQoZSk7cmV0dXJuIHZvaWQgMCE9PXQmJihuLnZvbHVtZT10KSxuLnZvbHVtZX0sZS5wcm90b3R5cGUuc3BlZWQ9ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzLmZpbmQoZSk7cmV0dXJuIHZvaWQgMCE9PXQmJihuLnNwZWVkPXQpLG4uc3BlZWR9LGUucHJvdG90eXBlLmR1cmF0aW9uPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmZpbmQoZSkuZHVyYXRpb259LGUucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmVtb3ZlQWxsKCksdGhpcy5fc291bmRzPW51bGwsdGhpcy5fd2ViQXVkaW9Db250ZXh0JiYodGhpcy5fd2ViQXVkaW9Db250ZXh0LmRlc3Ryb3koKSx0aGlzLl93ZWJBdWRpb0NvbnRleHQ9bnVsbCksdGhpcy5faHRtbEF1ZGlvQ29udGV4dCYmKHRoaXMuX2h0bWxBdWRpb0NvbnRleHQuZGVzdHJveSgpLHRoaXMuX2h0bWxBdWRpb0NvbnRleHQ9bnVsbCksdGhpcy5fY29udGV4dD1udWxsLHRoaXN9LGV9KCksST1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXt0aGlzLm1lZGlhPWUsdGhpcy5vcHRpb25zPXQsdGhpcy5faW5zdGFuY2VzPVtdLHRoaXMuX3Nwcml0ZXM9e30sdGhpcy5tZWRpYS5pbml0KHRoaXMpO3ZhciBuPXQuY29tcGxldGU7dGhpcy5fYXV0b1BsYXlPcHRpb25zPW4/e2NvbXBsZXRlOm59Om51bGwsdGhpcy5pc0xvYWRlZD0hMSx0aGlzLmlzUGxheWluZz0hMSx0aGlzLmF1dG9QbGF5PXQuYXV0b1BsYXksdGhpcy5zaW5nbGVJbnN0YW5jZT10LnNpbmdsZUluc3RhbmNlLHRoaXMucHJlbG9hZD10LnByZWxvYWR8fHRoaXMuYXV0b1BsYXksdGhpcy51cmw9dC51cmwsdGhpcy5zcGVlZD10LnNwZWVkLHRoaXMudm9sdW1lPXQudm9sdW1lLHRoaXMubG9vcD10Lmxvb3AsdC5zcHJpdGVzJiZ0aGlzLmFkZFNwcml0ZXModC5zcHJpdGVzKSx0aGlzLnByZWxvYWQmJnRoaXMuX3ByZWxvYWQodC5sb2FkZWQpfXJldHVybiBlLmZyb209ZnVuY3Rpb24odCl7dmFyIG49e307cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIHQ/bi51cmw9dDp0IGluc3RhbmNlb2YgQXJyYXlCdWZmZXJ8fHQgaW5zdGFuY2VvZiBIVE1MQXVkaW9FbGVtZW50P24uc291cmNlPXQ6bj10LChuPU9iamVjdC5hc3NpZ24oe2F1dG9QbGF5OiExLHNpbmdsZUluc3RhbmNlOiExLHVybDpudWxsLHNvdXJjZTpudWxsLHByZWxvYWQ6ITEsdm9sdW1lOjEsc3BlZWQ6MSxjb21wbGV0ZTpudWxsLGxvYWRlZDpudWxsLGxvb3A6ITF9LG4pKS51cmwmJihuLnVybD13LnJlc29sdmVVcmwobi51cmwpKSxPYmplY3QuZnJlZXplKG4pLG5ldyBlKFMuaW5zdGFuY2UudXNlTGVnYWN5P25ldyBzOm5ldyBPLG4pfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJjb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiBTLmluc3RhbmNlLmNvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pc1BsYXlpbmc9ITEsdGhpcy5wYXVzZWQ9ITAsdGhpc30sZS5wcm90b3R5cGUucmVzdW1lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaXNQbGF5aW5nPXRoaXMuX2luc3RhbmNlcy5sZW5ndGg+MCx0aGlzLnBhdXNlZD0hMSx0aGlzfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJwYXVzZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhdXNlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3BhdXNlZD1lLHRoaXMucmVmcmVzaFBhdXNlZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInNwZWVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zcGVlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NwZWVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tZWRpYS5maWx0ZXJzfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5tZWRpYS5maWx0ZXJzPWV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuYWRkU3ByaXRlcz1mdW5jdGlvbihlLHQpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXt2YXIgbj17fTtmb3IodmFyIG8gaW4gZSluW29dPXRoaXMuYWRkU3ByaXRlcyhvLGVbb10pO3JldHVybiBufWlmKFwic3RyaW5nXCI9PXR5cGVvZiBlKXtjb25zb2xlLmFzc2VydCghdGhpcy5fc3ByaXRlc1tlXSxcIkFsaWFzIFwiK2UrXCIgaXMgYWxyZWFkeSB0YWtlblwiKTt2YXIgaT1uZXcgRih0aGlzLHQpO3JldHVybiB0aGlzLl9zcHJpdGVzW2VdPWksaX19LGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLl9yZW1vdmVJbnN0YW5jZXMoKSx0aGlzLnJlbW92ZVNwcml0ZXMoKSx0aGlzLm1lZGlhLmRlc3Ryb3koKSx0aGlzLm1lZGlhPW51bGwsdGhpcy5fc3ByaXRlcz1udWxsLHRoaXMuX2luc3RhbmNlcz1udWxsfSxlLnByb3RvdHlwZS5yZW1vdmVTcHJpdGVzPWZ1bmN0aW9uKGUpe2lmKGUpe3ZhciB0PXRoaXMuX3Nwcml0ZXNbZV07dm9pZCAwIT09dCYmKHQuZGVzdHJveSgpLGRlbGV0ZSB0aGlzLl9zcHJpdGVzW2VdKX1lbHNlIGZvcih2YXIgbiBpbiB0aGlzLl9zcHJpdGVzKXRoaXMucmVtb3ZlU3ByaXRlcyhuKTtyZXR1cm4gdGhpc30sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiaXNQbGF5YWJsZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pc0xvYWRlZCYmdGhpcy5tZWRpYSYmdGhpcy5tZWRpYS5pc1BsYXlhYmxlfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oKXtpZighdGhpcy5pc1BsYXlhYmxlKXJldHVybiB0aGlzLmF1dG9QbGF5PSExLHRoaXMuX2F1dG9QbGF5T3B0aW9ucz1udWxsLHRoaXM7dGhpcy5pc1BsYXlpbmc9ITE7Zm9yKHZhciBlPXRoaXMuX2luc3RhbmNlcy5sZW5ndGgtMTtlPj0wO2UtLSl0aGlzLl9pbnN0YW5jZXNbZV0uc3RvcCgpO3JldHVybiB0aGlzfSxlLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUsdCl7dmFyIG4sbz10aGlzO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlP249e3Nwcml0ZTpyPWUsY29tcGxldGU6dH06XCJmdW5jdGlvblwiPT10eXBlb2YgZT8obj17fSkuY29tcGxldGU9ZTpuPWUsKG49T2JqZWN0LmFzc2lnbih7Y29tcGxldGU6bnVsbCxsb2FkZWQ6bnVsbCxzcHJpdGU6bnVsbCxlbmQ6bnVsbCxzdGFydDowLHZvbHVtZToxLHNwZWVkOjEsbXV0ZWQ6ITEsbG9vcDohMX0sbnx8e30pKS5zcHJpdGUpe3ZhciBpPW4uc3ByaXRlO2NvbnNvbGUuYXNzZXJ0KCEhdGhpcy5fc3ByaXRlc1tpXSxcIkFsaWFzIFwiK2krXCIgaXMgbm90IGF2YWlsYWJsZVwiKTt2YXIgcj10aGlzLl9zcHJpdGVzW2ldO24uc3RhcnQ9ci5zdGFydCxuLmVuZD1yLmVuZCxuLnNwZWVkPXIuc3BlZWR8fDEsZGVsZXRlIG4uc3ByaXRlfWlmKG4ub2Zmc2V0JiYobi5zdGFydD1uLm9mZnNldCksIXRoaXMuaXNMb2FkZWQpcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGUsdCl7by5hdXRvUGxheT0hMCxvLl9hdXRvUGxheU9wdGlvbnM9bixvLl9wcmVsb2FkKGZ1bmN0aW9uKG8saSxyKXtvP3Qobyk6KG4ubG9hZGVkJiZuLmxvYWRlZChvLGksciksZShyKSl9KX0pO3RoaXMuc2luZ2xlSW5zdGFuY2UmJnRoaXMuX3JlbW92ZUluc3RhbmNlcygpO3ZhciBzPXRoaXMuX2NyZWF0ZUluc3RhbmNlKCk7cmV0dXJuIHRoaXMuX2luc3RhbmNlcy5wdXNoKHMpLHRoaXMuaXNQbGF5aW5nPSEwLHMub25jZShcImVuZFwiLGZ1bmN0aW9uKCl7bi5jb21wbGV0ZSYmbi5jb21wbGV0ZShvKSxvLl9vbkNvbXBsZXRlKHMpfSkscy5vbmNlKFwic3RvcFwiLGZ1bmN0aW9uKCl7by5fb25Db21wbGV0ZShzKX0pLHMucGxheShuKSxzfSxlLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuX2luc3RhbmNlcy5sZW5ndGgsdD0wO3Q8ZTt0KyspdGhpcy5faW5zdGFuY2VzW3RdLnJlZnJlc2goKX0sZS5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLl9pbnN0YW5jZXMubGVuZ3RoLHQ9MDt0PGU7dCsrKXRoaXMuX2luc3RhbmNlc1t0XS5yZWZyZXNoUGF1c2VkKCl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInZvbHVtZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdm9sdW1lfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fdm9sdW1lPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwibXV0ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX211dGVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbXV0ZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJsb29wXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9sb29wfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbG9vcD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLl9wcmVsb2FkPWZ1bmN0aW9uKGUpe3RoaXMubWVkaWEubG9hZChlKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiaW5zdGFuY2VzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9pbnN0YW5jZXN9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwic3ByaXRlc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3ByaXRlc30sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJkdXJhdGlvblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tZWRpYS5kdXJhdGlvbn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5hdXRvUGxheVN0YXJ0PWZ1bmN0aW9uKCl7dmFyIGU7cmV0dXJuIHRoaXMuYXV0b1BsYXkmJihlPXRoaXMucGxheSh0aGlzLl9hdXRvUGxheU9wdGlvbnMpKSxlfSxlLnByb3RvdHlwZS5fcmVtb3ZlSW5zdGFuY2VzPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuX2luc3RhbmNlcy5sZW5ndGgtMTtlPj0wO2UtLSl0aGlzLl9wb29sSW5zdGFuY2UodGhpcy5faW5zdGFuY2VzW2VdKTt0aGlzLl9pbnN0YW5jZXMubGVuZ3RoPTB9LGUucHJvdG90eXBlLl9vbkNvbXBsZXRlPWZ1bmN0aW9uKGUpe2lmKHRoaXMuX2luc3RhbmNlcyl7dmFyIHQ9dGhpcy5faW5zdGFuY2VzLmluZGV4T2YoZSk7dD4tMSYmdGhpcy5faW5zdGFuY2VzLnNwbGljZSh0LDEpLHRoaXMuaXNQbGF5aW5nPXRoaXMuX2luc3RhbmNlcy5sZW5ndGg+MH10aGlzLl9wb29sSW5zdGFuY2UoZSl9LGUucHJvdG90eXBlLl9jcmVhdGVJbnN0YW5jZT1mdW5jdGlvbigpe2lmKGUuX3Bvb2wubGVuZ3RoPjApe3ZhciB0PWUuX3Bvb2wucG9wKCk7cmV0dXJuIHQuaW5pdCh0aGlzLm1lZGlhKSx0fXJldHVybiB0aGlzLm1lZGlhLmNyZWF0ZSgpfSxlLnByb3RvdHlwZS5fcG9vbEluc3RhbmNlPWZ1bmN0aW9uKHQpe3QuZGVzdHJveSgpLGUuX3Bvb2wuaW5kZXhPZih0KTwwJiZlLl9wb29sLnB1c2godCl9LGUuX3Bvb2w9W10sZX0oKSxDPVMuaW5pdCgpO2Uuc291bmQ9QyxlLmZpbHRlcnM9bSxlLmh0bWxhdWRpbz1nLGUud2ViYXVkaW89TCxlLkZpbHRlcmFibGU9bixlLlNvdW5kPUksZS5Tb3VuZExpYnJhcnk9UyxlLlNvdW5kU3ByaXRlPUYsZS51dGlscz13LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXhpLXNvdW5kLmpzLm1hcFxuIiwiIWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUoaSl7aWYobltpXSlyZXR1cm4gbltpXS5leHBvcnRzO3ZhciByPW5baV09e2V4cG9ydHM6e30saWQ6aSxsb2FkZWQ6ITF9O3JldHVybiB0W2ldLmNhbGwoci5leHBvcnRzLHIsci5leHBvcnRzLGUpLHIubG9hZGVkPSEwLHIuZXhwb3J0c312YXIgbj17fTtyZXR1cm4gZS5tPXQsZS5jPW4sZS5wPVwiXCIsZSgwKX0oW2Z1bmN0aW9uKHQsZSxuKXt0LmV4cG9ydHM9big2KX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9UElYSX0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbj17bGluZWFyOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0fX0saW5RdWFkOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnR9fSxvdXRRdWFkOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KigyLXQpfX0saW5PdXRRdWFkOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQ6LS41KigtLXQqKHQtMiktMSl9fSxpbkN1YmljOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnQqdH19LG91dEN1YmljOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi0tdCp0KnQrMX19LGluT3V0Q3ViaWM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py41KnQqdCp0Oih0LT0yLC41Kih0KnQqdCsyKSl9fSxpblF1YXJ0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnQqdCp0fX0sb3V0UXVhcnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEtIC0tdCp0KnQqdH19LGluT3V0UXVhcnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py41KnQqdCp0KnQ6KHQtPTIsLS41Kih0KnQqdCp0LTIpKX19LGluUXVpbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqdCp0KnQqdH19LG91dFF1aW50OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi0tdCp0KnQqdCp0KzF9fSxpbk91dFF1aW50OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQqdCp0KnQ6KHQtPTIsLjUqKHQqdCp0KnQqdCsyKSl9fSxpblNpbmU6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEtTWF0aC5jb3ModCpNYXRoLlBJLzIpfX0sb3V0U2luZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zaW4odCpNYXRoLlBJLzIpfX0saW5PdXRTaW5lOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi41KigxLU1hdGguY29zKE1hdGguUEkqdCkpfX0saW5FeHBvOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAwPT09dD8wOk1hdGgucG93KDEwMjQsdC0xKX19LG91dEV4cG86ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDE9PT10PzE6MS1NYXRoLnBvdygyLC0xMCp0KX19LGluT3V0RXhwbzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMD09PXQ/MDoxPT09dD8xOih0Kj0yLDE+dD8uNSpNYXRoLnBvdygxMDI0LHQtMSk6LjUqKC1NYXRoLnBvdygyLC0xMCoodC0xKSkrMikpfX0saW5DaXJjOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLU1hdGguc3FydCgxLXQqdCl9fSxvdXRDaXJjOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBNYXRoLnNxcnQoMS0gLS10KnQpfX0saW5PdXRDaXJjOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8tLjUqKE1hdGguc3FydCgxLXQqdCktMSk6LjUqKE1hdGguc3FydCgxLSh0LTIpKih0LTIpKSsxKX19LGluRWxhc3RpYzpmdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg8PTB8fHZvaWQgMD09PWFyZ3VtZW50c1swXT8uMTphcmd1bWVudHNbMF0sZT1hcmd1bWVudHMubGVuZ3RoPD0xfHx2b2lkIDA9PT1hcmd1bWVudHNbMV0/LjQ6YXJndW1lbnRzWzFdO3JldHVybiBmdW5jdGlvbihuKXt2YXIgaT12b2lkIDA7cmV0dXJuIDA9PT1uPzA6MT09PW4/MTooIXR8fDE+dD8odD0xLGk9ZS80KTppPWUqTWF0aC5hc2luKDEvdCkvKDIqTWF0aC5QSSksLSh0Kk1hdGgucG93KDIsMTAqKG4tMSkpKk1hdGguc2luKChuLTEtaSkqKDIqTWF0aC5QSSkvZSkpKX19LG91dEVsYXN0aWM6ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPD0wfHx2b2lkIDA9PT1hcmd1bWVudHNbMF0/LjE6YXJndW1lbnRzWzBdLGU9YXJndW1lbnRzLmxlbmd0aDw9MXx8dm9pZCAwPT09YXJndW1lbnRzWzFdPy40OmFyZ3VtZW50c1sxXTtyZXR1cm4gZnVuY3Rpb24obil7dmFyIGk9dm9pZCAwO3JldHVybiAwPT09bj8wOjE9PT1uPzE6KCF0fHwxPnQ/KHQ9MSxpPWUvNCk6aT1lKk1hdGguYXNpbigxL3QpLygyKk1hdGguUEkpLHQqTWF0aC5wb3coMiwtMTAqbikqTWF0aC5zaW4oKG4taSkqKDIqTWF0aC5QSSkvZSkrMSl9fSxpbk91dEVsYXN0aWM6ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPD0wfHx2b2lkIDA9PT1hcmd1bWVudHNbMF0/LjE6YXJndW1lbnRzWzBdLGU9YXJndW1lbnRzLmxlbmd0aDw9MXx8dm9pZCAwPT09YXJndW1lbnRzWzFdPy40OmFyZ3VtZW50c1sxXTtyZXR1cm4gZnVuY3Rpb24obil7dmFyIGk9dm9pZCAwO3JldHVybiAwPT09bj8wOjE9PT1uPzE6KCF0fHwxPnQ/KHQ9MSxpPWUvNCk6aT1lKk1hdGguYXNpbigxL3QpLygyKk1hdGguUEkpLG4qPTIsMT5uPy0uNSoodCpNYXRoLnBvdygyLDEwKihuLTEpKSpNYXRoLnNpbigobi0xLWkpKigyKk1hdGguUEkpL2UpKTp0Kk1hdGgucG93KDIsLTEwKihuLTEpKSpNYXRoLnNpbigobi0xLWkpKigyKk1hdGguUEkpL2UpKi41KzEpfX0saW5CYWNrOmZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgbj10fHwxLjcwMTU4O3JldHVybiBlKmUqKChuKzEpKmUtbil9fSxvdXRCYWNrOmZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgbj10fHwxLjcwMTU4O3JldHVybi0tZSplKigobisxKSplK24pKzF9fSxpbk91dEJhY2s6ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciBuPTEuNTI1Kih0fHwxLjcwMTU4KTtyZXR1cm4gZSo9MiwxPmU/LjUqKGUqZSooKG4rMSkqZS1uKSk6LjUqKChlLTIpKihlLTIpKigobisxKSooZS0yKStuKSsyKX19LGluQm91bmNlOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLW4ub3V0Qm91bmNlKCkoMS10KX19LG91dEJvdW5jZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS8yLjc1PnQ/Ny41NjI1KnQqdDoyLzIuNzU+dD8odC09MS41LzIuNzUsNy41NjI1KnQqdCsuNzUpOjIuNS8yLjc1PnQ/KHQtPTIuMjUvMi43NSw3LjU2MjUqdCp0Ky45Mzc1KToodC09Mi42MjUvMi43NSw3LjU2MjUqdCp0Ky45ODQzNzUpfX0saW5PdXRCb3VuY2U6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuLjU+dD8uNSpuLmluQm91bmNlKCkoMip0KTouNSpuLm91dEJvdW5jZSgpKDIqdC0xKSsuNX19LGN1c3RvbUFycmF5OmZ1bmN0aW9uKHQpe3JldHVybiB0P2Z1bmN0aW9uKHQpe3JldHVybiB0fTpuLmxpbmVhcigpfX07ZVtcImRlZmF1bHRcIl09bn0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1mdW5jdGlvbiByKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDt2YXIgZT17fTtpZihudWxsIT10KWZvcih2YXIgbiBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pJiYoZVtuXT10W25dKTtyZXR1cm4gZVtcImRlZmF1bHRcIl09dCxlfWZ1bmN0aW9uIHModCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfWZ1bmN0aW9uIG8odCxlKXtpZighdCl0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7cmV0dXJuIWV8fFwib2JqZWN0XCIhPXR5cGVvZiBlJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBlP3Q6ZX1mdW5jdGlvbiBhKHQsZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSYmbnVsbCE9PWUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIrdHlwZW9mIGUpO3QucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTp0LGVudW1lcmFibGU6ITEsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfX0pLGUmJihPYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LnNldFByb3RvdHlwZU9mKHQsZSk6dC5fX3Byb3RvX189ZSl9ZnVuY3Rpb24gdSh0LGUsbixpLHIscyl7Zm9yKHZhciBvIGluIHQpaWYoYyh0W29dKSl1KHRbb10sZVtvXSxuW29dLGkscixzKTtlbHNle3ZhciBhPWVbb10saD10W29dLWVbb10sbD1pLGY9ci9sO25bb109YStoKnMoZil9fWZ1bmN0aW9uIGgodCxlLG4pe2Zvcih2YXIgaSBpbiB0KTA9PT1lW2ldfHxlW2ldfHwoYyhuW2ldKT8oZVtpXT1KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG5baV0pKSxoKHRbaV0sZVtpXSxuW2ldKSk6ZVtpXT1uW2ldKX1mdW5jdGlvbiBjKHQpe3JldHVyblwiW29iamVjdCBPYmplY3RdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCl9dmFyIGw9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciBpPWVbbl07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLGkpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLGkmJnQoZSxpKSxlfX0oKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgZj1uKDEpLHA9cihmKSxkPW4oMiksZz1pKGQpLHY9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSh0LG4pe3ModGhpcyxlKTt2YXIgaT1vKHRoaXMsT2JqZWN0LmdldFByb3RvdHlwZU9mKGUpLmNhbGwodGhpcykpO3JldHVybiBpLnRhcmdldD10LG4mJmkuYWRkVG8obiksaS5jbGVhcigpLGl9cmV0dXJuIGEoZSx0KSxsKGUsW3trZXk6XCJhZGRUb1wiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLm1hbmFnZXI9dCx0aGlzLm1hbmFnZXIuYWRkVHdlZW4odGhpcyksdGhpc319LHtrZXk6XCJjaGFpblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0fHwodD1uZXcgZSh0aGlzLnRhcmdldCkpLHRoaXMuX2NoYWluVHdlZW49dCx0fX0se2tleTpcInN0YXJ0XCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hY3RpdmU9ITAsdGhpc319LHtrZXk6XCJzdG9wXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hY3RpdmU9ITEsdGhpcy5lbWl0KFwic3RvcFwiKSx0aGlzfX0se2tleTpcInRvXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX3RvPXQsdGhpc319LHtrZXk6XCJmcm9tXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2Zyb209dCx0aGlzfX0se2tleTpcInJlbW92ZVwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWFuYWdlcj8odGhpcy5tYW5hZ2VyLnJlbW92ZVR3ZWVuKHRoaXMpLHRoaXMpOnRoaXN9fSx7a2V5OlwiY2xlYXJcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMudGltZT0wLHRoaXMuYWN0aXZlPSExLHRoaXMuZWFzaW5nPWdbXCJkZWZhdWx0XCJdLmxpbmVhcigpLHRoaXMuZXhwaXJlPSExLHRoaXMucmVwZWF0PTAsdGhpcy5sb29wPSExLHRoaXMuZGVsYXk9MCx0aGlzLnBpbmdQb25nPSExLHRoaXMuaXNTdGFydGVkPSExLHRoaXMuaXNFbmRlZD0hMSx0aGlzLl90bz1udWxsLHRoaXMuX2Zyb209bnVsbCx0aGlzLl9kZWxheVRpbWU9MCx0aGlzLl9lbGFwc2VkVGltZT0wLHRoaXMuX3JlcGVhdD0wLHRoaXMuX3BpbmdQb25nPSExLHRoaXMuX2NoYWluVHdlZW49bnVsbCx0aGlzLnBhdGg9bnVsbCx0aGlzLnBhdGhSZXZlcnNlPSExLHRoaXMucGF0aEZyb209MCx0aGlzLnBhdGhUbz0wfX0se2tleTpcInJlc2V0XCIsdmFsdWU6ZnVuY3Rpb24oKXtpZih0aGlzLl9lbGFwc2VkVGltZT0wLHRoaXMuX3JlcGVhdD0wLHRoaXMuX2RlbGF5VGltZT0wLHRoaXMuaXNTdGFydGVkPSExLHRoaXMuaXNFbmRlZD0hMSx0aGlzLnBpbmdQb25nJiZ0aGlzLl9waW5nUG9uZyl7dmFyIHQ9dGhpcy5fdG8sZT10aGlzLl9mcm9tO3RoaXMuX3RvPWUsdGhpcy5fZnJvbT10LHRoaXMuX3BpbmdQb25nPSExfXJldHVybiB0aGlzfX0se2tleTpcInVwZGF0ZVwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7aWYodGhpcy5fY2FuVXBkYXRlKCl8fCF0aGlzLl90byYmIXRoaXMucGF0aCl7dmFyIG49dm9pZCAwLGk9dm9pZCAwO2lmKHRoaXMuZGVsYXk+dGhpcy5fZGVsYXlUaW1lKXJldHVybiB2b2lkKHRoaXMuX2RlbGF5VGltZSs9ZSk7dGhpcy5pc1N0YXJ0ZWR8fCh0aGlzLl9wYXJzZURhdGEoKSx0aGlzLmlzU3RhcnRlZD0hMCx0aGlzLmVtaXQoXCJzdGFydFwiKSk7dmFyIHI9dGhpcy5waW5nUG9uZz90aGlzLnRpbWUvMjp0aGlzLnRpbWU7aWYocj50aGlzLl9lbGFwc2VkVGltZSl7dmFyIHM9dGhpcy5fZWxhcHNlZFRpbWUrZSxvPXM+PXI7dGhpcy5fZWxhcHNlZFRpbWU9bz9yOnMsdGhpcy5fYXBwbHkocik7dmFyIGE9dGhpcy5fcGluZ1Bvbmc/cit0aGlzLl9lbGFwc2VkVGltZTp0aGlzLl9lbGFwc2VkVGltZTtpZih0aGlzLmVtaXQoXCJ1cGRhdGVcIixhKSxvKXtpZih0aGlzLnBpbmdQb25nJiYhdGhpcy5fcGluZ1BvbmcpcmV0dXJuIHRoaXMuX3BpbmdQb25nPSEwLG49dGhpcy5fdG8saT10aGlzLl9mcm9tLHRoaXMuX2Zyb209bix0aGlzLl90bz1pLHRoaXMucGF0aCYmKG49dGhpcy5wYXRoVG8saT10aGlzLnBhdGhGcm9tLHRoaXMucGF0aFRvPWksdGhpcy5wYXRoRnJvbT1uKSx0aGlzLmVtaXQoXCJwaW5ncG9uZ1wiKSx2b2lkKHRoaXMuX2VsYXBzZWRUaW1lPTApO2lmKHRoaXMubG9vcHx8dGhpcy5yZXBlYXQ+dGhpcy5fcmVwZWF0KXJldHVybiB0aGlzLl9yZXBlYXQrKyx0aGlzLmVtaXQoXCJyZXBlYXRcIix0aGlzLl9yZXBlYXQpLHRoaXMuX2VsYXBzZWRUaW1lPTAsdm9pZCh0aGlzLnBpbmdQb25nJiZ0aGlzLl9waW5nUG9uZyYmKG49dGhpcy5fdG8saT10aGlzLl9mcm9tLHRoaXMuX3RvPWksdGhpcy5fZnJvbT1uLHRoaXMucGF0aCYmKG49dGhpcy5wYXRoVG8saT10aGlzLnBhdGhGcm9tLHRoaXMucGF0aFRvPWksdGhpcy5wYXRoRnJvbT1uKSx0aGlzLl9waW5nUG9uZz0hMSkpO3RoaXMuaXNFbmRlZD0hMCx0aGlzLmFjdGl2ZT0hMSx0aGlzLmVtaXQoXCJlbmRcIiksdGhpcy5fY2hhaW5Ud2VlbiYmKHRoaXMuX2NoYWluVHdlZW4uYWRkVG8odGhpcy5tYW5hZ2VyKSx0aGlzLl9jaGFpblR3ZWVuLnN0YXJ0KCkpfX19fX0se2tleTpcIl9wYXJzZURhdGFcIix2YWx1ZTpmdW5jdGlvbigpe2lmKCF0aGlzLmlzU3RhcnRlZCYmKHRoaXMuX2Zyb218fCh0aGlzLl9mcm9tPXt9KSxoKHRoaXMuX3RvLHRoaXMuX2Zyb20sdGhpcy50YXJnZXQpLHRoaXMucGF0aCkpe3ZhciB0PXRoaXMucGF0aC50b3RhbERpc3RhbmNlKCk7dGhpcy5wYXRoUmV2ZXJzZT8odGhpcy5wYXRoRnJvbT10LHRoaXMucGF0aFRvPTApOih0aGlzLnBhdGhGcm9tPTAsdGhpcy5wYXRoVG89dCl9fX0se2tleTpcIl9hcHBseVwiLHZhbHVlOmZ1bmN0aW9uKHQpe2lmKHUodGhpcy5fdG8sdGhpcy5fZnJvbSx0aGlzLnRhcmdldCx0LHRoaXMuX2VsYXBzZWRUaW1lLHRoaXMuZWFzaW5nKSx0aGlzLnBhdGgpe3ZhciBlPXRoaXMucGluZ1Bvbmc/dGhpcy50aW1lLzI6dGhpcy50aW1lLG49dGhpcy5wYXRoRnJvbSxpPXRoaXMucGF0aFRvLXRoaXMucGF0aEZyb20scj1lLHM9dGhpcy5fZWxhcHNlZFRpbWUvcixvPW4raSp0aGlzLmVhc2luZyhzKSxhPXRoaXMucGF0aC5nZXRQb2ludEF0RGlzdGFuY2Uobyk7dGhpcy50YXJnZXQucG9zaXRpb24uc2V0KGEueCxhLnkpfX19LHtrZXk6XCJfY2FuVXBkYXRlXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aW1lJiZ0aGlzLmFjdGl2ZSYmdGhpcy50YXJnZXR9fV0pLGV9KHAudXRpbHMuRXZlbnRFbWl0dGVyKTtlW1wiZGVmYXVsdFwiXT12fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fWZ1bmN0aW9uIHIodCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfXZhciBzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgaT1lW25dO2kuZW51bWVyYWJsZT1pLmVudW1lcmFibGV8fCExLGkuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIGkmJihpLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLmtleSxpKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixpKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxpJiZ0KGUsaSksZX19KCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG89bigzKSxhPWkobyksdT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXtyKHRoaXMsdCksdGhpcy50d2VlbnM9W10sdGhpcy5fdHdlZW5zVG9EZWxldGU9W10sdGhpcy5fbGFzdD0wfXJldHVybiBzKHQsW3trZXk6XCJ1cGRhdGVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT12b2lkIDA7dHx8MD09PXQ/ZT0xZTMqdDooZT10aGlzLl9nZXREZWx0YU1TKCksdD1lLzFlMyk7Zm9yKHZhciBuPTA7bjx0aGlzLnR3ZWVucy5sZW5ndGg7bisrKXt2YXIgaT10aGlzLnR3ZWVuc1tuXTtpLmFjdGl2ZSYmKGkudXBkYXRlKHQsZSksaS5pc0VuZGVkJiZpLmV4cGlyZSYmaS5yZW1vdmUoKSl9aWYodGhpcy5fdHdlZW5zVG9EZWxldGUubGVuZ3RoKXtmb3IodmFyIG49MDtuPHRoaXMuX3R3ZWVuc1RvRGVsZXRlLmxlbmd0aDtuKyspdGhpcy5fcmVtb3ZlKHRoaXMuX3R3ZWVuc1RvRGVsZXRlW25dKTt0aGlzLl90d2VlbnNUb0RlbGV0ZS5sZW5ndGg9MH19fSx7a2V5OlwiZ2V0VHdlZW5zRm9yVGFyZ2V0XCIsdmFsdWU6ZnVuY3Rpb24odCl7Zm9yKHZhciBlPVtdLG49MDtuPHRoaXMudHdlZW5zLmxlbmd0aDtuKyspdGhpcy50d2VlbnNbbl0udGFyZ2V0PT09dCYmZS5wdXNoKHRoaXMudHdlZW5zW25dKTtyZXR1cm4gZX19LHtrZXk6XCJjcmVhdGVUd2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBuZXcgYVtcImRlZmF1bHRcIl0odCx0aGlzKX19LHtrZXk6XCJhZGRUd2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3QubWFuYWdlcj10aGlzLHRoaXMudHdlZW5zLnB1c2godCl9fSx7a2V5OlwicmVtb3ZlVHdlZW5cIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLl90d2VlbnNUb0RlbGV0ZS5wdXNoKHQpfX0se2tleTpcIl9yZW1vdmVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLnR3ZWVucy5pbmRleE9mKHQpOy0xIT09ZSYmdGhpcy50d2VlbnMuc3BsaWNlKGUsMSl9fSx7a2V5OlwiX2dldERlbHRhTVNcIix2YWx1ZTpmdW5jdGlvbigpezA9PT10aGlzLl9sYXN0JiYodGhpcy5fbGFzdD1EYXRlLm5vdygpKTt2YXIgdD1EYXRlLm5vdygpLGU9dC10aGlzLl9sYXN0O3JldHVybiB0aGlzLl9sYXN0PXQsZX19XSksdH0oKTtlW1wiZGVmYXVsdFwiXT11fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIGU9e307aWYobnVsbCE9dClmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSk7cmV0dXJuIGVbXCJkZWZhdWx0XCJdPXQsZX1mdW5jdGlvbiByKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX12YXIgcz1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIGk9ZVtuXTtpLmVudW1lcmFibGU9aS5lbnVtZXJhYmxlfHwhMSxpLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBpJiYoaS53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaS5rZXksaSl9fXJldHVybiBmdW5jdGlvbihlLG4saSl7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksaSYmdChlLGkpLGV9fSgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBvPW4oMSksYT1pKG8pLHU9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7cih0aGlzLHQpLHRoaXMuX2NvbHNlZD0hMSx0aGlzLnBvbHlnb249bmV3IGEuUG9seWdvbix0aGlzLnBvbHlnb24uY2xvc2VkPSExLHRoaXMuX3RtcFBvaW50PW5ldyBhLlBvaW50LHRoaXMuX3RtcFBvaW50Mj1uZXcgYS5Qb2ludCx0aGlzLl90bXBEaXN0YW5jZT1bXSx0aGlzLmN1cnJlbnRQYXRoPW51bGwsdGhpcy5ncmFwaGljc0RhdGE9W10sdGhpcy5kaXJ0eT0hMH1yZXR1cm4gcyh0LFt7a2V5OlwibW92ZVRvXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUubW92ZVRvLmNhbGwodGhpcyx0LGUpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJsaW5lVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5saW5lVG8uY2FsbCh0aGlzLHQsZSksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImJlemllckN1cnZlVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUsbixpLHIscyl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmJlemllckN1cnZlVG8uY2FsbCh0aGlzLHQsZSxuLGkscixzKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwicXVhZHJhdGljQ3VydmVUb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuLGkpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5xdWFkcmF0aWNDdXJ2ZVRvLmNhbGwodGhpcyx0LGUsbixpKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiYXJjVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUsbixpLHIpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5hcmNUby5jYWxsKHRoaXMsdCxlLG4saSxyKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiYXJjXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4saSxyLHMpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5hcmMuY2FsbCh0aGlzLHQsZSxuLGkscixzKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiZHJhd1NoYXBlXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmRyYXdTaGFwZS5jYWxsKHRoaXMsdCksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImdldFBvaW50XCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5wYXJzZVBvaW50cygpO3ZhciBlPXRoaXMuY2xvc2VkJiZ0Pj10aGlzLmxlbmd0aC0xPzA6Mip0O3JldHVybiB0aGlzLl90bXBQb2ludC5zZXQodGhpcy5wb2x5Z29uLnBvaW50c1tlXSx0aGlzLnBvbHlnb24ucG9pbnRzW2UrMV0pLHRoaXMuX3RtcFBvaW50fX0se2tleTpcImRpc3RhbmNlQmV0d2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7dGhpcy5wYXJzZVBvaW50cygpO3ZhciBuPXRoaXMuZ2V0UG9pbnQodCksaT1uLngscj1uLnkscz10aGlzLmdldFBvaW50KGUpLG89cy54LGE9cy55LHU9by1pLGg9YS1yO3JldHVybiBNYXRoLnNxcnQodSp1K2gqaCl9fSx7a2V5OlwidG90YWxEaXN0YW5jZVwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5wYXJzZVBvaW50cygpLHRoaXMuX3RtcERpc3RhbmNlLmxlbmd0aD0wLHRoaXMuX3RtcERpc3RhbmNlLnB1c2goMCk7Zm9yKHZhciB0PXRoaXMubGVuZ3RoLGU9MCxuPTA7dC0xPm47bisrKWUrPXRoaXMuZGlzdGFuY2VCZXR3ZWVuKG4sbisxKSx0aGlzLl90bXBEaXN0YW5jZS5wdXNoKGUpO3JldHVybiBlfX0se2tleTpcImdldFBvaW50QXRcIix2YWx1ZTpmdW5jdGlvbih0KXtpZih0aGlzLnBhcnNlUG9pbnRzKCksdD50aGlzLmxlbmd0aClyZXR1cm4gdGhpcy5nZXRQb2ludCh0aGlzLmxlbmd0aC0xKTtpZih0JTE9PT0wKXJldHVybiB0aGlzLmdldFBvaW50KHQpO3RoaXMuX3RtcFBvaW50Mi5zZXQoMCwwKTt2YXIgZT10JTEsbj10aGlzLmdldFBvaW50KE1hdGguY2VpbCh0KSksaT1uLngscj1uLnkscz10aGlzLmdldFBvaW50KE1hdGguZmxvb3IodCkpLG89cy54LGE9cy55LHU9LSgoby1pKSplKSxoPS0oKGEtcikqZSk7cmV0dXJuIHRoaXMuX3RtcFBvaW50Mi5zZXQobyt1LGEraCksdGhpcy5fdG1wUG9pbnQyfX0se2tleTpcImdldFBvaW50QXREaXN0YW5jZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMucGFyc2VQb2ludHMoKSx0aGlzLl90bXBEaXN0YW5jZXx8dGhpcy50b3RhbERpc3RhbmNlKCk7dmFyIGU9dGhpcy5fdG1wRGlzdGFuY2UubGVuZ3RoLG49MCxpPXRoaXMuX3RtcERpc3RhbmNlW3RoaXMuX3RtcERpc3RhbmNlLmxlbmd0aC0xXTswPnQ/dD1pK3Q6dD5pJiYodC09aSk7Zm9yKHZhciByPTA7ZT5yJiYodD49dGhpcy5fdG1wRGlzdGFuY2Vbcl0mJihuPXIpLCEodDx0aGlzLl90bXBEaXN0YW5jZVtyXSkpO3IrKyk7aWYobj09PXRoaXMubGVuZ3RoLTEpcmV0dXJuIHRoaXMuZ2V0UG9pbnRBdChuKTt2YXIgcz10LXRoaXMuX3RtcERpc3RhbmNlW25dLG89dGhpcy5fdG1wRGlzdGFuY2VbbisxXS10aGlzLl90bXBEaXN0YW5jZVtuXTtyZXR1cm4gdGhpcy5nZXRQb2ludEF0KG4rcy9vKX19LHtrZXk6XCJwYXJzZVBvaW50c1wiLHZhbHVlOmZ1bmN0aW9uKCl7aWYoIXRoaXMuZGlydHkpcmV0dXJuIHRoaXM7dGhpcy5kaXJ0eT0hMSx0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aD0wO2Zvcih2YXIgdD0wO3Q8dGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoO3QrKyl7dmFyIGU9dGhpcy5ncmFwaGljc0RhdGFbdF0uc2hhcGU7ZSYmZS5wb2ludHMmJih0aGlzLnBvbHlnb24ucG9pbnRzPXRoaXMucG9seWdvbi5wb2ludHMuY29uY2F0KGUucG9pbnRzKSl9cmV0dXJuIHRoaXN9fSx7a2V5OlwiY2xlYXJcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGg9MCx0aGlzLmN1cnJlbnRQYXRoPW51bGwsdGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGg9MCx0aGlzLl9jbG9zZWQ9ITEsdGhpcy5kaXJ0eT0hMSx0aGlzfX0se2tleTpcImNsb3NlZFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jbG9zZWR9LHNldDpmdW5jdGlvbih0KXt0aGlzLl9jbG9zZWQhPT10JiYodGhpcy5wb2x5Z29uLmNsb3NlZD10LHRoaXMuX2Nsb3NlZD10LHRoaXMuZGlydHk9ITApfX0se2tleTpcImxlbmd0aFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aD90aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aC8yKyh0aGlzLl9jbG9zZWQ/MTowKTowfX1dKSx0fSgpO2VbXCJkZWZhdWx0XCJdPXV9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7XCJkZWZhdWx0XCI6dH19ZnVuY3Rpb24gcih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIGU9e307aWYobnVsbCE9dClmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSk7cmV0dXJuIGVbXCJkZWZhdWx0XCJdPXQsZX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgcz1uKDEpLG89cihzKSxhPW4oNCksdT1pKGEpLGg9bigzKSxjPWkoaCksbD1uKDUpLGY9aShsKSxwPW4oMiksZD1pKHApO28uR3JhcGhpY3MucHJvdG90eXBlLmRyYXdQYXRoPWZ1bmN0aW9uKHQpe3JldHVybiB0LnBhcnNlUG9pbnRzKCksdGhpcy5kcmF3U2hhcGUodC5wb2x5Z29uKSx0aGlzfTt2YXIgZz17VHdlZW5NYW5hZ2VyOnVbXCJkZWZhdWx0XCJdLFR3ZWVuOmNbXCJkZWZhdWx0XCJdLEVhc2luZzpkW1wiZGVmYXVsdFwiXSxUd2VlblBhdGg6ZltcImRlZmF1bHRcIl19O28udHdlZW5NYW5hZ2VyfHwoby50d2Vlbk1hbmFnZXI9bmV3IHVbXCJkZWZhdWx0XCJdLG8udHdlZW49ZyksZVtcImRlZmF1bHRcIl09Z31dKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpeGktdHdlZW4uanMubWFwIiwibW9kdWxlLmV4cG9ydHM9e1xyXG4gIFwiQVwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiY2VsbDEucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiBmYWxzZSxcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiY2VsbDEtZmlsbC5wbmdcIixcclxuICAgIFwiYWN0aXZhdGlvblwiOiA4LFxyXG4gICAgXCJzY29yZVwiOiAxXHJcbiAgfSxcclxuICBcIkJcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImNlbGwyLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogZmFsc2VcclxuICB9LFxyXG4gIFwiQ1wiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiY2VsbDQucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiBmYWxzZSxcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiY2VsbDQtZmlsbC5wbmdcIixcclxuICAgIFwiYWN0aXZhdGlvblwiOiAyMixcclxuICAgIFwic2NvcmVcIjogM1xyXG4gIH0sXHJcbiAgXCJJQ1wiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZEMucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIixcclxuICAgIFwiYWN0aW9uXCI6IFwiaGlzdG9yeVwiLFxyXG4gICAgXCJhY3RpdmF0aW9uXCI6IDBcclxuICB9LFxyXG4gIFwiSVRMXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kVEwucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJVFwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZFQucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJVFJcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRUUi5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklSXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kUi5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcImFjdGlvblwiOiBcImhpc3RvcnlcIixcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSUJSXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kQlIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJQlwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZEIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJQkxcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRCTC5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklMXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kTC5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiLFxyXG4gICAgXCJhY3Rpb25cIjogXCJoaXN0b3J5XCIsXHJcbiAgICBcImFjdGl2YXRpb25cIjogMFxyXG4gIH1cclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cz17XHJcbiAgXCJsZXRcIjogW1xyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBXCIsIFwiQXxDfEJcIiwgXCJBXCIsIFwiQVwiLCBcIkFcIl0sXHJcbiAgICAgIFwic2h1ZmZsZVwiOiB0cnVlLFxyXG4gICAgICBcInRyaW1cIjogM1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQXxBfENcIiwgXCJBfEJcIiwgXCJBXCIsIFwiQlwiLCBcIkFcIl0sXHJcbiAgICAgIFwic2h1ZmZsZVwiOiB0cnVlLFxyXG4gICAgfVxyXG4gIF0sXHJcbiAgXCJlbmRcIjogW1xyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBXCIsIFwiQVwiLCBcIkFcIiwgXCJBXCIsIFwiQVwiXSxcclxuICAgIH1cclxuICBdLFxyXG4gIFwibGFiaXJpbnRcIjogW1xyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJCXCIsIFwiQlwiLCBcIkJcIiwgXCJCXCIsIFwiQlwiXSxcclxuICAgICAgXCJhcHBlbmRcIjogXCJBXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIkFcIiwgXCJBXCIsIFwiQVwiLCBcIkFcIiwgXCJBXCJdLFxyXG4gICAgfVxyXG4gIF0sXHJcbiAgXCJpc2xhbmRcIjogW1xyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBfEN8QlwiLCBcIkFcIiwgXCJBfEN8QlwiXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiSVRMXCIsIFwiSVRcIiwgXCJJVFJcIl1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIklMXCIsICBcIklDXCIsICBcIklSXCJdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJJQkxcIiwgXCJJQlwiLCBcIklCUlwiXVxyXG4gICAgfVxyXG4gIF1cclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cz1bXHJcbiAge1xyXG4gICAgXCJmcmFnbWVudHNcIjogW1xyXG4gICAgICB7XCJpc2xhbmRcIjogMX0sXHJcbiAgICAgIHtcImxldFwiOiA0fSxcclxuICAgICAge1wibGFiaXJpbnRcIjogNX0sXHJcbiAgICAgIHtcImVuZFwiOiAxfSxcclxuICAgICAge1wiaXNsYW5kXCI6IDF9LFxyXG4gICAgXSxcclxuICAgIFwiaGlzdG9yeVwiOiB7XHJcbiAgICAgIFwicnVcIjogXCLQotC70LXQvSDQuNC00LXRgiDQt9CwINGC0L7QsdC+0Lkg0L/QviDQv9GP0YLQsNC8LiBcXG4g0J7RgtGB0YLRg9C/0LjRgdGMINC4INC+0L0g0YLQtdCx0Y8g0L/QvtCz0LvQsNGC0LjRgi4uLiBcXG4g0J3QviDQvdC1INGB0YLQvtC40YIg0L7RgtGH0LDQuNCy0LDRgtGM0YHRjywg0LLQtdC00Ywg0LzRg9C30YvQutCwINCy0YHQtdCz0LTQsCDRgSDRgtC+0LHQvtC5LlwiXHJcbiAgICB9XHJcbiAgfSxcclxuICB7XHJcbiAgICBcImZyYWdtZW50c1wiOiBbXHJcbiAgICAgIHtcImxldFwiOiAxMH0sXHJcbiAgICAgIHtcImxhYmlyaW50XCI6IDEwfSxcclxuICAgICAge1wiZW5kXCI6IDF9LFxyXG4gICAgICB7XCJpc2xhbmRcIjogMX1cclxuICAgIF0sXHJcbiAgICBcImhpc3RvcnlcIjoge1xyXG4gICAgICBcInJ1XCI6IFwi0KLQu9C10L0g0L3QtSDRidCw0LTQuNGCINC90LjQutC+0LPQvi4g0JvQtdGC0YPRh9C40LUg0LfQvNC10Lgg0L/QsNC00YPRgiDQvdCwINC30LXQvNC70Y4g0Lgg0L/QvtCz0YDRg9C30Y/RgtGB0Y8g0LIg0YDRg9GC0LjQvdGDINCx0YvRgtC40Y8uLi5cIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJmcmFnbWVudHNcIjogW1xyXG4gICAgICB7XCJsZXRcIjogNX0sXHJcbiAgICAgIHtcImxhYmlyaW50XCI6IDV9LFxyXG4gICAgICB7XCJsZXRcIjogNX0sXHJcbiAgICAgIHtcImxhYmlyaW50XCI6IDV9LFxyXG4gICAgICB7XCJsZXRcIjogNX0sXHJcbiAgICAgIHtcImxhYmlyaW50XCI6IDV9LFxyXG4gICAgICB7XCJsZXRcIjogNX0sXHJcbiAgICAgIHtcImxhYmlyaW50XCI6IDV9LFxyXG4gICAgICB7XCJlbmRcIjogMX0sXHJcbiAgICAgIHtcImlzbGFuZFwiOiAxfVxyXG4gICAgXSxcclxuICAgIFwiaGlzdG9yeVwiOiB7XHJcbiAgICAgIFwicnVcIjogXCLQmCDRgtC+0LPQtNCwINC+0L0g0L/QvtC90LXRgSDRgdCy0LXRh9GDINGH0LXRgNC10Lcg0YfRg9C20LjQtSDQt9C10LzQu9C4INC+0YHQstC+0LHQvtC20LTQsNGPINC70LXRgtGD0YfQuNGFINC30LzQtdC5INC4INGB0LLQvtC5INC90LDRgNC+0LQuLi5cIlxyXG4gICAgfVxyXG4gIH1cclxuXVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlKHBhcmFtcyl7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gZmxvYXQgc3RhcnRHcmFkaWVudDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIGZsb2F0IGVuZEdyYWRpZW50OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInZvaWQgbWFpbigpIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgaWYodlRleHR1cmVDb29yZC55ID4gc3RhcnRHcmFkaWVudCkgZ2xfRnJhZ0NvbG9yID0gY29sb3I7IFxcblwiICtcclwiIFxcblwiICtcblwiICBlbHNlIGlmKHZUZXh0dXJlQ29vcmQueSA8IGVuZEdyYWRpZW50KSBnbF9GcmFnQ29sb3IgPSBjb2xvciowLjA7IFxcblwiICtcclwiIFxcblwiICtcblwiICBlbHNlIGdsX0ZyYWdDb2xvciA9IGNvbG9yKih2VGV4dHVyZUNvb3JkLnktZW5kR3JhZGllbnQpLyhzdGFydEdyYWRpZW50LWVuZEdyYWRpZW50KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ9IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiIFxuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9XG4gICAgICBmb3IodmFyIGtleSBpbiBwYXJhbXMpIHtcbiAgICAgICAgdmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFwie3tcIitrZXkrXCJ9fVwiLFwiZ1wiKVxuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UobWF0Y2hlciwgcGFyYW1zW2tleV0pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGVtcGxhdGVcbiAgICB9O1xuIiwiY29uc3QgZnJhZyA9IHJlcXVpcmUoJy4vYWxwaGEuZnJhZycpO1xyXG5jb25zdCB2ZXJ0ID0gcmVxdWlyZSgnLi4vYmFzaWMudmVydCcpO1xyXG5cclxuY2xhc3MgQWxwaGFHcmFkaWVudEZpbHRlciBleHRlbmRzIFBJWEkuRmlsdGVyIHtcclxuICBjb25zdHJ1Y3RvcihzdGFydEdyYWRpZW50LCBlbmRHcmFkaWVudCkge1xyXG4gICAgc3VwZXIodmVydCgpLCBmcmFnKCkpO1xyXG5cclxuICAgIHRoaXMuc3RhcnRHcmFkaWVudCA9IHN0YXJ0R3JhZGllbnQgfHwgLjU7XHJcbiAgICB0aGlzLmVuZEdyYWRpZW50ID0gZW5kR3JhZGllbnQgfHwgLjI7XHJcbiAgfVxyXG4gIHNldCBzdGFydEdyYWRpZW50KHYpIHtcclxuICAgIHRoaXMudW5pZm9ybXMuc3RhcnRHcmFkaWVudCA9IHY7XHJcbiAgfVxyXG4gIGdldCBzdGFydEdyYWRpZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMudW5pZm9ybXMuc3RhcnRHcmFkaWVudDtcclxuICB9XHJcbiAgc2V0IGVuZEdyYWRpZW50KHYpIHtcclxuICAgIHRoaXMudW5pZm9ybXMuZW5kR3JhZGllbnQgPSB2O1xyXG4gIH1cclxuICBnZXQgZW5kR3JhZGllbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy5lbmRHcmFkaWVudDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWxwaGFHcmFkaWVudEZpbHRlcjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZShwYXJhbXMpe1xuICAgICAgdmFyIHRlbXBsYXRlID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIHNhbXBsZXIyRCBub2lzZVRleHR1cmU7IFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSBmbG9hdCBpVGltZTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvL1NFVFRJTkdTLy8gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJjb25zdCBmbG9hdCB0aW1lU2NhbGUgPSAxMC4wOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cImNvbnN0IGZsb2F0IGNsb3VkU2NhbGUgPSAxLjU7IFxcblwiICtcclwiIFxcblwiICtcblwiY29uc3QgZmxvYXQgc2t5Q292ZXIgPSAwLjY7IC8vb3ZlcndyaXR0ZW4gYnkgbW91c2UgeCBkcmFnIFxcblwiICtcclwiIFxcblwiICtcblwiY29uc3QgZmxvYXQgc29mdG5lc3MgPSAwLjI7IFxcblwiICtcclwiIFxcblwiICtcblwiY29uc3QgZmxvYXQgYnJpZ2h0bmVzcyA9IDEuMDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJjb25zdCBpbnQgbm9pc2VPY3RhdmVzID0gODsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJjb25zdCBmbG9hdCBjdXJsU3RyYWluID0gMy4wOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vU0VUVElOR1MvLyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cImZsb2F0IHNhdHVyYXRlKGZsb2F0IG51bSkgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICByZXR1cm4gY2xhbXAobnVtLCAwLjAsIDEuMCk7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cImZsb2F0IG5vaXNlKHZlYzIgdXYpIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgcmV0dXJuIHRleHR1cmUyRChub2lzZVRleHR1cmUsIHV2KS5yOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2ZWMyIHJvdGF0ZSh2ZWMyIHV2KSB7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIHV2ID0gdXYgKyBub2lzZSh1diowLjIpKjAuMDA1OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBmbG9hdCByb3QgPSBjdXJsU3RyYWluOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBmbG9hdCBzaW5Sb3Q9c2luKHJvdCk7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIGZsb2F0IGNvc1JvdD1jb3Mocm90KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgbWF0MiByb3RNYXQgPSBtYXQyKGNvc1JvdCwtc2luUm90LHNpblJvdCxjb3NSb3QpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICByZXR1cm4gdXYgKiByb3RNYXQ7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cImZsb2F0IGZibSAodmVjMiB1dikgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBmbG9hdCByb3QgPSAxLjU3OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBmbG9hdCBzaW5Sb3Q9c2luKHJvdCk7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIGZsb2F0IGNvc1JvdD1jb3Mocm90KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgZmxvYXQgZiA9IDAuMDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgZmxvYXQgdG90YWwgPSAwLjA7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIGZsb2F0IG11bCA9IDAuNTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgbWF0MiByb3RNYXQgPSBtYXQyKGNvc1JvdCwtc2luUm90LHNpblJvdCxjb3NSb3QpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBmb3IoaW50IGkgPSAwOyBpIDwgbm9pc2VPY3RhdmVzOyBpKyspIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgICAgIGYgKz0gbm9pc2UodXYraVRpbWUqMC4wMDAxNSp0aW1lU2NhbGUqKDEuMC1tdWwpKSptdWw7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgICAgICB0b3RhbCArPSBtdWw7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgICAgICB1diAqPSAzLjA7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgICAgICB1dj1yb3RhdGUodXYpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICAgICAgbXVsICo9IDAuNTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgfSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICByZXR1cm4gZi90b3RhbDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ9IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidm9pZCBtYWluKCkgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMiB1diA9IHZUZXh0dXJlQ29vcmQueHkvKDQwMDAwLjAqY2xvdWRTY2FsZSk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICBmbG9hdCBjb3ZlciA9IDAuNTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIGZsb2F0IGJyaWdodCA9IGJyaWdodG5lc3MqKDEuOC1jb3Zlcik7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICBmbG9hdCBjb2xvcjEgPSBmYm0odlRleHR1cmVDb29yZC54eS0wLjUraVRpbWUqMC4wMDAwNCp0aW1lU2NhbGUpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgZmxvYXQgY29sb3IyID0gZmJtKHZUZXh0dXJlQ29vcmQueHktMTAuNStpVGltZSowLjAwMDAyKnRpbWVTY2FsZSk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICBmbG9hdCBjbG91ZHMxID0gc21vb3Roc3RlcCgxLjAtY292ZXIsbWluKCgxLjAtY292ZXIpK3NvZnRuZXNzKjIuMCwxLjApLGNvbG9yMSk7IFxcblwiICtcclwiIFxcblwiICtcblwiICBmbG9hdCBjbG91ZHMyID0gc21vb3Roc3RlcCgxLjAtY292ZXIsbWluKCgxLjAtY292ZXIpK3NvZnRuZXNzLDEuMCksY29sb3IyKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIGZsb2F0IGNsb3Vkc0Zvcm1Db21iID0gc2F0dXJhdGUoY2xvdWRzMStjbG91ZHMyKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgc2t5Q29sID0gdmVjNCgwLjYsMC44LDEuMCwxLjApOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgZmxvYXQgY2xvdWRDb2wgPSBzYXR1cmF0ZShzYXR1cmF0ZSgxLjAtcG93KGNvbG9yMSwxLjApKjAuMikqYnJpZ2h0KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgY2xvdWRzMUNvbG9yID0gdmVjNChjbG91ZENvbCxjbG91ZENvbCxjbG91ZENvbCwxLjApOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCBjbG91ZHMyQ29sb3IgPSBtaXgoY2xvdWRzMUNvbG9yLHNreUNvbCwwLjI1KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgY2xvdWRDb2xDb21iID0gbWl4KGNsb3VkczFDb2xvcixjbG91ZHMyQ29sb3Isc2F0dXJhdGUoY2xvdWRzMi1jbG91ZHMxKSk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiXHRnbF9GcmFnQ29sb3IgPSBtaXgodGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKSwgY2xvdWRDb2xDb21iLCBjbG91ZHNGb3JtQ29tYik7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiBcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuICAgICAgZm9yKHZhciBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcInt7XCIra2V5K1wifX1cIixcImdcIilcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKG1hdGNoZXIsIHBhcmFtc1trZXldKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgfTtcbiIsImNvbnN0IGZyYWcgPSByZXF1aXJlKCcuL2Nsb3Vkcy5mcmFnJyk7XHJcbmNvbnN0IHZlcnQgPSByZXF1aXJlKCcuLi9iYXNpYy52ZXJ0Jyk7XHJcblxyXG5jbGFzcyBDbG91ZHNGaWx0ZXIgZXh0ZW5kcyBQSVhJLkZpbHRlciB7XHJcbiAgY29uc3RydWN0b3IodGV4dHVyZSkge1xyXG4gICAgc3VwZXIodmVydCgpLCBmcmFnKCkpO1xyXG5cclxuICAgIHRoaXMudGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgdGhpcy5ub2lzZVRleHR1cmUgPSB0ZXh0dXJlO1xyXG4gIH1cclxuICBzZXQgdGltZSh2KSB7XHJcbiAgICB0aGlzLnVuaWZvcm1zLmlUaW1lID0gdjtcclxuICB9XHJcbiAgZ2V0IHRpbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy5pVGltZTtcclxuICB9XHJcbiAgc2V0IG5vaXNlVGV4dHVyZSh2KSB7XHJcbiAgICB0aGlzLnVuaWZvcm1zLm5vaXNlVGV4dHVyZSA9IHY7XHJcbiAgfVxyXG4gIGdldCBub2lzZVRleHR1cmUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy5ub2lzZVRleHR1cmU7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENsb3Vkc0ZpbHRlcjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZShwYXJhbXMpe1xuICAgICAgdmFyIHRlbXBsYXRlID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIGZsb2F0IHg7IFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSBmbG9hdCB5OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gZmxvYXQgcjsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2b2lkIG1haW4oKSB7IFxcblwiICtcclwiIFxcblwiICtcblwiICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMyBncmF5ID0gdmVjMygwLjMsIDAuNTksIDAuMTEpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgZmxvYXQgY29sID0gZG90KGdsX0ZyYWdDb2xvci54eXosIGdyYXkpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgZmxvYXQgZGlzdCA9IGRpc3RhbmNlKHZUZXh0dXJlQ29vcmQueHksIHZlYzIoeCwgeSkpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgZ2xfRnJhZ0NvbG9yLnh5eiA9IG1peChnbF9GcmFnQ29sb3IueHl6LCB2ZWMzKGNvbCksIG1pbihkaXN0L3IsIDEuMCktLjIpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgXG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge31cbiAgICAgIGZvcih2YXIga2V5IGluIHBhcmFtcykge1xuICAgICAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJ7e1wiK2tleStcIn19XCIsXCJnXCIpXG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShtYXRjaGVyLCBwYXJhbXNba2V5XSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgIH07XG4iLCJjb25zdCBmcmFnID0gcmVxdWlyZSgnLi9ncmF5c2NhbGUuZnJhZycpO1xyXG5jb25zdCB2ZXJ0ID0gcmVxdWlyZSgnLi4vYmFzaWMudmVydCcpO1xyXG5cclxuY2xhc3MgR3JheXNjYWxlRmlsdGVyIGV4dGVuZHMgUElYSS5GaWx0ZXIge1xyXG4gIGNvbnN0cnVjdG9yKHgsIHksIHIpIHtcclxuICAgIHN1cGVyKHZlcnQoKSwgZnJhZygpKTtcclxuXHJcbiAgICB0aGlzLnggPSB4IHx8IC41O1xyXG4gICAgdGhpcy55ID0geSB8fCAuNTtcclxuICAgIHRoaXMuciA9IHIgfHwgMC44O1xyXG4gIH1cclxuICBzZXQgeCh2KSB7XHJcbiAgICB0aGlzLnVuaWZvcm1zLnggPSB2O1xyXG4gIH1cclxuICBnZXQgeCgpIHtcclxuICAgIHJldHVybiB0aGlzLnVuaWZvcm1zLng7XHJcbiAgfVxyXG4gIHNldCB5KHYpIHtcclxuICAgIHRoaXMudW5pZm9ybXMueSA9IHY7XHJcbiAgfVxyXG4gIGdldCB5KCkge1xyXG4gICAgcmV0dXJuIHRoaXMudW5pZm9ybXMueTtcclxuICB9XHJcbiAgc2V0IHIodikge1xyXG4gICAgdGhpcy51bmlmb3Jtcy5yID0gdjtcclxuICB9XHJcbiAgZ2V0IHIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy5yO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHcmF5c2NhbGVGaWx0ZXI7XHJcbiIsImNvbnN0IGZyYWcgPSByZXF1aXJlKCcuL25vaXNlQmx1ci5mcmFnJyk7XHJcbmNvbnN0IHZlcnQgPSByZXF1aXJlKCcuLi9iYXNpYy52ZXJ0Jyk7XHJcblxyXG5jbGFzcyBOb2lzZUJsdXJGaWx0ZXIgZXh0ZW5kcyBQSVhJLkZpbHRlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcih2ZXJ0KCksIGZyYWcoKSk7XHJcblxyXG4gICAgdGhpcy5ibHVyUmFkaXVzID0gMC4wMDA1O1xyXG4gIH1cclxuICBzZXQgYmx1clJhZGl1cyh2KSB7XHJcbiAgICB0aGlzLnVuaWZvcm1zLmJsdXJSYWRpdXMgPSB2O1xyXG4gIH1cclxuICBnZXQgYmx1clJhZGl1cygpIHtcclxuICAgIHJldHVybiB0aGlzLnVuaWZvcm1zLmJsdXJSYWRpdXM7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5vaXNlQmx1ckZpbHRlcjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZShwYXJhbXMpe1xuICAgICAgdmFyIHRlbXBsYXRlID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIGZsb2F0IGJsdXJSYWRpdXM7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidmVjMiByYW5kb20odmVjMiBwKSB7IFxcblwiICtcclwiIFxcblwiICtcblwiXHRwID0gZnJhY3QocCAqIHZlYzIoNDQzLjg5NywgNDQxLjQyMykpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBwICs9IGRvdChwLCBwLnl4KzE5LjkxKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgcmV0dXJuIGZyYWN0KChwLnh4K3AueXgpKnAueHkpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2b2lkIG1haW4oKSB7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWMyIHIgPSByYW5kb20odlRleHR1cmVDb29yZCk7IFxcblwiICtcclwiIFxcblwiICtcblwiICByLnggKj0gNi4yODMwNTMwODsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzIgY3IgPSB2ZWMyKHNpbihyLngpLGNvcyhyLngpKSpzcXJ0KHIueSk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiXHRnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQrY3IqYmx1clJhZGl1cyk7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiBcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuICAgICAgZm9yKHZhciBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcInt7XCIra2V5K1wifX1cIixcImdcIilcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKG1hdGNoZXIsIHBhcmFtc1trZXldKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2UocGFyYW1zKXtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IFwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cImF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7IFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7IFxcblwiICtcclwiIFxcblwiICtcblwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidm9pZCBtYWluKHZvaWQpIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgXG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge31cbiAgICAgIGZvcih2YXIga2V5IGluIHBhcmFtcykge1xuICAgICAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJ7e1wiK2tleStcIn19XCIsXCJnXCIpXG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShtYXRjaGVyLCBwYXJhbXNba2V5XSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgIH07XG4iLCIvLyBvYmplY3RzXHJcbmNvbnN0IFNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuL21hbmFnZXJzL1NjZW5lc01hbmFnZXInKTtcclxuY29uc3QgU3BoZXJlID0gcmVxdWlyZSgnLi9zdWJqZWN0cy9TcGhlcmUnKTtcclxuXHJcbi8vIGZpbHRlcnNcclxuY29uc3QgR3JheXNjYWxlRmlsdGVyID0gcmVxdWlyZSgnLi9maWx0ZXJzL0dyYXlzY2FsZUZpbHRlcicpO1xyXG5jb25zdCBOb2lzZUJsdXJGaWx0ZXIgPSByZXF1aXJlKCcuL2ZpbHRlcnMvTm9pc2VCbHVyRmlsdGVyJyk7XHJcbmNvbnN0IENsb3Vkc0ZpbHRlciA9IHJlcXVpcmUoJy4vZmlsdGVycy9DbG91ZHNGaWx0ZXInKTtcclxuXHJcblxyXG5jbGFzcyBHYW1lIGV4dGVuZHMgUElYSS5BcHBsaWNhdGlvbiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcih3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0LCB7YmFja2dyb3VuZENvbG9yOiAweGZjZmNmY30pXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudmlldyk7XHJcblxyXG4gICAgdGhpcy53ID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICB0aGlzLmggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcclxuICAgIHRoaXMuc3RhZ2UuYWRkQ2hpbGQodGhpcy5jb250YWluZXIpO1xyXG5cclxuICAgIHRoaXMuYmcgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZSgnYmcnKSk7XHJcbiAgICB0aGlzLmJnLndpZHRoID0gdGhpcy53O1xyXG4gICAgdGhpcy5iZy5oZWlnaHQgPSB0aGlzLmg7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLmJnKTtcclxuXHJcbiAgICB0aGlzLnNjZW5lcyA9IG5ldyBTY2VuZXNNYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5jb250YWluZXIuYWRkQ2hpbGQodGhpcy5zY2VuZXMpO1xyXG5cclxuICAgIHRoaXMuZ3JheXNjYWxlID0gbmV3IEdyYXlzY2FsZUZpbHRlcigpO1xyXG4gICAgdGhpcy5ub2lzZUJsdXIgPSBuZXcgTm9pc2VCbHVyRmlsdGVyKCk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5maWx0ZXJzID0gW3RoaXMuZ3JheXNjYWxlLCB0aGlzLm5vaXNlQmx1cl07XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG4gICAgdGhpcy5jb250YWluZXIuY3Vyc29yID0gJ25vbmUnO1xyXG4gICAgdGhpcy5tb3VzZSA9IG5ldyBTcGhlcmUoKTtcclxuICAgIHRoaXMuY29udGFpbmVyLmFkZENoaWxkKHRoaXMubW91c2UpO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLm9uKCdwb2ludGVybW92ZScsIChlKSA9PiB7XHJcbiAgICAgIHRoaXMuZ3JheXNjYWxlLnggPSBlLmRhdGEuZ2xvYmFsLngvdGhpcy53O1xyXG4gICAgICB0aGlzLmdyYXlzY2FsZS55ID0gZS5kYXRhLmdsb2JhbC55L3RoaXMuaDtcclxuICAgICAgdGhpcy5tb3VzZS54ID0gZS5kYXRhLmdsb2JhbC54O1xyXG4gICAgICB0aGlzLm1vdXNlLnkgPSBlLmRhdGEuZ2xvYmFsLnk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLl9pbml0VGlja2VyKCk7XHJcbiAgfVxyXG4gIF9pbml0VGlja2VyKCkge1xyXG4gICAgdGhpcy50aWNrZXIuYWRkKChkdCkgPT4ge1xyXG4gICAgICBQSVhJLnR3ZWVuTWFuYWdlci51cGRhdGUoKTtcclxuICAgICAgdGhpcy5zY2VuZXMudXBkYXRlKGR0KTtcclxuICAgICAgdGhpcy5tb3VzZS51cGRhdGUoZHQpO1xyXG5cclxuICAgICAgdGhpcy5jbG91ZHMudGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcbiIsInJlcXVpcmUoJ3BpeGktc291bmQnKTtcclxucmVxdWlyZSgncGl4aS10d2VlbicpO1xyXG5yZXF1aXJlKCdwaXhpLXByb2plY3Rpb24nKTtcclxucmVxdWlyZSgncGl4aS1wYXJ0aWNsZXMnKTtcclxuXHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKTtcclxuXHJcbldlYkZvbnQubG9hZCh7XHJcbiAgZ29vZ2xlOiB7XHJcbiAgICBmYW1pbGllczogWydBbWF0aWMgU0MnXVxyXG4gIH0sXHJcbiAgYWN0aXZlKCkge1xyXG4gICAgUElYSS5sb2FkZXJcclxuICAgICAgLmFkZCgnYmxvY2tzJywgJ2Fzc2V0cy9ibG9ja3MuanNvbicpXHJcbiAgICAgIC5hZGQoJ3BsYXllcicsICdhc3NldHMvcGxheWVyLnBuZycpXHJcbiAgICAgIC5hZGQoJ2JnJywgJ2Fzc2V0cy9iZy5wbmcnKVxyXG4gICAgICAuYWRkKCdkaXNwbGFjZW1lbnQnLCAnYXNzZXRzL2Rpc3BsYWNlbWVudC5wbmcnKVxyXG4gICAgICAuYWRkKCd0aGxlbicsICdhc3NldHMvdGhsZW4ucG5nJylcclxuICAgICAgLmFkZCgnbm9pc2UnLCAnYXNzZXRzL25vaXNlX2dyYXlzY2FsZS5wbmcnKVxyXG4gICAgICAuYWRkKCdsaWdodG1hcCcsICdhc3NldHMvbGlnaHRtYXAucG5nJylcclxuICAgICAgLmFkZCgnbWFzaycsICdhc3NldHMvbWFzay5wbmcnKVxyXG4gICAgICAuYWRkKCdwYXJ0aWNsZScsICdhc3NldHMvcGFydGljbGUucG5nJylcclxuICAgICAgLmFkZCgnbXVzaWMnLCAnYXNzZXRzL211c2ljLm1wMycpXHJcbiAgICAgIC5sb2FkKChsb2FkZXIsIHJlc291cmNlcykgPT4ge1xyXG4gICAgICAgIC8vIFBJWEkuc291bmQucGxheSgnbXVzaWMnKTtcclxuICAgICAgICBsZXQgZ2FtZSA9IG5ldyBHYW1lKCk7XHJcbiAgICAgICAgZ2FtZS5zY2VuZXMuZW5hYmxlU2NlbmUoJ3BsYXlncm91bmQnKTtcclxuXHJcbiAgICAgICAgd2luZG93LmdhbWUgPSBnYW1lO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn0pO1xyXG4iLCJjbGFzcyBIaXN0b3J5TWFuYWdlciBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLmdhbWUgPSBzY2VuZS5nYW1lO1xyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG5cclxuICAgIHRoaXMuYWxwaGEgPSAwO1xyXG4gICAgdGhpcy50ZXh0ID0gbmV3IFBJWEkuVGV4dCgnVGV4dCcsIHtcclxuICAgICAgZm9udDogJ25vcm1hbCA0MHB4IEFtYXRpYyBTQycsXHJcbiAgICAgIHdvcmRXcmFwOiB0cnVlLFxyXG4gICAgICB3b3JkV3JhcFdpZHRoOiB0aGlzLmdhbWUudy8yLFxyXG4gICAgICBmaWxsOiAnI2ZmZicsXHJcbiAgICAgIHBhZGRpbmc6IDEwLFxyXG4gICAgICBhbGlnbjogJ2NlbnRlcidcclxuICAgIH0pO1xyXG4gICAgdGhpcy50ZXh0LmFuY2hvci5zZXQoLjUpO1xyXG4gICAgdGhpcy50ZXh0LnggPSB0aGlzLmdhbWUudy8yO1xyXG4gICAgdGhpcy50ZXh0LnkgPSAxNTA7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMudGV4dCk7XHJcbiAgfVxyXG4gIHNob3dUZXh0KHR4dCwgdGltZSkge1xyXG4gICAgdGhpcy50ZXh0LmZvbnRGYW1pbHkgPSAnQW1hdGljIFNDJztcclxuICAgIHRoaXMudGV4dC5zZXRUZXh0KHR4dCk7XHJcblxyXG4gICAgbGV0IHNob3cgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIHNob3cuZnJvbSh7YWxwaGE6IDB9KS50byh7YWxwaGE6IDF9KTtcclxuICAgIHNob3cudGltZSA9IDEwMDA7XHJcbiAgICBzaG93LnN0YXJ0KCk7XHJcbiAgICB0aGlzLmVtaXQoJ3Nob3dlbicpO1xyXG5cclxuICAgIHNldFRpbWVvdXQodGhpcy5oaWRlVGV4dC5iaW5kKHRoaXMpLCB0aW1lKTtcclxuICB9XHJcbiAgaGlkZVRleHQoKSB7XHJcbiAgICBsZXQgaGlkZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgaGlkZS5mcm9tKHthbHBoYTogMX0pLnRvKHthbHBoYTogMH0pO1xyXG4gICAgaGlkZS50aW1lID0gMTAwMDtcclxuICAgIGhpZGUuc3RhcnQoKTtcclxuICAgIHRoaXMuZW1pdCgnaGlkZGVuJyk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhpc3RvcnlNYW5hZ2VyO1xyXG4iLCIvKlxyXG4gINCc0LXQvdC10LTQttC10YAg0YPRgNC+0LLQvdC10LksINGA0LDQsdC+0YLQsNC10YIg0L3QsNC/0YDRj9C80YPRjiDRgSBNYXBNYW5hZ2VyXHJcbiAg0LjRgdC/0L7Qu9GM0LfRg9GPINC00LDQvdC90YvQtSBsZXZlbHMuanNvbiDQuCAgZnJhZ21lbnRzLmpzb25cclxuXHJcbiAg0KHQvtCx0YvRgtC40Y86XHJcbiAgICBhZGRlZEZyYWdtZW50c0RhdGEgPT4gbmV3IGZyYWdtZW50c0RhdGFcclxuICAgIGFkZGVkTGV2ZWxzID0+IG5ldyBsZXZlbHNcclxuICAgIGFkZGVkTGV2ZWwgPT4gbmV3IGx2bFxyXG5cclxuICAgIHN3aXRjaGVkTGV2ZWwgPT4gY3VyIGx2bFxyXG4gICAgd2VudE5leHRMZXZlbCA9PiBjdXIgbHZsXHJcbiAgICB3ZW50QmFja0xldmVsID0+IGN1ciBsdmxcclxuICAgIHN3aXRjaGVkRnJhZ21lbnQgPT4gY3VyIGZyYWdcclxuICAgIHdlbnROZXh0RnJhZ21lbnQgPT4gY3VyIGZyYWdcclxuICAgIHdlbnRCYWNrRnJhZ21lbnQgPT4gY3VyIGZyYWdcclxuXHJcbiAgICBzdGFydGVkTGV2ZWwgPT4gbmV3IGx2bFxyXG4gICAgZW5kZWRMZXZlbCA9PiBwcmV2IGx2bFxyXG4qL1xyXG5cclxuXHJcbmNsYXNzIExldmVsTWFuYWdlciBleHRlbmRzIFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSwgbWFwKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICAgIHRoaXMubWFwID0gbWFwO1xyXG5cclxuICAgIHRoaXMubGV2ZWxzID0gW107XHJcbiAgICB0aGlzLmZyYWdtZW50c0RhdGEgPSB7fTtcclxuICAgIHRoaXMuYWRkRnJhZ21lbnRzRGF0YShyZXF1aXJlKCcuLi9jb250ZW50L2ZyYWdtZW50cycpKTtcclxuICAgIHRoaXMuYWRkTGV2ZWxzKHJlcXVpcmUoJy4uL2NvbnRlbnQvbGV2ZWxzJykpXHJcblxyXG4gICAgdGhpcy5jdXJMZXZlbEluZGV4ID0gMDtcclxuICAgIHRoaXMuY3VyRnJhZ21lbnRJbmRleCA9IDA7XHJcbiAgfVxyXG4gIC8vIGdldHRlcnNcclxuICBnZXRDdXJyZW50TGV2ZWwoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5sZXZlbHNbdGhpcy5jdXJMZXZlbEluZGV4XTtcclxuICB9XHJcbiAgZ2V0Q3VycmVudEZyYWdtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVudExldmVsKCkgJiYgdGhpcy5nZXRDdXJyZW50TGV2ZWwoKS5tYXBzW3RoaXMuY3VyRnJhZ21lbnRJbmRleF07XHJcbiAgfVxyXG5cclxuICAvLyBhZGQgZnJhZ21lbnRzIHRvIGRiIGZyYWdtZW50c1xyXG4gIGFkZEZyYWdtZW50c0RhdGEoZGF0YT17fSkge1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmZyYWdtZW50c0RhdGEsIGRhdGEpO1xyXG4gICAgdGhpcy5lbWl0KCdhZGRlZEZyYWdtZW50c0RhdGEnLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIC8vIGFkZCBsZXZlbHMgdG8gZGIgbGV2ZWxzXHJcbiAgYWRkTGV2ZWxzKGxldmVscz1bXSkge1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGxldmVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLmFkZExldmVsKGxldmVsc1tpXSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkTGV2ZWxzJywgbGV2ZWxzKTtcclxuICB9XHJcbiAgYWRkTGV2ZWwobHZsPXt9KSB7XHJcbiAgICB0aGlzLmxldmVscy5wdXNoKGx2bCk7XHJcblxyXG4gICAgLy8gZ2VuZXJhdGVkIG1hcHMgdG8gbHZsIG9iamVjdFxyXG4gICAgbHZsLm1hcHMgPSBbXTtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsdmwuZnJhZ21lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGZvcihsZXQga2V5IGluIGx2bC5mcmFnbWVudHNbaV0pIHtcclxuICAgICAgICBmb3IobGV0IGMgPSAwOyBjIDwgbHZsLmZyYWdtZW50c1tpXVtrZXldOyBjKyspIHtcclxuICAgICAgICAgIGx2bC5tYXBzLnB1c2godGhpcy5mcmFnbWVudHNEYXRhW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KCdhZGRlZExldmVsJywgbHZsKTtcclxuICB9XHJcblxyXG4gIC8vIE1ldGhvZHMgZm9yIGxldmVscyBjb250cm9sXHJcbiAgc3dpdGNoTGV2ZWwobHZsKSB7XHJcbiAgICBpZihsdmwgPj0gdGhpcy5sZXZlbHMubGVuZ3RoIHx8IGx2bCA8IDApIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmN1ckxldmVsSW5kZXggPSBsdmw7XHJcbiAgICB0aGlzLnN3aXRjaEZyYWdtZW50KDApO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnc3RhcnRlZExldmVsJyk7XHJcbiAgICB0aGlzLmVtaXQoJ3N3aXRjaGVkTGV2ZWwnKTtcclxuICB9XHJcbiAgbmV4dExldmVsKCkge1xyXG4gICAgdGhpcy5zd2l0Y2hMZXZlbCh0aGlzLmN1ckxldmVsSW5kZXgrMSk7XHJcbiAgICB0aGlzLmVtaXQoJ3dlbnROZXh0TGV2ZWwnKTtcclxuICB9XHJcbiAgYmFja0xldmVsKCkge1xyXG4gICAgdGhpcy5zd2l0Y2hMZXZlbCh0aGlzLmN1ckxldmVsSW5kZXgtMSk7XHJcbiAgICB0aGlzLmVtaXQoJ3dlbnRCYWNrTGV2ZWwnKTtcclxuICB9XHJcblxyXG4gIC8vIE1ldGhvZHMgZm9yIGZyYWdtZW50cyBjb250cm9sXHJcbiAgc3dpdGNoRnJhZ21lbnQoZnJhZykge1xyXG4gICAgaWYoZnJhZyA8IDApIHJldHVybjtcclxuICAgIHRoaXMuY3VyRnJhZ21lbnRJbmRleCA9IGZyYWc7XHJcblxyXG4gICAgaWYodGhpcy5nZXRDdXJyZW50RnJhZ21lbnQoKSkgdGhpcy5tYXAuYWRkTWFwKHRoaXMuZ2V0Q3VycmVudEZyYWdtZW50KCkpO1xyXG4gICAgZWxzZSB0aGlzLmVtaXQoJ2VuZGVkTGV2ZWwnKTtcclxuICAgIHRoaXMuZW1pdCgnc3dpdGNoZWRGcmFnbWVudCcpO1xyXG4gIH1cclxuICBuZXh0RnJhZ21lbnQoKSB7XHJcbiAgICB0aGlzLnN3aXRjaEZyYWdtZW50KHRoaXMuY3VyRnJhZ21lbnRJbmRleCsxKTtcclxuICAgIHRoaXMuZW1pdCgnd2VudE5leHRGcmFnbWVudCcpO1xyXG4gIH1cclxuICBiYWNrRnJhZ21lbnQoKSB7XHJcbiAgICB0aGlzLnN3aXRjaEZyYWdtZW50KHRoaXMuY3VyRnJhZ21lbnRJbmRleC0xKTtcclxuICAgIHRoaXMuZW1pdCgnd2VudEJhY2tGcmFnbWVudCcpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMZXZlbE1hbmFnZXI7XHJcbiIsIi8qXHJcbiAg0JTQstC40LbQvtC6INGC0LDQudC70L7QstC+0Lkg0LrQsNGA0YLRi1xyXG4gINCh0L7QsdGL0YLQuNGPOlxyXG4gICAgYWRkZWRNYXAgPT4gbWFwXHJcbiAgICBhZGRlZEZyYWdtZW50ID0+IGZyYWdtZW50c1xyXG4gICAgYWRkZWRCbG9jayA9PiBibG9ja1xyXG4gICAgc2Nyb2xsZWREb3duID0+IGR0RG93blxyXG4gICAgc2Nyb2xsZWRUb3AgPT4gZHRUb3BcclxuXHJcbiAgICByZXNpemVkXHJcbiAgICBlbmRlZE1hcFxyXG4gICAgY2xlYXJlZE91dFJhbmdlQmxvY2tzXHJcbiovXHJcblxyXG5cclxuY29uc3QgQmxvY2sgPSByZXF1aXJlKCcuLi9zdWJqZWN0cy9CbG9jaycpO1xyXG5jb25zdCBEYXRhRnJhZ21lbnRDb252ZXJ0ZXIgPSByZXF1aXJlKCcuLi91dGlscy9EYXRhRnJhZ21lbnRDb252ZXJ0ZXInKTtcclxuXHJcbmNsYXNzIE1hcE1hbmFnZXIgZXh0ZW5kcyBQSVhJLnByb2plY3Rpb24uQ29udGFpbmVyMmQge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lLCBwYXJhbXM9e30pIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICBzY2VuZS5hZGRDaGlsZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICB0aGlzLmdhbWUgPSBzY2VuZS5nYW1lO1xyXG5cclxuICAgIHRoaXMuUEFERElOR19CT1RUT00gPSAyODA7XHJcblxyXG4gICAgdGhpcy5tYXhBeGlzWCA9IHBhcmFtcy5tYXhYIHx8IDU7XHJcbiAgICB0aGlzLmJsb2NrU2l6ZSA9IHBhcmFtcy50aWxlU2l6ZSB8fCAxMDA7XHJcbiAgICB0aGlzLnNldEJsb2Nrc0RhdGEocmVxdWlyZSgnLi4vY29udGVudC9ibG9ja3MnKSk7XHJcbiAgICB0aGlzLnJlc2l6ZSgpO1xyXG5cclxuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5zcGVlZCA9IDUwMDtcclxuICAgIHRoaXMubGFzdEluZGV4ID0gMDtcclxuICB9XHJcbiAgcmVzaXplKCkge1xyXG4gICAgdGhpcy54ID0gdGhpcy5nYW1lLncvMi10aGlzLm1heEF4aXNYKnRoaXMuYmxvY2tTaXplLzI7XHJcbiAgICB0aGlzLnkgPSB0aGlzLmdhbWUuaC10aGlzLlBBRERJTkdfQk9UVE9NO1xyXG4gICAgdGhpcy5lbWl0KCdyZXNpemVkJyk7XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgcGFyYW1zXHJcbiAgc2V0QmxvY2tzRGF0YShkYXRhKSB7XHJcbiAgICB0aGlzLkJMT0NLUyA9IGRhdGEgfHwge307XHJcbiAgfVxyXG4gIHNldE1heEF4aXNYKG1heCkge1xyXG4gICAgdGhpcy5tYXhBeGlzWCA9IG1heCB8fCA2O1xyXG4gICAgdGhpcy5yZXNpemUoKTtcclxuICB9XHJcbiAgc2V0QmxvY2tTaXplKHNpemUpIHtcclxuICAgIHRoaXMuYmxvY2tTaXplID0gc2l6ZSB8fCAxMDA7XHJcbiAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gIH1cclxuICBzZXRTcGVlZChzcGVlZCkge1xyXG4gICAgdGhpcy5zcGVlZCA9IHNwZWVkIHx8IDUwMDtcclxuICB9XHJcblxyXG5cclxuICAvLyBNYXAgTWFuYWdlclxyXG4gIGFkZE1hcChtYXApIHtcclxuICAgIGZvcihsZXQgaSA9IG1hcC5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgdGhpcy5hZGRGcmFnbWVudChtYXBbaV0pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KCdhZGRlZE1hcCcsIG1hcCk7XHJcbiAgICB0aGlzLmNvbXB1dGluZ01hcEVuZCgpO1xyXG4gIH1cclxuICBhZGRGcmFnbWVudChmcmFnRGF0YSkge1xyXG4gICAgbGV0IGZyYWcgPSBuZXcgRGF0YUZyYWdtZW50Q29udmVydGVyKGZyYWdEYXRhKS5mcmFnbWVudDtcclxuICAgIC8vIGFkZCBibG9jayB0byBjZW50ZXIgWCBheGlzLCBmb3IgZXhhbXBsZTogcm91bmQoKDgtNCkvMikgPT4gKzIgcGFkZGluZyB0byBibG9jayBYIHBvc1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGZyYWcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5hZGRCbG9jayhmcmFnW2ldLCBNYXRoLnJvdW5kKCh0aGlzLm1heEF4aXNYLWZyYWcubGVuZ3RoKS8yKStpLCB0aGlzLmxhc3RJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sYXN0SW5kZXgrKztcclxuICAgIHRoaXMuZW1pdCgnYWRkZWRGcmFnbWVudCcsIGZyYWdEYXRhKTtcclxuICB9XHJcbiAgYWRkQmxvY2soaWQsIHgsIHkpIHtcclxuICAgIGlmKGlkID09PSAnXycpIHJldHVybjtcclxuXHJcbiAgICBsZXQgcG9zWCA9IHgqdGhpcy5ibG9ja1NpemU7XHJcbiAgICBsZXQgcG9zWSA9IC15KnRoaXMuYmxvY2tTaXplO1xyXG4gICAgbGV0IGJsb2NrID0gdGhpcy5hZGRDaGlsZChuZXcgQmxvY2sodGhpcywgcG9zWCwgcG9zWSwgdGhpcy5CTE9DS1NbaWRdKSk7XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkQmxvY2snLCBibG9jayk7XHJcbiAgfVxyXG5cclxuICAvLyBDb2xsaXNpb24gV2lkaCBCbG9ja1xyXG4gIGdldEJsb2NrRnJvbVBvcyhwb3MpIHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKHRoaXMuY2hpbGRyZW5baV0uY29udGFpbnNQb2ludChwb3MpKSByZXR1cm4gdGhpcy5jaGlsZHJlbltpXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIE1vdmluZyBNYXBcclxuICBzY3JvbGxEb3duKGJsb2Nrcykge1xyXG4gICAgaWYodGhpcy5pc1N0b3ApIHJldHVybjtcclxuXHJcbiAgICAvLyBTY3JvbGwgbWFwIGRvd24gb24gWCBibG9ja3NcclxuICAgIGxldCBtb3ZlID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBtb3ZlLmZyb20oe3k6IHRoaXMueX0pLnRvKHt5OiB0aGlzLnkrYmxvY2tzKnRoaXMuYmxvY2tTaXplfSk7XHJcbiAgICBtb3ZlLnRpbWUgPSB0aGlzLnNwZWVkKmJsb2NrcztcclxuICAgIG1vdmUub24oJ2VuZCcsICgpID0+IHtcclxuICAgICAgdGhpcy5lbWl0KCdzY3JvbGxlZERvd24nLCBibG9ja3MpO1xyXG4gICAgICB0aGlzLmNsZWFyT3V0UmFuZ2VCbG9ja3MoKTtcclxuICAgICAgdGhpcy5jb21wdXRpbmdNYXBFbmQoKTtcclxuICAgIH0pO1xyXG4gICAgbW92ZS5zdGFydCgpO1xyXG4gIH1cclxuICBzY3JvbGxUb3AoYmxvY2tzKSB7XHJcbiAgICBpZih0aGlzLmlzU3RvcCkgcmV0dXJuO1xyXG5cclxuICAgIC8vIFNjcm9sbCBtYXAgdG9wIG9uIFggYmxvY2tzXHJcbiAgICBsZXQgbW92ZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgbW92ZS5mcm9tKHt5OiB0aGlzLnl9KS50byh7eTogdGhpcy55LWJsb2Nrcyp0aGlzLmJsb2NrU2l6ZX0pO1xyXG4gICAgbW92ZS50aW1lID0gdGhpcy5zcGVlZCpibG9ja3M7XHJcbiAgICBtb3ZlLm9uKCdlbmQnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuZW1pdCgnc2Nyb2xsZWRUb3AnLCBibG9ja3MpO1xyXG4gICAgICB0aGlzLmNsZWFyT3V0UmFuZ2VCbG9ja3MoKTtcclxuICAgICAgdGhpcy5jb21wdXRpbmdNYXBFbmQoKTtcclxuICAgIH0pO1xyXG4gICAgbW92ZS5zdGFydCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29tcHV0aW5nIG1hcCBlbmQgKGFtdCBibG9ja3MgPCBtYXggYW10IGJsb2NrcylcclxuICBjb21wdXRpbmdNYXBFbmQoKSB7XHJcbiAgICBpZih0aGlzLmNoaWxkcmVuLmxlbmd0aCA8IHRoaXMubWF4QXhpc1gqKHRoaXMuZ2FtZS5oL3RoaXMuYmxvY2tTaXplKSoyKSB7XHJcbiAgICAgIHRoaXMuZW1pdCgnZW5kZWRNYXAnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGNsZWFyIG91dCByYW5nZSBtYXAgYmxvY2tzXHJcbiAgY2xlYXJPdXRSYW5nZUJsb2NrcygpIHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKHRoaXMuY2hpbGRyZW5baV0ud29ybGRUcmFuc2Zvcm0udHktdGhpcy5ibG9ja1NpemUvMiA+IHRoaXMuZ2FtZS5oKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLmNoaWxkcmVuW2ldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KCdjbGVhcmVkT3V0UmFuZ2VCbG9ja3MnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwTWFuYWdlcjtcclxuIiwiLypcclxuICDQmtC70LDRgdGBINC00LvRjyDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0LLQuNC00LjQvNC+0LPQviDQutC+0L3RgtC10LnQvdC10YDQsCAo0YDQsNCx0L7Rh9C40YUg0YHRhtC10L0pXHJcbiAg0KHQvtCx0YvRgtC40Y86XHJcbiAgICBhZGRlZFNjZW5lcyA9PiBzY2VuZXNcclxuICAgIGFkZGVkU2NlbmUgPT4gc2NlbmVzXHJcbiAgICByZW1vdmVkU2NlbmUgPT4gc2NlbmVcclxuICAgIHJlc3RhcnRlZFNjZW5lID0+IHNjZW5lXHJcbiAgICBkaXNhYmxlZFNjZW5lID0+IHNjZW5lXHJcbiAgICBlbmFibGVkU2NlbmUgPT4gc2NlbmVzXHJcbiAgICB1cGRhdGVkID0+IGR0XHJcbiovXHJcblxyXG5jbGFzcyBTY2VuZXNNYW5hZ2VyIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgIHRoaXMuc2NlbmVzID0gcmVxdWlyZSgnLi4vc2NlbmVzJyk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gbnVsbDtcclxuICB9XHJcbiAgZ2V0U2NlbmUoaWQpIHtcclxuICAgIHJldHVybiB0aGlzLnNjZW5lc1tpZF07XHJcbiAgfVxyXG5cclxuICAvLyBhZGRpbmcgc2NlbmVzXHJcbiAgYWRkU2NlbmVzKHNjZW5lcykge1xyXG4gICAgZm9yKGxldCBpZCBpbiBzY2VuZXMpIHtcclxuICAgICAgdGhpcy5hZGRTY2VuZShpZCwgc2NlbmVzW2lkXSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkU2NlbmVzJywgc2NlbmVzKTtcclxuICB9XHJcbiAgYWRkU2NlbmUoaWQsIHNjZW5lKSB7XHJcbiAgICB0aGlzLnNjZW5lc1tpZF0gPSBzY2VuZTtcclxuICAgIHRoaXMuZW1pdCgnYWRkZWRTY2VuZScsIHNjZW5lKTtcclxuICB9XHJcbiAgcmVtb3ZlU2NlbmUoaWQpIHtcclxuICAgIGxldCBfc2NlbmUgPSB0aGlzLnNjZW5lc1tpZF07XHJcbiAgICB0aGlzLnNjZW5lc1tpZF0gPSBudWxsO1xyXG4gICAgdGhpcy5lbWl0KCdyZW1vdmVkU2NlbmUnLCBfc2NlbmUpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udHJvbHNcclxuICByZXN0YXJ0U2NlbmUoKSB7XHJcbiAgICB0aGlzLmVuYWJsZVNjZW5lKHRoaXMuYWN0aXZlU2NlbmUuX2lkU2NlbmUpO1xyXG4gICAgdGhpcy5lbWl0KCdyZXN0YXJ0ZWRTY2VuZScsIHRoaXMuYWN0aXZlU2NlbmUpO1xyXG4gIH1cclxuICBkaXNhYmxlU2NlbmUoKSB7XHJcbiAgICBsZXQgc2NlbmUgPSB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuYWN0aXZlU2NlbmUpO1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZSA9IG51bGw7XHJcbiAgICB0aGlzLmVtaXQoJ2Rpc2FibGVkU2NlbmUnLCBzY2VuZSk7XHJcbiAgfVxyXG4gIGVuYWJsZVNjZW5lKGlkKSB7XHJcbiAgICB0aGlzLmRpc2FibGVTY2VuZSgpO1xyXG5cclxuICAgIGxldCBTY2VuZSA9IHRoaXMuZ2V0U2NlbmUoaWQpO1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZSA9IHRoaXMuYWRkQ2hpbGQobmV3IFNjZW5lKHRoaXMuZ2FtZSwgdGhpcykpO1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZS5faWRTY2VuZSA9IGlkO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnZW5hYmxlZFNjZW5lJywgdGhpcy5hY3RpdmVTY2VuZSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoZHQpIHtcclxuICAgIHRoaXMuYWN0aXZlU2NlbmUgJiYgdGhpcy5hY3RpdmVTY2VuZS51cGRhdGUgJiYgdGhpcy5hY3RpdmVTY2VuZS51cGRhdGUoZHQpO1xyXG4gICAgdGhpcy5lbWl0KCd1cGRhdGVkJywgZHQpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZXNNYW5hZ2VyO1xyXG4iLCJjbGFzcyBTY3JlZW5NYW5hZ2VyIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuTWFuYWdlcjtcclxuIiwiLy8gbWFuYWdlcnNcclxuY29uc3QgTWFwTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXJzL01hcE1hbmFnZXInKTtcclxuY29uc3QgTGV2ZWxNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvTGV2ZWxNYW5hZ2VyJyk7XHJcbmNvbnN0IEhpc3RvcnlNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvSGlzdG9yeU1hbmFnZXInKTtcclxuY29uc3QgU2NyZWVuTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXJzL1NjcmVlbk1hbmFnZXInKTtcclxuXHJcbi8vIHN1YmplY3RzXHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4uL3N1YmplY3RzL1BsYXllcicpO1xyXG5jb25zdCBUaGxlbiA9IHJlcXVpcmUoJy4uL3N1YmplY3RzL1RobGVuJyk7XHJcblxyXG4vLyBmaWx0ZXJzXHJcbmNvbnN0IEFscGhhR3JhZGllbnRGaWx0ZXIgPSByZXF1aXJlKCcuLi9maWx0ZXJzL0FscGhhR3JhZGllbnRGaWx0ZXInKTtcclxuXHJcblxyXG5jbGFzcyBQbGF5Z3JvdW5kIGV4dGVuZHMgUElYSS5wcm9qZWN0aW9uLkNvbnRhaW5lcjJkIHtcclxuICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuXHJcbiAgICAvLyBDb25zdGFudCBmb3IgcG9zaXRpb24gb2JqZWN0IGluIHByb2plY3Rpb25cclxuICAgIHRoaXMuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgIC8vIEluaXQgb2JqZWN0c1xyXG4gICAgdGhpcy5wcm9qZWN0aW9uID0gbmV3IFBJWEkucHJvamVjdGlvbi5Db250YWluZXIyZCgpO1xyXG4gICAgdGhpcy5wcm9qZWN0aW9uLnByb2ouc2V0QXhpc1koe3g6IC10aGlzLmdhbWUudy8yKzUwLCB5OiA0MDAwfSwgLTEpO1xyXG4gICAgdGhpcy5wcm9qZWN0aW9uLmZpbHRlcnMgPSBbbmV3IEFscGhhR3JhZGllbnRGaWx0ZXIoLjMsIC4xKV07XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMucHJvamVjdGlvbik7XHJcblxyXG4gICAgdGhpcy5tYXAgPSBuZXcgTWFwTWFuYWdlcih0aGlzKTtcclxuICAgIHRoaXMucHJvamVjdGlvbi5hZGRDaGlsZCh0aGlzLm1hcCk7XHJcblxyXG4gICAgdGhpcy5sZXZlbHMgPSBuZXcgTGV2ZWxNYW5hZ2VyKHRoaXMsIHRoaXMubWFwKTtcclxuXHJcbiAgICB0aGlzLnNjcmVlbiA9IG5ldyBTY3JlZW5NYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5oaXN0b3J5ID0gbmV3IEhpc3RvcnlNYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMsIHRoaXMubWFwKTtcclxuICAgIHRoaXMudGhsZW4gPSBuZXcgVGhsZW4odGhpcyk7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuc2NyZWVuLCB0aGlzLmhpc3RvcnksIHRoaXMucGxheWVyLCB0aGlzLnRobGVuKTtcclxuXHJcbiAgICAvLyBDb250cm9sc1xyXG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xyXG4gIH1cclxuICBfYmluZEV2ZW50cygpIHtcclxuICAgIHRoaXMub24oJ3BvaW50ZXJkb3duJywgKCkgPT4gdGhpcy5wbGF5ZXIuaW1tdW5pdHkoKSk7XHJcbiAgICB0aGlzLm9uKCdwb2ludGVybW92ZScsIChlKSA9PiB7XHJcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLm1hcC5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBibG9jayA9IHRoaXMubWFwLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmKGJsb2NrLmNvbnRhaW5zUG9pbnQoZS5kYXRhLmdsb2JhbCkpIHtcclxuICAgICAgICAgIHJldHVybiBibG9jay5oaXQoKTtcclxuICAgICAgICB9IGVsc2UgYmxvY2sudW5oaXQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5wbGF5ZXIub24oJ2RlYWRlZCcsICgpID0+IHRoaXMucmVzdGFydCgpKTtcclxuICAgIHRoaXMucGxheWVyLm9uKCdjb2xsaXNpb24nLCAoYmxvY2spID0+IHtcclxuICAgICAgaWYoYmxvY2suYWN0aW9uID09PSAnaGlzdG9yeScpIHRoaXMuaGlzdG9yeS5zaG93VGV4dCh0aGlzLmxldmVscy5nZXRDdXJyZW50TGV2ZWwoKS5oaXN0b3J5LnJ1LCAzMDAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaGlzdG9yeS5vbignc2hvd2VuJywgKCkgPT4ge1xyXG4gICAgICBsZXQgdHdlZW4gPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzLnByb2plY3Rpb24uZmlsdGVyc1swXSk7XHJcbiAgICAgIHR3ZWVuLmZyb20oe3N0YXJ0R3JhZGllbnQ6IC4zLCBlbmRHcmFkaWVudDogLjF9KS50byh7c3RhcnRHcmFkaWVudDogLjcsIGVuZEdyYWRpZW50OiAuNX0pO1xyXG4gICAgICB0d2Vlbi50aW1lID0gMTAwMDtcclxuICAgICAgdHdlZW4uc3RhcnQoKTtcclxuXHJcbiAgICAgIHRoaXMubWFwLmlzU3RvcCA9IHRydWVcclxuICAgIH0pO1xyXG4gICAgdGhpcy5oaXN0b3J5Lm9uKCdoaWRkZW4nLCAoKSA9PiB7XHJcbiAgICAgIGxldCB0d2VlbiA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMucHJvamVjdGlvbi5maWx0ZXJzWzBdKTtcclxuICAgICAgdHdlZW4uZnJvbSh7c3RhcnRHcmFkaWVudDogLjcsIGVuZEdyYWRpZW50OiAuNX0pLnRvKHtzdGFydEdyYWRpZW50OiAuMywgZW5kR3JhZGllbnQ6IC4xfSk7XHJcbiAgICAgIHR3ZWVuLnRpbWUgPSAxMDAwO1xyXG4gICAgICB0d2Vlbi5zdGFydCgpO1xyXG5cclxuICAgICAgdGhpcy5tYXAuaXNTdG9wID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubWFwLnNjcm9sbERvd24oMSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm1hcC5vbignZW5kZWRNYXAnLCAoKSA9PiB0aGlzLmxldmVscy5uZXh0RnJhZ21lbnQoKSk7XHJcbiAgICB0aGlzLm1hcC5vbignc2Nyb2xsZWREb3duJywgKCkgPT4gdGhpcy5wbGF5ZXIubW92aW5nKCkpO1xyXG5cclxuICAgIHRoaXMubGV2ZWxzLm9uKCdlbmRlZExldmVsJywgKCkgPT4gdGhpcy5sZXZlbHMubmV4dExldmVsKCkpO1xyXG5cclxuICAgIHRoaXMubGV2ZWxzLnN3aXRjaExldmVsKDApO1xyXG4gICAgdGhpcy5tYXAuc2Nyb2xsRG93bigxKTtcclxuICB9XHJcbiAgcmVzdGFydCgpIHtcclxuICAgIHRoaXMuZ2FtZS5zY2VuZXMucmVzdGFydFNjZW5lKCdwbGF5Z3JvdW5kJyk7XHJcblxyXG4gICAgLy8gdGhpcy5zY3JlZW4uc3BsYXNoKDB4RkZGRkZGLCAxMDAwKS50aGVuKCgpID0+IHtcclxuICAgIC8vICAgdGhpcy5nYW1lLnNjZW5lcy5yZXN0YXJ0U2NlbmUoJ3BsYXlncm91bmQnKTtcclxuICAgIC8vIH0pO1xyXG4gIH1cclxuICB1cGRhdGUoKSB7XHJcbiAgICB0aGlzLnRobGVuLnVwZGF0ZSgpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5Z3JvdW5kO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAncGxheWdyb3VuZCc6IHJlcXVpcmUoJy4vUGxheWdyb3VuZCcpXHJcbn1cclxuIiwiLypcclxuICDQmtC70LDRgdGBINCR0LvQvtC60LAsINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y8g0YLQsNC50LvQvtCy0L7Qs9C+INC00LLQuNC20LrQsFxyXG4gINCh0L7QsdGL0YLQuNGPOlxyXG4gICAgYWN0aXZhdGVkXHJcbiAgICBkZWFjdGl2YXRlZFxyXG4gICAgaGl0ZWRcclxuKi9cclxuXHJcbmNsYXNzIEJsb2NrIGV4dGVuZHMgUElYSS5wcm9qZWN0aW9uLlNwcml0ZTJkIHtcclxuICBjb25zdHJ1Y3RvcihtYXAsIHgsIHksIHBhcmFtcz17fSkge1xyXG4gICAgc3VwZXIoUElYSS5UZXh0dXJlLmZyb21GcmFtZShwYXJhbXMuaW1hZ2UgfHwgcGFyYW1zLmFjdGl2YXRpb25JbWFnZSkpO1xyXG5cclxuICAgIHRoaXMubWFwID0gbWFwO1xyXG4gICAgdGhpcy5nYW1lID0gdGhpcy5tYXAuZ2FtZTtcclxuXHJcbiAgICB0aGlzLnNjb3JlID0gcGFyYW1zLnNjb3JlO1xyXG4gICAgdGhpcy5hY3RpdmF0aW9uID0gcGFyYW1zLmFjdGl2YXRpb24gfHwgbnVsbDtcclxuICAgIHRoaXMuZGVhY3RpdmF0aW9uVGV4dHVyZSA9IHBhcmFtcy5pbWFnZSA/IFBJWEkuVGV4dHVyZS5mcm9tRnJhbWUocGFyYW1zLmltYWdlKSA6IG51bGw7XHJcbiAgICB0aGlzLmFjdGl2YXRpb25UZXh0dXJlID0gcGFyYW1zLmFjdGl2YXRpb25JbWFnZSA/IFBJWEkuVGV4dHVyZS5mcm9tRnJhbWUocGFyYW1zLmFjdGl2YXRpb25JbWFnZSkgOiBudWxsO1xyXG4gICAgdGhpcy5pc0FjdGl2ZSA9IHBhcmFtcy5hY3RpdmU7XHJcbiAgICB0aGlzLnBsYXllckRpciA9IHBhcmFtcy5wbGF5ZXJEaXIgfHwgbnVsbDtcclxuICAgIHRoaXMuYWN0aW9uID0gcGFyYW1zLmFjdGlvbiB8fCBudWxsO1xyXG5cclxuICAgIHRoaXMuYW5jaG9yLnNldCguNSk7XHJcbiAgICB0aGlzLndpZHRoID0gbWFwLmJsb2NrU2l6ZSsxO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBtYXAuYmxvY2tTaXplKzE7XHJcbiAgICB0aGlzLnggPSB4K21hcC5ibG9ja1NpemUvMisuNTtcclxuICAgIHRoaXMueSA9IHkrbWFwLmJsb2NrU2l6ZS8yKy41O1xyXG5cclxuICAgIHRoaXMuam9sdGluZyA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgdGhpcy5qb2x0aW5nLmZyb20oe3JvdGF0aW9uOiAtLjF9KS50byh7cm90YXRpb246IC4xfSk7XHJcbiAgICB0aGlzLmpvbHRpbmcudGltZSA9IDIwMDtcclxuICAgIHRoaXMuam9sdGluZy5waW5nUG9uZyA9IHRydWU7XHJcbiAgICB0aGlzLmpvbHRpbmcucmVwZWF0ID0gSW5maW5pdHk7XHJcblxyXG4gICAgdGhpcy5nbG93ID0gbmV3IFBJWEkuZmlsdGVycy5BbHBoYUZpbHRlcigpO1xyXG4gICAgdGhpcy5nbG93LmVuYWJsZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuZmlsdGVycyA9IFt0aGlzLmdsb3ddO1xyXG4gIH1cclxuICBhY3RpdmF0ZSgpIHtcclxuICAgIGxldCBhY3RpdmF0aW5nID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcylcclxuICAgICAgLmZyb20oe3dpZHRoOiB0aGlzLndpZHRoKjMvNCwgaGVpZ2h0OiB0aGlzLmhlaWdodCozLzR9KVxyXG4gICAgICAudG8oe3dpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0LCByb3RhdGlvbjogMH0pO1xyXG4gICAgYWN0aXZhdGluZy50aW1lID0gNTAwO1xyXG4gICAgYWN0aXZhdGluZy5lYXNpbmcgPSBQSVhJLnR3ZWVuLkVhc2luZy5vdXRCb3VuY2UoKTtcclxuICAgIGFjdGl2YXRpbmcuc3RhcnQoKTtcclxuXHJcbiAgICB0aGlzLmdsb3cuYWxwaGEgPSAxLjA7XHJcbiAgICB0aGlzLmpvbHRpbmcuc3RvcCgpO1xyXG4gICAgdGhpcy5yb3RhdGlvbiA9IDA7XHJcblxyXG4gICAgdGhpcy5pc0FjdGl2ZSA9IHRydWU7XHJcbiAgICBpZih0aGlzLmFjdGl2YXRpb25UZXh0dXJlKSB0aGlzLnRleHR1cmUgPSB0aGlzLmFjdGl2YXRpb25UZXh0dXJlO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnYWN0aXZhdGVkJyk7XHJcbiAgfVxyXG4gIGRlYWN0aXZhdGUoKSB7XHJcbiAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XHJcbiAgICBpZih0aGlzLmRlYWN0aXZhdGlvblRleHR1cmUpIHRoaXMudGV4dHVyZSA9IHRoaXMuZGVhY3RpdmF0aW9uVGV4dHVyZTtcclxuICAgIHRoaXMuZW1pdCgnZGVhY3RpdmF0ZWQnKTtcclxuICB9XHJcbiAgdW5oaXQoKSB7XHJcbiAgICB0aGlzLmdsb3cuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5qb2x0aW5nLnN0b3AoKTtcclxuICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG4gIH1cclxuICBoaXQoKSB7XHJcbiAgICBpZih0aGlzLmFjdGl2YXRpb24gPT09IG51bGwgfHwgdGhpcy5pc0FjdGl2ZSkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuam9sdGluZy5zdGFydCgpO1xyXG4gICAgdGhpcy5nbG93LmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5nbG93LmFscGhhID0gNS4wO1xyXG5cclxuICAgIGlmKHRoaXMuYWN0aXZhdGlvbikgdGhpcy5hY3RpdmF0aW9uLS07XHJcbiAgICBlbHNlIHRoaXMuYWN0aXZhdGUoKTtcclxuICAgIHRoaXMuZW1pdCgnaGl0ZWQnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmxvY2s7XHJcbiIsIi8qXHJcbiAg0JrQu9Cw0YHRgSBQbGF5ZXIsINCy0LfQsNC40LzQvtC00LXQudGB0YLQstGD0LXRgiDRgSBNYXBNYW5hZ2VyXHJcbiAg0KHQvtCx0YvRgtC40Y9cclxuICAgIGNvbGxpc2lvbiA9PiBjb2xsaXNpb24gYmxvY2tcclxuICAgIG1vdmVkXHJcbiAgICBkZWFkZWRcclxuXHJcbiAgICBhY3Rpb25JbW11bml0eVxyXG4gICAgYWN0aW9uVG9wXHJcbiAgICBhY3Rpb25MZWZ0XHJcbiAgICBhY3Rpb25SaWdodFxyXG4qL1xyXG5cclxuY2xhc3MgUGxheWVyIGV4dGVuZHMgUElYSS5TcHJpdGUge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lLCBtYXApIHtcclxuICAgIHN1cGVyKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoJ3BsYXllcicpKTtcclxuXHJcbiAgICB0aGlzLmdhbWUgPSBzY2VuZS5nYW1lO1xyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgdGhpcy5tYXAgPSBtYXA7XHJcblxyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41LCAxKTtcclxuICAgIHRoaXMuc2NhbGUuc2V0KC43KTtcclxuICAgIHRoaXMueCA9IHRoaXMuZ2FtZS53LzIrNTtcclxuICAgIHRoaXMueSA9IHRoaXMuZ2FtZS5oLXRoaXMubWFwLmJsb2NrU2l6ZSoyO1xyXG5cclxuICAgIHRoaXMud2Fsa2luZyA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgdGhpcy53YWxraW5nLmZyb20oe3k6IHRoaXMueX0pLnRvKHt5OiB0aGlzLnktMTV9KTtcclxuICAgIHRoaXMud2Fsa2luZy50aW1lID0gODAwO1xyXG4gICAgdGhpcy53YWxraW5nLmxvb3AgPSB0cnVlO1xyXG4gICAgdGhpcy53YWxraW5nLnBpbmdQb25nID0gdHJ1ZTtcclxuICAgIHRoaXMud2Fsa2luZy5zdGFydCgpO1xyXG5cclxuICAgIHRoaXMubGFzdE1vdmUgPSBudWxsO1xyXG4gICAgdGhpcy5zcGVlZCA9IHRoaXMubWFwLnNwZWVkIHx8IDUwMDtcclxuICAgIHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5JTU1VTklUWV9CTE9DS1MgPSAyO1xyXG4gICAgdGhpcy5pbW11bml0eUNvdW50ID0gNTtcclxuICAgIHRoaXMuaXNJbW11bml0eSA9IGZhbHNlO1xyXG4gIH1cclxuICBtb3ZpbmcoKSB7XHJcbiAgICBpZih0aGlzLmlzRGVhZCB8fCB0aGlzLmlzSW1tdW5pdHkpIHJldHVybjtcclxuXHJcbiAgICBsZXQgY3VyID0gdGhpcy5tYXAuZ2V0QmxvY2tGcm9tUG9zKHt4OiB0aGlzLngsIHk6IHRoaXMueX0pO1xyXG4gICAgaWYoY3VyICYmIGN1ci5pc0FjdGl2ZSkge1xyXG4gICAgICB0aGlzLmVtaXQoJ2NvbGxpc2lvbicsIGN1cik7XHJcblxyXG4gICAgICBpZihjdXIucGxheWVyRGlyID09PSAndG9wJykgcmV0dXJuIHRoaXMudG9wKCk7XHJcbiAgICAgIGlmKGN1ci5wbGF5ZXJEaXIgPT09ICdsZWZ0JykgcmV0dXJuIHRoaXMubGVmdCgpO1xyXG4gICAgICBpZihjdXIucGxheWVyRGlyID09PSAncmlnaHQnKSByZXR1cm4gdGhpcy5yaWdodCgpO1xyXG5cclxuICAgICAgLy9jaGVjayB0b3BcclxuICAgICAgbGV0IHRvcCA9IHRoaXMubWFwLmdldEJsb2NrRnJvbVBvcyh7eDogdGhpcy54LCB5OiB0aGlzLnktdGhpcy5tYXAuYmxvY2tTaXplfSk7XHJcbiAgICAgIGlmKHRvcCAmJiB0b3AuaXNBY3RpdmUgJiYgdGhpcy5sYXN0TW92ZSAhPT0gJ2JvdHRvbScpIHJldHVybiB0aGlzLnRvcCgpO1xyXG5cclxuICAgICAgLy8gY2hlY2sgbGVmdFxyXG4gICAgICBsZXQgbGVmdCA9IHRoaXMubWFwLmdldEJsb2NrRnJvbVBvcyh7eDogdGhpcy54LXRoaXMubWFwLmJsb2NrU2l6ZSwgeTogdGhpcy55fSk7XHJcbiAgICAgIGlmKGxlZnQgJiYgbGVmdC5pc0FjdGl2ZSAmJiB0aGlzLmxhc3RNb3ZlICE9PSAncmlnaHQnKSByZXR1cm4gdGhpcy5sZWZ0KCk7XHJcblxyXG4gICAgICAvLyBjaGVjayByaWd0aFxyXG4gICAgICBsZXQgcmlnaHQgPSB0aGlzLm1hcC5nZXRCbG9ja0Zyb21Qb3Moe3g6IHRoaXMueCt0aGlzLm1hcC5ibG9ja1NpemUsIHk6IHRoaXMueX0pO1xyXG4gICAgICBpZihyaWdodCAmJiByaWdodC5pc0FjdGl2ZSAmJiB0aGlzLmxhc3RNb3ZlICE9PSAnbGVmdCcpIHJldHVybiB0aGlzLnJpZ2h0KCk7XHJcblxyXG4gICAgICAvLyBvciBkaWVcclxuICAgICAgdGhpcy50b3AoKTtcclxuICAgIH0gZWxzZSB0aGlzLmRlYWQoKTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ21vdmVkJyk7XHJcbiAgfVxyXG4gIGRlYWQoKSB7XHJcbiAgICB0aGlzLndhbGtpbmcuc3RvcCgpO1xyXG4gICAgdGhpcy5pc0RlYWQgPSB0cnVlO1xyXG5cclxuICAgIGxldCBkZWFkID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcy5zY2FsZSk7XHJcbiAgICBkZWFkLmZyb20odGhpcy5zY2FsZSkudG8oe3g6IDAsIHk6IDB9KTtcclxuICAgIGRlYWQudGltZSA9IDIwMDtcclxuICAgIGRlYWQuc3RhcnQoKTtcclxuICAgIGRlYWQub24oJ2VuZCcsICgpID0+IHRoaXMuZW1pdCgnZGVhZGVkJykpO1xyXG4gIH1cclxuICBpbW11bml0eSgpIHtcclxuICAgIGlmKCF0aGlzLmltbXVuaXR5Q291bnQpIHJldHVybjtcclxuXHJcbiAgICBsZXQgaW1tdW5pdHkgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIGltbXVuaXR5LmZyb20oe2FscGhhOiAuNX0pLnRvKHthbHBoYTogMX0pO1xyXG4gICAgaW1tdW5pdHkudGltZSA9IHRoaXMuc3BlZWQqdGhpcy5JTU1VTklUWV9CTE9DS1M7XHJcbiAgICBpbW11bml0eS5zdGFydCgpO1xyXG5cclxuICAgIHRoaXMubWFwLnNjcm9sbERvd24odGhpcy5JTU1VTklUWV9CTE9DS1MpO1xyXG4gICAgaW1tdW5pdHkub24oJ2VuZCcsICgpID0+IHRoaXMuaXNJbW11bml0eSA9IGZhbHNlKTtcclxuICAgIHRoaXMuaXNJbW11bml0eSA9IHRydWU7XHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gJ3RvcCc7XHJcbiAgICB0aGlzLmltbXVuaXR5Q291bnQtLTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ2FjdGlvbkltbXVuaXR5Jyk7XHJcbiAgfVxyXG4gIHRvcCgpIHtcclxuICAgIHRoaXMubGFzdE1vdmUgPSAndG9wJztcclxuICAgIHRoaXMubWFwLnNjcm9sbERvd24oMSk7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdhY3Rpb25Ub3AnKTtcclxuICB9XHJcbiAgbGVmdCgpIHtcclxuICAgIHRoaXMubGFzdE1vdmUgPSAnbGVmdCc7XHJcbiAgICBsZXQgbW92ZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgbW92ZS5mcm9tKHt4OiB0aGlzLnh9KS50byh7eDogdGhpcy54LXRoaXMubWFwLmJsb2NrU2l6ZS0yMH0pO1xyXG4gICAgbW92ZS50aW1lID0gdGhpcy5zcGVlZC8yO1xyXG4gICAgbW92ZS5zdGFydCgpO1xyXG5cclxuICAgIG1vdmUub24oJ2VuZCcsICgpID0+IHRoaXMubW92aW5nKCkpO1xyXG4gICAgdGhpcy5lbWl0KCdhY3Rpb25MZWZ0Jyk7XHJcbiAgfVxyXG4gIHJpZ2h0KCkge1xyXG4gICAgdGhpcy5sYXN0TW92ZSA9ICdyaWdodCc7XHJcbiAgICBsZXQgbW92ZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgbW92ZS5mcm9tKHt4OiB0aGlzLnh9KS50byh7eDogdGhpcy54K3RoaXMubWFwLmJsb2NrU2l6ZSsyMH0pO1xyXG4gICAgbW92ZS50aW1lID0gdGhpcy5zcGVlZC8yO1xyXG4gICAgbW92ZS5zdGFydCgpO1xyXG5cclxuICAgIG1vdmUub24oJ2VuZCcsICgpID0+IHRoaXMubW92aW5nKCkpO1xyXG4gICAgdGhpcy5lbWl0KCdhY3Rpb25SaWdodCcpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XHJcbiIsImNsYXNzIFNwaGVyZSBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgUElYSS5wYXJ0aWNsZXMuRW1pdHRlcih0aGlzLCBbUElYSS5UZXh0dXJlLmZyb21JbWFnZSgncGFydGljbGUnKV0sIHJlcXVpcmUoJy4vZW1pdHRlci5qc29uJykpO1xyXG4gIH1cclxuICB1cGRhdGUoZHQpIHtcclxuICAgIHRoaXMuZW1pdHRlci51cGRhdGUoZHQqLjAxKTtcclxuICAgIHRoaXMuZW1pdHRlci5lbWl0ID0gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3BoZXJlO1xyXG4iLCJjbGFzcyBUaGxlbiBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICB0aGlzLmdhbWUgPSBzY2VuZS5nYW1lO1xyXG5cclxuICAgIHRoaXMuUEFERElOID0gNTA7XHJcblxyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZSgnZGlzcGxhY2VtZW50JykpO1xyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUudGV4dHVyZS5iYXNlVGV4dHVyZS53cmFwTW9kZSA9IFBJWEkuV1JBUF9NT0RFUy5SRVBFQVQ7XHJcbiAgICBzY2VuZS5hZGRDaGlsZCh0aGlzLmRpc3BsYWNlbWVudFNwcml0ZSk7XHJcbiAgICB0aGlzLmRpc3BsYWNlbWVudEZpbHRlciA9IG5ldyBQSVhJLmZpbHRlcnMuRGlzcGxhY2VtZW50RmlsdGVyKHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlKTtcclxuXHJcbiAgICB0aGlzLnRobGVuID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoJ3RobGVuJykpO1xyXG4gICAgdGhpcy50aGxlbi53aWR0aCA9IHRoaXMuZ2FtZS53K3RoaXMuUEFERElOO1xyXG4gICAgdGhpcy50aGxlbi55ID0gdGhpcy5nYW1lLmgtdGhpcy50aGxlbi5oZWlnaHQrdGhpcy5QQURESU47XHJcbiAgICB0aGlzLnRobGVuLnggPSAtdGhpcy5QQURESU4vMjtcclxuICAgIHRoaXMudGhsZW4uZmlsdGVycyA9IFt0aGlzLmRpc3BsYWNlbWVudEZpbHRlcl07XHJcbiAgICBzY2VuZS5hZGRDaGlsZCh0aGlzLnRobGVuKTtcclxuICB9XHJcbiAgdXBkYXRlKCkge1xyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUueCArPSA1O1xyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUueSArPSA1O1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaGxlbjtcclxuIiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcImFscGhhXCI6IHtcblx0XHRcInN0YXJ0XCI6IDAuNDgsXG5cdFx0XCJlbmRcIjogMFxuXHR9LFxuXHRcInNjYWxlXCI6IHtcblx0XHRcInN0YXJ0XCI6IDAuNSxcblx0XHRcImVuZFwiOiAwLjUsXG5cdFx0XCJtaW5pbXVtU2NhbGVNdWx0aXBsaWVyXCI6IDAuMDVcblx0fSxcblx0XCJjb2xvclwiOiB7XG5cdFx0XCJzdGFydFwiOiBcIiNmZmZmZmZcIixcblx0XHRcImVuZFwiOiBcIiNmZmZmZmZcIlxuXHR9LFxuXHRcInNwZWVkXCI6IHtcblx0XHRcInN0YXJ0XCI6IDkwLFxuXHRcdFwiZW5kXCI6IDAsXG5cdFx0XCJtaW5pbXVtU3BlZWRNdWx0aXBsaWVyXCI6IDFcblx0fSxcblx0XCJtYXhTcGVlZFwiOiAwLFxuXHRcInN0YXJ0Um90YXRpb25cIjoge1xuXHRcdFwibWluXCI6IDAsXG5cdFx0XCJtYXhcIjogMzYwXG5cdH0sXG5cdFwibm9Sb3RhdGlvblwiOiBmYWxzZSxcblx0XCJyb3RhdGlvblNwZWVkXCI6IHtcblx0XHRcIm1pblwiOiAwLFxuXHRcdFwibWF4XCI6IDBcblx0fSxcblx0XCJsaWZldGltZVwiOiB7XG5cdFx0XCJtaW5cIjogMC4yLFxuXHRcdFwibWF4XCI6IDFcblx0fSxcblx0XCJibGVuZE1vZGVcIjogXCJhZGRcIixcblx0XCJmcmVxdWVuY3lcIjogMC4wMDEsXG5cdFwiZW1pdHRlckxpZmV0aW1lXCI6IC0xLFxuXHRcIm1heFBhcnRpY2xlc1wiOiA1MDAsXG5cdFwicG9zXCI6IHtcblx0XHRcInhcIjogMCxcblx0XHRcInlcIjogMFxuXHR9LFxuXHRcImFkZEF0QmFja1wiOiBmYWxzZSxcblx0XCJzcGF3blR5cGVcIjogXCJyZWN0XCIsXG5cdFwic3Bhd25SZWN0XCI6IHtcblx0XHRcInhcIjogMCxcblx0XHRcInlcIjogMCxcblx0XHRcIndcIjogMCxcblx0XHRcImhcIjogMFxuXHR9XG59XG4iLCIvKlxyXG5UaGlzIHV0aWwgY2xhc3MgZm9yIGNvbnZlcnRlZCBkYXRhIGZyb20gZnJhZ21lbnRzLmpzb25cclxub2JqZWN0IHRvIHNpbXBsZSBtYXAgYXJyYXksIGZvciBleGFtcGxlOiBbJ0EnLCAnQScsICdBJywgJ0EnXVxyXG4qL1xyXG5cclxuY2xhc3MgRGF0YUZyYWdtZW50Q29udmVydGVyIHtcclxuICBjb25zdHJ1Y3RvcihkYXRhKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgdGhpcy5pbnB1dE1hcCA9IGRhdGEubWFwO1xyXG4gICAgdGhpcy5mcmFnbWVudCA9IFtdO1xyXG5cclxuICAgIC8vIE9QRVJBVE9SU1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGRhdGEubWFwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKH5+ZGF0YS5tYXBbaV0uaW5kZXhPZignfCcpKSB0aGlzLmNhc2VPcGVyYXRvcihkYXRhLm1hcFtpXSwgaSk7XHJcbiAgICAgIGVsc2UgdGhpcy5mcmFnbWVudFtpXSA9IGRhdGEubWFwW2ldO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1FVEhPRFNcclxuICAgIGRhdGEudHJpbSAmJiB0aGlzLnJhbmRvbVRyaW0oZGF0YS50cmltKTtcclxuICAgIGRhdGEuYXBwZW5kICYmIHRoaXMucmFuZG9tQXBwZW5kKGRhdGEuYXBwZW5kKTtcclxuICAgIGRhdGEuc2h1ZmZsZSAmJiB0aGlzLnNodWZmbGUoKTtcclxuICB9XHJcblxyXG4gIC8vIE9QRVJBVE9SU1xyXG4gIC8vIENhc2Ugb3BlcmF0b3I6ICdBfEJ8Q3xEJyA9PiBDIGFuZCBldGMuLi5cclxuICBjYXNlT3BlcmF0b3Ioc3RyLCBpKSB7XHJcbiAgICBsZXQgaWRzID0gc3RyLnNwbGl0KCd8Jyk7XHJcbiAgICB0aGlzLmZyYWdtZW50W2ldID0gaWRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSppZHMubGVuZ3RoKV07XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIE1FVEhPRFNcclxuICAvLyBUcmltbWluZyBhcnJheSBpbiByYW5nZSAwLi5yYW5kKG1pbiwgbGVuZ3RoKVxyXG4gIHJhbmRvbVRyaW0obWluKSB7XHJcbiAgICB0aGlzLmZyYWdtZW50Lmxlbmd0aCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0aGlzLmZyYWdtZW50Lmxlbmd0aCsxIC0gbWluKSArIG1pbik7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbiAgLy8gU2h1ZmZsZSBhcnJheSBbMSwyLDNdID0+IFsyLDEsM10gYW5kIGV0Yy4uLlxyXG4gIHNodWZmbGUoKSB7XHJcbiAgICB0aGlzLmZyYWdtZW50LnNvcnQoKGEsIGIpID0+IE1hdGgucmFuZG9tKCkgPCAuNSA/IC0xIDogMSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbiAgLy8gQWRkcyBhIGJsb2NrIHRvIHRoZSByYW5kb20gbG9jYXRpb24gb2YgdGhlIGFycmF5OiBbQSxBLEFdID0+IFtCLEEsQV0gYW5kIGV0Yy4uLlxyXG4gIHJhbmRvbUFwcGVuZChpZCkge1xyXG4gICAgdGhpcy5mcmFnbWVudFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqdGhpcy5mcmFnbWVudC5sZW5ndGgpXSA9IGlkO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFGcmFnbWVudENvbnZlcnRlcjtcclxuIl19
