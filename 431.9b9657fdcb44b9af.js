"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[431],{431:(p,u,i)=>{i.r(u),i.d(u,{ConductorBienvenidaPageModule:()=>m});var d=i(177),l=i(4341),s=i(4742),r=i(70),e=i(3953);const g=[{path:"",component:(()=>{var n;class t{constructor(o){this.router=o,this.cnombreUsuario=""}ngOnInit(){const o=localStorage.getItem("usuarioRegistrado");if(o){const c=JSON.parse(o);this.cnombreUsuario=c.nombre,setTimeout(()=>{this.router.navigate(["/inicio-conductor"])},3e3)}else this.router.navigate(["/login"])}}return(n=t).\u0275fac=function(o){return new(o||n)(e.rXU(r.Ix))},n.\u0275cmp=e.VBU({type:n,selectors:[["app-conductor-bienvenida"]],decls:7,vars:4,consts:[[1,"ion-text-center",3,"fullscreen"],[1,"welcome-container"]],template:function(o,c){1&o&&(e.j41(0,"ion-content",0)(1,"div",1)(2,"h1"),e.EFF(3),e.nI1(4,"titlecase"),e.k0s(),e.j41(5,"p"),e.EFF(6,"\xa1Es hora de manejar compa\xf1ero, disfruta este d\xeda!"),e.k0s()()()),2&o&&(e.Y8G("fullscreen",!0),e.R7$(3),e.SpI("Bienvenido, ",e.bMT(4,2,c.cnombreUsuario),"!"))},dependencies:[s.W9,d.PV],styles:[".welcome-container[_ngcontent-%COMP%]{margin-top:50%;padding:20px}h1[_ngcontent-%COMP%]{color:#3880ff;font-size:24px;font-weight:700}p[_ngcontent-%COMP%]{color:#8c8c8c;margin-top:10px}"]}),t})()}];let v=(()=>{var n;class t{}return(n=t).\u0275fac=function(o){return new(o||n)},n.\u0275mod=e.$C({type:n}),n.\u0275inj=e.G2t({imports:[r.iI.forChild(g),r.iI]}),t})(),m=(()=>{var n;class t{}return(n=t).\u0275fac=function(o){return new(o||n)},n.\u0275mod=e.$C({type:n}),n.\u0275inj=e.G2t({imports:[d.MD,l.YN,s.bv,v]}),t})()}}]);