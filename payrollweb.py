from distutils.log import debug
from flask import Flask, render_template, request, redirect, url_for, session, make_response
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_session import Session
from datetime import datetime
import mysql.connector as mysql
from flask import jsonify
from flask_cors import CORS
from datetime import datetime
from datetime import timedelta
from datetime import date
import random
import pdfkit

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'secret123123'
app.config['SESSION_TYPE'] = 'filesystem'

db_name = "addatsco_payroll"
db_password = "sohaib023612"
db_user = "addatsco_sohaib"
db_host = "162.214.195.234"

CORS(app)

def database():
    db = mysql.connect(host=db_host, user=db_user, passwd=db_password, database=db_name)
    cursor=db.cursor(buffered=True)
    return db,cursor

@app.route("/api/employee",methods=['GET','POST'])
def home():
    db,cursor=database()
    query="select name,payrate,paymentMethod,availableVacations,status,id from employee"
    cursor.execute(query)
    result=cursor.fetchall()
    response=[]
    for row in result:
        temp={"name":row[0],"payrate":row[1],"paymentMethod":row[2],"availableVacations":row[3],"status":row[4],"id":row[5]}
        response.append(temp)
    return jsonify({"response":response})

@app.route("/api/allEmployees",methods=['GET','POST'])
def allEmployees():
    db,cursor=database()
    query="select id,paymentMethod,name,lastName from employee"
    cursor.execute(query)
    result=cursor.fetchall()
    response=[]
    for row in result:
        name=row[2]+" "+row[3]
        temp={"id":row[0],"paymentMethod":row[1],"name":name}
        response.append(temp)
    return jsonify({"response":response})

@app.route("/api/addEmployee/<data>/<slip>",methods=["GET","POST"])
def addEmployee(data,slip):
    data=data.split(",")
    data2=slip.split(",")
    db,cursor=database()
    query="insert into employee(name,mi,lastName,hiredDate,email,paySchedule,payPer,payRate,hours,vacPolicy,taxes,paymentMethod) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    data.append(0)
    data.append("cheque paper")
    values=tuple(data)
    print(values)
    cursor.execute(query,values)
    db.commit()
    query3="select id from employee order by id desc limit 1"
    cursor.execute(query3)
    result=cursor.fetchone()
    id=result[0]
    query2="insert into slipdetails(firstName, lastName, mi, dob, employeeNumber, homeAddress, country, sin, town, province, postalCode, tdi, additionalTax, provinceTax, taxExemptions,hiredDate,employeeId) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    data2.append(data[3])
    data2.append(id)
    values2=tuple(data2)
    cursor.execute(query2,values2)
    db.commit()
    return jsonify({"response":"done"})

@app.route("/api/employeeProfile/<data>",methods=["GET","POST"])
def employeeProfile(data):
    db,cursor=database()
    query="select name,email,taxes,sin,payrate,additionalPay,paySchedule,paymentMethod,deduction,company,contribution,address,birthDate,gender,note,id,status,hiredDate,jobTitle from employee where id=%s"
    value=(data,)
    cursor.execute(query,value)
    result=cursor.fetchall()
    query="select province,tdi from slipdetails where employeeId=%s"
    value=(data,)
    cursor.execute(query,value)
    result2=cursor.fetchall()
    response=list(result[0])
    for i in result2:
        for j in i:
            print(j)
            response.append(j)
    return jsonify({"response":response})

@app.route("/api/employeeChequeList/<data>", methods=["GET","POST"])
def employeeChequeList(data):
    db,cursor=database()
    query="select payDate,name,totalPay,netPay,paymentMethod,id from cheques where employeeId=%s"
    value=(data,)
    cursor.execute(query,value)
    result=cursor.fetchall()
    response=[]
    for row in result:
        temp={"payDate":row[0],"name":row[1],"totalPay":row[2],"netPay":row[3],"paymentMethod":row[4],"id":row[5]}
        response.append(temp)
    return jsonify({"response":response})

def days_between(d1, d2):
    d1 = datetime.strptime(d1, "%Y-%m-%d")
    d2 = datetime.strptime(d2, "%Y-%m-%d")
    return abs((d2 - d1).days)


#************************************************************ GENERATE CHEQUE ****************************************************

