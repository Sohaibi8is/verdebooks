function employeeCardHtml(data){
    var location=data.availableVacations
    if(data.availableVacations=="null"){location="-"}
    html="<div onclick='employeeProfile(this)' style='cursor:pointer;' id='"+data.id+"' class='employeeCard'>"+
    "<div>"+data.name+"</div>"+
    "<div>"+data.payrate+"</div>"+
    "<div>"+data.paymentMethod+"</div>"+
    "<div>"+location+"</div>"+
    "<div>"+data.status+"</div>"+
    "</div>"
    return html
}
function employees(){
    var $row=$("#employees")
    $.ajax({
        url:"https://addats.com:7890/api/employee",
        type:"GET",
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(data){
            $.each(data,function(i,item){
                $.each(this,function(j,item){
                    console.log(item)
                    var html=employeeCardHtml(item);
                    $row.append(html);
                })
            })
        }
    })
}
function addEmployee(){
    window.location.href="addEmployee.html"
}
function submitEmployeeDetails(){
    var temp1=document.getElementById("firstName").value;
    var temp2=document.getElementById("mi").value;
    var temp3=document.getElementById("lastName").value;
    var temp4=document.getElementById("hireDate").value;
    var temp5=document.getElementById("email").value;
    var temp6=document.getElementById("payDate").value;
    var temp7=document.getElementById("payPer").value;
    var temp8=document.getElementById("payRate").value;
    var temp9=document.getElementById("defaultHours").value;
    var temp10=document.getElementById("vacationPolicy").value;
    data=[temp1,temp2,temp3,temp4,temp5,temp6,temp7,temp8,temp9,temp10]
    var temp11=document.getElementById("taxExemptionsSlip").value;
    var temp12=document.getElementById("provinceTaxSlip").value;
    var temp13=document.getElementById("additionalTaxAmountSlip").value;
    var temp14=document.getElementById("federalTD1AmmountSlip").value;
    var temp15=document.getElementById("postalCodeSlip").value;
    var temp16=document.getElementById("provinceSlip").value;
    var temp17=document.getElementById("townSlip").value;
    var temp18=document.getElementById("sinSlip").value;
    var temp19=document.getElementById("countryOfPaymentResidenceSlip").value;
    var temp20=document.getElementById("homeAddressSlip").value;
    var temp21=document.getElementById("employeeNumberSlip").value;
    var temp22=document.getElementById("dateOfBirthSlip").value;
    var temp23=document.getElementById("miSlip").value;
    var temp24=document.getElementById("lastNameSlip").value;
    var temp25=document.getElementById("firstNameSlip").value;
    data2=[temp11,temp12,temp13,temp14,temp15,temp16,temp17,temp18,temp19,temp20,temp21,temp22,temp23,temp24,temp25]
    data2=data2.reverse();
    $.ajax({
        url:"https://addats.com:7890/api/addEmployee/"+data+"/"+data2,
        type:"GET",
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(data){
            alert("Employee Added");
            window.location.href="index.html";
        }
    });
}
function employeeProfile(param){
    var id=param.id;
    id=id.replace("emp","")
    localStorage.setItem("employeeId",id)
    window.location.href="employeeProfile.html"
}
function employeeProfileData(){
    var id=localStorage.getItem("employeeId");
    $.ajax({
        url:"https://addats.com:7890/api/employeeProfile/"+id,
        type:"GET",
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(data){
            console.log(data);
                $.each(data,function(j,item){
                    document.getElementById("employeeName").innerHTML=item[0].toUpperCase();
                    document.getElementById("employeeEmail").innerHTML=item[1]
                    localStorage.setItem("employeeName",item[0].toUpperCase())
                    localStorage.setItem("employeeEmail",item[1])
                    document.getElementById("jobTitle").innerHTML=item[19]
                    document.getElementById("hiredDate").innerHTML=item[18]
                    document.getElementById("status").innerHTML=item[16]
                    document.getElementById("id").innerHTML=item[15]
                    document.getElementById("notes").innerHTML=item[14]
                    document.getElementById("gender").innerHTML=item[13]
                    document.getElementById("dob").innerHTML=item[12]
                    document.getElementById("address").innerHTML=item[11]
                    document.getElementById("contribution").innerHTML=item[10]
                    document.getElementById("company").innerHTML=item[9]
                    document.getElementById("deduction").innerHTML=item[8]
                    document.getElementById("paymentMethod").innerHTML=item[7]
                    document.getElementById("paySchedule").innerHTML=item[6]
                    document.getElementById("additionalPay").innerHTML=item[5]
                    document.getElementById("payRate").innerHTML=item[4]
                    document.getElementById("sin").innerHTML=item[3]
                    document.getElementById("province").innerHTML=item[20]
                    document.getElementById("federal").innerHTML="null"
                    document.getElementById("taxes").innerHTML=item[2]
                })
        }
    })
}
function checkListCardHtml(data){
    html="<div  class='employeeCard' style='cursor:pointer;' class='employeeCard'>"+
    "<div >"+data.payDate+"</div>"+
    "<div>"+data.name+"</div>"+
    "<div>"+data.totalPay+"</div>"+
    "<div>"+data.netPay+"</div>"+
    "<div  id='"+data.id+"' onclick='goToSlip(this)' style='color:blue;'>"+data.paymentMethod+"</div>"+
    "<div><input type='number' id='chequeNumber"+data.id+"' oninput='enableCheckNumberSave()'></div>"+
    "<div>-</div>"+
    "</div>"
    return html
}
function employeeProfileChequeList(){
    document.getElementById("employeeName").innerHTML=localStorage.getItem("employeeName");
    document.getElementById("employeeEmail").innerHTML=localStorage.getItem("employeeEmail");
    var id=localStorage.getItem("employeeId");
    console.log(id)
    var $row=$("#employeeCheckListTable")
    $.ajax({
        url:"https://addats.com:7890/api/employeeChequeList/"+id,
        type:"GET",
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(data){
            $.each(data,function(i,item){
                $.each(this,function(j,item){
                    console.log(item)
                    var html=checkListCardHtml(item);
                    $row.append(html);
                })
            })
        }
    })
}
function runPayRoll(){
    window.location.href="allChequesList.html"
}
function allEmployeesChequeListHtml(item){
    // name=item.name
    // paymentMethod=item.paymentMethod
    // regPayHours=item.regPayHours
    // otHours=item.otHours
    // vacationPayHours=item.vacationPayHours
    // statHolidayPayHours=item.statHolidayPayHours
    // hours=item.hours
    // memo=item.memo
    // totalHours=item.totalHours
    // totalPay=item.totalPay
    // if(typeof name!="undefined"){}
    // else if(name=="null"){name=""}
    // else{name=""}
    // if(typeof paymentMethod!="undefined"){}
    // else if(paymentMethod=="null"){paymentMethod=""}
    // else{paymentMethod=""}
    // if(typeof regPayHours!="undefined"){}
    // else if(regPayHours=="null"){regPayHours=""}
    // else{regPayHours=""}
    // if(typeof otHours!="undefined"){}
    // else if(otHours=="null"){otHours=""}
    // else{otHours=""}
    // if(typeof vacationPayHours!="undefined"){}
    // else if(vacationPayHours=="null"){vacationPayHours=""}
    // else{vacationPayHours=""}
    // if(typeof hours!="undefined"){}
    // else if(hours=="null"){hours=""}
    // else{hours=""}
    // if(typeof memo!="undefined"){memo=""}
    // else if(memo=="null"){memo=""}
    // else{memo=""}
    // if(typeof totalHours!="undefined"){}
    // else if(totalHours=="null"){totalHours=""}
    // else{totalHours=""}
    // if(typeof totalPay!="undefined"){}
    // else if(totalPay=="null"){totalPay=""}
    // else{totalPay=""}
    // if(typeof statHolidayPayHours!="undefined"){statHolidayPayHours=""}
    // else if(statHolidayPayHours=="null"){statHolidayPayHours=""}
    // else{statHolidayPayHours=""}
    html="<tr id='cheque"+item.id+"'>"+
    "<td><input type='checkbox' id='"+item.id+"' onclick='addCheque(this)'></td>"+
    "<td id='emp"+item.id+"' onclick='employeeProfile(this)' style='cursor:pointer'>"+item.name+"</td>"+
    "<td>"+item.paymentMethod+"</td>"+
    "<td><input onfocus='calculateTotalPay()' id='regPayHours"+item.id+"' type='number' value='0'></td>"+
    "<td><input onfocus='calculateTotalPay()' id='otHours"+item.id+"' type='otHours' value='0'></td>"+
    "<td>"+"4%"+"</td>"+
    '<td><input onfocus="calculateTotalPay()" id="statHolidayPayHours'+item.id+'" type="statHolidayPayHours" value="0"></td>'+
    '<td></td>	'+
    '<td><input onfocus="calculateTotalPay()" id="memo'+item.id+'" type="memo" value="0"></td>'+
    "<td id='totalHours"+item.id+"'>0:00</td>	"+
    "<td id='totalPay"+item.id+"'>$0.00</td>"+
    "</tr>"
    return html
}

