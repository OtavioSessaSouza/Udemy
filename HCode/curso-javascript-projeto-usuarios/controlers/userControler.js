class UserControler{
    constructor(formId,tableEl){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableEl);
        this.onSubmit();
    }
    onSubmit(){
        this.formEl.addEventListener("submit", (event) => {
            event.preventDefault();
            let values = this.getValues();
            let btnState = this.formEl.querySelector("[type=submit]");

            btnState.disabled = true;

            this.getPhoto().then(
                (content)=>{
                    values.photo = content;
                    this.addLine(values);
                    this.formEl.reset();
                    btnState.disabled = false;
                },
                (e)=>{
                    console.error(e);
                }
            );
        })
    }
    getPhoto(){
        return new Promise((resolve, reject)=>{
            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item=>{
                if(item.name === "photo"){
                    return item;
                }
            });
    
            let file = elements[0].files[0];
    
            fileReader.onload=() =>{
                resolve(fileReader.result);
            };
            fileReader.onerror=(e)=>{
                reject(e);
            };
            if(file){
                fileReader.readAsDataURL(file);
            }
            else{
                resolve("dist/img/boxed-bg.jpg");
            }
            

        })

    }
    getValues(){
        let user = {};
        let validUser = true;

        [...this.formEl.elements].forEach(function(fields){

            if ((["name","email","password"]).indexOf(fields.name) > -1 && !fields.value ){
                fields.parentElement.classList.add("has-error");
                validUser = false;
            }

            if(fields.name == "gender"){
                if(fields.checked){
                    user[fields.name] = fields.value;
                }
            }else if(fields.name == "admin"){
                user[fields.name] = fields.checked;
            }
            else{
                user[fields.name] = fields.value;
            }
            //console.log(fields.id, fields.name, fields.value, fields.checked, index);
        });
        if (!validUser) {
            return false;
        }
        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin);
    }

    addLine(dataUser){

        let tr = document.createElement("tr");

        tr.innerHTML= `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
            <td>${Utils.dateFormat(dataUser._registerDate)}</td>
            <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;
        this.tableEl.appendChild(tr);
    }
}