def runPayroll(values):
    db,cursor=database()
    query="select hiredDate,payrate,hours,name,paymentMethod,id,taxes from employee where id=%s"
    cursor.execute(query,(values[2],))
    result=cursor.fetchall()
    row=result[0]
    totalHours=int(values[0])*7
    totalPay=totalHours*int(row[1])
    query="insert into cheques(name, paymentMethod, regularPayHours, employeeId, totalHours, totalPay,varcationPayHours,payDate,netPay,statHolidayPayHours,year,weekStart,weekEnd,otHours,bonus,memo) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    varcationPayHours=float(values[0])*float(row[1])*0.04
    values=(row[3],row[4],values[0],values[2], totalHours, totalPay,varcationPayHours,values[1],str(int(totalPay)-int(str(row[6]))),values[7],values[3],values[4],values[5],values[6],0,values[8])
    cursor.execute(query,values)
    db.commit()
    return "done"
    
@app.route("/api/generateEmployeeCheque/<data>",methods=["GET", "POST"])
def generateEmployeeCheque(data):
    data=data.split(",^$^")
    year=data[0]
    temp=data[1]
    w=temp.split(" - ")
    print(w)
    ws=w[0]
    we=w[1]
    cd = date.today()
    userId=data[2]
    values=[data[3],cd,userId,year,ws,we,data[4],data[5],data[6]]
    print(data)
    print(values)
    response=runPayroll(values)
    return jsonify({"response":response})

#************************************************************ GET DATES ****************************************************

def numOfDays(date1, date2):
    return (date2-date1).days

@app.route("/api/getDates/<year>",methods=["GET","POST"])
def getDates(year):
    # Driver program
    start_date = date(2000,1,7)
    date2 = date.today()
    print(date2.year)
    days=numOfDays(start_date, date2)
    print(days)
    days=int(days/7)
    print(days)
    start_date=str(start_date)
    start_date=datetime.strptime(start_date, "%Y-%m-%d").strftime("%Y-%m-%d")
    fridays=[]
    dateRanges=[]
    count=0
    for i in range(days):
        previous=str(datetime.strptime(start_date, "%Y-%m-%d")+timedelta(days=1))
        friday=datetime.strptime(start_date, "%Y-%m-%d")+timedelta(days=7)
        generatedDate=str(friday)
        generatedDate=generatedDate[0:10]
        friday=datetime.strptime(str(friday.date()), "%Y-%m-%d").strftime("%Y-%m-%d")
        start_date=friday
        dateRange=previous[0:10] +" - " + str(generatedDate)
        if dateRange=="":
            pass
        else:
            if year in str(generatedDate):
                fridays.append(str(generatedDate))
                dateRanges.append(dateRange)
                count=count+1
    print(fridays)
    print(dateRanges)
    return jsonify({"fridays":fridays,"dateRanges":dateRanges,"count":count})


#******************************************************* GET PAY RATE ********************************************************

@app.route("/api/getEmployeePayRate/<data>",methods=["GET","POST"])
def getEmployeePayRate(data):
    db = mysql.connect(host=db_host, user=db_user, passwd=db_password, database=db_name)
    cursor = db.cursor()
    query="select payRate from employee where id=%s"
    cursor.execute(query,(data,))
    result=cursor.fetchone()
    payRate=result[0]
    return jsonify({"payRate":payRate})

#******************************************************* GENERATE PAY SLIP ********************************************************
def calculate(values):
    record=[]
    RegCurrent=values["payRate"]*values["regHours"]
    record.append(RegCurrent)
    YTD=RegCurrent*values["YTDPrev"]
    record.append(YTD)
    OTHours=values["OTHours"]
    record.append(OTHours)
    OTRate=values["payRate"]*1.5
    record.append(OTRate)
    OTCurrent=values["OTHours"]+OTRate
    record.append(OTCurrent)
    OTYTD=OTCurrent+values["OTYTDPrev"]
    record.append(OTYTD)
    VACCurrent=(RegCurrent+OTCurrent+values["stat"])*0.04
    record.append(VACCurrent)
    VACYTD=VACCurrent+values["VACYTDPrev"]
    record.append(VACYTD)
    StatHours=values["stat"]
    record.append(StatHours)
    StatRate=values["payDate"]
    record.append(StatRate)
    StatCurrent=values["stat"]+values["payRate"]
    # record.append(StatCurrent)
    StatYTD=StatCurrent+values["StatYTDPrev"]
    record.append(StatYTD)
    IncomeTax=(RegCurrent+OTCurrent+VACCurrent+StatCurrent)*0.0505
    record.append(IncomeTax)
    IncomeTaxYTD=IncomeTax+values["IncomeTaxYTDPrev"]
    record.append(IncomeTaxYTD)
    EI=(RegCurrent+OTCurrent+VACCurrent+StatCurrent)*0.0158
    record.append(EI)
    EIYTD=EI+values["EIYTDPrev"]
    record.append(EIYTD)
    CPP=(RegCurrent+OTCurrent+VACCurrent+StatCurrent)*0.0545
    record.append(CPP)
    CPPYTD=CPP+values["CPPYTDPrev"]
    record.append(CPPYTD)
    TotalPayCurrent=RegCurrent+OTCurrent+VACCurrent+StatCurrent
    record.append(TotalPayCurrent)
    TotalPayYTD=TotalPayCurrent+values["TotalPayYTDPrev"]
    record.append(TotalPayYTD)
    TotalTaxCurrent=IncomeTax+EI+CPP
    record.append(TotalTaxCurrent)
    TotalTaxYTD=TotalTaxCurrent+values["TotalTaxYTDPrev"]
    record.append(TotalTaxYTD)
    NetPay=CPP-TotalPayCurrent
    record.append(NetPay)
    return record

