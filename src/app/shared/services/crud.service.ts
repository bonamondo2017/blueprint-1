import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

/*Firebase*/
import { fbDatabase } from './../../../environments/firebase-database.config';

import { environment } from './../../../environments/environment';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class CrudService {
  headersToAuth: Headers;
  optionsToAuth: RequestOptions;
  url = environment.urlToApi;

  constructor(private http: Http) { }

  /*
    CREATE
    Problema:
    Performance tá uma merda porque em cada iteração de elemento está sendo feita uma ação com o firebase
    Porque:
    Para lidar com subchilds suas propriedades e valores dentro da child que está sendo iterada, por exemplo, é preciso alterar a ref para a child, por isso não dá pra simplesmente montar todo o objeto e enviar pra uma mesma ref
    Solução:
    Pensar
  */
  create = (source, params) => new Promise((resolve, reject) => {
    let route: string = params.route;
    
    switch(source) {
      case 'firebase':
        let arr: any;
        let check: any;
        let countChildIteration: number; //Para ver se é a primeira iteração da child e definir se a acão será push ou update
        let keyToUpdate: any;//APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE
        let lastKey: any;
        let lastSubchild: any;
        let obj: any;
        let objectFromSpecificKey: any;
        let ref: any;
        let ref2: any;
        let setKey: boolean;
        
        if(route.length < 1 || route == undefined) { // Verifica se pelo menos uma child foi definida
          reject({
            cod: "c-01",
            message: "Informar erro c-01 ao administrador"
          });
        }
        
        for(let i = 0; i < route.length; i++) { //Ryzzan: child to create i
          check = null;
          countChildIteration = 0;
          //obj = {}; //VOLTAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE
          objectFromSpecificKey = {};
          ref = fbDatabase.ref(route[i]); // Referencia a child onde será inserido o registro
          setKey = true; // Variável boleana responsável por identicar a existência ou não de uma sub-child (child dentro de child)

          for (let k in params.objectToPush){ // Loop que varre todos os campos do formulário
            obj = {}; //APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE
            if(params.objectToPush.hasOwnProperty(k)) {
              check = k.split('_'); // Divide a 'tag' de cada formControl (campos do form) criando um array. Ex.: ['field', '0', 'name']
              if(check[1] == i) { // Verifica se a iteração do formControl (campos do form) corresponde a iteração do loop
                if(check[0] === "field") { // Verifica se o formControl está configurado como um campo simples
                  if(params.objectToPush[k] != undefined) {
                    obj[check[2]] = params.objectToPush[k]; // Insere na variável obj o nome do campo e seu valor
                    /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE INICIO*/
                    if(countChildIteration < 1) {
                      if(setKey) { // Verifica se é a chave principal ou a sub-child
                        let key = ref.push(obj).key; // Cria a chave principal
                        
                        lastKey = {
                          key: key, // Retorna a key do objeto recém criado
                          child: route[i] // Retorna o nome da child principal
                        }

                        keyToUpdate = key;
                      } else {
                        let key = ref.push(obj).key;
                        keyToUpdate = key;
                      }
                    } else {
                      ref2 = fbDatabase.ref(route[i]+"/"+keyToUpdate);
                      ref2.update(obj);
                    }
                    /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE FIM*/
                  }
                }
                
                if(check[0] === "updateFromSpecificKey") { // Identifica o campo como um array de valores dentro da uma child recém criada
                  if(params.objectToPush[k] != undefined || params.objectToPush[k] != ""){
                    if(Array.isArray(params.objectToPush[k]))
                      arr = params.objectToPush[k]; // Cria um array com todos os elementos que serão inseridos dentro da child recém criada
                    else
                      arr = params.objectToPush[k].split(";");
                    for(let j = 0; j < arr.length; j++) { // Loop que varre todos os elementos que serão inseridos dentro da child recém criada
                      ref2 = fbDatabase.ref(lastKey.child+"/"+lastKey.key).child(route[i]); // Referencia a sub-child onde será inserido o registro
                      objectFromSpecificKey[arr[j].__key] = arr[j]; // Inseri na variável objectFromSpecificKey todos os elementos com valor true
                      ref2.update(objectFromSpecificKey); // Cria a sub-child com cada elemento dentro da child principal
                    }
                  }
                  setKey = false; // Identifica a existência de uma sub-child (child dentro de child)
                }

                /* Adicionando subchild na child da iteração atual parar inserir propriedade(s) e valor(es) nela início*/
                if(check[0] === "subchild") { //Flag para a subchild por vir
                  if(params.objectToPush[k] != undefined) {
                    lastSubchild = check[2];
                  }
                }

                if(check[0] === "subchildPropertyAndValue") { //Mordendo a língua sobre a crítica a respeito dos métodos Java
                  if(params.objectToPush[k] != "" && params.objectToPush[k] != null && params.objectToPush[k] != undefined && lastSubchild != undefined) {
                    obj[check[2]] = params.objectToPush[k];

                    /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE INICIO*/
                    if(countChildIteration < 1) {
                      if(setKey) { // Verifica se é a chave principal ou a sub-child
                        ref2 = fbDatabase.ref(route[i]+"/"+lastSubchild);
                        let key = ref2.push(obj).key; // Cria a chave principal
                        
                        lastKey = {
                          key: key, // Retorna a key do objeto recém criado
                          child: route[i] // Retorna o nome da child principal
                        }

                        keyToUpdate = key;
                      } else {
                        let key = ref.push(obj).key;
                        keyToUpdate = key;
                      }
                    } else {
                      ref2 = fbDatabase.ref(route[i]+"/"+keyToUpdate).child(lastSubchild);
                      ref2.update(obj);
                    }
                    /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE FIM*/
                  }
                }

                /* Adicionando subchild na child da iteração atual parar inserir propriedade(s) e valor(es) nela fim*/
                
                /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE INICIO*/
                if(check[0] != "subchild" && (countChildIteration == 0 && params.objectToPush[k] != undefined)) { //Preocupação em não faze o count caso newSubChild seja o primeiro elemento do form
                  countChildIteration ++;
                }
                /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE FIM*/
              }
            }
          }

          /*VOLTAR NO CASO DE RESOLVER MELHORA DA PERFORMANCE INÍCIO*/
          /*if(setKey) { // Verifica se é a chave principal ou a sub-child
            let key = ref.push(obj).key; // Cria a chave principal
            
            lastKey = {
              key: key, // Retorna a key do objeto recém criado
              child: child[i] // Retorna o nome da child principal
            }
          } else {
            ref.push(obj);
          }*/
        /*VOLTAR NO CASO DE RESOLVER MELHORA DA PERFORMANCE FIM*/
        }

        resolve({
          cod: "c-02",
          message: "Cadastro feito com sucesso"//Cadastro feito com sucesso
        });
      break;
      
      case 'laravel':
        let objectToCreate: any = params.objectToCreate;
        
        if(!route) { // Verifica se pelo menos uma child foi definida
          reject({
            cod: "c-01",
            message: "Informar erro c-01 ao administrador"
          });
        }

        this.headersToAuth = new Headers({
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('access_token')
        });

        this.optionsToAuth = new RequestOptions({
          'headers': this.headersToAuth
        })

        this.http
        .post(
          this.url+route,
          objectToCreate,
          this.optionsToAuth
        ).subscribe(res => {
          resolve({
            cod: "c-02",
            message: "Cadastro feito com sucesso"//Cadastro feito com sucesso
          });
        })
      break;

      default:
        console.log("Faltando source")
    }
  })

  readArray = (source, params) => new Promise((resolve, reject) => {
    let hide: any = ""; //E.g.: [field1, field2, field3]
    let route: string = "";
    let show: any = ""; //E.g.: [field1, field2, field3]
    
    switch(source) {
      case 'firebase':  
        let orderByChild = params.orderByChild;
        let equalTo;

        let ref;
        let key;
        let obj;
        let objFiltered = [];
        let objKeys;
        let res;

        if(!params) {
          reject({
            cod: "ra-01",
            message: "Informar erro ra-01 ao administrador"//Checar parâmetros obrigatórios
          });
        }

        if(params.route) {
          route = params.route;                 
        } else {
          reject({
            cod: "ra-03",
            message: "Informar erro ra-03 ao administrador"////É preciso declarar ao menos uma route
          });
        }
        
        if(orderByChild) {
          if(!params.equalTo) {
            reject({
              cod: "ra-04",
              message: "Informar erro ra-04 ao administrador"//É preciso declarar um equalTo referente ao orderByChild
            });
          }

          orderByChild = params.orderByChild;
          equalTo = params.equalTo;
        }
        
        ref = fbDatabase.ref(route);
        
        if(orderByChild) {
          ref
          .orderByChild(orderByChild)
          .equalTo(equalTo)
          .on('value', snap => {
            if(snap.val() != null) {
              res = snap.val();
              key = Object.keys(res);
              
              obj = Object.keys(res).map(k => res[k]); //Tranformando objetos em arrays
              for(let i=0; i<Object.keys(res).length; i++){
                obj[i].__key = key[i];
              }

              if(params.show) {
                for(let i= 0; i < obj.length; i++) {
                  let temp = {};

                  for(let j = 0; j < params.show.length; j++) {
                    temp[params.show[j]] = obj[i][params.show[j]];
                  }

                  /*Object.keys(obj[i])
                  .map(k => {
                    for(let j = 0; j < params.show.length; j++) {
                      if(k == params.show[j]) {
                        temp[k] = obj[i][k];
                      }
                    }
                  })*/
                  objFiltered.push(temp);
                }
                
                obj = objFiltered;
                
                resolve(obj);
              } else {
                resolve(obj);
              }
            }
          })
        } else {
          ref
          .once('value')
          .then(snap => {
            if(snap.val() != null) {
              res = snap.val();
              key = Object.keys(res);
              obj = Object.keys(res).map(k => res[k]); //Tranformando objetos em arrays
              
              for(let i=0; i<Object.keys(res).length; i++){
                obj[i].__key = key[i];
              }
              
              if(params.show) {
                for(let i= 0; i < obj.length; i++) {
                  let temp = {};

                  for(let j = 0; j < params.show.length; j++) {
                    temp[params.show[j]] = obj[i][params.show[j]];
                  }

                  /*Object.keys(obj[i])
                  .map(k => {
                    for(let j = 0; j < params.show.length; j++) {
                      if(k == params.show[j]) {
                        temp[k] = obj[i][k];
                      }
                    }
                  })*/
                  objFiltered.push(temp);
                }
                
                obj = objFiltered;
                console.log(res);
                resolve(obj);
              } else {
                resolve(obj);
              }
            } else {
              resolve({
                cod: "ra-03",
                message: "Nenhum cadastro"//É preciso declarar ao menos um child"
              });
            }
          })
        }
      break;

      case "laravel":
        let apiUrl: string = this.url;
        let objFilteredTemp: any = [];
        let orderBy: any;
        let setGet: string = '';
        let where: any; //E.g.: [[field1, operator1, value1], [field2, operator2, value2], [field3, operator3, value3]]
        
        if(!params) {
          reject({
            cod: "ra-01",
            message: "Informar erro ra-01 ao administrador"//Checar parâmetros obrigatórios
          });
        }

        if(params.show && params.hide) {
          reject({
            cod: "ra-02",
            message: "Informar erro ra-03 ao administrador"//Não pode declarar os dois parâmetros ao mesmo tempo
          });
        }

        if(!params.route) {
          reject({
            cod: "ra-03",
            message: "Informar erro ra-04 ao administrador"//É preciso declarar a rota do serviço
          });
        } else {
          route = params.route;
        }

        if(params.show) {
          setGet = "?";
          show = "show=[";
          
          for(let lim = params.show.length, i =0; i < lim; i++) {
            show += params.show[i]+",";            
          }

          show = show.substring(0, show.length - 1)+"]";
        }

        if(params.hide) {
          setGet = "?";
          hide = "hide=";
          
          for(let lim = params.hide.length, i =0; i < lim; i++) {
            hide += params.hide[i]+",";            
          }

          hide = hide.substring(0, hide.length - 1);
        }
        
        this.headersToAuth = new Headers({
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('access_token')
        });

        this.optionsToAuth = new RequestOptions({
          'headers': this.headersToAuth
        })
        console.log(apiUrl+route+setGet+show);
        this.http
        .get(
          apiUrl+route+setGet+show+hide,
          this.optionsToAuth
        ).subscribe(res => {
          obj = JSON.parse(res['_body']);
          objFiltered = obj.data;
          objKeys = Object.keys(objFiltered);
          
          if(params.show) {
            objFilteredTemp = obj.data;
            objFiltered = [];
            
            for(let lim = objFilteredTemp.length, i =0; i < lim; i++) {
              let temp = {};

              for(let j = 0; j < params.show.length; j++) {
                temp[params.show[j]] = objFilteredTemp[i][params.show[j]];
              }

              objFiltered.push(temp);
            }

            obj = objFiltered;

            resolve({
              obj
            });
          } else {
            obj = objFiltered;
            
            resolve({
              obj
            });
          }
        })
      break;

      default:
        console.log("Faltando source")
    }
  })

  readObject = (source, params) => new Promise((resolve, reject) => {
    switch(source) {
      case 'firebase':
        /*
        RYZZAN
        child: child,
        attributes: [childs.attributes],
        filters:[[orderByChild1][equalTo]],
        limit: [start, finish] //if only one array is set, set start as 1 and the only set value will be finish
        */
        let child;
        let orderByChild;
        let equalTo;

        let ref;
        let key;
        let obj;
        let res;

        if(!params) {
          reject({
            cod: "ro-01",
            message: "Informar erro ro-01 ao administrador"//Checar parâmetros obrigatórios
          });
        }

        if(!params.child) {
          reject({
            cod: "ro-02",
            message: "Informar erro ro-02 ao administrador"//É preciso declarar ao menos um child
          });
        }

        if(params.orderByChild) {
          if(!params.equalTo) {
            reject({
              cod: "ro-03",
              message: "Informar erro ro-03 ao administrador"//É preciso declarar um equalTo referente ao orderByChild
            });
          }

          orderByChild = params.orderByChild;
          equalTo = params.equalTo;
        }
        
        child = params.child;

        ref = fbDatabase.ref(child);

        if(orderByChild) {
          ref
          .orderByChild(orderByChild)
          .equalTo(equalTo)
          .once('value')
          .then(snap => {
            res = snap.val();

            if(res === null) {
              reject({
                cod: "ro-04",
                message: "Nenhum dado gravado na child " + child
              });
            } else {
              key = Object.keys(res);
              obj = Object.keys(res).map(k => res[k]); //Tranformando objetos em arrays
              obj[0].__key = key[0];
              resolve(obj[0]);
            }
          })
        } else {
          ref
          .once('value')
          .then(snap => {
            res = snap.val();
            
            if(res === null) {
              reject({
                cod: "ro-04",
                message: "Nenhum dado gravado na child " + child
              });
            } else {
              key = Object.keys(res);
              obj = Object.keys(res).map(k => res[k]); //Tranformando objetos em arrays
              obj[0].__key = key[0];
              resolve(obj[0]);
            }
          })
        }
      break;

      case 'laravel':
        let apiUrl: string = this.url;
        let route: string = params.route;
        let value: string = params.value;

        if(!route) {
          reject({
            cod: "ro-01",
            message: "Informar erro ro-01 ao administrador"
          });
        }

        if(!value) {
          reject({
            cod: "ro-02",
            message: "Informar erro ro-02 ao administrador"
          });
        }

        this.headersToAuth = new Headers({
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('access_token')
        });

        this.optionsToAuth = new RequestOptions({
          'headers': this.headersToAuth
        })

        this.http
        .get(
          apiUrl+route+"/"+value,
          this.optionsToAuth
        ).subscribe(res => {
          obj = JSON.parse(res['_body']);
          
          resolve({
            obj
          });
        })
      break;

      default:
        console.log("Faltando source");
    }
  })
  
  update = (source, params) => new Promise((resolve, reject) => {
    switch(source) {
      case 'firebase':
        let arr: any;
        let check: any;
        let child: any = params.child;
        let countChildIteration: number;
        let idChildToUpdate: any = params.idChildToUpdate;
        let lastKey: any;
        let lastSubchild: any;
        let obj: any;
        let objectToUpdate: any = params.objectToUpdate;
        let ref: any;
        let ref2: any;
        let setKey: boolean;
        let updateFromSpecificKey: any;

        if(child.length < 1 || child == undefined) { // Verifica se pelo menos uma child foi definida
          reject({
            cod: "u-01",
            message: "Informar erro u-01 ao administrador"
          });
        }

        for(let i = 0; i < child.length; i++) { //child to create in
          if(idChildToUpdate[i]) {
            ref = fbDatabase.ref(child[i]).child(idChildToUpdate[i]); // Referencia a child com o registro que será atualizado
          } 
          
          check = null;
          countChildIteration = 0;
          obj = {};
          setKey = true; // Varável boleana responsável por identicar a existência ou não de uma sub-child (child dentro de child)
          updateFromSpecificKey = {};

          for(let k in objectToUpdate){ // Loop que varre todos os campos do formulário
            if(objectToUpdate.hasOwnProperty(k)) {
              check = k.split('_'); // Divide a 'tag' de cada formControl (campos do form) criando um array. Ex.: ['field', '0', 'name']

              if(check[1] == i) { // Verifica se a iteração do formControl (campos do form) corresponde a iteração do loop
                if(check[0] === "field") { // Verifica se o formControl está configurado como um campo simples
                  if(objectToUpdate[k] != undefined)
                    obj[check[2]] = objectToUpdate[k]; // Inseri na variável obj o nome do campo e seu valor
                }

                if(check[0] === "updateFromSpecificKey") { // Identifica o campo como um array de valores dentro da uma child recém atualizada
                  if(objectToUpdate[k] != undefined){
                    if(Array.isArray(objectToUpdate[k]))
                      arr = objectToUpdate[k]; // Cria um array com todos os elementos que serão inseridos dentro da child recém criada
                    else
                      arr = objectToUpdate[k].split(";");
                    fbDatabase.ref(lastKey.child+"/"+lastKey.key).child(child[i]).remove(); // Apaga todos os registros na sub-child antes de povoá-los com os dados atualizados

                    for(let j = 0; j < arr.length; j++) { // Loop que varre todos os elementos que serão inseridos dentro da child recém atualizada
                      ref2 = fbDatabase.ref(lastKey.child+"/"+lastKey.key).child(child[i]); // Referencia a sub-child onde será inserido o registro
                      updateFromSpecificKey[arr[j]] = 1; // Inseri na variável updateFromSpecificKey todos os elementos com valor true
                      ref2.set(updateFromSpecificKey); // Cria a sub-child com cada elemento dentro da child principal
                    }
                  }
                  setKey = false; // Identifica a existência de uma sub-child (child dentro de child)
                }

                /* Adicionando subchild na child da iteração atual parar inserir propriedade(s) e valor(es) nela início*/
                if(check[0] === "subchild") { //Flag para a subchild por vir
                  if(objectToUpdate[k] != undefined) {
                    lastSubchild = check[2];
                  }
                }

                if(objectToUpdate[k] != undefined && lastSubchild != undefined) {
                  obj[check[2]] = objectToUpdate[k];

                  /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE INICIO*/
                  if(countChildIteration < 1) {
                    if(setKey) { // Verifica se é a chave principal ou a sub-child
                      ref2 = fbDatabase.ref(child[i]+"/"+lastSubchild);
                      let key = ref2.push(obj).key; // Cria a chave principal
                      
                    } else {
                      let key = ref.push(obj).key;
                    }
                  } else {
                    ref2 = fbDatabase.ref(child[i]+"/"+idChildToUpdate[i]).child(lastSubchild);
                    ref2.update(obj);
                  }
                  /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE FIM*/
                }
              }

              /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE INICIO*/
              if(check[0] != "subchild") { //Preocupação em não faze o count caso newSubChild seja o primeiro elemento do form
                countChildIteration ++;
              }
              /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE FIM*/
            }
          }
          if(setKey) { // Verifica se é a chave principal ou a sub-child
            ref.set(obj); // Atualiza a child principal
            lastKey = {
              key: idChildToUpdate[i], // Retorna a key da child principal
              child: child[i] // Retorna o nome da child principal
            }
          } else {
            ref.update(obj);
          }
        }

        resolve({
          cod: "u-02",
          message: "Atualização feita com sucesso" //Atualização feita com sucesso
        });
      break;

      case 'laravel':
        let apiUrl: string = this.url;
        let objectToCreate: any = params.objectToCreate;
        let route: string = params.route;
        let value: string = params.value;

        if(!route) {
          reject({
            cod: "u-01",
            message: "Informar erro u-01 ao administrador"
          });
        }

        if(!value) {
          reject({
            cod: "u-02",
            message: "Informar erro u-02 ao administrador"
          });
        }

        this.headersToAuth = new Headers({
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('access_token')
        });

        this.optionsToAuth = new RequestOptions({
          'headers': this.headersToAuth
        })

        this.http
        .put(
          apiUrl+route+"/"+value,
          objectToCreate,
          this.optionsToAuth
        ).subscribe(res => {
          resolve({
            cod: "u-03",
            message: "Atualização feita com sucesso"
          });
        })
      break;

      default:
        console.log("Faltando source");
    }
  })

  upload = (source, params) => new Promise((resolve, reject) => {
    switch(source) {
      case 'firebase':
        let arr: any;
        let check: any;
        let countChildIteration: number; //Para ver se é a primeira iteração da child e definir se a acão será push ou update
        let keyToUpdate: any;//APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE
        let lastKey: any;
        let lastSubchild: any;
        let obj: any;
        let objectFromSpecificKey: any;
        let ref: any;
        let ref2: any;
        let setKey: boolean;
        
        if(params.child.length < 1 || params.child == undefined) { // Verifica se pelo menos uma child foi definida
          reject({
            cod: "c-01",
            message: "Informar erro c-01 ao administrador"
          });
        }
        
        for(let i = 0; i < params.child.length; i++) { //Ryzzan: child to create i
          check = null;
          countChildIteration = 0;
          //obj = {}; //VOLTAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE
          objectFromSpecificKey = {};
          ref = fbDatabase.ref(params.child[i]); // Referencia a child onde será inserido o registro
          setKey = true; // Variável boleana responsável por identicar a existência ou não de uma sub-child (child dentro de child)

          for (let k in params.objectToPush){ // Loop que varre todos os campos do formulário
            obj = {}; //APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE
            if(params.objectToPush.hasOwnProperty(k)) {
              check = k.split('_'); // Divide a 'tag' de cada formControl (campos do form) criando um array. Ex.: ['field', '0', 'name']
              if(check[1] == i) { // Verifica se a iteração do formControl (campos do form) corresponde a iteração do loop
                if(check[0] === "field") { // Verifica se o formControl está configurado como um campo simples
                  if(params.objectToPush[k] != undefined) {
                    obj[check[2]] = params.objectToPush[k]; // Insere na variável obj o nome do campo e seu valor
                    /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE INICIO*/
                    if(countChildIteration < 1) {
                      if(setKey) { // Verifica se é a chave principal ou a sub-child
                        let key = ref.push(obj).key; // Cria a chave principal
                        
                        lastKey = {
                          key: key, // Retorna a key do objeto recém criado
                          child: params.child[i] // Retorna o nome da child principal
                        }

                        keyToUpdate = key;
                      } else {
                        let key = ref.push(obj).key;
                        keyToUpdate = key;
                      }
                    } else {
                      ref2 = fbDatabase.ref(params.child[i]+"/"+keyToUpdate);
                      ref2.update(obj);
                    }
                    /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE FIM*/
                  }
                }
                
                if(check[0] === "updateFromSpecificKey") { // Identifica o campo como um array de valores dentro da uma child recém criada
                  if(params.objectToPush[k] != undefined || params.objectToPush[k] != ""){
                    if(Array.isArray(params.objectToPush[k]))
                      arr = params.objectToPush[k]; // Cria um array com todos os elementos que serão inseridos dentro da child recém criada
                    else
                      arr = params.objectToPush[k].split(";");
                    for(let j = 0; j < arr.length; j++) { // Loop que varre todos os elementos que serão inseridos dentro da child recém criada
                      ref2 = fbDatabase.ref(lastKey.child+"/"+lastKey.key).child(params.child[i]); // Referencia a sub-child onde será inserido o registro
                      objectFromSpecificKey[arr[j].__key] = arr[j]; // Inseri na variável objectFromSpecificKey todos os elementos com valor true
                      ref2.update(objectFromSpecificKey); // Cria a sub-child com cada elemento dentro da child principal
                    }
                  }
                  setKey = false; // Identifica a existência de uma sub-child (child dentro de child)
                }

                /* Adicionando subchild na child da iteração atual parar inserir propriedade(s) e valor(es) nela início*/
                if(check[0] === "subchild") { //Flag para a subchild por vir
                  if(params.objectToPush[k] != undefined) {
                    lastSubchild = check[2];
                  }
                }

                if(check[0] === "subchildPropertyAndValue") { //Mordendo a língua sobre a crítica a respeito dos métodos Java
                  if(params.objectToPush[k] != "" && params.objectToPush[k] != null && params.objectToPush[k] != undefined && lastSubchild != undefined) {
                    obj[check[2]] = params.objectToPush[k];

                    /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE INICIO*/
                    if(countChildIteration < 1) {
                      if(setKey) { // Verifica se é a chave principal ou a sub-child
                        ref2 = fbDatabase.ref(params.child[i]+"/"+lastSubchild);
                        let key = ref2.push(obj).key; // Cria a chave principal
                        
                        lastKey = {
                          key: key, // Retorna a key do objeto recém criado
                          child: params.child[i] // Retorna o nome da child principal
                        }

                        keyToUpdate = key;
                      } else {
                        let key = ref.push(obj).key;
                        keyToUpdate = key;
                      }
                    } else {
                      ref2 = fbDatabase.ref(params.child[i]+"/"+keyToUpdate).child(lastSubchild);
                      ref2.update(obj);
                    }
                    /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE FIM*/
                  }
                }

                /* Adicionando subchild na child da iteração atual parar inserir propriedade(s) e valor(es) nela fim*/
                
                /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE INICIO*/
                if(check[0] != "subchild" && (countChildIteration == 0 && params.objectToPush[k] != undefined)) { //Preocupação em não faze o count caso newSubChild seja o primeiro elemento do form
                  countChildIteration ++;
                }
                /*APAGAR NO CASO DE RESOLVER A SITUAÇÃO DE MELHORA DA PERFORMANCE FIM*/
              }
            }
          }

          /*VOLTAR NO CASO DE RESOLVER MELHORA DA PERFORMANCE INÍCIO*/
          /*if(setKey) { // Verifica se é a chave principal ou a sub-child
            let key = ref.push(obj).key; // Cria a chave principal
            
            lastKey = {
              key: key, // Retorna a key do objeto recém criado
              child: child[i] // Retorna o nome da child principal
            }
          } else {
            ref.push(obj);
          }*/
        /*VOLTAR NO CASO DE RESOLVER MELHORA DA PERFORMANCE FIM*/
        }

        resolve({
          cod: "c-02",
          message: "Cadastro feito com sucesso"//Cadastro feito com sucesso
        });
      break;
      
      case 'laravel':
        let apiUrl: string = this.url;
        let objectToCreate: any = params.objectToCreate;
        let route: string = params.route;
        
        if(!route) { // Verifica se pelo menos uma child foi definida
          reject({
            cod: "u-01",
            message: "Informar erro c-01 ao administrador"
          });
        }

        this.headersToAuth = new Headers({
          'Authorization': sessionStorage.getItem('access_token')
        });

        this.optionsToAuth = new RequestOptions({
          'headers': this.headersToAuth
        })

        this.http
        .post(
          apiUrl+route,
          objectToCreate,
          this.optionsToAuth
        ).subscribe(res => {
          resolve({
            cod: "u-02",
            message: "Upload feito com sucesso"
          });
        })
      break;

      default:
        console.log("Faltando source")
    }
  })
  
  delete = (child: any, idChildToDelete: any, childRelated: any, ...params) => new Promise((resolve, reject) => {
    let ref: any;
    let ref2: any;
    let check: any;
    
    if(child.length < 1 || child == undefined) {
      reject({
        cod: "c-01",
        message: "Informar erro c-01 ao administrador"
      });
    }
    
    for(let i = 0; i < child.length; i++) { //child to delete in
      ref = fbDatabase.ref(child[i]);
      if(childRelated) { // Verifica se existem child que se relacionam com a child a ser excluída
        for(let j = 0; j < childRelated.length; j++) { // loop que varre todas as childs que se relacionam com a child a ser excluída
          check = childRelated[j].split('_'); // Ex.: Tranforma a child "0_productsClass" em ['0','productsClass']
          
          if(check[1] == i) { // Verifica se a child relacionada refere-se a child a ser excluída
            ref2 = fbDatabase.ref(check[2]); // referencia a child que child a ser excluída está relacionada
            ref2.orderByKey().once("value").then(res => { // loop que varre todas childs em busca da child a ser excluída
              res.forEach(childRes => { 
                let childIntoChild = childRes.hasChild(child[i] + "/" + idChildToDelete); // true = child tem relação || false = child não tem relação
                if(childIntoChild){
                  ref2.child(childRes.key).child(child[i] + "/" + idChildToDelete).remove(); // Deleta a relação
                }
              })
            })
          }
        }
      }
      
      ref.child(idChildToDelete).remove();
      
      /*ref
      .once('value')
      .then(snap => {
      }*/
    }
    
    resolve({
      crudMessage: {
        cod: "d-01",
        message: "Remoção feita com sucesso"
      }
    });
    
  }) 
}