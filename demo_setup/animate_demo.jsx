(function(){
 var comp=app.project.item(app.project.numItems); 
 for (var i=1;i<=app.project.numItems;i++) if(app.project.item(i).name=="demo") comp=app.project.item(i);
 comp.duration=8;
 var c=comp.layer("Split Ctrl"), P=c.property("ADBE Transform Group").property("ADBE Position"), fx=c.property("ADBE Effect Parade");
 function key(prop,pairs,asPos){ for(var k=0;k<pairs.length;k++){ prop.setValueAtTime(pairs[k][0], asPos?[pairs[k][1],540,0]:pairs[k][1]); }
   try{ var e=new KeyframeEase(0,60); for(var n=1;n<=prop.numKeys;n++){ prop.setTemporalEaseAtKey(n,asPos?[e,e,e]:[e],asPos?[e,e,e]:[e]); } }catch(err){} }
 key(P,[[0,960],[1.2,560],[2.4,1360],[3.6,960],[4.4,960],[5.4,520],[6.4,1400],[7.4,960],[8,960]],true);
 key(fx.property("Roundness").property(1),[[0,0],[1.2,0],[2.4,50],[3.6,50],[4.4,0],[8,0]]);
 key(fx.property("Gap").property(1),[[0,20],[3.6,20],[4.4,36],[7.4,36],[8,20]]);
 key(fx.property("Parallax").property(1),[[0,100],[4.4,100],[5.2,0],[6.6,0],[7.4,100],[8,100]]);
 return "keys "+P.numKeys;
})();
