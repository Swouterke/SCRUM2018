

var oFouten = {
	required:{
		msg: "verplicht veld",
		test: function(elem){
			return elem.value != "";
		}
		
	},
	volwassen:{
		msg: 'U moet 18 jaar',
		test: function(elem){
			//controleer als leeftijd 18+ is
			
			//haal jaar,maand en dag uit elem value
			var aDatum = elem.value.split('-');
			var nGebJaar = parseInt(aDatum[0]);
			var nGebMaand = parseInt(aDatum[1]);
			var nGebDag = parseInt(aDatum[2]);
			
			
			//console.log( nGebJaar + ' ' + nGebMaand + ' ' + nGebDag);
			
			//maak datum geboortedatum + 18 jaar 
			var minGebDat = new Date();
			minGebDat.setFullYear(nGebJaar+18,nGebMaand,nGebDag);
			
			var vandaag = new Date();
			if( minGebDat > vandaag){
				return false;	
			}
			else{
				return true;
			}
		}
	},
	email:{
		msg: 'email niet geldig',
		test: function(elem){
			/*controle op geldig email adres */
			var reg = new RegExp( /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
			if( elem.value != ""){
				return reg.test(elem.value);
			}
			else{
				return true;
			}
		}
	},
	getal:{
		msg: 'geen geldig getal',
		test: function(elem){
			/*controleert of value van element een getal is*/
			if( elem.value != ""){
				return !isNaN(elem.value) && elem.value > 0;
			}
			else{
				return true;
			}
		}
	},
	matchPass:{
		msg: 'wachtwoorden niet gelijk',
		test: function(elem){
			/* verglijkt value van een elem met de value van een element #paswoord */
			if(elem.value != ""){
				var sPass1 = document.getElementById('paswoord');
				if(elem.value !== sPass1.value){
					return false;
				}
			}
			return true;
		}		
	}
}

/*test code
window.onload = function(){
	
	var eBtnValideer = document.querySelector('#btnValideer');
	var eFrm = document.querySelector('#formke');
	
	eBtnValideer.addEventListener('click', function(e){
		e.preventDefault();
		valideerForm(eFrm);		
	});
	
	
}
*/


function valideerForm(eFrm){
/*
valideert alle elementen in een formulier 
@eFrm: dom form element  , te valideren formulier
@return false|true  , true als alle elementen valideren anders false
*/
	
	var bValid = true;
	
	for(var i=0; i<eFrm.length; i++){
		//vaideer veld
		var bVeld = valideerVeld(eFrm.elements[i]);
		
		//veld niet valid dan form niet valid
		if( bVeld === false ){
			bValid = false;
		}
	}
	
	return bValid;
}

function valideerVeld(elem){
/*
valideert de value van een element aan de hand van zijn classname
@elem : dom element , te valideren element
@oFouten : GLOBAL  ,object met validatieregels
@return: true|false  , true als value van element valideert anders false
*/	

	var aFoutBoodschappen = [];
	
	for( fout in oFouten){
		//maak regex met validatieregel
		var reg = new RegExp("(^|\\s)" + fout + "(\\s|$)");
		var bTest = true;
		// validatieregl aanwezig in classname
		if( reg.test(elem.className)){
			var bTest = oFouten[fout].test(elem);
			//console.log('element %s met naam %s valideert %s voor %s',elem.nodeName,elem.name,bTest,fout);
		}
		
		if(bTest === false){
			aFoutBoodschappen.push(oFouten[fout].msg);			
		}
		
	}
	
	//als er foutboodschappen zijn, toon ze
	if(aFoutBoodschappen.length > 0){
		showErrors(elem, aFoutBoodschappen);
		return false;
	}
	
	//wis vorige foutboodschappen
	hideErrors(elem);
	return true;
}

function showErrors(elem, aFoutBoodschappen){
/*
toont foutmelding in  label.fout(nextChild) 	
@elem: dom elem 
@aFoutBoodschappen : array of string , te tonen foutboodschappen
*/
	
	var eNextElem = elem.nextSibling;
	var sFoutboodschap = "";
	for(var i =0 ; i < aFoutBoodschappen.length; i++){
		sFoutboodschap = sFoutboodschap + aFoutBoodschappen[i] + " ";	
	}
	
	if( !eNextElem || !(eNextElem.className == 'fout' && eNextElem.nodeName == 'LABEL') ){
		//maak element aan voor foutboodschap
		eFout = document.createElement('label');
		eFout.className = "fout";
		eFout.innerHTML = sFoutboodschap;
		elem.parentNode.insertBefore(eFout,eNextElem);
		
	}
	else{
		//als er reeds foutboodschap is, pas inhoud aan
		eNextElem.innerHTML = sFoutboodschap;
	}
}

function hideErrors(elem){
/*
wist foutboodschappen voor element
*/	
	var eNextElem = elem.nextSibling;
	
	if( eNextElem && (eNextElem.className == 'fout' && eNextElem.nodeName == 'LABEL')){
		//label voor foutboodschap bestaat
		elem.parentNode.removeChild(eNextElem);
	}
}


