function Time() {

}

Time.get_time_now=function (){
    var time_now=new Date();
    var day=time_now.getDate();
    var month=time_now.getMonth()+1;
    var year=time_now.getFullYear();
    var time=time_now.toString().substr(16,8);
    return year+'年'+month+'月'+day+'日'+time;
};