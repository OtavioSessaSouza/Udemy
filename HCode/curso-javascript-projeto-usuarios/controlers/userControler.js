class UserControler{
    constructor(formId,tableEl){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableEl);
        this.onSubmit();
    }
    onSubmit(){
        this.formEl.addEventListener("submit", (event) => {
            event.preventDefault();
            this.addLine(this.getValues());
        })
    }
    getValues(){
        let user = {};
        this.formEl.elements.forEach(function(fields,index){
            if(fields.name =="gender"){
                if(fields.checked){
                    user[fields.name] = fields.value;
                }
            }else{
                user[fields.name] = fields.value;
            }
            //console.log(fields.id, fields.name, fields.value, fields.checked, index);
        });
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
        console.log(dataUser);
        document.getElementById(this.tableEl).innerHTML = `
            <tr>
                <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${dataUser.admin}</td>
                <td>${dataUser.birth}</td>
                <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>
        `;
    }
}