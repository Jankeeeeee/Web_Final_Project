var express = require('express');
var mysql = require('./mysql.js')
var app = express();
var cors = require('cors');
const { func } = require('assert-plus');
const { group } = require('console');
app.use(cors());
app.get('/search.html', function(req, res) {
    res.sendFile(__dirname + "/" + "search.html");
})

app.get('/heat_analysis',function(req,res){
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' }); //设置res编码为utf-8
    var dateSql = "select publish_date,count(*) as N from fetches where title like '%"+ 
        req.query.title + "%' group by publish_date order by publish_date desc;"
    console.log(dateSql);
    mysql.query(dateSql, function(err, resultdate, fields){
        if(resultdate.length==0){
            console.log('没有找到相关新闻');
            res.write("<h1>没有找到相关新闻</h1>");
            res.end();
        }else{
            var result0 = '<center><h1>关于‘'+req.query.title+'’的新闻热度分析</h1></center><center><table border='+"1"+'><tr><th>日期</th><th>条数</th></tr>';
            for(var i=0;i<resultdate.length;i++){
                result0+="<tr><td>";
                result0+=JSON.stringify(resultdate[i].publish_date).substring(1,11);
                result0+="</td><td>";
                result0+=resultdate[i].N;
                result0+="</td></tr>";
            }
            result0+="</table></center>";
            res.write(result0);
            res.end();
        }
    });
})

app.get('/process_get', function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' }); //设置res编码为utf-8
    var fetchSql = "select url,source_name,title,author,publish_date from fetches where title like '%" +
        req.query.title + "%'";
    console.log(fetchSql);
    mysql.query(fetchSql, function(err, result, fields) {
        if(result.length==0){
            console.log('没有找到相关新闻');
            res.write("<h1>没有找到相关新闻</h1>");
            res.end();
        }else{
            var result1 = '<center><table border='+"1"+'><tr><th>新闻链接</th><th>日期</th></tr>';
            for(var i=0;i<result.length;i++){
                result1+="<tr><td>";
                result1+='<a href=' + result[i].url + '>' + result[i].title + '</a>'
                result1+="</td><td>";
                result1+=JSON.stringify(result[i].publish_date).substring(1,11);
                result1+="</td></tr>";
            }
            result1+="</table></center>";
            res.write('<center><h1>共有'+ result.length +'条有关‘'+req.query.title+'’的新闻</h1></center>');
            res.write(result1);
            res.end();
        }
    });
})

var server = app.listen(8080, function() {
    console.log("访问地址为 http://127.0.0.1:8080/search.html")
})
