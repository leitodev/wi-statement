import{a as S,b as G}from"./chunk-QJREEZGA.js";import{l as A}from"./chunk-4JDCXK2X.js";import{$a as p,Fa as v,Ha as T,Ka as I,La as C,Ma as x,Na as i,Oa as o,Pa as d,Ta as h,Ua as f,V as g,Va as w,Xa as M,Ya as V,Za as N,ab as c,ba as u,bb as R,ca as b,da as _,ea as E,gb as F,hb as k,ka as y,lb as L,sa as m,ta as D}from"./chunk-YRRPMABQ.js";var B=(t,e)=>e.name,W=(t,e)=>e.id;function H(t,e){if(t&1&&(i(0,"th",1),p(1),o()),t&2){let a=e.$implicit;m(),c(a.name)}}function Q(t,e){if(t&1&&(i(0,"li"),p(1),o()),t&2){let a=e.$implicit;m(),c(a.name)}}function z(t,e){if(t&1){let a=h();i(0,"tr",2),f("click",function(){let n=u(a).$implicit,l=w(2);return b(l.tableRowCLick(n))}),i(1,"td",3),p(2),o(),i(3,"td",1),p(4),o(),i(5,"td",1),p(6),o(),i(7,"td",1)(8,"ul"),C(9,Q,2,1,"li",null,W),o()(),i(11,"td",1),p(12),o(),i(13,"td",4)(14,"div",5)(15,"button",6),f("click",function(n){let l=u(a).$implicit,s=w(2);return b(s.tableRowEditBtn(l,n))}),_(),i(16,"svg",7),d(17,"path",8),o()(),E(),i(18,"button",9),_(),i(19,"svg",7),d(20,"path",10)(21,"path",11),o()(),E(),i(22,"button",12),_(),i(23,"svg",13),d(24,"path",14),o()()()()()}if(t&2){let a=e.$implicit;m(2),c(a.id),m(2),c(a.supplier),m(2),c(a.partNumber),m(3),x(a.components),m(3),R(" ",a.description," ")}}function Z(t,e){if(t&1&&(i(0,"table",0)(1,"thead")(2,"tr"),C(3,H,2,1,"th",1,B),d(5,"th",1),o()(),i(6,"tbody"),C(7,z,25,4,"tr",null,W),o()()),t&2){let a=w();m(3),x(a.tableConfig.headers),m(4),x(a.data)}}var U=(()=>{let e=class e{constructor(){this.tableConfig=null,this.data=null,this.tableEvent=new y}tableRowCLick(r){this.tableEvent.emit({eventName:"tableRowCLick",data:r})}tableRowEditBtn(r,n){n.stopPropagation(),this.tableEvent.emit({eventName:"tableRowEditBtn",data:r})}};e.\u0275fac=function(n){return new(n||e)},e.\u0275cmp=g({type:e,selectors:[["wi-table"]],inputs:{tableConfig:[0,"tableConfigData","tableConfig"],data:"data"},outputs:{tableEvent:"tableEvent"},standalone:!0,features:[k],decls:1,vars:1,consts:[[1,"w-full","table-auto","border-collapse","border","border-slate-400"],[1,"border","border-slate-300"],[3,"click"],[1,"border","border-slate-300","text-center"],[1,"border","border-slate-300","w-[150px]"],[1,"flex","justify-evenly","items-center"],["type","button",1,"text-white","bg-white","border","border-gray-200","hover:bg-gray-100","hover:text-blue-700","font-medium","text-sm","px-1.5","rounded-sm","py-0.5","text-center","dark:bg-blue-600","dark:hover:bg-blue-700","dark:focus:ring-blue-800",3,"click"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24","stroke-width","1.5","stroke","black",1,"size-6"],["stroke-linecap","round","stroke-linejoin","round","d","m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"],["type","button",1,"text-white","bg-white","border","border-gray-200","hover:bg-gray-100","hover:text-blue-700","font-medium","text-sm","px-1.5","rounded-sm","py-0.5","text-center","dark:bg-blue-600","dark:hover:bg-blue-700","dark:focus:ring-blue-800"],["stroke-linecap","round","stroke-linejoin","round","d","M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"],["stroke-linecap","round","stroke-linejoin","round","d","M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"],["type","button",1,"text-white","bg-red-700","hover:bg-red-800","border","border-gray-200","hover:text-blue-700","font-medium","text-sm","px-1.5","rounded-sm","py-0.5","text-center","dark:bg-blue-600","dark:hover:bg-blue-700","dark:focus:ring-blue-800"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24","stroke-width","1.5","stroke","white",1,"size-6"],["stroke-linecap","round","stroke-linejoin","round","d","m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"]],template:function(n,l){n&1&&v(0,Z,9,0,"table",0),n&2&&I(l.tableConfig?0:-1)},dependencies:[A]});let t=e;return t})();var O={headers:[{name:"id",sort:!0},{name:"supplier",sort:!0},{name:"part_number",sort:!1},{name:"components",sort:!1},{name:"description",sort:!1}]},$=O;var q=["modalTemplate"];function J(t,e){if(t&1&&d(0,"app-product-modal",2),t&2){let a=e.data;T("data",a)}}var se=(()=>{let e=class e{constructor(r){this.modalService=r,this.data=[{parentID:null,id:1,supplier:"Rockstar Games",partNumber:"123SU152",components:[{parentID:1,id:11,supplier:"GTA San Diego",partNumber:"123SU15253",components:[{parentID:11,id:111,supplier:"GTA California",partNumber:"123SU1g5",components:[],description:"gta California 2018"}],description:"gta V 2014 desc!"},{parentID:1,id:12,supplier:"RDR Dakota",partNumber:"123SU15212",components:[],description:"rdr desc main 2"}],description:"lorem text"},{parentID:null,id:2,supplier:"Activision",partNumber:"W1889000001",components:[],description:"decent description text"},{parentID:1,id:11,supplier:"GTA San Diego",partNumber:"123SU15253",components:[],description:"gta V 2014 desc!"},{parentID:11,id:111,supplier:"GTA California",partNumber:"123SU1g5",components:[],description:"gta California 2018"},{parentID:1,id:12,supplier:"RDR Dakota",partNumber:"123SU15212",components:[],description:"rdr desc main 2"}],this.tableConfig=$}ngOnInit(){}tableEvent(r){console.log(r),this.openModal(this.modalTemplate,r.data)}openModal(r,n){this.modalService.open(r,{size:"lg",title:n.partNumber,data:n}).subscribe(l=>{console.log("modalAction",l)})}};e.\u0275fac=function(n){return new(n||e)(D(S))},e.\u0275cmp=g({type:e,selectors:[["app-part-management"]],viewQuery:function(n,l){if(n&1&&M(q,7),n&2){let s;V(s=N())&&(l.modalTemplate=s.first)}},standalone:!0,features:[F([S]),k],decls:3,vars:2,consts:[["modalTemplate",""],[3,"tableEvent","tableConfigData","data"],[3,"data"]],template:function(n,l){if(n&1){let s=h();i(0,"wi-table",1),f("tableEvent",function(j){return u(s),b(l.tableEvent(j))}),o(),v(1,J,1,1,"ng-template",null,0,L)}n&2&&T("tableConfigData",l.tableConfig)("data",l.data)},dependencies:[U,G]});let t=e;return t})();export{se as PartManagementComponent};