@app.route("/api/generateSlip/<data>",methods=['GET','POST'])
def generateSlip(data):
    db,cursor=database()
    query2="select payDate,totalPay,employeeId,regularPayHours,weekStart,weekEnd,statHolidayPayHours from cheques where id=%s"
    value=(data,)
    cursor.execute(query2,value)  
    response2=cursor.fetchall()
    query="select payRate,hours,taxes,name,address from employee where id=%s"
    value=(response2[0][2],)
    cursor.execute(query,value)
    response=cursor.fetchall()
    query="select town from slipdetails where employeeId=%s"
    cursor.execute(query,value)
    response3=cursor.fetchall()
    try:
        if response3[0]:pass
        else:response3=""
    except IndexError:
        response3=""
    temp={"YTDPrev":0,"OTHours":0,"OTYTDPrev":0,"stat":0,"VACYTDPrev":float(response[0][0])*(4/100),"StatYTDPrev":0,"EIYTDPrev":0,"CPPYTDPrev":0}
    final=temp
    for row in response:
        final["payRate"]=int(row[0])
        final["IncomeTaxYTDPrev"]=int(row[2])
        final["TotalTaxYTDPrev"]=int(row[2])
    for row in response2:
        final["regHours"]=int(row[3])
        final["payDate"]=row[0]
        final["TotalPayYTDPrev"]=int(row[1])
        final["weekStart"]=row[4]
        final["weekEnd"]=row[5]
        final["statHolidayPayHours"]=int(row[6])
    values=calculate(final)
    beginDate=str(final["weekStart"])
    values.append(response[0][3]) #name
    values.append(response[0][4]) #address
    values.append(final["weekStart"]) #beginDate
    print(response)
    print(response2)
    print(values)
    temp=datetime.strptime(str(final["weekEnd"]), "%Y-%m-%d").strftime("%Y-%m-%d")
    payDate=str(datetime.strptime(temp, "%Y-%m-%d")+timedelta(days=random.randint(1, 6)))
    payDate=payDate[0:10]
    responseData={"RegCurrent":values[0],"YTD":values[1],"OTHours":values[2],"OTRate":values[3],"VACCurrent":values[4],"VACYTD":values[5]
    ,"StatRate":values[6],"StatYTD":values[7],"IncomeTax":values[8],"IncomeTaxYTD":values[9],"EI":values[10],"EIYTD":values[11],"CPP":values[12]
    ,'CPPYTD':values[13],"TotalPayCurrent":values[14],"TotalPayYTD":final["TotalPayYTDPrev"],"TotalTaxCurrent":values[16],"TotalTaxYTD":values[17],"netPay":final["TotalPayYTDPrev"]
    ,"name":response[0][3],"address":response[0][4],"beginDate":beginDate,"endDate":str(final["weekEnd"]),"town":response3,"payDate":payDate,
    "totalHour":final["regHours"]*7,"payRate":final["payRate"],"statHolidayPay":float(final["statHolidayPayHours"])*(4/100),"totalPay":response2[0][1]}
    return jsonify({"response":responseData})

#******************************************************* UPDATE CHEQUE ********************************************************

