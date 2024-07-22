THREE.EffectComposer=function(e,r){if(this.renderer=e,void 0===r){var s={minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat,stencilBuffer:!1},t=e.getDrawingBufferSize();r=new THREE.WebGLRenderTarget(t.width,t.height,s),r.texture.name="EffectComposer.rt1"}this.renderTarget1=r,this.renderTarget2=r.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.passes=[],void 0===THREE.CopyShader&&console.error("THREE.EffectComposer relies on THREE.CopyShader"),void 0===THREE.ShaderPass&&console.error("THREE.EffectComposer relies on THREE.ShaderPass"),this.copyPass=new THREE.ShaderPass(THREE.CopyShader)},Object.assign(THREE.EffectComposer.prototype,{swapBuffers:function(){var e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e},addPass:function(e){this.passes.push(e);var r=this.renderer.getDrawingBufferSize();e.setSize(r.width,r.height)},insertPass:function(e,r){this.passes.splice(r,0,e)},render:function(e){var r,s,t=!1,i=this.passes.length;for(s=0;s<i;s++)if(r=this.passes[s],r.enabled!==!1){if(r.render(this.renderer,this.writeBuffer,this.readBuffer,e,t),r.needsSwap){if(t){var n=this.renderer.context;n.stencilFunc(n.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.stencilFunc(n.EQUAL,1,4294967295)}this.swapBuffers()}void 0!==THREE.MaskPass&&(r instanceof THREE.MaskPass?t=!0:r instanceof THREE.ClearMaskPass&&(t=!1))}},reset:function(e){if(void 0===e){var r=this.renderer.getDrawingBufferSize();e=this.renderTarget1.clone(),e.setSize(r.width,r.height)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2},setSize:function(e,r){this.renderTarget1.setSize(e,r),this.renderTarget2.setSize(e,r);for(var s=0;s<this.passes.length;s++)this.passes[s].setSize(e,r)}}),THREE.Pass=function(){this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1},Object.assign(THREE.Pass.prototype,{setSize:function(e,r){},render:function(e,r,s,t,i){console.error("THREE.Pass: .render() must be implemented in derived pass.")}});