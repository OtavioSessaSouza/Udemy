class CalcController{
    constructor(){
        this._lastOperator='';
        this._lastNumber='';
        this._operation=[];
        this._locale = 'pt-BR'
        this._displayCalcEL = document.querySelector("#display");
        this._dateEL = document.querySelector("#data");
        this._timeEL = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }
    get displayTime(){
        return this._timeEL.innerHTML;
    }
    set displayTime(val){
        return this._timeEL.innerHTML=val;
    }
    get displayDate(){
        return this._dateEL.innerHTML;
    }
    set displayDate(val){
        return this._dateEL.innerHTML=val;
    }
    initialize(){
        this.setDisplayDateTime();
        setInterval(()=>{
            this.setDisplayDateTime();        
        },1000);
        this.setLastNumberToDisplay();
    }
    addEventListenerALL(element, events,fn){
        events.split(' ').forEach(event =>{
            element.addEventListener(event,fn,false);
        });
    }
    clearAll(){
        this._operation = []; 
        this.setLastNumberToDisplay();
    }
    clearEntry(){//talvez mude
        this._operation.pop();//remove o ultimo elemento de um array
        this.setLastNumberToDisplay();
    }
    getLastOperation(){
        return this._operation[this._operation.length-1];
    }
    setLastOperation(val){
        this._operation[this._operation.length-1] = val;
    }
    isOperator(val){
        return ['+','-','*','/','%'].indexOf(val);
    }
    pushOperation(val){
        this._operation.push(val);
        if(this._operation.length>3){
            this.calc();
        }
    }
    getResult(){
        return eval(this._operation.join(""));
    }
    calc(){
        let last='';
        let result;
        this._lastOperator = this.getLastItem();
        if(this._operation.length<3){
            let fristItem=this._operation[0];
            this._operation=[fristItem,this._lastOperator,this._lastNumber];
        }
        if(this._operation.length>3){
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        }else if(this._operation.length==3){
            this._lastNumber = this.getLastItem(false);
        }
        result = this.getResult();
        if (last == '%') {
            result/=100;
            this._operation=[result];
        }
        else{
            this._operation=[result];
            if(last!=''){
                this._operation.push(last);
            }
        }
        
        this.setLastNumberToDisplay();

    }
    getLastItem(isOperator = true){
        let lastItem='';
        for(let i=this._operation.length-1; i>=0;i--){
            if(isOperator==true){
                if(this.isOperator(this._operation[i])>=0){
                lastItem=this._operation[i];
                break;
                }
            }else{
                if(this.isOperator(this._operation[i])<0){
                    lastItem=this._operation[i];
                    break;
                }   
            }
        }
        if(lastItem==''){
            lastItem=(isOperator) ? this._lastOperator : this._lastNumber;//(condição) ? caso sim : caso nao; 
        }
        return lastItem;
    }
    setLastNumberToDisplay(){
        let lastNumber=this.getLastItem(false);
        if (!lastNumber){
            lastNumber=0;
        }
        this.displayCalc=lastNumber;
    }
    addOperation(val){
        if(isNaN(this.getLastOperation())){
            //string
            if(this.isOperator(val)>-1){
                //trocar operador
                this.setLastOperation(val);

            }else if(isNaN(val)){
                //transforma em float ou add operador
                console.log("sla",val);
            }else{
                //numero
                this.pushOperation(val);
                this.setLastNumberToDisplay();
            }
        }else{
            if(this.isOperator(val)>-1){
                this.pushOperation(val);
            }
            else{
                //number
                let newval = this.getLastOperation().toString() +val.toString();
                this.setLastOperation(newval);
                this.setLastNumberToDisplay();

            }
        }
    }
    setError(){
        this.displayCalc="Error";
    }
    execBtn(val){
        switch(val){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'ponto':
                break;
            case 'igual':
                this.calc();            
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(val));
                break;
            default:
                this.setError();
                break;
        }
    }
    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((btn,index) => {
            btn.style.cursor = "pointer";
            this.addEventListenerALL(btn,"click drag",e =>{
                let textBtn = btn.className.baseVal.replace("btn-","");
                this.execBtn(textBtn);
            });
        });
    }
    setDisplayDateTime(){
        this.displayDate = this.currentDate.toDateString(this.locale);
        this.displayTime = this.currentTime();
    }
    get displayCalc(){
        return this._displayCalcEL.innerHTML;
    }
    set displayCalc(val){
        this._displayCalcEL.innerHTML=val;
    }
    get currentDate(){
        return new Date();
    }
    currentTime(){
        let data=new Date();
        let hour = data.getHours();
        let minute=data.getMinutes();
        let seconds=data.getSeconds();
        if (parseInt(seconds)<10){
            seconds='0'+seconds.toString();
        }
        if (parseInt(minute)<10){
            minute='0'+minute.toString();
        }
        if (parseInt(hour)<10){
            hour='0'+hour.toString();
        }
        let temp=[hour+":"+minute+":"+seconds];
        return temp;
        
    }
    set currentDate(val){
        this._currentDate=val;
    }
}