function addCheque(param){
    if(localStorage.getItem("cheques")){
        console.log("array exist");
    }
    else{
        var array=[]
        localStorage.setItem("cheques", JSON.stringify(array));
    }
    var cheques= JSON.parse(localStorage.getItem("cheques"));
    console.log(cheques);
    if(document.getElementById(param.id).checked==false){
        const index = cheques.indexOf(param.id);
        if (index > -1) {
          cheques.splice(index,1); // 2nd parameter means remove one item only
        }
    }
    else{
        cheques.push(param.id);
    }
    localStorage.setItem("cheques", JSON.stringify(cheques));
    console.log(localStorage.getItem("cheques"));
    calculateTotalPay();
}

function checkAllCheques(){
    if(localStorage.getItem("cheques")){
        var employeeIds= JSON.parse(localStorage.getItem("allEmployeesIds"));
        $.each(employeeIds,function(i,item){
        document.getElementById(item).checked=false;
        })
       localStorage.removeItem("cheques");
    }
    else{
    var employeeIds= JSON.parse(localStorage.getItem("allEmployeesIds"));
    console.log(employeeIds)
    var cheques=[]
    $.each(employeeIds,function(i,item){
        document.getElementById(item).checked=true;
        cheques.push(item);
    })
    localStorage.setItem("cheques", JSON.stringify(cheques));
    }
    calculateTotalPay();
}

