class CalcController{
    constructor(){
        this._audio = new Audio('click.mp3');
        this._audioOnOff=false;
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
        this.iniKeyboard();
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
    pasteFromClipboard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
        })
    }
    copyToClipboard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();

    }
    initialize(){
        this.setDisplayDateTime();
        setInterval(()=>{
            this.setDisplayDateTime();        
        },1000);
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();
        document.querySelectorAll('.btn-ac').forEach(btn => { 
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            });
        });
    }
    toggleAudio(){
        this._audioOnOff=!this._audioOnOff;
    }
    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }
    iniKeyboard(){
        document.addEventListener('keyup',e=>{
        this.playAudio();
            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '/':
                case '*':
                case '%':
                case '-':
                    this.addOperation(e.key);
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
                case 'Enter':
                case '=':
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
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }
        })
    }
    addEventListenerALL(element, events,fn){
        events.split(' ').forEach(event =>{
            element.addEventListener(event,fn,false);
        });
    }
    clearAll(){
        this._operation = [];
        this._lastNumber='';
        this._lastOperator='';
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
    setOperationZero(){
        this._operation=[];
    }
    getResult(){
        try {
            return eval(this._operation.join(""));            
        } catch (error) {
            setTimeout(()=>{
                this.setError();
                this.setOperationZero();
            },1);
        }
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
    addDot(){
        let lastOperation = this.getLastOperation();
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.')>-1){
            return;
        }
        if (!lastOperation || (this.isOperator(lastOperation)>-1)){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();
    }
    setError(){
        this.displayCalc="Error";
    }
    execBtn(val){
        this.playAudio();
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
                this.addDot();
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
                this.addOperation(val);
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