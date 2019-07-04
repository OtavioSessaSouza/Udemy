class CalcController{
    constructor(){
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
    }
    addEventListenerALL(element, events,fn){
        events.split(' ').forEach(event =>{
            element.addEventListener(event,fn,false);
        });
    }
    clearAll(){
        this._operation = []; 
    }
    clearEntry(){//remove o ultimo elemento de um array
        this._operation.pop();
    }
    addOperation(val){
        this._operation.push(val);
        console.log("assim:",this._operation);
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
                break;
            case 'divisao':
                break;
            case 'multiplicacao':
                break;
            case 'porcento':
                break;
            case 'igual':
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
        this._displayCalc=val;
    }
    get currentDate(){
        return new Date();
    }
    currentTime(){
        let data=new Date();
        let hour = data.getHours();
        let minute=data.getMinutes();
        let seconds=data.getSeconds();
        if (seconds<'10'){
            seconds=[0+seconds];
        }
        let temp=[hour+":"+minute+":"+seconds];
        return temp;
    }
    set currentDate(val){
        this._currentDate=val;
    }
}