function enableSaveChanges(){
    document.getElementById("saveChanges").style.display="block";
}
function disableSaveChanges(){
    document.getElementById("saveChanges").style.display="none";
}

function getYears(){
    var currentYear=new Date().getFullYear();
    var $yearsList=$("#year")
    for(i=2000;i<=parseInt(currentYear);i++){
         $yearsList.append("<option value='"+i+"'>"+i+"</option>")
    }
}

function clearRunPayRoll(){
    html="<tr>"+
    '<th><input type="checkbox" onclick="checkAllCheques()"></th>'+
    "<th>EMPLOYEE</th>"+
    "<th>PAY METHOD</th>"+
    "<th>REGULAR PAY HRS</th>"+
    "<th>OT HRS</th>"+
    "<th>VACATION PAY HRS</th>"+
    "<th>STAT HOLIDAY PAY HRS</th>"+
    "<th>BONUS</th>"+	
    "<th>MEMO</th>"+
    "<th>TOTAL HRS</th>	"+
    "<th>TOTAL PAY</th>"+
    "</tr>"
    document.getElementById("generatedDates").innerHTML="";
    document.getElementById("employeeCheques").innerHTML=html;
}

function allEmployeesChequeList(){
    localStorage.clear();
    var $list=$("#generatedDates");
    clearRunPayRoll();
    var year=document.getElementById("year").value;
    $.ajax({
        url:"https://addats.com:7890/api/getDates/"+year,
        type:"GET",
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(data){
            console.log(data);
            $.each(data["dateRanges"],function(i,item){
                $list.append("<option value='"+item+"'>"+item+"</item>");
            })
        }
    });
    generateCheques();
}
function generateCheques(){
    document.getElementById("totalPay").innerHTML=0;
    var $row=$("#employeeCheques")
    $.ajax({
        url:"https://addats.com:7890/api/allEmployees",
        type:"GET",
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(data){
            const employeeIds=[];
            $.each(data["response"],function(i,item){
                var html=allEmployeesChequeListHtml(item);
                $row.append(html);
                employeeIds.push(item.id);
            })
            localStorage.setItem("allEmployeesIds", JSON.stringify(employeeIds));
        }
    })
}
function calculateTotalPay(){
    var cheques= JSON.parse(localStorage.getItem("cheques"));
    console.log("test")
    localStorage.setItem("totalPay",0);
    console.log(cheques);
   for(let i=0;i<cheques.length;i++){
        $.ajax({
        url:"https://addats.com:7890/api/getEmployeePayRate/"+cheques[i],
        type:"GET",
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(data){
            var regularHours=document.getElementById("regPayHours"+cheques[i]).value;
            console.log(data);
            var temp=parseInt(regularHours) * parseInt(data["payRate"]) * 7
            console.log(temp)
            var temp2=localStorage.getItem("totalPay");
            var total=parseInt(temp)+parseInt(temp2);
            localStorage.setItem("totalPay",String(total));
            document.getElementById("totalPay").innerHTML=localStorage.getItem("totalPay");
            document.getElementById("totalHours"+cheques[i]).innerHTML=parseInt(regularHours)*7;
            document.getElementById("totalPay"+cheques[i]).innerHTML=temp;
        }
        });
    }
    enableSaveChanges();
}
function allEmployeesChequeListChanges(){
    
}
function goToSlip(param){
    localStorage.setItem("slipId",param.id)
    window.location.href="generateSlip.html"
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function pdfSlip(divId, title){
    var doc = new jsPDF();
    doc.fromHTML(`<html><head><title>${title}</title></head><body>` + document.getElementById(divId).innerHTML + `</body></html>`);
    doc.save('div.pdf');
    window.open('', document.getElementById(divId).toDataURL("image/png"));
}
function generateSlip(){
    var id=localStorage.getItem("slipId");
    $.ajax({
        url:"https://addats.com:7890/api/generateSlip/"+id,
        type:"GET",
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(data){
            console.log(data);
            localStorage.setItem("name",data["response"]["name"]);
            localStorage.setItem("address",data["response"]["address"]);
            localStorage.setItem("town",data["response"]["town"]);
            localStorage.setItem("periodEnd",data["response"]["endDate"]);
            localStorage.setItem("periodStart",data["response"]["beginDate"]);
            localStorage.setItem("payDate","PAY DATE: "+data["response"]["payDate"]);
            localStorage.setItem("payDate2",data["response"]["payDate"]);
            localStorage.setItem("netPay","Net Pay: $"+data["response"]["netPay"]);
            localStorage.setItem("netPay2","$"+data["response"]["netPay"]);
            localStorage.setItem("totalHour",data["response"]["totalHour"]+".00");
            localStorage.setItem("regularPayRate",data["response"]["payRate"]+".00"+" "+data["response"]["payRate"]+".00");
            localStorage.setItem("regularPayRateCurrent",data["response"]["payRate"]*8+".00");
            localStorage.setItem("vacationPayCurrent",data["response"]["VACCurrent"]);
            localStorage.setItem("vacationPayYtd",data["response"]["VACYTD"]+".00");
            localStorage.setItem("statHolidayPayRate",data["response"]["statHolidayPay"]+".00");
            localStorage.setItem("totalTaxCurrent",parseFloat(data["response"]["TotalTaxCurrent"]).toFixed(2));
            localStorage.setItem("totalTaxYtd",parseFloat(data["response"]["TotalTaxYTD"]).toFixed(2));
            localStorage.setItem("totalPay",parseFloat(data["response"]["totalPay"]).toFixed(2));
            localStorage.setItem("totalPayYtd",parseFloat(data["response"]["TotalPayYTD"]).toFixed(2));
            localStorage.setItem("ei",data["response"]["EI"]+".00");
            localStorage.setItem("eiYtd",parseFloat(data["response"]["EIYTD"]).toFixed(2));
            localStorage.setItem("cpp",parseFloat(data["response"]["CPP"]).toFixed(2));
            localStorage.setItem("cppYtd",parseFloat(data["response"]["CPPYTD"]).toFixed(2));
            document.getElementById("name").innerHTML=localStorage.getItem("name");
            document.getElementById("name2").innerHTML=localStorage.getItem("name");
            document.getElementById("address").innerHTML=localStorage.getItem("address");
            document.getElementById("address2").innerHTML=localStorage.getItem("address");
            document.getElementById("town").innerHTML=localStorage.getItem("town");
            document.getElementById("town2").innerHTML=localStorage.getItem("town");
            document.getElementById("periodEnd").innerHTML=localStorage.getItem("periodEnd");
            document.getElementById("periodStart").innerHTML=localStorage.getItem("periodStart");
            document.getElementById("payDate").innerHTML=localStorage.getItem("payDate");
            document.getElementById("payDate2").innerHTML=localStorage.getItem("payDate2");
            document.getElementById("netPay").innerHTML=localStorage.getItem("netPay");
            document.getElementById("netPay2").innerHTML=localStorage.getItem("netPay2");
            document.getElementById("netPay3").innerHTML=localStorage.getItem("netPay2");
            document.getElementById("totalHour").innerHTML=localStorage.getItem("totalHour");
            document.getElementById("regularPayRate").innerHTML=localStorage.getItem("regularPayRate");
            document.getElementById("regularPayRateCurrent").innerHTML=localStorage.getItem("regularPayRateCurrent");
            document.getElementById("regularPayRateYtd").innerHTML=localStorage.getItem("regularPayRateYtd");
            document.getElementById("vacationPayCurrent").innerHTML=localStorage.getItem("vacationPayCurrent");
            document.getElementById("vacationPayYtd").innerHTML=localStorage.getItem("vacationPayYtd");
            document.getElementById("statHolidayPayRate").innerHTML=localStorage.getItem("statHolidayPayRate");
            document.getElementById("statHolidayPayRate").innerHTML=localStorage.getItem("statHolidayPayRate");
            document.getElementById("totalTaxCurrent").innerHTML=localStorage.getItem("totalTaxCurrent");
            document.getElementById("totalTaxYtd").innerHTML=localStorage.getItem("totalTaxYtd");
            document.getElementById("totalPay").innerHTML=localStorage.getItem("totalPay");
            document.getElementById("totalPayYtd").innerHTML=localStorage.getItem("totalPayYtd");
            document.getElementById("ei").innerHTML=localStorage.getItem("ei");
            document.getElementById("eiYtd").innerHTML=localStorage.getItem("eiYtd");
            document.getElementById("cpp").innerHTML=localStorage.getItem("cpp");
            document.getElementById("cppYtd").innerHTML=localStorage.getItem("cppYtd");
            sendData=[data["response"]["name"],data["response"]["name"],data["response"]["address"],data["response"]["address"],data["response"]["town"],data["response"]["town"],data["response"]["endDate"],data["response"]["beginDate"],"PAY DATE: "+data["response"]["payDate"],data["response"]["payDate"],"Net Pay: $"+data["response"]["netPay"],"$"+data["response"]["netPay"],"$"+data["response"]["netPay"],data["response"]["totalHour"]+".00",data["response"]["payRate"]+".00"+" "+data["response"]["payRate"]+".00",data["response"]["payRate"]*8+".00",data["response"]["payRate"]*8+".00",data["response"]["VACCurrent"],data["response"]["VACYTD"]+".00",data["response"]["statHolidayPay"]+".00",data["response"]["statHolidayPay"]+".00",parseFloat(data["response"]["TotalTaxCurrent"]).toFixed(2),parseFloat(data["response"]["TotalTaxYTD"]).toFixed(2),parseFloat(data["response"]["totalPay"]).toFixed(2),parseFloat(data["response"]["TotalPayYTD"]).toFixed(2),data["response"]["EI"]+".00",parseFloat(data["response"]["EIYTD"]).toFixed(2),parseFloat(data["response"]["CPP"]).toFixed(2),parseFloat(data["response"]["CPPYTD"]).toFixed(2)]
            sendData=String(sendData)
            $.ajax({
            url:"https://addats.com:7890/api/generatePDF",
            type:"GET",
            type:"POST",
            data:sendData,
            contentType: 'application/json;charset=UTF-8',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(data){
                console.log(data);
            }
            })
            window.print();
            //pdfSlip("stub", "");
            // document.getElementById("name").innerHTML=data["response"]["name"];
            // document.getElementById("name2").innerHTML=data["response"]["name"];
            // document.getElementById("address").innerHTML=data["response"]["address"];
            // document.getElementById("address2").innerHTML=data["response"]["address"];
            // document.getElementById("town").innerHTML=data["response"]["town"];
            // document.getElementById("town2").innerHTML=data["response"]["town"];
            // document.getElementById("periodEnd").innerHTML=data["response"]["endDate"];
            // document.getElementById("periodStart").innerHTML=data["response"]["beginDate"];
            // document.getElementById("payDate").innerHTML="PAY DATE: "+data["response"]["payDate"];
            // document.getElementById("payDate2").innerHTML=data["response"]["payDate"];
            // document.getElementById("netPay").innerHTML="Net Pay: $"+data["response"]["netPay"];
            // document.getElementById("netPay2").innerHTML="$"+data["response"]["netPay"];
            // document.getElementById("netPay3").innerHTML="$"+data["response"]["netPay"];
            // document.getElementById("totalHour").innerHTML=data["response"]["totalHour"]+".00";
            // document.getElementById("regularPayRate").innerHTML=data["response"]["payRate"]+".00"+" "+data["response"]["payRate"]+".00";
            // document.getElementById("regularPayRateCurrent").innerHTML=data["response"]["payRate"]*8+".00";
            // document.getElementById("regularPayRateYtd").innerHTML=data["response"]["payRate"]*8+".00";
            // document.getElementById("vacationPayCurrent").innerHTML=data["response"]["VACCurrent"];
            // document.getElementById("vacationPayYtd").innerHTML=data["response"]["VACYTD"]+".00";
            // document.getElementById("statHolidayPayRate").innerHTML=data["response"]["statHolidayPay"]+".00";
            // document.getElementById("statHolidayPayRate").innerHTML=data["response"]["statHolidayPay"]+".00";
            // document.getElementById("totalTaxCurrent").innerHTML=parseFloat(data["response"]["TotalTaxCurrent"]).toFixed(2);
            // document.getElementById("totalTaxYtd").innerHTML=parseFloat(data["response"]["TotalTaxYTD"]).toFixed(2);
            // document.getElementById("totalPay").innerHTML=parseFloat(data["response"]["totalPay"]).toFixed(2);
            // document.getElementById("totalPayYtd").innerHTML=parseFloat(data["response"]["TotalPayYTD"]).toFixed(2);
            // document.getElementById("ei").innerHTML=data["response"]["EI"]+".00";
            // document.getElementById("eiYtd").innerHTML=parseFloat(data["response"]["EIYTD"]).toFixed(2);
            // document.getElementById("cpp").innerHTML=parseFloat(data["response"]["CPP"]).toFixed(2);
            // document.getElementById("cppYtd").innerHTML=parseFloat(data["response"]["CPPYTD"]).toFixed(2);
        }
    })
}
function saveChanegesAllEmployeeChequeList(){
    var generatedDates=document.getElementById("generatedDates").value;
    var year=document.getElementById("year").value;
    var ids=JSON.parse(localStorage.getItem("cheques"));
    for(i=1;i<=ids.length;i++){
        var regPayHours=document.getElementById("regPayHours"+i).value;
        var otHours=document.getElementById("otHours"+i).value;
        var statHolidayPayHours=document.getElementById("statHolidayPayHours"+i).value;
        var memo=document.getElementById("memo"+i).value;
        data=[year,"^$^"+generatedDates,"^$^"+String(i),"^$^"+regPayHours,"^$^"+otHours,"^$^"+statHolidayPayHours,"^$^"+memo];
        console.log()
        $.ajax({
            url:"https://addats.com:7890/api/generateEmployeeCheque/"+data,
            type:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            success:function(data){
                console.log(data);
                document.getElementById("saveChanges").style.display="none";
            }
        })
    }
}

function GetElementInsideContainer(containerID, tag) {
    var elm = [];
    var div = document.getElementById(containerID);
    var divs = div.getElementsByTagName(tag);
    var divArray = [];
    for (var i = 0; i < divs.length; i += 1) {
    elm.push(divs[i].id);
    }
    return elm;
}
function editEmployeeProfile(){
    window.location.href="editEmployee.html";
}
function getEmployeeInfo(){
    var id=localStorage.getItem("employeeId");
    $.ajax({
        url:"https://addats.com:7890/api/employeeInfo/"+id,
        type:"GET",
        headers:{'Content-Type': 'application/json'},
        success:function(data){
            $.each(data["response"],function(i,item){
                // document.getElementById("payDate").value=item.payDate
                document.getElementById("hireDate").value=item.hiredDate
                document.getElementById("lastName").value=item.lastName
                document.getElementById("mi").value=item.mi
                document.getElementById("firstName").value=item.name
                document.getElementById("vacationPolicy").value=item.vacPolicy
                document.getElementById("defaultHours").value=item.hours
                document.getElementById("payRate").value=item.payRate
                console.log(item)
            })
            $.each(data["response2"],function(i,item){
                console.log(item)
                document.getElementById("taxExemptionsSlip").value=item.taxExemptions;
                document.getElementById("provinceTaxSlip").value=item.provinceTax;
                document.getElementById("additionalTaxAmountSlip").value=item.additionalTax;
                document.getElementById("federalTD1AmmountSlip").value=item.tdi;
                document.getElementById("postalCodeSlip").value=item.postalCode;
                document.getElementById("provinceSlip").value=item.province;
                document.getElementById("townSlip").value=item.town;
                document.getElementById("sinSlip").value=item.sin;
                document.getElementById("countryOfPaymentResidenceSlip").value=item.country;
                document.getElementById("homeAddressSlip").value=item.homeAddress
                document.getElementById("employeeNumberSlip").value=item.employeeNumber
                document.getElementById("dateOfBirthSlip").value=item.dob
                document.getElementById("miSlip").value=item.mi
                document.getElementById("lastNameSlip").value=item.lastName
                document.getElementById("firstNameSlip").value=item.firstName
            })
        }
    })
}
function editEmployeeDetails(){
    var id=localStorage.getItem("employeeId");
    var temp1=document.getElementById("firstName").value;
    var temp2=document.getElementById("mi").value;
    var temp3=document.getElementById("lastName").value;
    var temp4=document.getElementById("hireDate").value;
    var temp5=document.getElementById("email").value;
    var temp6=document.getElementById("payDate").value;
    var temp7=document.getElementById("payPer").value;
    var temp8=document.getElementById("payRate").value;
    var temp9=document.getElementById("defaultHours").value;
    var temp10=document.getElementById("vacationPolicy").value;
    data=[temp1,temp2,temp3,temp4,temp5,temp6,temp7,temp8,temp9,temp10]
    var temp11=document.getElementById("taxExemptionsSlip").value;
    var temp12=document.getElementById("provinceTaxSlip").value;
    var temp13=document.getElementById("additionalTaxAmountSlip").value;
    var temp14=document.getElementById("federalTD1AmmountSlip").value;
    var temp15=document.getElementById("postalCodeSlip").value;
    var temp16=document.getElementById("provinceSlip").value;
    var temp17=document.getElementById("townSlip").value;
    var temp18=document.getElementById("sinSlip").value;
    var temp19=document.getElementById("countryOfPaymentResidenceSlip").value;
    var temp20=document.getElementById("homeAddressSlip").value;
    var temp21=document.getElementById("employeeNumberSlip").value;
    var temp22=document.getElementById("dateOfBirthSlip").value;
    var temp23=document.getElementById("miSlip").value;
    var temp24=document.getElementById("lastNameSlip").value;
    var temp25=document.getElementById("firstNameSlip").value;
    data2=[temp11,temp12,temp13,temp14,temp15,temp16,temp17,temp18,temp19,temp20,temp21,temp22,temp23,temp24,temp25]
    data2=data2.reverse();
    $.ajax({
        url:"https://addats.com:7890/api/editEmployee/"+data+"/"+data2+"/"+id,
        type:"GET",
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(data){
            alert("Info Update");
            window.location.href="index.html";
        }
    });
}
function enableCheckNumberSave(){
    document.getElementById("chequeNumberSave").style.display="block";
}
function disableCheckNumberSave(){
    document.getElementById("chequeNumberSave").style.display="none";
}
function saveChanegesEmployeeChequeList(){
    var ids=GetElementInsideContainer("employeeCheckListTable","div");
    for(i=1;i<ids.length;i++){
        var chequeNumber=document.getElementById("chequeNumber"+i).value;
        data=[chequeNumber,i];
        $.ajax({
            url:"https://addats.com:7890/api/updateEmployeeCheque/"+data,
            type:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            success:function(data){
                console.log(data);
                document.getElementById("chequeNumberSave").style.display="none";
            }
        })
    }
}