@app.route("/api/updateCheque/<data>",methods=["GET","POST"])
def updateCheque(data):
    data=data.split(",")
    print(data)
    db,cursor=database()
    query="update cheques set regularPayHours=%s, otHours=%s, stayHolidayPayHours=%s, memo=%s where id=%s"
    values=tuple(data)
    cursor.execute(query,values)
    db.commit()
    return jsonify({"response":"done"})

#******************************************************* EMPLOYEE INFO ********************************************************

@app.route("/api/employeeInfo/<data>",methods=["GET","POST"])
def employeeInfo(data):
    db,cursor=database()
    query="select name,lastName,mi,hiredDate,email,payPer,payrate,hours,vacPolicy,id from employee where id=%s"
    cursor.execute(query,(data,))
    result=cursor.fetchall()
    query2="select id, firstName, lastName, mi, dob, homeAddress, country, sin, town, province, postalCode, tdi, additionalTax, provinceTax, taxExemptions, hiredDate, employeeNumber from slipdetails where employeeId=%s"
    value=(data,)
    cursor.execute(query2,value)
    result2=cursor.fetchall()
    response=[]
    response2=[]
    for row in result:
        print(row)
        temp={"id":row[9],"name":row[0],"lastName":row[1],"mi":row[2],"hiredDate":row[3],"email":row[4],"payPer":row[5],"payRate":row[6],"hours":row[7],"vacPolicy":row[8]}
        response.append(temp)
    for row in result2:
        temp={"id":row[0],"firstName":row[1], "lastName":row[2], "mi":row[3], "dob":row[4], "homeAddress":row[5], "country":row[6], "sin":row[7], "town":row[8], "province":row[9], "postalCode":row[10], "tdi":row[11], "additionalTax":row[12], "provinceTax":row[13], "taxExemptions":row[14], "hiredDate":row[15], "employeeNumber":row[16]}
        response2.append(temp)
    return jsonify({"response":response,"response2":response2})

#******************************************************* EDIT EMPLOYEE DETAILS ****************************************************

@app.route("/api/editEmployee/<data>/<slip>/<id>",methods=["GET","POST"])
def editEmployee(data,slip,id):
    data=data.split(",")
    data2=slip.split(",")
    db,cursor=database()
    query="update employee set name=%s,mi=%s,lastName=%s,hiredDate=%s,email=%s,paySchedule=%s,payPer=%s,payRate=%s,hours=%s,vacPolicy=%s,taxes=%s where id=%s"
    data.append(0)
    data.append(id)
    values=tuple(data)
    print(values)
    cursor.execute(query,values)
    db.commit()
    print("Checkpoint 1")
    query2="update slipdetails set firstName=%s, lastName=%s, mi=%s, dob=%s, employeeNumber=%s, homeAddress=%s, country=%s, sin=%s, town=%s, province=%s, postalCode=%s, tdi=%s, additionalTax=%s, provinceTax=%s, taxExemptions=%s,hiredDate=%s,employeeId=%s where employeeId=%s"
    data2.append(0)
    data2.append(id)
    data2.append(0)
    print(data2)
    values2=tuple(data2)
    cursor.execute(query2,values2)
    db.commit()
    return jsonify({"response":"done"})

#******************************************************* UPDATE EMPLOYEE DETAILS ****************************************************

@app.route("/api/updateEmployeeCheque/<data>",methods=["GET","POST"])
def updateEmployeeCheque(data):
    data=data.split(",")
    db,cursor=database()
    query="update cheques set cheque_number=%s where id=%s"
    values=(data[0],data[1])
    cursor.execute(query,values)
    db.commit()
    return jsonify({"response":"done"})


#******************************************************* GENERATE PDF ****************************************************

@app.route("/api/generatePDF",methods=["GET","POST"])
def generatePDF():
    data=request.get_data().decode('big5')
    data=data.split(",")
    print(data)
    rendered=render_template("generateSlip.html",data=data)
    pdf=pdfkit.from_string(rendered,False)
    response=make_response(pdf)
    return response


#******************************************************* LOGIN ****************************************************

@app.route("/api/login")
def login():
    data=request.form
    print(data)
    response=""
    return jsonify({"response":response})


#******************************************************* MAIN PROGRAM TO RUN APPLICATION ****************************************************

if __name__=="__main__":
    app.secret_key="PayRoll023612"
    context=('addats.crt','addats.key')
    app.run(port=7890,debug=True,ssl_context=context,threaded=True,host='162.214.195.234')